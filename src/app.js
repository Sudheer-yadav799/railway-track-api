const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require('../swagger-output.json');

const sequelize = require('./config/database');

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const layerRoutes = require("./routes/layer.routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/layers", layerRoutes);


sequelize.sync()
  .then(() => console.log("Database synced"))
  .catch(err => console.error(err));

module.exports = app;
