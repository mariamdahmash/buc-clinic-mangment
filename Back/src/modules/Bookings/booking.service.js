const Booking = require('./booking.model');
const { fail } = require('../../utils/errors');
const { availableSchedule } = require('../Schedules/schedule.service');
const { minutes, clock, future } = require('../../utils/time');

async function validateData(clinicId, data) {
  const schedule = await availableSchedule(clinicId, data.scheduleId);
  const offset = minutes(data.startTime) - minutes(schedule.startTime);
  if (
    offset < 0 ||
    offset % schedule.slotMinutes !== 0 ||
    minutes(data.startTime) + schedule.slotMinutes > minutes(schedule.endTime)
  ) {
    fail('اختر وقتًا من المواعيد المتاحة', 400);
  }
  if (data.isActive && !future(schedule.date, data.startTime)) {
    fail('لا يمكن حجز موعد سابق', 400);
  }
  data.doctorId = schedule.doctorId;
  data.date = schedule.date;
}

const getAll = (clinicId) => Booking.find({ clinicId }).sort({ createdAt: -1 });

async function create(clinicId, data) {
  const payload = { isActive: true, ...data };
  await validateData(clinicId, payload);

  try {
    return await Booking.create({ ...payload, clinicId });
  } catch (err) {
    if (err.code === 11000) {
      fail('هذا الموعد تم حجزه بالفعل، اختر وقتًا آخر', 409);
    }
    throw err;
  }
}

async function update(clinicId, itemId, data) {
  const current = await Booking.findOne({ _id: itemId, clinicId });
  if (!current) fail('العنصر غير موجود', 404);

  await validateData(clinicId, data);
  Object.assign(current, data);

  try {
    await current.save();
    return current;
  } catch (err) {
    if (err.code === 11000) {
      fail('هذا الموعد محجوز بالفعل', 409);
    }
    throw err;
  }
}

async function setStatus(clinicId, itemId, isActive) {
  const current = await Booking.findOne({ _id: itemId, clinicId });
  if (!current) fail('العنصر غير موجود', 404);

  if (isActive) {
    await validateData(clinicId, { ...current.toObject(), isActive });
  }
  current.isActive = isActive;

  try {
    await current.save();
    return current;
  } catch (err) {
    if (err.code === 11000) {
      fail('لا يمكن تفعيل الحجز لتعارضه مع حجز آخر في نفس الوقت', 409);
    }
    throw err;
  }
}

async function remove(clinicId, itemId) {
  const filter = { _id: itemId, clinicId };
  if (!(await Booking.exists(filter))) fail('العنصر غير موجود', 404);

  await Booking.deleteOne(filter);
  return { deleted: true };
}

async function getAvailableSlots(clinicId, scheduleId) {
  const schedule = await availableSchedule(clinicId, scheduleId);
  const booked = await Booking.find({
    clinicId,
    scheduleId: schedule._id,
    isActive: true,
  }).select('startTime');

  const occupied = new Set(booked.map((b) => b.startTime));
  const slots = [];

  for (
    let n = minutes(schedule.startTime);
    n + schedule.slotMinutes <= minutes(schedule.endTime);
    n += schedule.slotMinutes
  ) {
    const time = clock(n);
    if (future(schedule.date, time) && !occupied.has(time)) {
      slots.push(time);
    }
  }
  return slots;
}

module.exports = { getAll, create, update, setStatus, remove, getAvailableSlots };