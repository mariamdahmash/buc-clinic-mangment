const Booking = require('./booking.model');
const { write } = require('../Clinics/clinic.transaction');
const { fail } = require('../../utils/errors');
const { availableSchedule } = require('../Schedules/schedule.service');
const { minutes, clock, future } = require('../../utils/time');

async function validateData(clinicId, data, session, existingId) {
  const schedule = await availableSchedule(clinicId, data.scheduleId, session);
  const offset = minutes(data.startTime) - minutes(schedule.startTime);
  if (offset < 0 || offset % schedule.slotMinutes || minutes(data.startTime) + schedule.slotMinutes > minutes(schedule.endTime)) fail('اختر وقتًا من المواعيد المتاحة');
  if (data.isActive && !future(schedule.date, data.startTime)) fail('لا يمكن حجز موعد سابق');
  data.doctorId = schedule.doctorId; data.date = schedule.date;
}

const getAll = clinicId => Booking.find({ clinicId }).sort({ createdAt: -1 });

async function create(clinicId, data) {
  return write(clinicId, async session => {
    await validateData(clinicId, data, session);
    return (await Booking.create([{ ...data, clinicId }], { session }))[0];
  });
}

async function update(clinicId, itemId, data) {
  return write(clinicId, async session => {
    const current = await Booking.findOne({ _id: itemId, clinicId }).session(session);
    if (!current) fail('العنصر غير موجود', 404);
    await validateData(clinicId, data, session, current.id);
    Object.assign(current, data);
    await current.save({ session });
    return current;
  });
}

async function setStatus(clinicId, itemId, isActive) {
  return write(clinicId, async session => {
    const current = await Booking.findOne({ _id: itemId, clinicId }).session(session);
    if (!current) fail('العنصر غير موجود', 404);
    if (isActive) await validateData(clinicId, { ...current.toObject(), isActive }, session, current.id);
    current.isActive = isActive;
    await current.save({ session });
    return current;
  });
}

async function remove(clinicId, itemId) {
  return write(clinicId, async session => {
    const filter = { _id: itemId, clinicId };
    if (!await Booking.exists(filter).session(session)) fail('العنصر غير موجود', 404);
    await Booking.deleteOne(filter).session(session);
    return { deleted: true };
  });
}

async function getAvailableSlots(clinicId, scheduleId) {
  const schedule = await availableSchedule(clinicId, scheduleId);
  const booked = await Booking.find({ clinicId: clinicId, scheduleId: schedule.id, isActive: true }).select('startTime');
  const occupied = new Set(booked.map(b => b.startTime));
  const slots = [];
  for (let n = minutes(schedule.startTime); n + schedule.slotMinutes <= minutes(schedule.endTime); n += schedule.slotMinutes) {
    const time = clock(n);
    if (future(schedule.date, time) && !occupied.has(time)) slots.push(time);
  }
  return slots;
}

module.exports = { getAll, create, update, setStatus, remove, getAvailableSlots };
