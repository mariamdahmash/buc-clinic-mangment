const mongoose = require('mongoose');
const ref = (name) => ({ type: mongoose.Schema.Types.ObjectId, ref: name, required: true });
const scheduleSchema = new mongoose.Schema({
  clinicId: ref('Clinic'), doctorId: ref('Doctor'), date: String,
  startTime: String, endTime: String, slotMinutes: Number,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model('Schedule', scheduleSchema);
