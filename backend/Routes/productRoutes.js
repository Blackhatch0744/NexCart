const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../Middleware/authMiddleware");

const {
  createProduct,
  getAllProducts,
  getSearchProducts,
  getFeaturedProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
} = require("../Controllers/productController");

// Public
router.get("/all", getAllProducts);
router.get("/search", getSearchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:slug", getProductBySlug);


// Admin
router.post("/create", protect, isAdmin, createProduct);
router.get("/admin/all", protect, isAdmin, getAllProductsAdmin);
router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router;
