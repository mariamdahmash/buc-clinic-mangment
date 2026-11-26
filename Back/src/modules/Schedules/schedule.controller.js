const service = require('./schedule.service');
const { schema } = require('./schedule.validation');
const { id, status } = require('../../utils/validation');

const getAll = async (req, res) => {
  try {
    const data = await service.getAll(req.user.clinicId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = schema.parse(req.body);
    const created = await service.create(req.user.clinicId, data);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    const msg = error.issues ? error.issues.map((i) => i.message).join('، ') : error.message;
    res.status(error.status || 400).json({ success: false, message: msg });
  }
};

const update = async (req, res) => {
  try {
    const itemId = id.parse(req.params.id);
    const data = schema.parse(req.body);
    const updated = await service.update(req.user.clinicId, itemId, data);
    res.json({ success: true, data: updated });
  } catch (error) {
    const msg = error.issues ? error.issues.map((i) => i.message).join('، ') : error.message;
    res.status(error.status || 400).json({ success: false, message: msg });
  }
};

const setStatus = async (req, res) => {
  try {
    const itemId = id.parse(req.params.id);
    const { isActive } = status.parse(req.body);
    const updated = await service.setStatus(req.user.clinicId, itemId, isActive);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const itemId = id.parse(req.params.id);
    const result = await service.remove(req.user.clinicId, itemId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, create, update, setStatus, remove };