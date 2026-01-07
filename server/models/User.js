const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
  cart: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      quantity: Number
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
