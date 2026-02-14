const dotenv = require("dotenv");
const path = require("path");

const env = process.env.NODE_ENV || "dev";

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${env}`)
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET
};
