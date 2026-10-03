import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");
  const [addingId, setAddingId] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // FETCH WISHLIST
  // ==========================================

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Please login to view your wishlist.");
        return;
      }

      const response = await api.get(
        "/wishlist",
        authConfig
      );

      setWishlist(
        response.data.wishlist?.products || []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ==========================================
  // REMOVE
  // ==========================================

  const removeFromWishlist = async (productId) => {
    try {
      setRemovingId(productId);
      setError("");

      await api.delete(
        `/wishlist/${productId}`,
        authConfig
      );

      setWishlist((current) =>
        current.filter(
          (product) => product._id !== productId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to remove product."
      );
    } finally {
      setRemovingId("");
    }
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = async (productId) => {
    try {
      setAddingId(productId);
      setError("");

      await api.post(
        "/cart/add",
        {
          productId,
          quantity: 1,
        },
        authConfig
      );

      alert("Product added to cart.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add product to cart."
      );
    } finally {
      setAddingId("");
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-status">
          Loading wishlist...
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="wishlist-page">

      <div className="wishlist-header">
        <div>
          <h1>My Wishlist ❤️</h1>
          <p>
            Products you saved for later.
          </p>
        </div>

        <Link
          to="/products"
          className="wishlist-shopping-link"
        >
          Continue Shopping
        </Link>
      </div>

      {error && (
        <div className="wishlist-error">
          {error}
        </div>
      )}

      {/* EMPTY */}

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">

          <div className="wishlist-empty-icon">
            ❤️
          </div>

          <h2>Your wishlist is empty</h2>

          <p>
            Add products you like to your wishlist.
          </p>

          <Link
            to="/products"
            className="wishlist-shop-btn"
          >
            Browse Products
          </Link>

        </div>
      ) : (

        /* PRODUCTS */

        <div className="wishlist-grid">

          {wishlist.map((product) => (

            <div
              className="wishlist-card"
              key={product._id}
            >

              <div className="wishlist-image-wrapper">

                <img
                  src={
                    product.images?.[0] ||
                    "https://via.placeholder.com/300x300?text=Product"
                  }
                  alt={product.name}
                />

              </div>

              <div className="wishlist-content">

                <h3>{product.name}</h3>

                <p className="wishlist-price">
                  ₹
                  {Number(
                    product.price || 0
                  ).toLocaleString("en-IN")}
                </p>

                <p className="wishlist-stock">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </p>

                <div className="wishlist-actions">

                  <Link
                    to={`/products/${product._id}`}
                    className="wishlist-view-btn"
                  >
                    View Product
                  </Link>

                  {product.stock > 0 && (
                    <button
                      className="wishlist-cart-btn"
                      disabled={
                        addingId === product._id
                      }
                      onClick={() =>
                        addToCart(product._id)
                      }
                    >
                      {addingId === product._id
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>
                  )}

                  <button
                    className="wishlist-remove-btn"
                    disabled={
                      removingId === product._id
                    }
                    onClick={() =>
                      removeFromWishlist(
                        product._id
                      )
                    }
                  >
                    {removingId === product._id
                      ? "Removing..."
                      : "Remove"}
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default Wishlist;