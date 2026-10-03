const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  getSellerStats,
  updateSellerOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================
   SELLER ROUTES
   Keep these BEFORE /:id
========================================= */

router.get(
  "/seller",
  protect,
  authorize("seller"),
  getSellerOrders
);

router.get(
  "/seller/stats",
  protect,
  authorize("seller"),
  getSellerStats
);

router.patch(
  "/seller/:id/status",
  protect,
  authorize("seller"),
  updateSellerOrderStatus
);

/* =========================================
   CUSTOMER ROUTES
========================================= */

router.post(
  "/",
  protect,
  authorize("customer"),
  createOrder
);

router.get(
  "/",
  protect,
  authorize("customer"),
  getMyOrders
);

router.get(
  "/:id",
  protect,
  authorize("customer"),
  getOrderById
);

router.patch(
  "/:id/cancel",
  protect,
  authorize("customer"),
  cancelOrder
);

module.exports = router;