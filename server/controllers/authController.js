const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const generateToken = (id, role, username) => {
  return jwt.sign({ id, role, username }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

// Register User
exports.register = async (req, res) => {
  const { username, email, password, role, ...rest } = req.body;

  // Check for existing user
  const existingUser =
    (await Student.findOne({ username })) ||
    (await Teacher.findOne({ username }));
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  let user;
  if (role === "student") {
    user = await Student.create({ username, email, password: hashedPassword, role, ...rest });
  } else if (role === "teacher") {
    user = await Teacher.create({
      email,
      username,
      password: hashedPassword,
      role,
      ...rest,
    });
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  const token = generateToken(user._id, user.role, user.username);
  res.status(201).json({ user, token });
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user =
    (await Student.findOne({ email })) ||
    (await Teacher.findOne({ email }));
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = generateToken(user._id, user.role);
  res.json({ user, token });
};