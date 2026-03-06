const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Layer = sequelize.define(
  "Layer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    layer_code: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },

    color: {
      type: DataTypes.STRING(20)
    },

    fillcolor: {
      type: DataTypes.STRING(20)
    },

    opacity: {
      type: DataTypes.STRING(10)
    },

    isenabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    isactivated: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    type: {
      type: DataTypes.STRING(50)
    },

    apiendpoint: {
      type: DataTypes.STRING(150)
    },

    sortby: {
      type: DataTypes.INTEGER
    },

    popup_type: {
      type: DataTypes.STRING(50)
    },

    popup_name: {
      type: DataTypes.STRING(100)
    },

    bind_popup_name: {
      type: DataTypes.STRING(100)
    },

    popup_field_name: {
      type: DataTypes.STRING(100)
    },

    icon_url: {
      type: DataTypes.STRING(200)
    },

    geoserver_workspace: {
      type: DataTypes.STRING(150)
    }
  },
  {
    tableName: "layers",
    freezeTableName: true,
    underscored: true,

    timestamps: true,

    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = Layer;