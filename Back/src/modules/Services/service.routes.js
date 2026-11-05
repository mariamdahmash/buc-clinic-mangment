const express = require('express');
const router = express.Router();
const serviceController = require('./service.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.use(protect);

router.post('/', serviceController.createService);
router.get('/', serviceController.getClinicServices);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;