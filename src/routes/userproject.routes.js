const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const projectController = require("../controllers/userproject.controller");

router.post("/assign-project", projectController.assignProject);

router.post("/remove-project", projectController.removeProject);

// corrected function name
router.get("/get-assigned-projects/:user_id", projectController.getUserProjects);


router.get("/users-projects", projectController.getUsersWithProjects);
// router.get("/user-projects/:user_id", projectController.getUserProjectsByUserId);
router.get("/user-projects/:user_id", projectController.getUserAssignedProjects);

router.get("/project-users/:project_id", projectController.getProjectUsers);

module.exports = router;