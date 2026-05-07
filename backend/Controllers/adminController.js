const Order = require("../Models/Order");
const Product = require("../Models/Product");
const User = require("../Models/User");
const asyncHandler = require("../Middleware/asyncHandler");

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Total Orders
    const totalOrders = await Order.countDocuments();

    // 2. Total Products
    const totalProducts = await Product.countDocuments();

    // 3. Total Users
    const totalUsers = await User.countDocuments();

    // 4. Total Revenue
    const totalRevenueResult = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },
            },
        },
    ]);

    const totalRevenue =
        totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

    // 5. Recent Orders (Last 5)
    const recentOrders = await Order.find()
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .limit(5);

    res.json({
        success: true,
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
        recentOrders,
    });
});
