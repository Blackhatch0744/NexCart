const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  updatePassword,
  getAllUsers,
} = require("../Controllers/userController");

// PROFILE
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);

// ADMIN
const { isAdmin } = require("../Middleware/authMiddleware");
router.get("/admin/all", protect, isAdmin, getAllUsers);

module.exports = router;
