const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("customer"),
  getWishlist
);

router.post(
  "/",
  protect,
  authorize("customer"),
  addToWishlist
);

router.delete(
  "/:productId",
  protect,
  authorize("customer"),
  removeFromWishlist
);

module.exports = router;