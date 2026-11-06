const mongoose = require('mongoose');
const ref = (name) => ({ type: mongoose.Schema.Types.ObjectId, ref: name, required: true });
const bookingSchema = new mongoose.Schema({
  clinicId: ref('Clinic'), scheduleId: ref('Schedule'), doctorId: ref('Doctor'),
  patientName: String, phone: String, startTime: String, date: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
bookingSchema.index({ scheduleId: 1, startTime: 1 }, { unique: true, partialFilterExpression: { isActive: true } });
module.exports = mongoose.model('Booking', bookingSchema);
