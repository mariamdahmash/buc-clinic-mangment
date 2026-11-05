const express = require('express');
const router = express.Router();
const specialtyController = require('./specialty.controller');
const { protect, authorize } = require('../../../middlewares/auth.middleware');


router.use(protect, authorize('clinicadmin'));

router.post('/', specialtyController.createSpecialty);
router.get('/', specialtyController.getMySpecialties);
router.patch('/:id/toggle-status', specialtyController.toggleStatus);

module.exports = router;