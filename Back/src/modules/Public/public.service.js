const { DateTime } = require('luxon');
const clinicService = require('../Clinics/clinic.service');
const bookingService = require('../Bookings/booking.service');
const Specialty = require('../Specialties/specialty.model');
const Doctor = require('../Doctors/doctor.model');
const Service = require('../Services/service.model');
const Schedule = require('../Schedules/schedule.model');

async function getClinicBySlug(slug) {
  const clinic = await clinicService.getActiveBySlug(slug);
  const clinicId = clinic.id;

  const specialties = await Specialty.find({ clinicId, isActive: true });
  const ids = specialties.map(s => s._id);
  const doctors = await Doctor.find({ clinicId, isActive: true, specialtyId: { $in: ids } }).select('-email').populate('specialtyId', 'name');
  const services = await Service.find({ clinicId, isActive: true, $or: [{ specialtyId: null }, { specialtyId: { $in: ids } }] });
  const schedules = await Schedule.find({ clinicId, isActive: true, doctorId: { $in: doctors.map(d => d._id) }, date: { $gte: DateTime.now().setZone('Africa/Cairo').toISODate() } }).sort({ date: 1, startTime: 1 });

  return { clinic, specialties, doctors, services, schedules };
}
async function getSlots(slug, scheduleId) {
  const clinic = await clinicService.getActiveBySlug(slug);
  return bookingService.getAvailableSlots(clinic.id, scheduleId);
}
async function createBooking(slug, data) {
  const clinic = await clinicService.getActiveBySlug(slug);
  const booking = await bookingService.create(clinic.id, { ...data, isActive: true });
  return { reference: booking.id, date: booking.date, startTime: booking.startTime };
}
module.exports = { getClinicBySlug, getSlots, createBooking };
