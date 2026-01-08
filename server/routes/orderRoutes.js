const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { createOrderFromCart, getMyOrders } = require("../controllers/orderController");

router.get("/mine", auth, getMyOrders);
router.post("/from-cart", auth, createOrderFromCart);

module.exports = router;
