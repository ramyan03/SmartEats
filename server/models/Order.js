const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: Array,
  total: Number,
  status: String
});

module.exports = mongoose.model("Order", orderSchema);
