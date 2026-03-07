const sequelize = require("../config/database");

const User = require("./user.model");
const Role = require("./role.model");
const UserRole = require("./userRole.model");
const UserSession = require("./userSession.model");

const Layer = require("./layer.model");
const LayerSection = require("./layerSection.model");

const Project = require("./project.model");
const LayerTemplate = require("./LayerTemplate.model");
const ProjectLayer = require("./ProjectLayer.model");

const UserProject = require("./userProject.model");

/* ======================
   USER ↔ ROLE
====================== */

User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id"
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "role_id",
  otherKey: "user_id"
});

/* ======================
   LAYER ↔ SECTION
====================== */

LayerSection.hasMany(Layer, {
  foreignKey: "section_id",
  as: "layers"
});

Layer.belongsTo(LayerSection, {
  foreignKey: "section_id",
  as: "section"
});

/* ======================
   LAYER TEMPLATE ↔ SECTION
====================== */

LayerSection.hasMany(LayerTemplate, {
  foreignKey: "section_id",
  as: "templates"
});

LayerTemplate.belongsTo(LayerSection, {
  foreignKey: "section_id",
  as: "section"
});

/* ======================
   PROJECT ↔ PROJECT LAYERS
====================== */

Project.hasMany(ProjectLayer, {
  foreignKey: "project_id",
  as: "projectLayers"
});

ProjectLayer.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project"
});

/* ======================
   LAYER TEMPLATE ↔ PROJECT LAYERS
====================== */

LayerTemplate.hasMany(ProjectLayer, {
  foreignKey: "layer_template_id",
  as: "projectLayers"
});

ProjectLayer.belongsTo(LayerTemplate, {
  foreignKey: "layer_template_id",
  as: "template"
});

/* ======================
   USER ↔ PROJECT (Many-to-Many)
====================== */

User.belongsToMany(Project, {
  through: UserProject,
  foreignKey: "user_id",
  otherKey: "project_id",
  as: "projects"
});

Project.belongsToMany(User, {
  through: UserProject,
  foreignKey: "project_id",
  otherKey: "user_id",
  as: "users"
});
/* ======================
   EXPORT MODELS
====================== */

module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  UserSession,
  Layer,
  LayerSection,
  Project,
  LayerTemplate,
  ProjectLayer,
  UserProject
};