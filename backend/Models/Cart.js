const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // One cart per user
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1,
                },
                selectedSize: {
                    type: String,
                },
                selectedColor: {
                    name: String,
                    code: String,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
