const router = require("express").Router();
const controller = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/createuser", controller.createUser);
router.get("/getallusers", verifyToken, controller.getAllUsers);
router.get("/get-id-by-userdetails/:id", verifyToken, controller.getUserById);

module.exports = router;
