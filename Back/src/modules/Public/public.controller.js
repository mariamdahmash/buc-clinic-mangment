const service = require('./public.service');
const { publicBooking } = require('../Bookings/booking.validation');
const { id } = require('../../utils/validation');
const getClinicBySlug = async (req, res) => res.json({ success: true, data: await service.getClinicBySlug(req.params.slug) });
const getSlots = async (req, res) => res.json({ success: true, data: await service.getSlots(req.params.slug, id.parse(req.params.id)) });
const createBooking = async (req, res) => {
  const data = publicBooking.parse(req.body);
  res.status(201).json({ success: true, data: await service.createBooking(req.params.slug, data) });
};
module.exports = { getClinicBySlug, getSlots, createBooking };
