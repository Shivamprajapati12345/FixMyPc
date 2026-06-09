const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    technician: {
      type: String,
      trim: true,
    },
    problem: {
      type: String,
      required: [true, "Problem description is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
