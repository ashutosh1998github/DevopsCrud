// src/Controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Find user by email and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2️⃣ Compare entered password with hashed password
    const isMatch = await user.comparePassword(password); // use instance method from model

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3️⃣ Generate JWT token
    const token = generateToken(user._id);

    // 4️⃣ Send response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginUser };
