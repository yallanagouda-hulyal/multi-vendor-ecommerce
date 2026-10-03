const express = require("express");

const {
  getUsers,
  getSellers,
  updateSellerStatus,
  getProducts,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Users
router.get("/users", protect, authorize("admin"), getUsers);

// Sellers
router.get("/sellers", protect, authorize("admin"), getSellers);
router.patch(
  "/sellers/:id/status",
  protect,
  authorize("admin"),
  updateSellerStatus
);

// Products
router.get("/products", protect, authorize("admin"), getProducts);
router.delete(
  "/products/:id",
  protect,
  authorize("admin"),
  deleteProduct
);

// Orders
router.get("/orders", protect, authorize("admin"), getAllOrders);
router.patch(
  "/orders/:id/status",
  protect,
  authorize("admin"),
  updateOrderStatus
);

// Categories
router.get(
  "/categories",
  protect,
  authorize("admin"),
  getCategories
);

router.post(
  "/categories",
  protect,
  authorize("admin"),
  createCategory
);

router.put(
  "/categories/:id",
  protect,
  authorize("admin"),
  updateCategory
);

router.delete(
  "/categories/:id",
  protect,
  authorize("admin"),
  deleteCategory
);

module.exports = router;