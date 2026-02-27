const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Layer = sequelize.define("Layer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  layer_code: DataTypes.STRING,
  name: DataTypes.STRING,
  color: DataTypes.STRING,
  fillcolor: DataTypes.STRING,
  isenabled: DataTypes.BOOLEAN,
  type: DataTypes.STRING,
  apiendpoint: DataTypes.STRING,
  sortby: DataTypes.INTEGER,
  popup_type: DataTypes.STRING,
  popup_name: DataTypes.STRING,
  bind_popup_name: DataTypes.STRING,
  popup_field_name: DataTypes.STRING,
  icon_url: DataTypes.STRING,
  geoserver_workspace: DataTypes.STRING,
  opacity: DataTypes.STRING
}, {
  tableName: "layers",
  freezeTableName: true,
  underscored: true,
  timestamps: true
});

module.exports = Layer;