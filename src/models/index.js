const User = require("./user.model");
const Role = require("./role.model");
const UserRole = require("./userRole.model");
const UserSession = require("./userSession.model");

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

module.exports = {
  User,
  Role,
  UserRole,
  UserSession
};
