const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.put("/qty", auth, updateQuantity);
router.delete("/item/:productId", auth, removeFromCart);
router.delete("/clear", auth, clearCart);

module.exports = router;
