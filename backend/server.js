const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// ROUTES
const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const addressRoutes = require("./Routes/addressRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
const productRoutes = require("./Routes/productRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const wishlistRoutes = require("./Routes/wishlistRoutes");
const adminRoutes = require("./Routes/adminRoutes"); // Added adminRoutes import
const { errorHandler } = require("./Middleware/errorMiddleware");

// INIT APP (THIS MUST COME FIRST)
const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// Dynamic CORS configuration for development and production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  "https://mini-x-pearl.vercel.app", // The deployed Vercel Frontend URL
  process.env.FRONTEND_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// ROUTE MOUNTS (AFTER app IS CREATED)
const orderRoutes = require("./Routes/orderRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");

// Health Check / API Root
app.get("/", (req, res) => res.send("MiniX API is running..."));
app.get("/api", (req, res) => res.json({ message: "Welcome to MiniX API" }));

const chatRoutes = require("./Routes/chatRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.use("/api/user", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes); // Added adminRoutes usage
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/contact", require("./Routes/contactRoutes"));

// ERROR HANDLER (Last middleware)
app.use(errorHandler);

// DB + SERVER
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    // Only listen if not running in a Vercel Serverless environment
    if (!process.env.VERCEL) {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = app;
