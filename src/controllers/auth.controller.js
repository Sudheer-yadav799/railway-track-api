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
    if (!authHeader)
      return res.status(403).json({ message: "Token required" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const session = await UserSession.findOne({
      where: { token, is_active: true }
    });

    if (!session)
      return res.status(401).json({ message: "Session expired or logged out" });

    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
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


exports.getTodayUserSessions = async (req, res) => {
  try {

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sessions = await UserSession.findAll({
      where: {
        login_time: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "mobile_number"]
        }
      ],
      order: [["login_time", "DESC"]]
    });

    const formatted = sessions.map((s) => ({
      user_id: s.user_id,
      name: s.User?.name,
      email: s.User?.email,
      mobile_number: s.User?.mobile_number,
      login_time: s.login_time,
      logout_time: s.logout_time,
      status: s.is_active ? "active" : "logged_out"
    }));

    res.json({
      success: true,
      total_users_today: formatted.length,
      users: formatted
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};