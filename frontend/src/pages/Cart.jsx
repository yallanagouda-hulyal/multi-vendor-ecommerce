import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/Cart.css";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(response.data.cart || response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Unable to load cart."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Increase/decrease quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");

      if (quantity < 1) {
        return;
      }

      await api.put(
        "/cart/update",
        {
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to update quantity."
      );
    }
  };

  // Remove product
  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchCart();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to remove product."
      );
    }
  };

  if (loading) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <div className="cart-message">
          Loading cart...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <div className="cart-error">{error}</div>
      </div>
    );
  }

  const items = cart?.items || [];

  const total = items.reduce((sum, item) => {
    const price = item.product?.price || 0;

    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="cart-page">

      <div className="cart-title">
        <h1>Shopping Cart</h1>

        <Link to="/products">
          Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Add some products to your cart.
          </p>

          <Link
            to="/products"
            className="continue-shopping-btn"
          >
            Start Shopping
          </Link>

        </div>
      ) : (
        <div className="cart-layout">

          {/* CART ITEMS */}

          <div className="cart-items">

            {items.map((item) => {
              const product = item.product;

              if (!product) return null;

              return (
                <div
                  className="cart-item"
                  key={product._id}
                >

                  <img
                    src={
                      product.images?.[0] ||
                      "https://via.placeholder.com/150"
                    }
                    alt={product.name}
                  />

                  <div className="cart-item-info">

                    <h2>{product.name}</h2>

                    <p className="cart-category">
                      {product.category}
                    </p>

                    <p className="cart-price">
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    {/* Quantity */}

                    <div className="quantity-box">

                      <button
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                    {/* Remove */}

                    <button
                      className="remove-btn"
                      onClick={() =>
                        removeItem(product._id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                  {/* Subtotal */}

                  <div className="cart-subtotal">
                    ₹
                    {(
                      product.price *
                      item.quantity
                    ).toLocaleString("en-IN")}
                  </div>

                </div>
              );
            })}

          </div>

          {/* SUMMARY */}

          <div className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Products</span>
              <span>{items.length}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>

              <span>
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>

              <span className="free-delivery">
                FREE
              </span>
            </div>

            <div className="summary-total">
              <span>Total</span>

              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>
            </div>

            <Link
                to="/checkout"
                className="checkout-btn"
            >
                Proceed to Checkout
            </Link>

          
          </div>

        </div>
      )}

    </div>
  );
}

export default Cart;