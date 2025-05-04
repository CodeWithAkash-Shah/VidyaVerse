const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "student" },
  class: String,
  age: Number,
  school: String,
  favSubjects: {
    type: [String],
    default: [],
  },
  weakSubjects: {
    type: [String],
    default: [],
  },
  preferences: {
    type: Object,
    default: {
      style: "with examples",
    },
  },
});


module.exports = mongoose.model("Student", studentSchema);
