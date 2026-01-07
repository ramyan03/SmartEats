const Product = require("../models/Product");

exports.getProducts = async (_, res) => {
  res.json(await Product.find());
};

exports.createProduct = async (req, res) => {
  res.json(await Product.create(req.body));
};
