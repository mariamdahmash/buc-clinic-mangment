const specialtyService = require('./specialty.service');

const createSpecialty = async (req, res) => {
  try {
    const specialty = await specialtyService.createSpecialty(
      req.user.clinicId,
      req.body
    );
    res.status(201).json({
      success: true,
      message: 'Specialty created successfully',
      data: specialty,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMySpecialties = async (req, res) => {
  try {
    const specialties = await specialtyService.getClinicSpecialties(req.user.clinicId);
    res.status(200).json({ success: true, data: specialties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const specialty = await specialtyService.toggleSpecialtyStatus(
      req.user.clinicId,
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: `Specialty is now ${specialty.isActive ? 'active' : 'paused'}`,
      data: specialty,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSpecialty,
  getMySpecialties,
  toggleStatus,
};