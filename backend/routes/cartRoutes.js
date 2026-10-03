const express = require("express");

const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const { protect, authorize } = require("../middleware/authMiddleware");

// All cart routes require customer login
router.use(protect, authorize("customer"));

router.get("/", getCart);

router.post("/add", addToCart);

router.put("/update", updateCartItem);

router.delete("/remove/:productId", removeFromCart);

router.delete("/clear", clearCart);

module.exports = router;