const { UserProject, User, Project ,Role } = require("../models");

exports.assignProject = async (req, res) => {
  try {
    const { user_id, project_id, assigned_by } = req.body;

    const existing = await UserProject.findOne({
      where: { user_id, project_id }
    });

    if (existing) {
      await existing.update({
        is_active: true,
        assigned_by,
        assigned_at: new Date(),
        removed_by: null,
        removed_at: null
      });

      return res.status(200).json({
        message: "Project reassigned successfully"
      });
    }

    await UserProject.create({
      user_id,
      project_id,
      assigned_by
    });

    res.status(201).json({
      message: "Project assigned successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error assigning project",
      error: error.message
    });
  }
};


exports.removeProject = async (req, res) => {
  try {
    const { user_id, project_id, removed_by } = req.body;

    const assignment = await UserProject.findOne({
      where: { user_id, project_id, is_active: true }
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Project assignment not found"
      });
    }

    await assignment.update({
      is_active: false,
      removed_by,
      removed_at: new Date()
    });

    res.status(200).json({
      message: "Project removed successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error removing project",
      error: error.message
    });
  }
};


exports.getUserProjects = async (req, res) => {
  try {

    const { user_id } = req.params;

    // validation
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const projects = await UserProject.findAll({
      where: { user_id, is_active: true }
    });

    // if no projects assigned
    if (!projects || projects.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No projects are assigned to this user",
        data: []
      });
    }

    // projects found
    return res.status(200).json({
      success: true,
      message: "Assigned projects fetched successfully",
      data: projects
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error fetching assigned projects",
      error: error.message
    });

  }
};

exports.getProjectUsers = async (req, res) => {
  try {
    const { project_id } = req.params;

    if (!project_id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required"
      });
    }

    const project = await Project.findByPk(project_id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "name", "email"],
          through: {
            attributes: [],
            where: { is_active: true }
          },
          include: [
            {
              model: Role,
              attributes: ["id", "name"]
            }
          ]
        }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const users = project.users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.Roles?.[0]?.id || null,
      rolename: user.Roles?.[0]?.name || null
    }));

    return res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching project users",
      error: error.message
    });
  }
};


exports.getUsersWithProjects = async (req, res) => {
  try {

    const users = await User.findAll({
      attributes: ["id", "name", "email"],
      include: [
        {
          model: Project,
          as: "projects",
          attributes: ["id", "name", "code"],
          through: {
            attributes: [],
            where: { is_active: true }
          }
        },
        {
          model: Role,
          attributes: ["id", "name"]
        }
      ],
      order: [["name", "ASC"]]
    });

    const result = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.Roles?.[0]?.name || null,
      projects: user.projects.map(p => ({
        id: p.id,
        name: p.name,
        code: p.code
      }))
    }));

    res.status(200).json({
      success: true,
      message: "Users with assigned projects fetched successfully",
      data: result
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching users with projects",
      error: error.message
    });

  }
};


exports.getUserAssignedProjects = async (req, res) => {
  try {

    const { user_id } = req.params;

    const user = await User.findOne({
      where: { id: user_id },
      attributes: [],
      include: [
        {
          model: Project,
          as: "projects",
          attributes: [
            "id",
            "name",
            "code",
            "map_view_center",
            "geoserver_workspace",
            "station_count",
            "track_length_km"
          ],
          through: {
            attributes: [],
            where: { is_active: true }
          }
        }
      ],
      order: [[{ model: Project, as: "projects" }, "id", "ASC"]] // ORDER BY projects.id ASC
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const projects = user.projects.map(p => ({
      id: p.id,
      name: p.name,
      code: p.code,
      map_view: p.map_view_center,
      workspace: p.geoserver_workspace,
      station_count: p.station_count,
      track_length_km: p.track_length_km,
    }));

    res.status(200).json({
      success: true,
      message: "User assigned projects fetched successfully",
      data: projects
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user projects",
      error: error.message
    });
  }
};