const doctorService = require('./doctor.service');

const getAll = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const doctors = await doctorService.getAll(clinicId);
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const body = { ...req.body };
    
    if (!body.image) body.image = '';
    if (!body.bio) body.bio = '';

    const doctor = await doctorService.create(clinicId, body);
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { id } = req.params;
    const updated = await doctorService.update(clinicId, id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

const setStatus = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { id } = req.params;
    const { isActive } = req.body;
    const updated = await doctorService.setStatus(clinicId, id, isActive);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { id } = req.params;
    await doctorService.remove(clinicId, id);
    res.status(200).json({ success: true, message: 'تم حذف الطبيب بنجاح' });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAll,
  create,
  update,
  setStatus,
  remove,
};