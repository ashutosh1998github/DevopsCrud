// ✅ authMiddleware.js
// This middleware protects routes by checking for a valid JWT in the request headers

const jwt = require("jsonwebtoken");   // Used to verify JWT tokens
const User = require("../Models/User");  // Import User model (MongoDB collection)

// Middleware function to protect routes
const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Check if the request has an Authorization header and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // 2️⃣ Extract the token (after the word "Bearer")
      token = req.headers.authorization.split(" ")[1];

      // 3️⃣ Verify the token using the secret key from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4️⃣ Find the user by ID (from token payload) and attach to req.user
      req.user = await User.findById(decoded.id).select("-password");

      // 5️⃣ Call next() → move to the next middleware or route handler
      return next();
    } catch (error) {
      // ❌ If token is invalid/expired
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // ❌ If no token was provided at all
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
// Admin-only access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { protect, adminOnly };


