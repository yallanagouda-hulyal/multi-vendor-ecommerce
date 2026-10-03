const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");

// ======================================================
// CREATE ORDER / CHECKOUT
// ======================================================

const createOrder = async (req, res) => {
  let reservedItems = [];
  let cartItems = [];

  try {
    const { shippingAddress, paymentMethod = "cod" } = req.body;

    // Validate shipping address
    if (
      !shippingAddress ||
      typeof shippingAddress !== "string" ||
      !shippingAddress.trim()
    ) {
      return res.status(400).json({
        message: "Shipping address is required",
      });
    }

    // Validate payment method
    if (!["cod", "online"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    // Atomically take the customer's cart
    const cart = await Cart.findOneAndUpdate(
      {
        customer: req.user._id,
        "items.0": { $exists: true },
      },
      {
        $set: {
          items: [],
        },
      },
      {
        new: false,
      }
    );

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Save cart items in case rollback is needed
    cartItems = cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    const orderItems = [];
    let totalAmount = 0;

    // ==================================================
    // CHECK AND RESERVE PRODUCTS
    // ==================================================

    for (const cartItem of cartItems) {
      if (
        !Number.isInteger(cartItem.quantity) ||
        cartItem.quantity <= 0
      ) {
        throw new Error("Invalid quantity");
      }

      const product = await Product.findById(cartItem.product);

      if (!product) {
        throw new Error("One of the products no longer exists");
      }

      if (!product.isPublished || !product.isAvailable) {
        throw new Error(`${product.name} is not available`);
      }

      // Atomic stock update.
      // Stock will only decrease if enough stock exists.
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: product._id,
          isPublished: true,
          isAvailable: true,
          stock: {
            $gte: cartItem.quantity,
          },
        },
        {
          $inc: {
            stock: -cartItem.quantity,
          },
        },
        {
          new: true,
        }
      );

      if (!updatedProduct) {
        throw new Error(
          `Insufficient stock for ${product.name}`
        );
      }

      // Remember reserved stock for rollback
      reservedItems.push({
        productId: product._id,
        quantity: cartItem.quantity,
      });

      // If stock becomes zero, mark unavailable
      if (updatedProduct.stock === 0) {
        await Product.findByIdAndUpdate(
          updatedProduct._id,
          {
            $set: {
              isAvailable: false,
            },
          }
        );
      }

      // Snapshot product information into order
      const subtotal =
        Number(product.price) * cartItem.quantity;

      orderItems.push({
        product: product._id,
        seller: product.seller,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: cartItem.quantity,
        subtotal,
      });

      totalAmount += subtotal;
    }

    // ==================================================
    // CREATE ORDER
    // ==================================================

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: shippingAddress.trim(),
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "confirmed",
    });

    // Populate response
    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "name email")
      .populate("items.product", "name sku");

    return res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    // ==================================================
    // ROLLBACK STOCK
    // ==================================================

    if (reservedItems.length > 0) {
      for (const item of reservedItems) {
        try {
          const product = await Product.findById(
            item.productId
          );

          if (product) {
            product.stock += item.quantity;

            if (product.stock > 0) {
              product.isAvailable = true;
            }

            await product.save();
          }
        } catch (rollbackError) {
          console.error(
            "Stock rollback error:",
            rollbackError
          );
        }
      }
    }

    // ==================================================
    // RESTORE CART
    // ==================================================

    if (cartItems.length > 0) {
      try {
        await Cart.findOneAndUpdate(
          {
            customer: req.user._id,
          },
          {
            $set: {
              items: cartItems,
            },
          },
          {
            upsert: true,
          }
        );
      } catch (cartRollbackError) {
        console.error(
          "Cart rollback error:",
          cartRollbackError
        );
      }
    }

    const clientErrorMessages = [
      "One of the products no longer exists",
      "is not available",
      "Insufficient stock",
      "Invalid quantity",
    ];

    const isClientError = clientErrorMessages.some(
      (message) => error.message.includes(message)
    );

    return res.status(isClientError ? 400 : 500).json({
      message:
        error.message || "Failed to create order",
    });
  }
};

