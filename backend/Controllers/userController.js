const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../Middleware/asyncHandler");

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const updated = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true }
  ).select("-password");

  res.json({ message: "Profile updated", user: updated });
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  const match = await bcrypt.compare(oldPassword, user.password);

  if (!match) {
    res.status(400);
    throw new Error("Current password incorrect");
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  res.json({ message: "Password updated" });
});

// @desc    Get all users (Admin)
// @route   GET /api/user/admin/all
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
});
