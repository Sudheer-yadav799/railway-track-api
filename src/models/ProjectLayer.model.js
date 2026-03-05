

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProjectLayer = sequelize.define("ProjectLayer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  layer_template_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  geoserver_workspace: DataTypes.STRING,  
  geoserver_layer: DataTypes.STRING,      
  shapefile_name: DataTypes.STRING,
  apiendpoint: DataTypes.STRING,
  color: DataTypes.STRING,
  fillcolor: DataTypes.STRING,
  opacity: DataTypes.STRING,
  isenabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortby: DataTypes.INTEGER
}, {
  tableName: "project_layers",
  freezeTableName: true,
  underscored: true,
  timestamps: true
});

module.exports = ProjectLayer;