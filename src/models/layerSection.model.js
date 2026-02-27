const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LayerSection = sequelize.define("LayerSection", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  section: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "layer_sections",
  freezeTableName: true,
  underscored: true,
  timestamps: true
});

module.exports = LayerSection;