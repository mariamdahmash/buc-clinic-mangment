const router = require('express').Router();
const controller = require('./clinic.controller');
const { protect, authorize } = require('../../../middlewares/auth.middleware');
router.get('/clinics', protect, authorize('superadmin'), controller.getAllClinics);
router.post('/clinics', protect, authorize('superadmin'), controller.createClinic);
router.patch('/clinics/:id/status', protect, authorize('superadmin'), controller.setStatus);
router.get('/clinic/me', protect, authorize('clinicadmin'), controller.getMyClinic);
module.exports = router;
