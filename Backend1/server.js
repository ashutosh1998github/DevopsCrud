const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/Config/db');
const cors = require('cors');      
const userRoutes = require ("./src/Routes/UserRoutes");

const authRoutes = require('./src/Routes/AuthRoutes')

dotenv.config(); // load .env variables

connectDB(); // connect to MongoDB

const app = express();

app.use(cors({ origin: 'http://localhost:5173' })); // ✅ allow your React dev server
// Middleware to parse JSON
app.use(express.json());

app.use((req, res, next) => {
  console.log("📩 Incoming request:", req.method, req.url);
  next();
});

// Routes
app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
