const sequelize = require("../config/database");

const User         = require("./user.model");
const Role         = require("./role.model");
const UserRole     = require("./userRole.model");
const UserSession  = require("./userSession.model");
const Layer        = require("./layer.model");
const LayerSection = require("./layerSection.model");
const Project      = require("./project.model");
const LayerTemplate = require("./LayerTemplate.model");
const ProjectLayer  = require("./ProjectLayer.model");

/* ======================
   USER ↔ ROLE
====================== */
User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id",  otherKey: "role_id" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id",  otherKey: "user_id" });

/* ======================
   LAYER ↔ SECTION  (existing)
====================== */
LayerSection.hasMany(Layer, { foreignKey: "section_id", as: "layers" });
Layer.belongsTo(LayerSection, { foreignKey: "section_id", as: "section" });

/* ======================
   LAYER TEMPLATE ↔ SECTION  (new)
====================== */
LayerSection.hasMany(LayerTemplate, { foreignKey: "section_id", as: "templates" });
LayerTemplate.belongsTo(LayerSection, { foreignKey: "section_id" });

/* ======================
   PROJECT ↔ PROJECT LAYERS  (new)
====================== */
Project.hasMany(ProjectLayer, { foreignKey: "project_id", as: "projectLayers" });
ProjectLayer.belongsTo(Project, { foreignKey: "project_id" });

/* ======================
   LAYER TEMPLATE ↔ PROJECT LAYERS  (new)
====================== */
LayerTemplate.hasMany(ProjectLayer, { foreignKey: "layer_template_id", as: "projectLayers" });
ProjectLayer.belongsTo(LayerTemplate, { foreignKey: "layer_template_id", as: "template" });

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
  ProjectLayer
};