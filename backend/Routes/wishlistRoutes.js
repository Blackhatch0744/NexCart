const express = require("express");
const router = express.Router();
const {
    getWishlist,
    toggleWishlist,
} = require("../Controllers/wishlistController");
const { protect } = require("../Middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.get("/", getWishlist);
router.post("/toggle", toggleWishlist);

module.exports = router;
