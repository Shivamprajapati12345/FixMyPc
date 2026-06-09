const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technician",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Update technician rating when review is created/updated
reviewSchema.statics.updateTechnicianRating = async function (technicianId) {
  const reviews = await this.find({ technician: technicianId });
  if (reviews.length === 0) return;

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await mongoose.model("Technician").findByIdAndUpdate(technicianId, {
    rating: averageRating.toFixed(1),
    totalReviews: reviews.length,
  });
};

reviewSchema.post("save", async function () {
  await this.constructor.updateTechnicianRating(this.technician);
});

module.exports = mongoose.model("Review", reviewSchema);
