const express = require('express');
const cors = require('cors');

const userRoutes = require('./modules/Auth/auth.routes');
const clinicRoutes = require('./modules/Clinics/clinic.routes');
const publicRoutes = require('./modules/Public/public.routes');
const specialtyRoutes = require('./modules/Specialties/specialty.routes');
const doctorRoutes = require('./modules/Doctors/doctor.routes');

const app = express();

// 1. Global Middlewares
app.use(cors());
app.use(express.json());

// 2. Module Routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/clinics', clinicRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/specialties', specialtyRoutes);
app.use('/api/v1/doctors', doctorRoutes);


module.exports = app; 