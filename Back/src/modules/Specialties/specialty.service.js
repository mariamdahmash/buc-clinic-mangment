const Specialty = require('./specialty.model');
const { write } = require('../Clinics/clinic.transaction');
const { fail } = require('../../utils/errors');
const Doctor = require('../Doctors/doctor.model');
const Service = require('../Services/service.model');

const getAll = clinicId => Specialty.find({ clinicId }).sort({ createdAt: -1 });

async function create(clinicId, data) {
  return write(clinicId, async session => {
    return (await Specialty.create([{ ...data, clinicId }], { session }))[0];
  });
}

async function update(clinicId, itemId, data) {
  return write(clinicId, async session => {
    const current = await Specialty.findOne({ _id: itemId, clinicId }).session(session);
    if (!current) fail('العنصر غير موجود', 404);
    Object.assign(current, data);
    await current.save({ session });
    return current;
  });
}

async function setStatus(clinicId, itemId, isActive) {
  return write(clinicId, async session => {
    const current = await Specialty.findOne({ _id: itemId, clinicId }).session(session);
    if (!current) fail('العنصر غير موجود', 404);
    current.isActive = isActive;
    await current.save({ session });
    return current;
  });
}

async function remove(clinicId, itemId) {
  return write(clinicId, async session => {
    const filter = { _id: itemId, clinicId };
    if (!await Specialty.exists(filter).session(session)) fail('العنصر غير موجود', 404);
    if (await Doctor.exists({ clinicId, specialtyId: itemId }).session(session)) fail('العنصر مرتبط ببيانات أخرى. احذف أو انقل البيانات المرتبطة أولًا، أو عطّل العنصر', 409);
    if (await Service.exists({ clinicId, specialtyId: itemId }).session(session)) fail('العنصر مرتبط ببيانات أخرى. احذف أو انقل البيانات المرتبطة أولًا، أو عطّل العنصر', 409);
    await Specialty.deleteOne(filter).session(session);
    return { deleted: true };
  });
}

module.exports = { getAll, create, update, setStatus, remove };
