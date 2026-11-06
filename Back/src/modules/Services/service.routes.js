const router = require('express').Router();
const controller = require('./service.controller');
const { protect, authorize } = require('../../../middlewares/auth.middleware');

router.use(protect, authorize('clinicadmin'));
router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id/status', controller.setStatus);
router.delete('/:id', controller.remove);

module.exports = router;
