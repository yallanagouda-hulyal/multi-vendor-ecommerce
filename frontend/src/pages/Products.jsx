import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("-createdAt");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 12,
        sort,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (category) {
        params.category = category;
      }

      const response = await api.get("/products", {
        params,
      });

      setProducts(response.data.products || []);

      // Backend pagination
      setTotalPages(
        response.data.pagination?.totalPages ||
          response.data.totalPages ||
          1
      );

      setTotalProducts(
        response.data.pagination?.totalProducts ||
          response.data.totalProducts ||
          0
      );
    } catch (err) {
      console.error("Failed to load products:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load products."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH CATEGORIES
  // =========================
  const fetchCategories = async () => {
    try {
      const response = await api.get("/products", {
        params: {
          page: 1,
          limit: 50,
        },
      });

      const productList = response.data.products || [];

      const uniqueCategories = [
        ...new Set(
          productList
            .map((product) => product.category)
            .filter(Boolean)
        ),
      ];

      setCategories(uniqueCategories);
    } catch (err) {
      console.error(
        "Failed to load categories:",
        err
      );
    }
  };

  // =========================
  // FETCH WHEN FILTER/PAGE CHANGES
  // =========================
  useEffect(() => {
    fetchProducts();
  }, [category, sort, page]);

  // =========================
  // FETCH CATEGORIES ONCE
  // =========================
  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================
  // SEARCH
  // =========================
  const handleSearch = (e) => {
    e.preventDefault();

    // Start search from page 1
    if (page !== 1) {
      setPage(1);
    } else {
      fetchProducts();
    }
  };

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = async (productId) => {
    if (!token) {
      alert("Please login to add products to cart.");
      return;
    }

    try {
      await api.post(
        "/cart/add",
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product added to cart.");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to add product to cart."
      );
    }
  };

  // =========================
  // ADD TO WISHLIST
  // =========================
  const addToWishlist = async (productId) => {
    if (!token) {
      alert("Please login to add products to wishlist.");
      return;
    }

    try {
      await api.post(
        "/wishlist",
        {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product added to wishlist ❤️");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to add product to wishlist."
      );
    }
  };

  // =========================
  // FORMAT PRICE
  // =========================
  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  // =========================
  // PRODUCT IMAGE
  // =========================
  const getProductImage = (product) => {
    if (
      product.images &&
      product.images.length > 0 &&
      product.images[0]
    ) {
      return product.images[0];
    }

    return "https://via.placeholder.com/600x500?text=Product";
  };

  // =========================
  // GO TO PAGE
  // =========================
  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="products-page">
        <div className="products-container">
          <div className="products-loading">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="products-page">
      <div className="products-container">

        {/* HEADER */}
        <div className="products-header">
          <div>
            <span className="products-eyebrow">
              MULTI-VENDOR STORE
            </span>

            <h1>Shop Products</h1>

            <p>
              Discover quality products from multiple sellers
            </p>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="products-filter-card">

          {/* SEARCH */}
          <form
            className="products-search"
            onSubmit={handleSearch}
          >
            <div className="search-input-wrapper">
              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <button type="submit">
              Search
            </button>
          </form>

          {/* FILTERS */}
          <div className="products-filters">

            {/* CATEGORY */}
            <div className="filter-group">
              <label>Category</label>

              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">
                  All Categories
                </option>

                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* SORT */}
            <div className="filter-group">
              <label>Sort By</label>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="-createdAt">
                  Newest
                </option>

                <option value="price">
                  Price: Low to High
                </option>

                <option value="-price">
                  Price: High to Low
                </option>

                <option value="-rating">
                  Highest Rated
                </option>

                <option value="name">
                  Name: A-Z
                </option>
              </select>
            </div>

          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="products-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* RESULTS INFO */}
        <div className="products-results-bar">
          <div>
            <strong>
              {totalProducts || products.length}
            </strong>{" "}
            products found
          </div>

          {category && (
            <button
              className="clear-filter"
              onClick={() => {
                setCategory("");
                setPage(1);
              }}
            >
              Clear filter ×
            </button>
          )}
        </div>

        {/* PRODUCTS */}
        {products.length === 0 ? (
          <div className="products-empty">

            <div className="empty-icon">
              🛍️
            </div>

            <h2>No products found</h2>

            <p>
              Try another search or select a different
              category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("");
                setPage(1);
              }}
            >
              View All Products
            </button>

          </div>
        ) : (
          <>
            <div className="products-grid">

              {products.map((product) => (
                <article
                  className="product-card"
                  key={product._id}
                >

                  {/* IMAGE */}
                  <div className="product-image-wrapper">

                    <Link
                      to={`/products/${product._id}`}
                      className="product-image-link"
                    >
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/600x500?text=Product";
                        }}
                      />
                    </Link>

                    {/* WISHLIST */}
                    <button
                      className="wishlist-button"
                      onClick={() =>
                        addToWishlist(product._id)
                      }
                      aria-label="Add to wishlist"
                    >
                      ♡
                    </button>

                    {/* OUT OF STOCK */}
                    {product.stock === 0 && (
                      <span className="out-of-stock-badge">
                        Out of Stock
                      </span>
                    )}

                    {/* LOW STOCK */}
                    {product.stock > 0 &&
                      product.stock <= 5 && (
                        <span className="low-stock-badge">
                          Only {product.stock} left
                        </span>
                      )}

                  </div>

                  {/* PRODUCT INFO */}
                  <div className="product-info">

                    {/* CATEGORY */}
                    <span className="product-category">
                      {product.category ||
                        "General"}
                    </span>

                    {/* NAME */}
                    <Link
                      to={`/products/${product._id}`}
                      className="product-name"
                    >
                      {product.name}
                    </Link>

                    {/* RATING */}
                    <div className="product-rating">

                      <span className="star">
                        ★
                      </span>

                      <strong>
                        {Number(
                          product.rating || 0
                        ).toFixed(1)}
                      </strong>

                      <span className="review-count">
                        ({product.reviewCount || 0})
                      </span>

                    </div>

                    {/* PRICE + STOCK */}
                    <div className="product-bottom">

                      <div>

                        <div className="product-price">
                          ₹{formatPrice(product.price)}
                        </div>

                        {product.stock > 0 ? (
                          <span className="stock-status">
                            ✓ In Stock
                          </span>
                        ) : (
                          <span className="stock-status sold-out">
                            ✕ Out of Stock
                          </span>
                        )}

                      </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="product-actions">

                      <button
                        className="add-cart-button"
                        disabled={product.stock === 0}
                        onClick={() =>
                          addToCart(product._id)
                        }
                      >
                        🛒 Add to Cart
                      </button>

                      <Link
                        to={`/products/${product._id}`}
                        className="view-product-button"
                      >
                        View Product
                      </Link>

                    </div>

                  </div>

                </article>
              ))}

            </div>

            {/* ========================= */}
            {/* PAGINATION */}
            {/* ========================= */}
            {totalPages > 1 && (
              <div className="products-pagination">

                {/* PREVIOUS */}
                <button
                  className="pagination-button"
                  disabled={page === 1}
                  onClick={() =>
                    goToPage(page - 1)
                  }
                >
                  ← Previous
                </button>

                {/* PAGE NUMBERS */}
                <div className="pagination-pages">

                  {Array.from(
                    { length: totalPages },
                    (_, index) => {
                      const pageNumber = index + 1;

                      return (
                        <button
                          key={pageNumber}
                          className={`pagination-page ${
                            page === pageNumber
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            goToPage(pageNumber)
                          }
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                  )}

                </div>

                {/* NEXT */}
                <button
                  className="pagination-button"
                  disabled={page === totalPages}
                  onClick={() =>
                    goToPage(page + 1)
                  }
                >
                  Next →
                </button>

              </div>
            )}

            {/* PAGE INFORMATION */}
            {totalPages > 1 && (
              <div className="pagination-info">
                Page <strong>{page}</strong> of{" "}
                <strong>{totalPages}</strong>
              </div>
            )}

          </>
        )}

      </div>
    </div>
  );
}

export default Products;