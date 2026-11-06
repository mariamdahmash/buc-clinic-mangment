const service = require('./clinic.service');
const { clinic } = require('./clinic.validation');
const { id, status } = require('../../utils/validation');
const createClinic = async (req, res) => {
  res.status(201).json({ success: true, data: await service.createClinicWithAdmin(clinic.parse(req.body)) });
};
const getAllClinics = async (req, res) => res.json({ success: true, data: await service.getAllClinics() });
const getMyClinic = async (req, res) => res.json({ success: true, data: await service.getMyClinic(req.user.clinicId) });
const setStatus = async (req, res) => {
  const clinicId = id.parse(req.params.id);
  const { isActive } = status.parse(req.body);
  res.json({ success: true, data: await service.setStatus(clinicId, isActive) });
};
module.exports = { createClinic, getAllClinics, getMyClinic, setStatus };
