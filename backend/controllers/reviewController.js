const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

// ======================================================
// GET REVIEWS FOR A PRODUCT
// ======================================================

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const reviews = await Review.find({
      product: productId,
    })
      .populate("customer", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      reviews,
    });
  } catch (error) {
    console.error("Get product reviews error:", error);

    return res.status(500).json({
      message: "Failed to fetch reviews",
    });
  }
};

// ======================================================
// ADD REVIEW
// ======================================================

const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    // Validate rating
    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    // Validate comment
    if (
      !comment ||
      typeof comment !== "string" ||
      !comment.trim()
    ) {
      return res.status(400).json({
        message: "Review comment is required",
      });
    }

    if (comment.trim().length < 3) {
      return res.status(400).json({
        message: "Review comment must be at least 3 characters",
      });
    }

    if (comment.trim().length > 1000) {
      return res.status(400).json({
        message: "Review comment cannot exceed 1000 characters",
      });
    }

    // Check product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // ==================================================
    // VERIFY CUSTOMER PURCHASED THE PRODUCT
    // ==================================================

    const purchasedOrder = await Order.findOne({
      customer: req.user._id,
      "items.product": productId,
      orderStatus: "delivered",
    });

    if (!purchasedOrder) {
      return res.status(403).json({
        message:
          "You can review this product only after purchasing and receiving it.",
      });
    }

    // ==================================================
    // PREVENT DUPLICATE REVIEW
    // ==================================================

    const existingReview = await Review.findOne({
      customer: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    // ==================================================
    // CREATE REVIEW
    // ==================================================

    const review = await Review.create({
      customer: req.user._id,
      product: productId,
      rating: numericRating,
      comment: comment.trim(),
    });

    // ==================================================
    // RECALCULATE PRODUCT RATING
    // ==================================================

    const reviews = await Review.find({
      product: productId,
    });

    const totalRating = reviews.reduce(
      (sum, item) => sum + Number(item.rating),
      0
    );

    const averageRating =
      reviews.length > 0
        ? totalRating / reviews.length
        : 0;

    product.rating = Number(
      averageRating.toFixed(1)
    );

    product.reviewCount = reviews.length;

    await product.save();

    // ==================================================
    // RETURN POPULATED REVIEW
    // ==================================================

    const populatedReview = await Review.findById(
      review._id
    ).populate("customer", "name");

    return res.status(201).json({
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Add review error:", error);

    // Duplicate key protection
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    return res.status(500).json({
      message: "Failed to add review",
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getProductReviews,
  addReview,
};