const mongoose = require('mongoose');
const ref = (name) => ({ type: mongoose.Schema.Types.ObjectId, ref: name, required: true });
const scheduleSchema = new mongoose.Schema({
  clinicId: ref('Clinic'), doctorId: ref('Doctor'), date: String,
  startTime: String, endTime: String, slotMinutes: Number,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
const bookingSchema = new mongoose.Schema({
  clinicId: ref('Clinic'), scheduleId: ref('Schedule'), doctorId: ref('Doctor'),
  patientName: String, phone: String, startTime: String, date: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
bookingSchema.index({ scheduleId: 1, startTime: 1 }, { unique: true, partialFilterExpression: { isActive: true } });
module.exports = {
  Clinic: require('../modules/Clinics/clinic.model'),
  User: require('../modules/Auth/user.model'),
  specialties: require('../modules/Specialties/specialty.model'),
  doctors: require('../modules/Doctors/doctor.model'),
  services: require('../modules/Services/service.model'),
  schedules: mongoose.model('Schedule', scheduleSchema),
  bookings: mongoose.model('Booking', bookingSchema),
};
