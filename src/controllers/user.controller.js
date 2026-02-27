const bcrypt = require("bcrypt");
const { User, Role } = require("../models");

exports.createUser = async (req, res) => {
  try {
    const { name, email, mobile_number, password, roleId, roleName } = req.body;
    if (!name || !email || !mobile_number || !password) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }
    const existingUser = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [
          { email },
          { mobile_number }
        ]
      },
      paranoid: false   
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          message: "User already exists with this email"
        });
      }

      if (existingUser.mobile_number === mobile_number) {
        return res.status(400).json({
          message: "User already exists with this mobile number"
        });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile_number,
      password: password,
      created_by: roleId || null
    });

    const role = await Role.findOne({ where: { name: roleName } });

    if (role) {
      await user.addRole(role);
    }

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: Role
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: Role
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id, deletedById } = req.params;

    if (!deletedById) {
      return res.status(400).json({
        message: "deletedById is required"
      });
    }

    const user = await User.findByPk(id);

    if (!user)
      return res.status(404).json({ message: "User not found" });
    if (user.deleted_at) {
      return res.status(400).json({
        message: "User already deleted"
      });
    }
    await user.update({
      deleted_by: deletedById,
      is_active: false
    });

    await user.destroy();

    res.json({
      message: "User soft deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.restoreUser = async (req, res) => {
  try {
    const { id, restoredById } = req.params;

    if (!restoredById) {
      return res.status(400).json({
        message: "restoredById is required"
      });
    }

    const user = await User.findByPk(id, { paranoid: false });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    await user.restore();

    await user.update({
      deleted_by: null,
      is_active: true
    });

    res.json({
      message: "User restored successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};