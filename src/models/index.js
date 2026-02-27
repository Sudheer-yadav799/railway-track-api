const sequelize = require("../config/database");

const User = require("./user.model");
const Role = require("./role.model");
const UserRole = require("./userRole.model");
const UserSession = require("./userSession.model");

const Layer = require("./layer.model");
const LayerSection = require("./layerSection.model");

/* ======================
   USER ↔ ROLE ASSOCIATION
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
   LAYER ↔ SECTION ASSOCIATION
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
   EXPORT
====================== */

module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  UserSession,
  Layer,
  LayerSection
};