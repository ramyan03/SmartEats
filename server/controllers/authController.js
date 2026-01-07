const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  // For demo: first registered user becomes admin (optional but convenient)
  const isFirstUser = (await User.countDocuments()) === 0;

  const user = await User.create({
    email,
    password: hashed,
    isAdmin: isFirstUser,
    cart: [],
  });

  res.status(201).json({ message: "Registered", id: user._id, isAdmin: user.isAdmin });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({
    token,
    user: { id: user._id, email: user.email, isAdmin: user.isAdmin },
  });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};
