const express = require('express');
const router = express.Router();
const doctorController = require('./doctor.controller');
const { protect, authorize } = require('../../../middlewares/auth.middleware');

router.use(protect, authorize('clinicadmin'));

router.post('/', doctorController.createDoctor);
router.get('/', doctorController.getMyDoctors);

module.exports = router;