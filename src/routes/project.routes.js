
const router = require("express").Router();
const controller = require("../controllers/project.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/",                              verifyToken, controller.getAllProjects);
router.get("/layers/:projectId/",             verifyToken, controller.getProjectLayers);
router.patch("/:projectId/layers/:layerCode", verifyToken, controller.toggleProjectLayer);

module.exports = router;