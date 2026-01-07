const User = require("../models/User");

exports.addToCart = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.cart.push(req.body);
  await user.save();
  res.send("Added to cart");
};
