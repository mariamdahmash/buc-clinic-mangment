const Service = require('./service.model');
const { fail } = require('../../utils/errors');
const Specialty = require('../Specialties/specialty.model');

// التحقق من صحة التخصص إذا تم اختياره
async function validateData(clinicId, data) {
  if (data.specialtyId) {
    const specialtyExists = await Specialty.exists({ _id: data.specialtyId, clinicId });
    if (!specialtyExists) fail('التخصص المختار غير تابع لهذه العيادة', 400);
  }
}

// 1. جلب كافة الخدمات
const getAll = (clinicId) =>
  Service.find({ clinicId })
    .populate({ path: 'specialtyId', select: 'name', strictPopulate: false })
    .sort({ createdAt: -1 });

// 2. إنشاء خدمة جديد
async function create(clinicId, data) {
  await validateData(clinicId, data);
  return await Service.create({ ...data, clinicId });
}

// 3. تعديل بيانات خدمة
async function update(clinicId, itemId, data) {
  const current = await Service.findOne({ _id: itemId, clinicId });
  if (!current) fail('العنصر غير موجود', 404);

  await validateData(clinicId, data);
  Object.assign(current, data);
  await current.save();
  return current;
}

// 4. تغيير الحالة
async function setStatus(clinicId, itemId, isActive) {
  const current = await Service.findOne({ _id: itemId, clinicId });
  if (!current) fail('العنصر غير موجود', 404);

  current.isActive = isActive;
  await current.save();
  return current;
}

// 5. حذف خدمة
async function remove(clinicId, itemId) {
  const filter = { _id: itemId, clinicId };
  const exists = await Service.exists(filter);
  if (!exists) fail('العنصر غير موجود', 404);

  await Service.deleteOne(filter);
  return { deleted: true };
}

module.exports = { getAll, create, update, setStatus, remove };