const Wishlist = require("../Models/Wishlist");
const asyncHandler = require("../Middleware/asyncHandler");

/**
 * GET WISHLIST
 * GET /api/wishlist
 */
const Product = require("../Models/Product");
const mongoose = require("mongoose");

// Helper to resolve product ID
const resolveProductId = async (idOrSlug) => {
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        return idOrSlug;
    }
    const product = await Product.findOne({ slug: idOrSlug });
    return product ? product._id : null;
};

/**
 * GET WISHLIST
 * GET /api/wishlist
 */
exports.getWishlist = asyncHandler(async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
        "products",
        "name price images slug category"
    );

    if (!wishlist) {
        return res.json({ success: true, wishlist: [] });
    }

    // Filter out any null products (if deleted)
    wishlist.products = wishlist.products.filter((p) => p !== null);
    await wishlist.save();

    res.json({ success: true, wishlist: wishlist.products });
});

/**
 * TOGGLE WISHLIST ITEM
 * POST /api/wishlist/toggle
 */
exports.toggleWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    const resolvedProductId = await resolveProductId(productId);
    if (!resolvedProductId) {
        res.status(404);
        throw new Error("Product not found");
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    // Check if product ObjectId is in the array
    const index = wishlist.products.findIndex(p => p.toString() === resolvedProductId.toString());

    if (index === -1) {
        // Add to wishlist
        wishlist.products.push(resolvedProductId);
    } else {
        // Remove from wishlist
        wishlist.products.splice(index, 1);
    }

    await wishlist.save();

    // Populate to return updated list
    const updatedWishlist = await Wishlist.findById(wishlist._id).populate(
        "products",
        "name price images slug category"
    );

    res.json({ success: true, wishlist: updatedWishlist.products });
});
