const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
const {
    getPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    createPaymentIntent,
} = require("../Controllers/paymentController");

router.route("/create-payment-intent")
    .post(protect, createPaymentIntent);

router.route("/")
    .get(protect, getPaymentMethods)
    .post(protect, addPaymentMethod);

router.route("/:id")
    .delete(protect, deletePaymentMethod);

router.route("/:id/default")
    .patch(protect, setDefaultPaymentMethod);

module.exports = router;
