const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserSession = sequelize.define("UserSession", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  login_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  logout_time: {
    type: DataTypes.DATE
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: "user_sessions",
  freezeTableName: true,
  underscored: true,
  timestamps: false
});

module.exports = UserSession;
