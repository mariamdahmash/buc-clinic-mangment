const service = require('./booking.service');
const { schema } = require('./booking.validation');
const { id, status } = require('../../utils/validation');

const getAll = async (req, res) => {
  res.json({ success: true, data: await service.getAll(req.user.clinicId) });
};
const create = async (req, res) => {
  const data = schema.parse(req.body);
  res.status(201).json({ success: true, data: await service.create(req.user.clinicId, data) });
};
const update = async (req, res) => {
  const itemId = id.parse(req.params.id);
  const data = schema.parse(req.body);
  res.json({ success: true, data: await service.update(req.user.clinicId, itemId, data) });
};
const setStatus = async (req, res) => {
  const itemId = id.parse(req.params.id);
  const { isActive } = status.parse(req.body);
  res.json({ success: true, data: await service.setStatus(req.user.clinicId, itemId, isActive) });
};
const remove = async (req, res) => {
  const itemId = id.parse(req.params.id);
  res.json({ success: true, data: await service.remove(req.user.clinicId, itemId) });
};
module.exports = { getAll, create, update, setStatus, remove };
