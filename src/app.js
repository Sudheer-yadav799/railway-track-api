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
const projectRoutes = require("./routes/project.routes"); 
const assignProjectRoutes = require("./routes/userproject.routes"); 
const app = express();

app.use(cors());
app.use(helmet());


app.use(cors({
   origin: [
      "http://localhost:5173",
      "http://115.245.208.219:5173"
    ],
  credentials: true
}));

app.options('*', cors());

app.use(helmet({
  crossOriginResourcePolicy: false
}));


app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src *; img-src * data:; connect-src *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';"
  );
  next();
});

app.use(morgan('dev'));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/layers", layerRoutes);
app.use("/api/assignproject",assignProjectRoutes)

app.use("/api/layers",   layerRoutes);
app.use("/api/projects", projectRoutes,);

app.get("/", async (req, res) => {
  try {

    // Test database connection
    await sequelize.authenticate();

    res.status(200).json({
      status: "success",
      message: "Railway Track API is running 🚆",
      database: "Connected ✅",
      time: new Date()
    });

  } catch (error) {

    res.status(500).json({
      status: "error",
      message: "API running but database connection failed ❌",
      error: error.message
    });

  }
});
app.get("/health", async (req, res) => {
  try {

    await sequelize.authenticate();

    res.json({
      api: "Running",
      database: "Connected",
      uptime: process.uptime()
    });

  } catch (error) {

    res.status(500).json({
      api: "Running",
      database: "Disconnected",
      error: error.message
    });

  }
});

sequelize.sync()
  .then(() => console.log("Database synced"))
  .catch(err => console.error(err));

module.exports = app;
