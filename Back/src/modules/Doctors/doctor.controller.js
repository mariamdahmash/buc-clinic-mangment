const doctorService = require('./doctor.service');

const createDoctor = async (req, res) => {
  try {
    const doctor = await doctorService.createDoctor(req.user.clinicId, req.body);
    res.status(201).json({ success: true, message: 'Doctor added successfully', data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMyDoctors = async (req, res) => {
  try {
    const doctors = await doctorService.getClinicDoctors(req.user.clinicId);
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createDoctor, getMyDoctors };