// ======================================================
// GET CUSTOMER ORDERS
// ======================================================

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
    })
      .populate("items.product", "name images sku")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

// ======================================================
// GET SINGLE CUSTOMER ORDER
// ======================================================

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      customer: req.user._id,
    })
      .populate("customer", "name email")
      .populate("items.product", "name images sku")
      .populate("items.seller", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      message: "Failed to fetch order",
    });
  }
};

// ======================================================
// GET SELLER ORDERS
// ======================================================

const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "items.seller": req.user._id,
    })
      .populate("customer", "name email")
      .populate("items.product", "name images sku")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Get seller orders error:", error);

    return res.status(500).json({
      message: "Failed to fetch seller orders",
    });
  }
};

// ======================================================
// SELLER STATS
// ======================================================

const getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const products = await Product.find({
      seller: sellerId,
    });

    const orders = await Order.find({
      "items.seller": sellerId,
    });

    let totalSales = 0;
    let totalOrders = orders.length;
    let pendingOrders = 0;
    let deliveredOrders = 0;

    orders.forEach((order) => {
      if (order.orderStatus === "pending") {
        pendingOrders++;
      }

      if (order.orderStatus === "delivered") {
        deliveredOrders++;
      }

      order.items.forEach((item) => {
        if (
          item.seller &&
          item.seller.toString() === sellerId.toString()
        ) {
          totalSales += Number(item.subtotal || 0);
        }
      });
    });

    const lowStockProducts = products.filter(
      (product) =>
        product.stock > 0 && product.stock <= 5
    ).length;

    const inStockProducts = products.filter(
      (product) => product.stock > 0
    ).length;

    const outOfStockProducts = products.filter(
      (product) => product.stock === 0
    ).length;

    return res.status(200).json({
      totalProducts: products.length,
      totalOrders,
      totalSales,
      pendingOrders,
      deliveredOrders,
      lowStockProducts,
      inStockProducts,
      outOfStockProducts,
    });
  } catch (error) {
    console.error("Get seller stats error:", error);

    return res.status(500).json({
      message: "Failed to fetch seller statistics",
    });
  }
};

// ======================================================
// SELLER UPDATE ORDER STATUS
// ======================================================

const updateSellerOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const allowedStatuses = [
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findOne({
      _id: id,
      "items.seller": req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const previousStatus = order.orderStatus;

    // Restore stock when seller cancels an order
    if (
      status === "cancelled" &&
      previousStatus !== "cancelled" &&
      previousStatus !== "returned"
    ) {
      for (const item of order.items) {
        if (
          item.seller &&
          item.seller.toString() ===
            req.user._id.toString()
        ) {
          const product = await Product.findById(
            item.product
          );

          if (product) {
            product.stock += item.quantity;

            if (product.stock > 0) {
              product.isAvailable = true;
            }

            await product.save();
          }
        }
      }
    }

    order.orderStatus = status;

    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Update seller order status error:",
      error
    );

    return res.status(500).json({
      message: "Failed to update order status",
    });
  }
};

// ======================================================
// CUSTOMER CANCEL ORDER
// ======================================================

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      customer: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Only certain statuses can be cancelled
    if (
      ["shipped", "delivered", "cancelled", "returned"].includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        message: `Order cannot be cancelled when status is ${order.orderStatus}`,
      });
    }

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(
        item.product
      );

      if (product) {
        product.stock += item.quantity;

        if (product.stock > 0) {
          product.isAvailable = true;
        }

        await product.save();
      }
    }

    order.orderStatus = "cancelled";

    await order.save();

    return res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);

    return res.status(500).json({
      message: "Failed to cancel order",
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  getSellerStats,
  updateSellerOrderStatus,
  cancelOrder,
};