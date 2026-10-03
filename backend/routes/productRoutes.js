const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getProducts);

// IMPORTANT: this must come BEFORE /:id
router.get(
  "/my-products",
  protect,
  authorize("seller"),
  getMyProducts
);

router.get("/:id", getProductById);

// Seller/Admin routes
router.post(
  "/",
  protect,
  authorize("seller", "admin"),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("seller", "admin"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("seller", "admin"),
  deleteProduct
);

module.exports = router;