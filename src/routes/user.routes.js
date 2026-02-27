const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/createuser", userController.createUser);
router.get("/getallusers", verifyToken, userController.getAllUsers);
router.get("/get-id-by-userdetails/:id", verifyToken, userController.getUserById);

router.delete("/delete-by-id/:id/:deletedById", verifyToken, userController.deleteUser);
router.post("/restore/:id/:restoredById",  verifyToken,userController.restoreUser); 

module.exports = router;
