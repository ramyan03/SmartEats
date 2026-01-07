const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  res.json(await Order.create(req.body));
};
