const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserProject = sequelize.define(
  "UserProject",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assigned_by: {
      type: DataTypes.INTEGER
    },
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    removed_by: {
      type: DataTypes.INTEGER
    },
    removed_at: {
      type: DataTypes.DATE
    }
  },
  {
    tableName: "user_projects",
    timestamps: false
  }
);

module.exports = UserProject;