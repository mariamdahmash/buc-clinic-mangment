const Doctor = require('./doctor.model');
const User = require('../Auth/user.model'); 

const createDoctor = async (clinicId, doctorData) => {

const { email } = doctorData;

  const existingDoctor = await Doctor.findOne({ email: email.toLowerCase() });
  if (existingDoctor) {
    throw new Error('A doctor with this email already exists');
  }

  return await Doctor.create({
    ...doctorData,
    clinicId,
    email: email.toLowerCase(),
  });
};

const getClinicDoctors = async (clinicId) => {
  return await Doctor.find({ clinicId }).populate('specialtyId', 'name');
};

module.exports = {
  createDoctor,
  getClinicDoctors,
};