const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");

// ==========================================
// GET ALL SELLERS
// ==========================================

const getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      sellers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get sellers",
      error: error.message,
    });
  }
};

// ==========================================
// APPROVE / REJECT SELLER
// ==========================================

const updateSellerStatus = async (req, res) => {
  try {
    const { approved } = req.body;

    if (typeof approved !== "boolean") {
      return res.status(400).json({
        message: "Approved must be true or false",
      });
    }

    const seller = await User.findOne({
      _id: req.params.id,
      role: "seller",
    });

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    seller.sellerApproved = approved;

    await seller.save();

    res.json({
      message: `Seller ${
        approved ? "approved" : "rejected"
      } successfully`,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        role: seller.role,
        sellerApproved: seller.sellerApproved,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update seller status",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL USERS
// ==========================================

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get users",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL PRODUCTS
// ==========================================

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.json({
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL ORDERS
// ==========================================

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE ORDER STATUS
// ==========================================

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const previousStatus = order.orderStatus;

    const wasStockRestored =
      previousStatus === "cancelled" ||
      previousStatus === "returned";

    const shouldRestoreStock =
      (status === "cancelled" || status === "returned") &&
      !wasStockRestored;

    if (shouldRestoreStock) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);

        if (product) {
          product.stock += item.quantity;

          if (product.stock > 0) {
            product.isAvailable = true;
          }

          await product.save();
        }
      }
    }

    order.orderStatus = status;

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL CATEGORIES
// ==========================================

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
      .sort({ name: 1 });

    res.status(200).json({
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get categories",
      error: error.message,
    });
  }
};

// ==========================================
// CREATE CATEGORY
// ==========================================

const createCategory = async (req, res) => {
  try {
    const { name, description = "" } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description.trim(),
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE CATEGORY
// ==========================================

const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Category name cannot be empty",
        });
      }

      const duplicate = await Category.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(409).json({
          message: "Category already exists",
        });
      }

      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    if (isActive !== undefined) {
      category.isActive = Boolean(isActive);
    }

    await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE CATEGORY
// ==========================================

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
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
};