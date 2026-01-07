const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { createOrder } = require("../controllers/orderController");

router.post("/", auth, createOrder);
module.exports = router;
