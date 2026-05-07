const express = require("express");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
} = require("../Controllers/categoryController");

// Create category
router.post("/create", createCategory);

// Get all categories
router.get("/all", getAllCategories);

module.exports = router;
