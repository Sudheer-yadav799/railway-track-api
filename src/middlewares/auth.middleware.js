const jwt = require("jsonwebtoken");
const { UserSession } = require("../models");

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(403).json({
        message: "Token required"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const session = await UserSession.findOne({
      where: {
        token,
        is_active: true
      }
    });

    if (!session) {
      return res.status(401).json({
        message: "Session expired or logged out"
      });
    }

    req.user = decoded;
    next();

  } catch (error) {

    if (error.name === "TokenExpiredError") {

      const authHeader = req.headers["authorization"];
      const token = authHeader?.split(" ")[1];

      await UserSession.update(
        {
          is_active: false,
          logout_time: new Date()
        },
        {
          where: {
            token,
            is_active: true
          }
        }
      );

      return res.status(401).json({
        message: "Token expired"
      });
    }

    return res.status(401).json({
      message: "Invalid token"
    });
  }
};