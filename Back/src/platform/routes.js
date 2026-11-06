const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DateTime } = require('luxon');
const { rateLimit } = require('express-rate-limit');
const M = require('./models');
const V = require('./validation');
const router = express.Router();
const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
const send = (res, data, status = 200) => res.status(status).json({ success: true, data });
const minutes = t => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
const clock = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
const future = (date, time) => DateTime.fromISO(`${date}T${time}`, { zone: 'Africa/Cairo' }).toMillis() > Date.now();
const limit = max => rateLimit({ windowMs: 900000, limit: max, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'محاولات كثيرة. حاول بعد قليل.' } });
// A shared clinic write serializes dependent mutations and prevents booking races.
async function write(clinicId, fn) {
  return mongoose.connection.transaction(async session => {
    if (!await M.Clinic.findOneAndUpdate({ _id: clinicId, isActive: true }, { $inc: { mutationVersion: 1 } }, { session })) fail('العيادة غير متاحة', 404);
    return fn(session);
  });
}
async function protect(req, res, next) {
  try {
    const match = /^Bearer (\S+)$/.exec(req.headers.authorization || '');
    if (!match) fail('سجل الدخول أولًا', 401);
    const decoded = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const user = await M.User.findById(decoded.id);
    if (!user) fail('الجلسة غير صالحة', 401);
    if (user.role === 'clinicadmin' && !await M.Clinic.exists({ _id: user.clinicId, isActive: true })) fail('العيادة غير متاحة', 403);
    req.user = user; next();
  } catch (e) { next(e.status ? e : Object.assign(new Error('انتهت الجلسة. سجل الدخول مرة أخرى'), { status: 401 })); }
}
const role = value => (req, res, next) => req.user.role === value ? next() : next(Object.assign(new Error('غير مصرح بهذه العملية'), { status: 403 }));
router.post('/auth/login', limit(15), async (req, res) => {
  const data = V.login.parse(req.body);
  const user = await M.User.findOne({ nationalId: data.nationalId }).select('+password');
  if (!user || !await bcrypt.compare(data.password, user.password)) fail('بيانات الدخول غير صحيحة', 401);
  if (user.role === 'clinicadmin' && !await M.Clinic.exists({ _id: user.clinicId, isActive: true })) fail('العيادة غير متاحة', 403);
  if (!['clinicadmin', 'superadmin'].includes(user.role)) fail('غير مصرح بالدخول', 403);
  send(res, { token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '8h', algorithm: 'HS256' }), user: { _id: user.id, name: user.name, role: user.role, clinicId: user.clinicId } });
});
router.post('/auth/register', (req, res) => res.status(403).json({ message: 'إنشاء الحسابات متاح لمدير النظام فقط' }));
router.get('/clinics', protect, role('superadmin'), async (req, res) => send(res, await M.Clinic.find().sort({ createdAt: -1 })));
router.post('/clinics', protect, role('superadmin'), async (req, res) => {
  const { adminData, ...data } = V.clinic.parse(req.body);
  const password = await bcrypt.hash(adminData.password, 12);
  const clinic = await mongoose.connection.transaction(async session => {
    const [clinic] = await M.Clinic.create([data], { session });
    await M.User.create([{ ...adminData, password, role: 'clinicadmin', clinicId: clinic.id }], { session });
    return clinic;
  });
  send(res, clinic, 201);
});
router.patch('/clinics/:id/status', protect, role('superadmin'), async (req, res) => {
  V.id.parse(req.params.id);
  if (typeof req.body.isActive !== 'boolean') fail('حالة غير صحيحة');
  const clinic = await M.Clinic.findByIdAndUpdate(req.params.id, { $set: { isActive: req.body.isActive }, $inc: { mutationVersion: 1 } }, { returnDocument: 'after' });
  if (!clinic) fail('العيادة غير موجودة', 404);
  send(res, clinic);
});
router.get('/public/clinics/:slug', async (req, res) => {
  const clinic = await M.Clinic.findOne({ slug: req.params.slug, isActive: true });
  if (!clinic) fail('العيادة غير موجودة أو متوقفة', 404);
  const clinicId = clinic.id;
  const specialties = await M.specialties.find({ clinicId, isActive: true });
  const ids = specialties.map(s => s._id);
  const doctors = await M.doctors.find({ clinicId, isActive: true, specialtyId: { $in: ids } }).select('-email').populate('specialtyId', 'name');
  const services = await M.services.find({ clinicId, isActive: true, $or: [{ specialtyId: null }, { specialtyId: { $in: ids } }] });
  const schedules = await M.schedules.find({ clinicId, isActive: true, doctorId: { $in: doctors.map(d => d._id) }, date: { $gte: DateTime.now().setZone('Africa/Cairo').toISODate() } }).sort({ date: 1, startTime: 1 });
  send(res, { clinic, specialties, doctors, services, schedules });
});
async function availableSchedule(clinicId, id, session) {
  const schedule = await M.schedules.findOne({ _id: id, clinicId, isActive: true }).session(session);
  if (!schedule) fail('الموعد غير متاح');
  const doctor = await M.doctors.findOne({ _id: schedule.doctorId, clinicId, isActive: true }).session(session);
  if (!doctor || !await M.specialties.exists({ _id: doctor.specialtyId, clinicId, isActive: true }).session(session)) fail('الطبيب أو التخصص غير متاح');
  return schedule;
}
router.get('/public/clinics/:slug/slots/:id', async (req, res) => {
  V.id.parse(req.params.id);
  const clinic = await M.Clinic.findOne({ slug: req.params.slug, isActive: true });
  if (!clinic) fail('العيادة غير متاحة', 404);
  const schedule = await availableSchedule(clinic.id, req.params.id);
  const booked = await M.bookings.find({ clinicId: clinic.id, scheduleId: schedule.id, isActive: true }).select('startTime');
  const occupied = new Set(booked.map(b => b.startTime));
  const slots = [];
  for (let n = minutes(schedule.startTime); n + schedule.slotMinutes <= minutes(schedule.endTime); n += schedule.slotMinutes) {
    const time = clock(n);
    if (future(schedule.date, time) && !occupied.has(time)) slots.push(time);
  }
  send(res, slots);
});
async function validateRelations(kind, data, clinicId, session, existingId) {
  if (data.specialtyId && !await M.specialties.exists({ _id: data.specialtyId, clinicId }).session(session)) fail('التخصص لا يتبع العيادة');
  if (kind === 'schedules') {
    if (!await M.doctors.exists({ _id: data.doctorId, clinicId }).session(session)) fail('الطبيب لا يتبع العيادة');
    if (minutes(data.endTime) - minutes(data.startTime) < data.slotMinutes) fail('نهاية الفترة يجب أن تكون بعد البداية بمدة كشف على الأقل');
    if (!future(data.date, data.startTime)) fail('اختر موعدًا قادمًا');
    if (data.isActive && await M.schedules.exists({ clinicId, doctorId: data.doctorId, date: data.date, isActive: true, _id: { $ne: existingId }, startTime: { $lt: data.endTime }, endTime: { $gt: data.startTime } }).session(session)) fail('الفترة تتعارض مع موعد آخر للطبيب', 409);
  }
  if (kind === 'bookings') {
    const schedule = await availableSchedule(clinicId, data.scheduleId, session);
    const offset = minutes(data.startTime) - minutes(schedule.startTime);
    if (offset < 0 || offset % schedule.slotMinutes || minutes(data.startTime) + schedule.slotMinutes > minutes(schedule.endTime)) fail('اختر وقتًا من المواعيد المتاحة');
    if (data.isActive && !future(schedule.date, data.startTime)) fail('لا يمكن حجز موعد سابق');
    data.doctorId = schedule.doctorId; data.date = schedule.date;
  }
}
router.post('/public/clinics/:slug/bookings', limit(20), async (req, res) => {
  const data = V.schemas.bookings.omit({ isActive: true }).parse(req.body); data.isActive = true;
  const clinic = await M.Clinic.findOne({ slug: req.params.slug, isActive: true });
  if (!clinic) fail('العيادة غير متاحة', 404);
  const booking = await write(clinic.id, async session => {
    await validateRelations('bookings', data, clinic.id, session);
    return (await M.bookings.create([{ ...data, clinicId: clinic.id }], { session }))[0];
  });
  send(res, { reference: booking.id, date: booking.date, startTime: booking.startTime }, 201);
});
router.get('/clinic/me', protect, role('clinicadmin'), async (req, res) => send(res, await M.Clinic.findById(req.user.clinicId)));
for (const kind of Object.keys(V.schemas)) {
  const model = M[kind];
  router.get(`/${kind}`, protect, role('clinicadmin'), async (req, res) => send(res, await model.find({ clinicId: req.user.clinicId }).sort({ createdAt: -1 })));
  router.post(`/${kind}`, protect, role('clinicadmin'), async (req, res) => {
    const data = V.schemas[kind].parse(req.body);
    send(res, await write(req.user.clinicId, async session => {
      await validateRelations(kind, data, req.user.clinicId, session);
      return (await model.create([{ ...data, clinicId: req.user.clinicId }], { session }))[0];
    }), 201);
  });
  router.put(`/${kind}/:id`, protect, role('clinicadmin'), async (req, res) => {
    V.id.parse(req.params.id); const data = V.schemas[kind].parse(req.body);
    send(res, await write(req.user.clinicId, async session => {
      const current = await model.findOne({ _id: req.params.id, clinicId: req.user.clinicId }).session(session);
      if (!current) fail('العنصر غير موجود', 404);
      if (kind === 'schedules' && await M.bookings.exists({ scheduleId: current.id, isActive: true }).session(session)) fail('ألغِ أو انقل الحجوزات المرتبطة قبل تعديل الفترة', 409);
      await validateRelations(kind, data, req.user.clinicId, session, current.id);
      Object.assign(current, data); await current.save({ session }); return current;
    }));
  });
  router.patch(`/${kind}/:id/status`, protect, role('clinicadmin'), async (req, res) => {
    V.id.parse(req.params.id);
    if (typeof req.body.isActive !== 'boolean') fail('حالة غير صحيحة');
    send(res, await write(req.user.clinicId, async session => {
      const current = await model.findOne({ _id: req.params.id, clinicId: req.user.clinicId }).session(session);
      if (!current) fail('العنصر غير موجود', 404);
      const isActive = req.body.isActive;
      if (kind === 'schedules' && !isActive && await M.bookings.exists({ scheduleId: current.id, isActive: true }).session(session)) fail('ألغِ أو انقل الحجوزات قبل إيقاف الفترة', 409);
      if (isActive && ['schedules', 'bookings'].includes(kind)) await validateRelations(kind, { ...current.toObject(), isActive }, req.user.clinicId, session, current.id);
      current.isActive = isActive; await current.save({ session }); return current;
    }));
  });
  router.delete(`/${kind}/:id`, protect, role('clinicadmin'), async (req, res) => {
    V.id.parse(req.params.id);
    send(res, await write(req.user.clinicId, async session => {
      const filter = { _id: req.params.id, clinicId: req.user.clinicId };
      if (!await model.exists(filter).session(session)) fail('العنصر غير موجود', 404);
      const relations = kind === 'specialties' ? [['doctors', 'specialtyId'], ['services', 'specialtyId']] : kind === 'doctors' ? [['schedules', 'doctorId'], ['bookings', 'doctorId']] : kind === 'schedules' ? [['bookings', 'scheduleId']] : [];
      for (const [child, key] of relations) if (await M[child].exists({ clinicId: req.user.clinicId, [key]: req.params.id }).session(session)) fail('العنصر مرتبط ببيانات أخرى. احذف أو انقل البيانات المرتبطة أولًا، أو عطّل العنصر', 409);
      await model.deleteOne(filter).session(session); return { deleted: true };
    }));
  });
}
module.exports = router;
