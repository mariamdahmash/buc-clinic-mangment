const express = require('express');
const router = express.Router();
const publicController = require('./public.controller');

router.get('/clinics/:slug', publicController.getLandingDataBySlug);
router.get('/clinics', publicController.getAllClinics);

module.exports = router;