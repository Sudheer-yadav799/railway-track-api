const router = require("express").Router();
const controller = require("../controllers/layer.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/get-layers", verifyToken, controller.getAllLayers);

module.exports = router;