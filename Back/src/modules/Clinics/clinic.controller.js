const clinicService = require('./clinic.service');

const createClinic = async (req, res) => {
  try {
    const result = await clinicService.createClinicWithAdmin(req.body);
    res.status(201).json({
      success: true,
      message: 'Clinic and ClinicAdmin created successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllClinics = async (req, res) => {
  try {
    const clinics = await clinicService.getAllClinics();
    res.status(200).json({
      success: true,
      data: clinics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getClinicBySlug = async (req, res) => {
  try {
    const clinic = await clinicService.getClinicBySlug(req.params.slug);
    res.status(200).json({
      success: true,
      data: clinic,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createClinic,
  getAllClinics,
  getClinicBySlug,
};