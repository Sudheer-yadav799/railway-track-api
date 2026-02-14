const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');


router.post('/register', controller.register);
router.post('/login', controller.login);

router.post('/logout', verifyToken, controller.logout);

module.exports = router;
