const { Sequelize } = require("sequelize");
const config = require("./env");

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASS,
  {
    host: config.DB_HOST,
    dialect: "postgres",
    logging: config.NODE_ENV === "dev",
    dialectOptions:
      config.NODE_ENV === "production"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          }
        : {}
  }
);

module.exports = sequelize;
