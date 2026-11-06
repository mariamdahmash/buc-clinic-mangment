const router = require('express').Router();
const controller = require('./auth.controller');
const { limit } = require('../../../middlewares/rate-limit.middleware');
router.post('/login', limit(15), controller.login);
router.post('/register', controller.register);
module.exports = router;
