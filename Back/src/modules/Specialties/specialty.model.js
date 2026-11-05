const mongoose = require('mongoose');

const specialtySchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      required: [true, 'Clinic ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Specialty name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true, 
    },
  },
  {
    timestamps: true,
  }
);

const Specialty = mongoose.model('Specialty', specialtySchema);

module.exports = Specialty;