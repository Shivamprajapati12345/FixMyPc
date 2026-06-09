const mongoose = require("mongoose");

const repairRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceType: {
      type: String,
      enum: ["laptop", "desktop", "other"],
      required: true,
    },
    issueDescription: {
      type: String,
      required: true,
      trim: true,
    },
    userLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending_quotes", "quotes_received", "accepted", "cancelled"],
      default: "pending_quotes",
    },
    nearbyTechnicians: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technician",
      },
    ],
    chosenTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technician",
    },
  },
  { timestamps: true }
);

repairRequestSchema.index({ userLocation: "2dsphere" });

module.exports = mongoose.model("RepairRequest", repairRequestSchema);

