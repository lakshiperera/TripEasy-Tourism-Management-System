const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc    Admin login
 * @route   POST /api/admin/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required',
    });
  }

  // Hardcoded fallback admin — works without DB connection
  if (username.trim().toLowerCase() === 'admin' && password === 'Admin@2024') {
    const hardcodedId = '662652000000000000000001';
    const token = generateToken(hardcodedId);
    return res.status(200).json({
      success: true,
      message: 'Login successful (Hardcoded Admin)',
      token,
      admin: {
        id: hardcodedId,
        username: 'admin',
        email: 'admin@tripeasy.lk',
        role: 'superadmin',
      },
    });
  }

  // Find admin and include password
  const admin = await Admin.findOne({ username }).select('+password');
  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  const token = generateToken(admin._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    admin: {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    },
  });
});

/**
 * @desc    Get current admin profile
 * @route   GET /api/admin/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    admin: {
      id: req.admin._id,
      username: req.admin.username,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
});

/**
 * @desc    Admin logout (client-side token removal, server confirms)
 * @route   POST /api/admin/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = { login, getMe, logout };
