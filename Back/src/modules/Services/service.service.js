const Service = require('./service.model');

// 1. إنشاء خدمة جديدة (للأدمن)
const createService = async (clinicId, serviceData) => {
  return await Service.create({
    ...serviceData,
    clinicId,
  });
};

// 2. جلب جميع خدمات العيادة (للأدمن)
const getClinicServices = async (clinicId) => {
  return await Service.find({ clinicId }).populate('specialtyId', 'name');
};

// 3. تعديل خدمة
const updateService = async (clinicId, serviceId, updateData) => {
  const service = await Service.findOneAndUpdate(
    { _id: serviceId, clinicId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!service) {
    throw new Error('Service not found or unauthorized');
  }

  return service;
};

// 4. حذف خدمة
const deleteService = async (clinicId, serviceId) => {
  const service = await Service.findOneAndDelete({ _id: serviceId, clinicId });
  if (!service) {
    throw new Error('Service not found or unauthorized');
  }
  return service;
};

module.exports = {
  createService,
  getClinicServices,
  updateService,
  deleteService,
};