const Specialty = require('./specialty.model');

const createSpecialty = async (clinicId, specialtyData) => {
  return await Specialty.create({
    ...specialtyData,
    clinicId,
  });
};

const getClinicSpecialties = async (clinicId) => {
  return await Specialty.find({ clinicId });
};

// (Pause / Resume)
const toggleSpecialtyStatus = async (clinicId, specialtyId) => {
  const specialty = await Specialty.findOne({ _id: specialtyId, clinicId });
  if (!specialty) {
    throw new Error('Specialty not found or unauthorized');
  }

  specialty.isActive = !specialty.isActive;
  await specialty.save();
  return specialty;
};

module.exports = {
  createSpecialty,
  getClinicSpecialties,
  toggleSpecialtyStatus,
};