const PaymentMethod = require("../Models/PaymentMethod");
const asyncHandler = require("../Middleware/asyncHandler");

// Initialize Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// @desc    Create Payment Intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
// @desc    Create Payment Intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = asyncHandler(async (req, res) => {

    const { items, currency = "usd" } = req.body;

    if (!items || items.length === 0) {
        res.status(400);
        throw new Error("No items in checkout");
    }

    // Calculate total & Check Stock based on DB
    const Product = require("../Models/Product"); // Ensure model is imported
    let totalAmount = 0;
    const SHIPPING_COST = 5; // Fixed shipping cost

    console.log("[PAYMENT] Processing Payment for items:", items.length);

    for (const item of items) {
        // Find product
        const product = await Product.findById(item.product);
        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.product}`);
        }

        // Check Stock
        if (product.stock < item.quantity) {
            res.status(400);
            throw new Error(`Not enough stock for ${product.name}. Available: ${product.stock}`);
        }

        // Add to total (Use DB price)
        totalAmount += product.price * item.quantity;
    }

    // Add Shipping
    totalAmount += SHIPPING_COST;

    if (!totalAmount || totalAmount < 1) {
        res.status(400);
        throw new Error("Invalid total amount");
    }

    console.log("[PAYMENT] Total Calculated:", totalAmount);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Stripe expects cents
        currency,
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
});


// @desc    Get all payment methods
// @route   GET /api/payments
// @access  Private
exports.getPaymentMethods = asyncHandler(async (req, res) => {
    const methods = await PaymentMethod.find({ user: req.user.id }).sort({
        createdAt: -1,
    });
    res.json({ success: true, methods });
});

// @desc    Add a payment method
// @route   POST /api/payments
// @access  Private
exports.addPaymentMethod = asyncHandler(async (req, res) => {
    const { type, isDefault, cardName, last4, expiry, upiId } = req.body;

    if (type === "card") {
        if (!cardName || !last4 || !expiry) {
            res.status(400);
            throw new Error("Missing card details");
        }
    } else if (type === "upi") {
        if (!upiId) {
            res.status(400);
            throw new Error("Missing UPI ID");
        }
    } else {
        res.status(400);
        throw new Error("Invalid payment method type");
    }

    const method = await PaymentMethod.create({
        user: req.user.id,
        type,
        isDefault: isDefault || false,
        cardName,
        last4,
        expiry,
        upiId,
    });

    // Because of the pre-save hook, we might want to re-fetch if we ensure consistency,
    // but usually for UI updates, returning the new one + separate fetch is fine.
    // Or we just return all methods again to be safe.
    const methods = await PaymentMethod.find({ user: req.user.id }).sort({
        createdAt: -1,
    });

    res.status(201).json({ success: true, methods });
});

// @desc    Delete a payment method
// @route   DELETE /api/payments/:id
// @access  Private
exports.deletePaymentMethod = asyncHandler(async (req, res) => {
    const method = await PaymentMethod.findById(req.params.id);

    if (!method) {
        res.status(404);
        throw new Error("Payment method not found");
    }

    if (method.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("Not authorized");
    }

    await method.deleteOne();

    const methods = await PaymentMethod.find({ user: req.user.id }).sort({
        createdAt: -1,
    });

    res.json({ success: true, methods });
});

// @desc    Set default payment method
// @route   PUT /api/payments/:id/default
// @access  Private
exports.setDefaultPaymentMethod = asyncHandler(async (req, res) => {
    const method = await PaymentMethod.findById(req.params.id);

    if (!method) {
        res.status(404);
        throw new Error("Payment method not found");
    }

    if (method.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("Not authorized");
    }

    method.isDefault = true;
    await method.save(); // Hook handles unsetting others

    const methods = await PaymentMethod.find({ user: req.user.id }).sort({
        createdAt: -1,
    });

    res.json({ success: true, methods });
});
