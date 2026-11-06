const Schedule = require('./schedule.model');
const { write } = require('../Clinics/clinic.transaction');
const { fail } = require('../../utils/errors');
const Doctor = require('../Doctors/doctor.model');
const Booking = require('../Bookings/booking.model');
const Specialty = require('../Specialties/specialty.model');
const { minutes, future } = require('../../utils/time');

async function availableSchedule(clinicId, id, session) {
  const schedule = await Schedule.findOne({ _id: id, clinicId, isActive: true }).session(session);
  if (!schedule) fail('الموعد غير متاح');
  const doctor = await Doctor.findOne({ _id: schedule.doctorId, clinicId, isActive: true }).session(session);
  if (!doctor || !await Specialty.exists({ _id: doctor.specialtyId, clinicId, isActive: true }).session(session)) fail('الطبيب أو التخصص غير متاح');
  return schedule;
}

async function validateData(clinicId, data, session, existingId) {
  if (!await Doctor.exists({ _id: data.doctorId, clinicId }).session(session)) fail('الطبيب لا يتبع العيادة');
  if (minutes(data.endTime) - minutes(data.startTime) < data.slotMinutes) fail('نهاية الفترة يجب أن تكون بعد البداية بمدة كشف على الأقل');
  if (!future(data.date, data.startTime)) fail('اختر موعدًا قادمًا');
  if (data.isActive && await Schedule.exists({ clinicId, doctorId: data.doctorId, date: data.date, isActive: true, _id: { $ne: existingId }, startTime: { $lt: data.endTime }, endTime: { $gt: data.startTime } }).session(session)) fail('الفترة تتعارض مع موعد آخر للطبيب', 409);
}

const getAll = clinicId => Schedule.find({ clinicId }).sort({ createdAt: -1 });

async function create(clinicId, data) {
  return write(clinicId, async session => {
    await validateData(clinicId, data, session);
    return (await Schedule.create([{ ...data, clinicId }], { session }))[0];
  });
}

async function update(clinicId, itemId, data) {
  return write(clinicId, async session => {
    const current = await Schedule.findOne({ _id: itemId, clinicId }).session(session);
    if (!current) fail('العنصر غير موجود', 404);
    if (await Booking.exists({ scheduleId: current.id, isActive: true }).session(session)) fail('ألغِ أو انقل الحجوزات المرتبطة قبل تعديل الفترة', 409);
    await validateData(clinicId, data, session, current.id);
    Object.assign(current, data);
    await current.save({ session });
    return current;
  });
}

async function setStatus(clinicId, itemId, isActive) {
  return write(clinicId, async session => {
    const current = await Schedule.findOne({ _id: itemId, clinicId }).session(session);
    if (!current) fail('العنصر غير موجود', 404);
    if (!isActive && await Booking.exists({ scheduleId: current.id, isActive: true }).session(session)) fail('ألغِ أو انقل الحجوزات قبل إيقاف الفترة', 409);
    if (isActive) await validateData(clinicId, { ...current.toObject(), isActive }, session, current.id);
    current.isActive = isActive;
    await current.save({ session });
    return current;
  });
}

async function remove(clinicId, itemId) {
  return write(clinicId, async session => {
    const filter = { _id: itemId, clinicId };
    if (!await Schedule.exists(filter).session(session)) fail('العنصر غير موجود', 404);
    if (await Booking.exists({ clinicId, scheduleId: itemId }).session(session)) fail('العنصر مرتبط ببيانات أخرى. احذف أو انقل البيانات المرتبطة أولًا، أو عطّل العنصر', 409);
    await Schedule.deleteOne(filter).session(session);
    return { deleted: true };
  });
}

module.exports = { getAll, create, update, setStatus, remove, availableSchedule };
