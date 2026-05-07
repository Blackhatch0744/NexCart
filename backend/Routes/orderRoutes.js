const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../Middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,

  updateOrderStatus,
  getAllOrdersAdmin,
} = require("../Controllers/orderController");

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/admin/:id/status", protect, isAdmin, updateOrderStatus);
router.get("/admin/all", protect, isAdmin, getAllOrdersAdmin);

module.exports = router;
