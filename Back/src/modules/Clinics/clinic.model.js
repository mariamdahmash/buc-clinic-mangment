const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Clinic name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumbers: [
      {
        type: String,
        trim: true,
      },
    ],
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      googleMapsUrl: { type: String, default: '' },
    },
    logo: {
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

const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;