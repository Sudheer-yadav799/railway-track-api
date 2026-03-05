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
    allowNull: false          // "Vijayawada to Kadapa"
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true              // "VJA_KDP"
  },
  from_station: DataTypes.STRING,
  to_station: DataTypes.STRING,
  geoserver_workspace: DataTypes.STRING,  // default workspace for project
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  track_length_km: {
  type: DataTypes.DECIMAL(10, 2),
  defaultValue: 0
},
station_count: {
  type: DataTypes.INTEGER,
  defaultValue: 0
}
  
}, {
  tableName: "projects",
  freezeTableName: true,
  underscored: true,
  timestamps: true
});

module.exports = Project;