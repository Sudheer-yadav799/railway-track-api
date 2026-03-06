const router = require("express").Router();
const controller = require("../controllers/layer.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/get-layers", verifyToken, controller.getAllLayers);

router.post("/create-layers", controller.createLayer);

// routes/layer.routes.js

router.patch("/delete-layers/:layerId/", controller.softDeleteLayer);

// Update layer
router.put("/update-layers/:layerId", controller.updateLayer);

module.exports = router;