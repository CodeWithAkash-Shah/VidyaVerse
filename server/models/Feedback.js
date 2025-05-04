const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    understanding: {
      type: String,
      enum: ["excellent", "good", "fair", "poor", "very-poor"],
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, 
  }
);

feedbackSchema.index({ subject: 1, school: 1, class: 1 });
module.exports = mongoose.model("Feedback", feedbackSchema);
