const Doctor = require('./doctor.model');
const { fail } = require('../../utils/errors');
const Specialty = require('../Specialties/specialty.model');
const Schedule = require('../Schedules/schedule.model');
const Booking = require('../Bookings/booking.model');

async function validateData(clinicId, data) {
  if (data.specialtyId) {
    const specialtyExists = await Specialty.exists({ _id: data.specialtyId, clinicId });
    if (!specialtyExists) fail('التخصص غير تابع لهذه العيادة', 400);
  }
}

// ✅ حماية الـ populate بإرجاع الداتا حتى لو التخصص اتحذف
const getAll = (clinicId) =>
  Doctor.find({ clinicId })
    .populate({ path: 'specialtyId', select: 'name', strictPopulate: false })
    .sort({ createdAt: -1 });

async function create(clinicId, data) {
  await validateData(clinicId, data);
  return await Doctor.create({ ...data, clinicId });
}

async function update(clinicId, itemId, data) {
  const current = await Doctor.findOne({ _id: itemId, clinicId });
  if (!current) fail('العنصر غير موجود', 404);

  await validateData(clinicId, data);
  Object.assign(current, data);
  await current.save();
  return current;
}

async function setStatus(clinicId, itemId, isActive) {
  const current = await Doctor.findOne({ _id: itemId, clinicId });
  if (!current) fail('العنصر غير موجود', 404);

  current.isActive = isActive;
  await current.save();
  return current;
}

async function remove(clinicId, itemId) {
  const filter = { _id: itemId, clinicId };
  const exists = await Doctor.exists(filter);
  if (!exists) fail('العنصر غير موجود', 404);

  const hasSchedules = await Schedule.exists({ clinicId, doctorId: itemId });
  if (hasSchedules) {
    fail('العنصر مرتبط ببيانات أخرى. احذف أو انقل البيانات المرتبطة أولًا، أو عطّل العنصر', 409);
  }

  const hasBookings = await Booking.exists({ clinicId, doctorId: itemId });
  if (hasBookings) {
    fail('العنصر مرتبط ببيانات أخرى. احذف أو انقل البيانات المرتبطة أولًا، أو عطّل العنصر', 409);
  }

  await Doctor.deleteOne(filter);
  return { deleted: true };
}

module.exports = { getAll, create, update, setStatus, remove };