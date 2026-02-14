
const router = require('express').Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const controller = require('../controllers/track.controller');

router.get('/', verifyToken, controller.getTracks);
router.post('/', verifyToken, controller.createTrack);

module.exports = router;
