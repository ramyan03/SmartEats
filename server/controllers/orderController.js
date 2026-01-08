const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const buildItems = async (user) => {
  const ids = user.cart.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids } });

  const items = user.cart
    .map((i) => {
      const p = products.find((x) => String(x._id) === String(i.productId));
      if (!p) return null;
      return {
        productId: p._id,
        name: p.name,
        price: p.price,
        quantity: i.quantity,
      };
    })
    .filter(Boolean);

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  return { items, total };
};

exports.createOrderFromCart = async (req, res) => {
  const { paymentIntentId } = req.body;
  if (!paymentIntentId) return res.status(400).json({ message: "paymentIntentId required" });

  const user = await User.findById(req.user.id);
  if (!user || user.cart.length === 0) return res.status(400).json({ message: "Cart is empty" });

  const { items, total } = await buildItems(user);
  if (items.length === 0) return res.status(400).json({ message: "No valid items in cart" });

  const order = await Order.create({
    userId: user._id,
    items,
    total,
    status: "PAID",
    paymentIntentId,
    createdAt: new Date(),
  });

  user.cart = [];
  await user.save();

  res.status(201).json(order);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
};
