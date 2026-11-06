const router = require('express').Router();
const controller = require('./public.controller');
const { limit } = require('../../../middlewares/rate-limit.middleware');
router.get('/clinics/:slug', controller.getClinicBySlug);
router.get('/clinics/:slug/slots/:id', controller.getSlots);
router.post('/clinics/:slug/bookings', limit(20), controller.createBooking);
module.exports = router;
