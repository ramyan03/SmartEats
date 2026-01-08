const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { createIntentFromCart } = require("../controllers/paymentController");

router.post("/create-intent", auth, createIntentFromCart);

module.exports = router;
