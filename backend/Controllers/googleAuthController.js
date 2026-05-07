const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../Middleware/asyncHandler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const axios = require("axios");



exports.googleAuth = asyncHandler(async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    res.status(400);
    throw new Error("No Google access_token provided");
  }

  // Securely verify token by asking Google for user profile
  let payload;
  try {
    const { data } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    payload = data;
  } catch (err) {
    res.status(401);
    throw new Error("Google access_token verification failed");
  }

  const { email, name, picture } = payload;

  console.log(`[Google Auth] Login attempt for ${email}`);

  // Check if user exists
  let user = await User.findOne({ email });

  if (!user) {
    // Generate a secure random password since the user schema requires one
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create user
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log(`[Google Auth] Created new user profile for ${email}`);
  }

  // Sign standard JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  // Set standard MiniX Auth Cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  console.log(`[Google Auth] Login successful for ${email}`);

  res.json({
    message: "Google login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});
