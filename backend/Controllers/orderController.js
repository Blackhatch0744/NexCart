const Order = require("../Models/Order");
const Product = require("../Models/Product");
const mongoose = require("mongoose");
const asyncHandler = require("../Middleware/asyncHandler");
const sendEmail = require("../utils/sendEmail");


// Helper to resolve product ID
const resolveProductId = async (idOrSlug) => {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    return idOrSlug;
  }
  const product = await Product.findOne({ slug: idOrSlug });
  return product ? product._id : null;
};

exports.createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, paymentInfo } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("Order items are required");
  }

  if (!shippingAddress) {
    res.status(400);
    throw new Error("Shipping address is required");
  }

  const SHIPPING_COST = 5;
  let totalAmount = SHIPPING_COST;
  const finalItems = [];

  // Verify stock & snapshot price from DB
  for (const item of items) {
    const resolvedProductId = await resolveProductId(item.product);

    if (!resolvedProductId) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }

    const product = await Product.findById(resolvedProductId);

    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Not enough stock for ${product.name}`);
    }

    // Snapshot price from DB (Security fix)
    const price = product.price;
    totalAmount += price * item.quantity;

    // Update stock
    product.stock -= item.quantity;
    await product.save();

    finalItems.push({
      product: product._id,
      quantity: item.quantity,
      price: price, // Enforce DB price
    });
  }

  let paymentStatus = "pending";
  if (paymentInfo && paymentInfo.status === "succeeded") {
    paymentStatus = "paid";
  }

  const order = await Order.create({
    user: req.user.id,
    items: finalItems,
    shippingAddress,
    paymentMethod: paymentMethod || "COD",
    paymentStatus,
    totalAmount,
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });

  // Send Order Confirmation Email to Customer
  try {
    await sendEmail({
      email: req.user.email,
      subject: `Order Confirmation - Order #${order._id}`,
      message: `Thank you for your order! Total: $${totalAmount}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Your order ID is: <strong>${order._id}</strong></p>
        <p>Total Amount: <strong>$${totalAmount}</strong></p>
        <p>We will notify you when your items are shipped.</p>
        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/orders/${order._id}">View Order Details</a>
      `,
    });
  } catch (err) {
    console.error("[Email] Failed to send customer order confirmation", err);
  }

  // Send Order Notification Email to Admin
  try {
    await sendEmail({
      email: process.env.EMAIL_USER, // Send to Admin
      subject: `New Order Received - #${order._id}`,
      message: `A new order has been placed!\nOrder ID: ${order._id}\nTotal Amount: $${totalAmount}\nCustomer: ${req.user.name} (${req.user.email})`,
      html: `
        <h2>New Order Placed!</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Customer:</strong> ${req.user.name} (${req.user.email})</p>
        <p><strong>Total Amount:</strong> $${totalAmount}</p>
        <p>Review the order details in your admin dashboard.</p>
      `,
    });
  } catch (err) {
    console.error("[Email] Failed to send admin order notification", err);
  }

});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("items.product", "name price images")
    .populate("shippingAddress")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    orders,
  });
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("items.product", "name price images")
    .populate("shippingAddress")
    .populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user._id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized");
  }

  res.json({
    success: true,
    order,
  });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = status;
  await order.save();

  res.json({ success: true, order });
});

exports.getAllOrdersAdmin = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "id name email")
    .populate("items.product", "name price")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    orders,
  });
});

