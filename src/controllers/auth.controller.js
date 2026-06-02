const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { User, Role, UserSession } = require("../models");

exports.login = async (req, res) => {
  try {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
      return res.status(400).json({
        message: "User ID and password are required"
      });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: user_id },
          { mobile_number: user_id }
        ]
      },
      include: Role
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.is_active) {
      return res.status(403).json({
        message: "User account is inactive"
      });
    }
    if (user.password !== password) {
      return res.status(400).json({
        message: "Wrong password"
      });
    }

    const roles = user.Roles.map(r => r.name);

    const payload = {
      id: user.id,
      name: user.name,
      mobile_number: user.mobile_number,
      roles
    };

    const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn }
    );

    await UserSession.update(
      {
        logout_time: new Date(),
        is_active: false
      },
      {
        where: {
          user_id: user.id,
          is_active: true
        }
      }
    );

    await UserSession.create({
      user_id: user.id,
      token
    });

    const decoded = jwt.decode(token);

    res.json({
      message: "Login successful",
      token,
      userId: user.id,
      expiresAt: new Date(decoded.exp * 1000)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader)
      return res.status(401).json({ message: "Token required" });

    const token = authHeader.split(" ")[1];

    // 🔥 Verify JWT first
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // 🔥 Check active session
    const session = await UserSession.findOne({
      where: { token, is_active: true }
    });

    if (!session)
      return res.status(401).json({ message: "Session already logged out or invalid" });

    await session.update({
      logout_time: new Date(),
      is_active: false
    });

    res.json({ message: "Logout successful" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(403).json({
        message: "Token required"
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find active session
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

    const loginTime = new Date(session.login_time);
    const now = new Date();

    const diffHours =
      (now - loginTime) / (1000 * 60 * 60);

    if (diffHours >= 8) {
      await session.update({
        logout_time: new Date(),
        is_active: false
      });

      return res.status(401).json({
        message:
          "Session expired after 8 hours. Please login again."
      });
    }

    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};


exports.register = async (req, res) => {
  try {
    const { name, email, mobile_number, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile_number,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUserSessions = async (req, res) => {
  try {
    const { filter, startDate, endDate } = req.query;

    let start;
    let end = new Date();

    // Custom date range
    if (startDate && endDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      const today = new Date();

      switch (filter) {
        case "yesterday":
          start = new Date(today);
          start.setDate(today.getDate() - 1);
          start.setHours(0, 0, 0, 0);

          end = new Date(today);
          end.setDate(today.getDate() - 1);
          end.setHours(23, 59, 59, 999);
          break;

        case "lastWeek":
          start = new Date(today);
          start.setDate(today.getDate() - 7);
          start.setHours(0, 0, 0, 0);

          end = new Date();
          end.setHours(23, 59, 59, 999);
          break;

        case "thisMonth":
          start = new Date(today.getFullYear(), today.getMonth(), 1);
          start.setHours(0, 0, 0, 0);

          end = new Date();
          end.setHours(23, 59, 59, 999);
          break;

        case "today":
        default:
          start = new Date();
          start.setHours(0, 0, 0, 0);

          end = new Date();
          end.setHours(23, 59, 59, 999);
          break;
      }
    }

    const sessions = await UserSession.findAll({
      where: {
        login_time: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "mobile_number"],
        },
      ],
      order: [["login_time", "DESC"]],
    });

    const formatted = sessions.map((s) => ({
      user_id: s.user_id,
      name: s.User?.name,
      email: s.User?.email,
      mobile_number: s.User?.mobile_number,
      login_time: s.login_time,
      logout_time: s.logout_time,
      status: s.is_active ? "active" : "logged_out",
    }));

    return res.json({
      success: true,
      filter: filter || (startDate && endDate ? "custom" : "today"),
      startDate: start,
      endDate: end,
      total_users: formatted.length,
      users: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};