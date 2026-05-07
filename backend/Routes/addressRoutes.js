const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");

const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../Controllers/addressController");

/**
 * @route   POST /api/address
 * @desc    Add new address
 * @access  Private
 */
router.post("/", protect, addAddress);

/**
 * @route   GET /api/address
 * @desc    Get all user addresses
 * @access  Private
 */
router.get("/", protect, getAddresses);

/**
 * @route   PUT /api/address/:id
 * @desc    Update address
 * @access  Private
 */
router.put("/:id", protect, updateAddress);

/**
 * @route   PATCH /api/address/:id/default
 * @desc    Set default address
 * @access  Private
 */
router.patch("/:id/default", protect, setDefaultAddress);

/**
 * @route   DELETE /api/address/:id
 * @desc    Soft delete address
 * @access  Private
 */
router.delete("/:id", protect, deleteAddress);

module.exports = router;
