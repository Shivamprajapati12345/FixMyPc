const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow null for mock payments
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    razorpaySignature: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: "razorpay",
    },
    description: {
      type: String,
    },
    receipt: {
      type: String,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ booking: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
