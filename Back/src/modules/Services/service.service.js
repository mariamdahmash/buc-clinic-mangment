const Service = require('./service.model');
const { write } = require('../Clinics/clinic.transaction');
const { fail } = require('../../utils/errors');
const Specialty = require('../Specialties/specialty.model');

async function validateData(clinicId, data, session, existingId) {
  if (data.specialtyId && !await Specialty.exists({ _id: data.specialtyId, clinicId }).session(session)) fail('التخصص لا يتبع العيادة');
}

const getAll = clinicId => Service.find({ clinicId }).sort({ createdAt: -1 });

async function create(clinicId, data) {
  return write(clinicId, async session => {
    await validateData(clinicId, data, session);
    return (await Service.create([{ ...data, clinicId }], { session }))[0];
  });
}

async function update(clinicId, itemId, data) {
  return write(clinicId, async session => {
    const current = await Service.findOne({ _id: itemId, clinicId }).session(session);
    if (!current) fail('العنصر غير موجود', 404);
    await validateData(clinicId, data, session, current.id);
    Object.assign(current, data);
    await current.save({ session });
    return current;
  });
}

async function setStatus(clinicId, itemId, isActive) {
  return write(clinicId, async session => {
    const current = await Service.findOne({ _id: itemId, clinicId }).session(session);
    if (!current) fail('العنصر غير موجود', 404);
    current.isActive = isActive;
    await current.save({ session });
    return current;
  });
}

async function remove(clinicId, itemId) {
  return write(clinicId, async session => {
    const filter = { _id: itemId, clinicId };
    if (!await Service.exists(filter).session(session)) fail('العنصر غير موجود', 404);
    await Service.deleteOne(filter).session(session);
    return { deleted: true };
  });
}

module.exports = { getAll, create, update, setStatus, remove };
