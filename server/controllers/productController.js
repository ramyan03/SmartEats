const Product = require("../models/Product");

exports.getProducts = async (_req, res) => {
  res.json(await Product.find());
};

exports.createProduct = async (req, res) => {
  const created = await Product.create(req.body);
  res.status(201).json(created);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
