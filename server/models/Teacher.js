const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  subjects: {
    type: [String],
    default: [],
  },
  classes: {
    type: [String],
    default: [],
  },
  school: {
    type: String,
  },
  age: {
    type: Number,
  },
  experience: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "teacher",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);