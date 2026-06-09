const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema(
  {
    repairRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RepairRequest",
      required: true,
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technician",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    message: {
      type: String,
      trim: true,
    },
    etaHours: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

quotationSchema.index({ repairRequest: 1, technician: 1 }, { unique: true });

module.exports = mongoose.model("Quotation", quotationSchema);

