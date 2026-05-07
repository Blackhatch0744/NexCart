const express = require("express");
const router = express.Router();
const {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
} = require("../Controllers/cartController");
const { protect } = require("../Middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.get("/", getCart);
router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.put("/update", updateCartItem);
router.delete("/clear", clearCart);

module.exports = router;
