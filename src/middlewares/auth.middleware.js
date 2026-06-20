const jwt = require("jsonwebtoken");
const { UserSession } = require("../models");

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token required" });
  }

  try {
    // verify jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check session in DB
    const session = await UserSession.findOne({
      where: { token }
    });

    if (!session) {
      return res.status(401).json({ message: "Session not found" });
    }

    // already logged out
    if (!session.is_active) {
      return res.status(401).json({ message: "User already logged out" });
    }

    // check 8 hour expiry
if (
  session.session_expiry_time &&
  new Date() > session.session_expiry_time
) {

  await session.update({
    logout_time: new Date(),
    is_active: false
  });

  return res.status(401).json({
    message: "Session expired. Please login again."
  });
}

    req.user = decoded;
    req.session = session;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};