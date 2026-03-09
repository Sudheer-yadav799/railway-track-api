
const router = require("express").Router();
const controller = require("../controllers/project.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// ---------- Projects ----------
router.get("/get-all-projects", verifyToken, controller.getAllProjects);
router.post("/create-project", verifyToken, controller.createProject);
router.get("/get-project/:projectId", verifyToken, controller.getProjectDetails);
router.delete("/delete-project/:projectId", verifyToken, controller.deleteProject);



// ---------- Project Layers ----------
router.get("/layers/:projectId", verifyToken, controller.getProjectLayers);
router.patch("/:projectId/layers/:layerCode", verifyToken, controller.toggleProjectLayer);

module.exports = router;