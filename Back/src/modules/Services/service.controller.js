const serviceService = require('./service.service');

const createService = async (req, res) => {
  try {
    const clinicId = req.user.clinicId; // مأخوذة من الـ Auth Token
    const service = await serviceService.createService(clinicId, req.body);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getClinicServices = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const services = await serviceService.getClinicServices(clinicId);

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateService = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { id } = req.params;
    const updated = await serviceService.updateService(clinicId, id, req.body);

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { id } = req.params;
    await serviceService.deleteService(clinicId, id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createService,
  getClinicServices,
  updateService,
  deleteService,
};