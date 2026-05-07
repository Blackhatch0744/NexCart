const Cart = require("../Models/Cart");
const Product = require("../Models/Product");
const mongoose = require("mongoose");
const asyncHandler = require("../Middleware/asyncHandler");

// Helper to calculate cart totals or other logic if needed later

// Helper to resolve product ID from slug or ObjectId
const resolveProductId = async (idOrSlug) => {
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        return idOrSlug;
    }
    const product = await Product.findOne({ slug: idOrSlug });
    return product ? product._id : null;
};

/**
 * GET CART
 * GET /api/cart
 */
exports.getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
        "items.product",
        "name price images slug category"
    );

    if (!cart) {
        // Return empty cart structure if none exists
        return res.json({ success: true, cart: [], total: 0 });
    }

    // Filter out null products (if product deleted)
    cart.items = cart.items.filter((item) => item.product);
    await cart.save();

    res.json({ success: true, cart: cart.items });
});

/**
 * ADD TO CART
 * POST /api/cart/add
 */
exports.addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, selectedSize, selectedColor } = req.body;

    const resolvedProductId = await resolveProductId(productId);
    if (!resolvedProductId) {
        res.status(404);
        throw new Error("Product not found");
    }

    // Fetch product to check stock
    const product = await Product.findById(resolvedProductId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (product.stock < quantity) {
        res.status(400);
        throw new Error(`Not enough stock. Available: ${product.stock}`);
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
        (item) =>
            item.product.toString() === resolvedProductId.toString() &&
            item.selectedSize === selectedSize &&
            item.selectedColor?.name === selectedColor?.name
    );

    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({
            product: resolvedProductId,
            quantity,
            selectedSize,
            selectedColor,
        });
    }

    await cart.save();
    // Re-fetch to populate
    cart = await Cart.findById(cart._id).populate(
        "items.product",
        "name price images slug category"
    );

    res.json({ success: true, cart: cart.items });
});

/**
 * UPDATE CART ITEM (Quantity)
 * PUT /api/cart/update
 */
exports.updateCartItem = asyncHandler(async (req, res) => {
    const { productId, selectedSize, selectedColor, quantity } = req.body;

    const resolvedProductId = await resolveProductId(productId);
    if (!resolvedProductId) {
        res.status(404);
        throw new Error("Product not found");
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    // Check stock
    const product = await Product.findById(resolvedProductId);
    if (product && quantity > product.stock) {
        res.status(400);
        throw new Error(`Not enough stock. Available: ${product.stock}`);
    }

    const itemIndex = cart.items.findIndex(
        (item) =>
            item.product.toString() === resolvedProductId.toString() &&
            item.selectedSize === selectedSize &&
            item.selectedColor?.name === selectedColor?.name
    );

    if (itemIndex > -1) {
        if (quantity > 0) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            // Remove if quantity 0 or less
            cart.items.splice(itemIndex, 1);
        }
        await cart.save();
    }

    const updatedCart = await Cart.findById(cart._id).populate(
        "items.product",
        "name price images slug category"
    );
    res.json({ success: true, cart: updatedCart.items });
});

/**
 * REMOVE FROM CART
 * POST /api/cart/remove
 */
exports.removeFromCart = asyncHandler(async (req, res) => {
    const { productId, selectedSize, selectedColor } = req.body;

    const resolvedProductId = await resolveProductId(productId);
    if (!resolvedProductId) { // If product not found, we can't remove it anyway, or we should ignore?
        // If we can't resolve the ID, we likely can't find it in the cart logic which uses IDs.
        // But maybe we should just return success if not found?
        // For now, let's throw to be consistent.
        res.status(404);
        throw new Error("Product not found");
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(
        (item) =>
            !(
                item.product.toString() === resolvedProductId.toString() &&
                item.selectedSize === selectedSize &&
                item.selectedColor?.name === selectedColor?.name
            )
    );

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate(
        "items.product",
        "name price images slug category"
    );
    res.json({ success: true, cart: updatedCart.items });
});



/**
 * CLEAR CART
 * DELETE /api/cart/clear
 */
exports.clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
        cart.items = [];
        await cart.save();
    }
    res.json({ success: true, cart: [] });
});
