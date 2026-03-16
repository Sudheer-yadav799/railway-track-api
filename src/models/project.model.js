const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  from_station: DataTypes.STRING,

  to_station: DataTypes.STRING,

  geoserver_workspace: DataTypes.STRING,

  map_view_center: {
    type: DataTypes.STRING,
    allowNull: true
  },

  track_length_km: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },

  station_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  deleted_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  tableName: "projects",
  freezeTableName: true,
  underscored: true,
  timestamps: true
});

module.exports = Project;