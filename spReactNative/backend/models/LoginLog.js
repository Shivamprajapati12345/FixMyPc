const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    loginMethod: {
      type: String,
      enum: ["firebase", "email", "demo"],
      default: "firebase",
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    success: {
      type: Boolean,
      default: true,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
loginLogSchema.index({ email: 1, createdAt: -1 });
loginLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("LoginLog", loginLogSchema);
