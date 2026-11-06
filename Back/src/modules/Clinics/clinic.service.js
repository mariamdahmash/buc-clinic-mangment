const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Clinic = require('./clinic.model');
const User = require('../Auth/user.model');
const { fail } = require('../../utils/errors');
async function createClinicWithAdmin({ adminData, ...data }) {
  const password = await bcrypt.hash(adminData.password, 12);

  const clinic = await mongoose.connection.transaction(async session => {
    const [clinic] = await Clinic.create([data], { session });
    await User.create([{ ...adminData, password, role: 'clinicadmin', clinicId: clinic.id }], { session });
    return clinic;
  });

  return clinic;
}
const getAllClinics = () => Clinic.find().sort({ createdAt: -1 });
const getMyClinic = clinicId => Clinic.findById(clinicId);
async function getActiveBySlug(slug) {
  const clinic = await Clinic.findOne({ slug, isActive: true });
  if (!clinic) fail('العيادة غير موجودة أو متوقفة', 404);
  return clinic;
}
async function setStatus(clinicId, isActive) {
  const clinic = await Clinic.findByIdAndUpdate(clinicId, { $set: { isActive }, $inc: { mutationVersion: 1 } }, { returnDocument: 'after' });
  if (!clinic) fail('العيادة غير موجودة', 404);
  return clinic;
}
module.exports = { createClinicWithAdmin, getAllClinics, getMyClinic, getActiveBySlug, setStatus };
