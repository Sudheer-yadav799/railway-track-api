
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LayerTemplate = sequelize.define("LayerTemplate", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  layer_code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false         // "TRACK", "POLE", "BRIDGE"
  },
  name: DataTypes.STRING,
  type: DataTypes.STRING,   // "wms" | "geojson" | "drone"
  color: DataTypes.STRING,
  fillcolor: DataTypes.STRING,
  opacity: DataTypes.STRING,
  icon_url: DataTypes.STRING,
  popup_type: DataTypes.STRING,
  popup_name: DataTypes.STRING,
  bind_popup_name: DataTypes.STRING,
  popup_field_name: DataTypes.STRING,
  sortby: DataTypes.INTEGER,
  isenabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: "layer_templates",
  freezeTableName: true,
  underscored: true,
  timestamps: true
});

module.exports = LayerTemplate;
