const clinicService = require('../Clinics/clinic.service');

const getLandingDataBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const clinic = await clinicService.getClinicBySlug(slug);

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

module.exports = {
  getLandingDataBySlug,
  getAllClinics,
};