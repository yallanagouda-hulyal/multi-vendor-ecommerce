const Product = require("../models/Product");

// =====================================================
// CREATE PRODUCT
// =====================================================

const createProduct = async (req, res) => {
  try {
    if (
      req.user.role === "seller" &&
      req.user.sellerApproved !== true
    ) {
      return res.status(403).json({
        message: "Seller account is not approved",
      });
    }

    const {
      name,
      description,
      price,
      sku,
      category,
      images,
      stock,
    } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !sku ||
      !category
    ) {
      return res.status(400).json({
        message:
          "Name, description, price, SKU and category are required",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
      });
    }

    if (Number(stock || 0) < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    const existingProduct = await Product.findOne({ sku });

    if (existingProduct) {
      return res.status(400).json({
        message: "SKU already exists",
      });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      sku,
      category,
      images: images || [],
      stock: Number(stock || 0),
      seller: req.user._id,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL PRODUCTS
// =====================================================

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      page = 1,
      limit = 12,
      sort = "-createdAt",
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const itemsPerPage = Math.min(
      Math.max(Number(limit) || 12, 1),
      50
    );

    // ---------------------------------------------
    // FILTER
    // ---------------------------------------------

    const filter = {
      isPublished: true,
      isAvailable: true,
    };

    // Search
    if (search && search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // Category
    if (category && category.trim()) {
      filter.category = category.trim();
    }

    // Price
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined && minPrice !== "") {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined && maxPrice !== "") {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Rating
    if (minRating !== undefined && minRating !== "") {
      filter.rating = {
        $gte: Number(minRating),
      };
    }

    // Stock
    if (inStock === "true") {
      filter.stock = {
        $gt: 0,
      };
    }

    // ---------------------------------------------
    // TOTAL PRODUCTS
    // ---------------------------------------------

    const totalProducts =
      await Product.countDocuments(filter);

    // ---------------------------------------------
    // TOTAL PAGES
    // ---------------------------------------------

    const totalPages = Math.max(
      Math.ceil(
        totalProducts / itemsPerPage
      ),
      1
    );

    // Prevent page going beyond available pages
    const safePage = Math.min(
      currentPage,
      totalPages
    );

    // ---------------------------------------------
    // GET PRODUCTS
    // ---------------------------------------------

    const products = await Product.find(filter)
      .populate("seller", "name email")
      .sort(sort)
      .skip(
        (safePage - 1) * itemsPerPage
      )
      .limit(itemsPerPage);

    // ---------------------------------------------
    // RESPONSE
    // ---------------------------------------------

    res.status(200).json({
      products,

      pagination: {
        page: safePage,
        limit: itemsPerPage,
        totalProducts,
        totalPages,
      },

      // These are kept because your current
      // Products.jsx reads data.totalPages
      page: safePage,
      totalPages,
      totalProducts,
    });

  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE PRODUCT
// =====================================================

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    ).populate(
      "seller",
      "name email"
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });

  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    res.status(500).json({
      message: "Failed to get product",
      error: error.message,
    });
  }
};


// =====================================================
// GET MY PRODUCTS
// =====================================================

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      products,
    });

  } catch (error) {
    console.error(
      "Get my products error:",
      error
    );

    res.status(500).json({
      message: "Failed to get your products",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE PRODUCT
// =====================================================

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Seller authorization
    if (req.user.role === "seller") {

      if (req.user.sellerApproved !== true) {
        return res.status(403).json({
          message:
            "Seller account is not approved",
        });
      }

      if (
        product.seller.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "You can only update your own products",
        });
      }
    }

    const {
      name,
      description,
      price,
      sku,
      category,
      images,
      stock,
      isPublished,
      isAvailable,
    } = req.body;

    // Check SKU
    if (
      sku &&
      sku !== product.sku
    ) {
      const existingProduct =
        await Product.findOne({ sku });

      if (
        existingProduct &&
        existingProduct._id.toString() !==
          product._id.toString()
      ) {
        return res.status(400).json({
          message: "SKU already exists",
        });
      }
    }

    // Validate price
    if (
      price !== undefined &&
      Number(price) < 0
    ) {
      return res.status(400).json({
        message: "Price cannot be negative",
      });
    }

    // Validate stock
    if (
      stock !== undefined &&
      Number(stock) < 0
    ) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    product.name =
      name ?? product.name;

    product.description =
      description ?? product.description;

    product.price =
      price !== undefined
        ? Number(price)
        : product.price;

    product.sku =
      sku ?? product.sku;

    product.category =
      category ?? product.category;

    product.images =
      images ?? product.images;

    product.stock =
      stock !== undefined
        ? Number(stock)
        : product.stock;

    product.isPublished =
      isPublished ??
      product.isPublished;

    product.isAvailable =
      isAvailable ??
      product.isAvailable;

    await product.save();

    res.status(200).json({
      message:
        "Product updated successfully",
      product,
    });

  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE PRODUCT
// =====================================================

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Seller authorization
    if (req.user.role === "seller") {

      if (req.user.sellerApproved !== true) {
        return res.status(403).json({
          message:
            "Seller account is not approved",
        });
      }

      if (
        product.seller.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "You can only delete your own products",
        });
      }
    }

    await product.deleteOne();

    res.status(200).json({
      message:
        "Product deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
};