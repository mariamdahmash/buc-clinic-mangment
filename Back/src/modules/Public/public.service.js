const Clinic = require('./clinic.model');
const Specialty = require('../Specialties/specialty.model');
const Doctor = require('../Doctors/doctor.model');
const Service = require('../Services/service.model');

const getClinicBySlug = async (slug) => {
  // 1. جلب العيادة
  const clinic = await Clinic.findOne({ slug, isActive: true });
  if (!clinic) {
    throw new Error('Clinic not found');
  }

  // 2. جلب التخصصات النشطة للعيادة
  const specialties = await Specialty.find({
    clinicId: clinic._id,
    isActive: true,
  });

  // 3. جلب الأطباء النشطين وتحديد بيانات التخصص
  const doctors = await Doctor.find({
    clinicId: clinic._id,
    isActive: true,
  })
    .populate('specialtyId', 'name icon')
    .select('-email'); // إخفاء الإيميل للحفاظ على الخصوصية في العرض العام

  // 4. إرجاع الـ Data تجميعة واحدة للـ Landing Page
  return {
    clinic,
    specialties,
    services,
    doctors,
  };
};

const getAllClinics = async () => {
  return await Clinic.find({ isActive: true });
};

module.exports = {
  getClinicBySlug,
  getAllClinics,
};