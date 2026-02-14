const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  description: DataTypes.TEXT
}, {
  tableName: "roles",        // IMPORTANT
  freezeTableName: true,
  underscored: true, 
  timestamps: true
});

module.exports = Role;
