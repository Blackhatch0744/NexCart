const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../Middleware/authMiddleware");
const { getDashboardStats } = require("../Controllers/adminController");

router.get("/stats", protect, isAdmin, getDashboardStats);

module.exports = router;
