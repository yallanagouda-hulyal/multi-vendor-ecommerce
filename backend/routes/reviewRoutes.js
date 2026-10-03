const express = require("express");

const {
  getProductReviews,
  addReview,
} = require("../controllers/reviewController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Get reviews for a product
router.get("/product/:productId", getProductReviews);

// Customer adds a review
router.post(
  "/product/:productId",
  protect,
  authorize("customer"),
  addReview
);

module.exports = router;