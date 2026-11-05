const express = require('express');
const router = express.Router();
const clinicController = require('./clinic.controller');
const { protect, authorize } = require('../../../middlewares/auth.middleware');

router.get('/public/:slug', clinicController.getClinicBySlug);

router.post(
  '/',
  protect,
  authorize('superadmin'),
  clinicController.createClinic
);

router.get(
  '/',
  protect,
  authorize('superadmin'),
  clinicController.getAllClinics
);



module.exports = router;