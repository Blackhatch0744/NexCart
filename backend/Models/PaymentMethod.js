const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["card", "upi"],
            required: true,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
        // Card fields
        cardName: {
            type: String,
        },
        last4: {
            type: String,
        },
        expiry: {
            type: String,
        },
        // UPI fields
        upiId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

paymentMethodSchema.pre("save", async function (next) {
    if (this.isDefault) {
        // Unset other defaults for this user
        await this.constructor.updateMany(
            { user: this.user, _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    next();
});

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
