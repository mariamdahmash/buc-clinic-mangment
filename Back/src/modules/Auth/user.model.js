const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      //required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    nationalId: {
      type: String,
      required: [true, 'National ID is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, 
    },
    role: {
      type: String,
      enum: ['superadmin', 'clinicadmin', 'doctor', 'patient'],
      default: 'patient',
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      default: null,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;