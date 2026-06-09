const mongoose = require("mongoose");

const technicianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: 0,
    },
    specialization: {
      type: [String],
      default: [],
    },
    brands: {
      type: [String],
      required: [true, "At least one brand is required"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    location: {
      type: String,
      trim: true,
    },
    geoLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    bio: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

technicianSchema.index({ geoLocation: "2dsphere" });

module.exports = mongoose.model("Technician", technicianSchema);
