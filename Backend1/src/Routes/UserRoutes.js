const express = require("express");
const { registerUser, updateUserById, deleteUserById } = require("../Controllers/userController");
const { protect, adminOnly } = require("../Middleware/authMiddleware");
const User = require("../Models/User");

const router = express.Router();

// Register route (public)
router.post("/register", registerUser);

// Get all users (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user (admin only)
router.put("/:id", protect, adminOnly, updateUserById);

// Delete user (admin only)
router.delete("/:id", protect, adminOnly, deleteUserById);

module.exports = router;
