const User = require("../models/User");
const Product = require("../models/Product");

// Helper: build a detailed cart with product info + totals
const buildCartResponse = async (user) => {
  const ids = user.cart.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids } });

  const items = user.cart.map((i) => {
    const p = products.find((x) => String(x._id) === String(i.productId));
    return {
      productId: i.productId,
      quantity: i.quantity,
      product: p
        ? {
            _id: p._id,
            name: p.name,
            price: p.price,
            description: p.description,
            stock: p.stock,
          }
        : null,
    };
  });

  const subtotal = items.reduce((sum, it) => {
    if (!it.product) return sum;
    return sum + it.product.price * it.quantity;
  }, 0);

  return { items, subtotal };
};

exports.getCart = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(await buildCartResponse(user));
};

exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: "productId required" });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const user = await User.findById(req.user.id);

  const qty = Math.max(1, Number(quantity) || 1);
  const existing = user.cart.find((i) => String(i.productId) === String(productId));

  if (existing) existing.quantity += qty;
  else user.cart.push({ productId, quantity: qty });

  await user.save();
  res.json(await buildCartResponse(user));
};

exports.updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ message: "productId required" });

  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty < 1) {
    return res.status(400).json({ message: "quantity must be >= 1" });
  }

  const user = await User.findById(req.user.id);
  const item = user.cart.find((i) => String(i.productId) === String(productId));
  if (!item) return res.status(404).json({ message: "Item not in cart" });

  item.quantity = qty;
  await user.save();
  res.json(await buildCartResponse(user));
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user.id);

  user.cart = user.cart.filter((i) => String(i.productId) !== String(productId));
  await user.save();

  res.json(await buildCartResponse(user));
};

exports.clearCart = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.cart = [];
  await user.save();
  res.json(await buildCartResponse(user));
};
