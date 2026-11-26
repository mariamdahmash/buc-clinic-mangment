const Schedule = require('./schedule.model');
const { fail } = require('../../utils/errors');
const Doctor = require('../Doctors/doctor.model');
const Booking = require('../Bookings/booking.model');
const Specialty = require('../Specialties/specialty.model');
const { minutes, future } = require('../../utils/time');

async function availableSchedule(clinicId, id) {
  const schedule = await Schedule.findOne({ _id: id, clinicId, isActive: true });
  if (!schedule) fail('الموعد غير متاح', 404);

  const doctor = await Doctor.findOne({ _id: schedule.doctorId, clinicId, isActive: true });
  if (!doctor || !(await Specialty.exists({ _id: doctor.specialtyId, clinicId, isActive: true }))) {
    fail('الطبيب أو التخصص غير متاح', 400);
  }
  return schedule;
}

async function validateData(clinicId, data, existingId) {
  if (!(await Doctor.exists({ _id: data.doctorId, clinicId }))) {
    fail('الطبيب لا يتبع العيادة', 400);
  }
  if (minutes(data.endTime) - minutes(data.startTime) < data.slotMinutes) {
    fail('نهاية الفترة يجب أن تكون بعد البداية بمدة كشف على الأقل', 400);
  }
  if (!future(data.date, data.startTime)) {
    fail('اختر موعدًا قادمًا', 400);
  }

  const overlapFilter = {
    clinicId,
    doctorId: data.doctorId,
    date: data.date,
    isActive: true,
    startTime: { $lt: data.endTime },
    endTime: { $gt: data.startTime },
  };
  if (existingId) {
    overlapFilter._id = { $ne: existingId };
  }

  if (data.isActive && (await Schedule.exists(overlapFilter))) {
    fail('الفترة تتعارض مع موعد آخر للطبيب', 409);
  }
}

const getAll = (clinicId) => Schedule.find({ clinicId }).sort({ createdAt: -1 });

async function create(clinicId, data) {
  await validateData(clinicId, data);
  return await Schedule.create({ ...data, clinicId });
}

async function update(clinicId, itemId, data) {
  const current = await Schedule.findOne({ _id: itemId, clinicId });
  if (!current) fail('العنصر غير موجود', 404);

  if (await Booking.exists({ scheduleId: current._id, isActive: true })) {
    fail('ألغِ أو انقل الحجوزات المرتبطة قبل تعديل الفترة', 409);
  }

  await validateData(clinicId, data, current._id);
  Object.assign(current, data);
  await current.save();
  return current;
}

async function setStatus(clinicId, itemId, isActive) {
  const current = await Schedule.findOne({ _id: itemId, clinicId });
  if (!current) fail('العنصر غير موجود', 404);

  if (!isActive && (await Booking.exists({ scheduleId: current._id, isActive: true }))) {
    fail('ألغِ أو انقل الحجوزات قبل إيقاف الفترة', 409);
  }
  if (isActive) {
    await validateData(clinicId, { ...current.toObject(), isActive }, current._id);
  }

  current.isActive = isActive;
  await current.save();
  return current;
}

async function remove(clinicId, itemId) {
  const filter = { _id: itemId, clinicId };
  if (!(await Schedule.exists(filter))) fail('العنصر غير موجود', 404);

  if (await Booking.exists({ clinicId, scheduleId: itemId })) {
    fail('العنصر مرتبط ببيانات أخرى. احذف أو انقل البيانات المرتبطة أولًا، أو عطّل العنصر', 409);
  }

  await Schedule.deleteOne(filter);
  return { deleted: true };
}

module.exports = { getAll, create, update, setStatus, remove, availableSchedule };