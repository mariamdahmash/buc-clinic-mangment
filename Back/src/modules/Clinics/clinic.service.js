const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Clinic = require("./clinic.model");
const User = require("../Auth/user.model"); // 👈 تعديل مسار الموديل هنا
const { fail } = require("../../utils/errors");

async function createClinicWithAdmin({ adminData, ...data }) {
  // 1. التحقق من عدم تكرار البريد أو الرقم القومي للمدير مسبقاً
  const existingUser = await User.findOne({
    $or: [{ email: adminData.email }, { nationalId: adminData.nationalId }],
  });
  if (existingUser) {
    fail("البريد الإلكتروني أو الرقم القومي للمدير مستخدم بالفعل", 400);
  }

  // 2. التحقق من عدم تكرار الـ Slug للعيادة
  const existingClinic = await Clinic.findOne({ slug: data.slug });
  if (existingClinic) {
    fail("رابط العيادة (Slug) مستخدم بالفعل، اختر رابطًا آخر", 400);
  }

  // 3. تشفير كلمة المرور
  const password = await bcrypt.hash(adminData.password, 12);

  // 4. إنشاء العيادة
  const clinic = await Clinic.create(data);

  try {
    // 5. إنشاء حساب المدير وربطه بالعيادة
    await User.create({
      ...adminData,
      password,
      role: "clinicadmin", // حسب المعتمد في user.model عندك
      clinicId: clinic._id,
    });

    return clinic;
  } catch (error) {
    // في حال فشل إنشاء المستخدم، نلغي العيادة لعدم ترك داتا معلقة
    await Clinic.findByIdAndDelete(clinic._id);
    throw error;
  }
}

const getAllClinics = () => Clinic.find().sort({ createdAt: -1 });

const getMyClinic = (clinicId) => Clinic.findById(clinicId);

async function getActiveBySlug(slug) {
  const clinic = await Clinic.findOne({ slug, isActive: true });
  if (!clinic) fail("العيادة غير موجودة أو متوقفة", 404);
  return clinic;
}

async function setStatus(clinicId, isActive) {
  const clinic = await Clinic.findByIdAndUpdate(
    clinicId,
    { $set: { isActive }, $inc: { mutationVersion: 1 } },
    { returnDocument: "after" }
  );
  if (!clinic) fail("العيادة غير موجودة", 404);
  return clinic;
}

module.exports = {
  createClinicWithAdmin,
  getAllClinics,
  getMyClinic,
  getActiveBySlug,
  setStatus,
};