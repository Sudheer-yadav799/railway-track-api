const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');


router.post('/register', controller.register);
router.post('/login', controller.login);

router.post('/logout', verifyToken, controller.logout);

router.get( "/user-sessions",verifyToken,controller.getUserSessions);

router.get(
  "/check-session",
  verifyToken,
  (req, res) => {
    res.json({
      valid: true
    });
  }
);

module.exports = router;
