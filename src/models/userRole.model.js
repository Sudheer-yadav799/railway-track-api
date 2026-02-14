const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserRole = sequelize.define("UserRole", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "user_roles",
  freezeTableName: true,
  underscored: true, 
  timestamps: true
});

module.exports = UserRole;
