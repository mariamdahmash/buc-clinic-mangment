const Specialty = require('./specialty.model');
const { fail } = require('../../utils/errors');
const Doctor = require('../Doctors/doctor.model');
const Service = require('../Services/service.model');

// 1. جلب كل التخصصات الخاصة بالعيادة
const getAll = (clinicId) => Specialty.find({ clinicId }).sort({ createdAt: -1 });

// 2. إنشاء تخصص جديد
async function create(clinicId, data) {
  return await Specialty.create({ ...data, clinicId });
}

// 3. تعديل بيانات التخصص
async function update(clinicId, itemId, data) {
  const current = await Specialty.findOne({ _id: itemId, clinicId });
  if (!current) fail('العنصر غير موجود', 404);

  Object.assign(current, data);
  await current.save();
  return current;
}

// 4. تغيير حالة التخصص (تفعيل / تعطيل)
async function setStatus(clinicId, itemId, isActive) {
  const current = await Specialty.findOne({ _id: itemId, clinicId });
  if (!current) fail('العنصر غير موجود', 404);

  current.isActive = isActive;
  await current.save();
  return current;
}

// 5. حذف التخصص مع التحقق من الارتباط بأطباء أو خدمات
async function remove(clinicId, itemId) {
  const filter = { _id: itemId, clinicId };
  const exists = await Specialty.exists(filter);
  if (!exists) fail('العنصر غير موجود', 404);

  const hasDoctors = await Doctor.exists({ clinicId, specialtyId: itemId });
  if (hasDoctors) {
    fail('العنصر مرتبط ببيانات أخرى. احذف أو انقل البيانات المرتبطة أولًا، أو عطّل العنصر', 409);
  }

  const hasServices = await Service.exists({ clinicId, specialtyId: itemId });
  if (hasServices) {
    fail('العنصر مرتبط ببيانات أخرى. احذف أو انقل البيانات المرتبطة أولًا، أو عطّل العنصر', 409);
  }

  await Specialty.deleteOne(filter);
  return { deleted: true };
}

module.exports = { getAll, create, update, setStatus, remove };