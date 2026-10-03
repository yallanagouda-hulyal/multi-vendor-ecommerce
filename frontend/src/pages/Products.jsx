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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: 1,
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
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

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
      console.error("Failed to load categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

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

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

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

          <form
            className="products-search"
            onSubmit={handleSearch}
          >
            <div className="search-input-wrapper">
              <span className="search-icon">⌕</span>

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

          <div className="products-filters">

            <div className="filter-group">
              <label>Category</label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
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

            <div className="filter-group">
              <label>Sort By</label>

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
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
            <strong>{products.length}</strong>{" "}
            products found
          </div>

          {category && (
            <button
              className="clear-filter"
              onClick={() => setCategory("")}
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
              }}
            >
              View All Products
            </button>
          </div>
        ) : (
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

                  <button
                    className="wishlist-button"
                    onClick={() =>
                      addToWishlist(product._id)
                    }
                    aria-label="Add to wishlist"
                  >
                    ♡
                  </button>

                  {product.stock === 0 && (
                    <span className="out-of-stock-badge">
                      Out of Stock
                    </span>
                  )}

                  {product.stock > 0 &&
                    product.stock <= 5 && (
                      <span className="low-stock-badge">
                        Only {product.stock} left
                      </span>
                    )}
                </div>

                {/* PRODUCT INFO */}
                <div className="product-info">

                  <span className="product-category">
                    {product.category ||
                      "General"}
                  </span>

                  <Link
                    to={`/products/${product._id}`}
                    className="product-name"
                  >
                    {product.name}
                  </Link>

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
        )}
      </div>
    </div>
  );
}

export default Products;