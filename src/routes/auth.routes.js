const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');


router.post('/register', controller.register);
router.post('/login', controller.login);

router.post('/logout', verifyToken, controller.logout);

router.get( "/today-user-sessions",verifyToken,controller.getTodayUserSessions);

module.exports = router;
