const service = require('./service.service');
const { schema } = require('./service.validation');
const { id, status } = require('../../utils/validation');

const getAll = async (req, res) => {
  try {
    const data = await service.getAll(req.user.clinicId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.specialtyId || body.specialtyId === '') {
      body.specialtyId = null;
    }
    const data = schema.parse(body);
    const result = await service.create(req.user.clinicId, data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message || error.errors });
  }
};

const update = async (req, res) => {
  try {
    const itemId = id.parse(req.params.id);
    const body = { ...req.body };
    if (!body.specialtyId || body.specialtyId === '') {
      body.specialtyId = null;
    }
    const data = schema.partial().parse(body);
    const result = await service.update(req.user.clinicId, itemId, data);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message || error.errors });
  }
};

const setStatus = async (req, res) => {
  try {
    const itemId = id.parse(req.params.id);
    const { isActive } = status.parse(req.body);
    const result = await service.setStatus(req.user.clinicId, itemId, isActive);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const itemId = id.parse(req.params.id);
    const result = await service.remove(req.user.clinicId, itemId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, create, update, setStatus, remove };