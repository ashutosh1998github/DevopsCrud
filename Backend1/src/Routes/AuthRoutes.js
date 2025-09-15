

// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { loginUser } =  require('../Controllers/AuthController')
const  {protect}  = require("../Middleware/authMiddleware.js");


// Define routes
router.post('/login', loginUser);

// Protected profile route
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});


module.exports = router;
