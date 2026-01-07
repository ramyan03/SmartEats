const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  await User.create({ email: req.body.email, password: hashed });
  res.send("Registered");
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.sendStatus(401);
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.sendStatus(401);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};
