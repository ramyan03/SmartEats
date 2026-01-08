const User = require("../models/User");
const Product = require("../models/Product");
const { createPaymentIntent } = require("../utils/stripe");

const computeSubtotal = async (user) => {
  const ids = user.cart.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids } });

  return user.cart.reduce((sum, item) => {
    const p = products.find((x) => String(x._id) === String(item.productId));
    if (!p) return sum;
    return sum + p.price * item.quantity;
  }, 0);
};

exports.createIntentFromCart = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user || user.cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const subtotal = await computeSubtotal(user);
  if (subtotal <= 0) return res.status(400).json({ message: "Invalid subtotal" });

  const intent = await createPaymentIntent(subtotal);

  res.json({
    clientSecret: intent.client_secret,
    amount: subtotal,
    paymentIntentId: intent.id,
  });
};
