const admin = require("firebase-admin");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../Middleware/asyncHandler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Initialize Firebase Admin securely using Project ID
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

exports.firebaseAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400);
    throw new Error("No Firebase idToken provided");
  }

  // Securely verify token by validating public keys
  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    res.status(401);
    throw new Error("Firebase idToken verification failed: " + err.message);
  }

  const { email, name, uid } = decodedToken;

  console.log(`[Firebase Auth] Login attempt for ${email || uid}`);

  // Fetch or build the user
  let user = await User.findOne({ email });

  if (!user) {
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    user = await User.create({
      name: name || "User",
      email: email || `${uid}@firebase.com`,
      password: hashedPassword,
    });
    console.log(`[Firebase Auth] Created new user profile for ${email || uid}`);
  }

  // Issue standard MiniX Cookie
  const cookieToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", cookieToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  console.log(`[Firebase Auth] Login successful for ${email || uid}`);

  res.json({
    message: "Firebase login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});
