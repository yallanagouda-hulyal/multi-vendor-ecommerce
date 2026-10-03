import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    house: "",
    area: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(response.data.cart || response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load cart."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // PLACE ORDER
  // ==================================================

  const placeOrder = async (e) => {
    e.preventDefault();

    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to place an order.");
      navigate("/login");
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      setError(
        "Your cart is empty. Add products before checkout."
      );
      return;
    }

    const cleanPhone = address.phone
      .replace(/\D/g, "")
      .slice(0, 10);

    const cleanPincode = address.pincode
      .replace(/\D/g, "")
      .slice(0, 6);

    // Validate address
    if (
      !address.fullName.trim() ||
      cleanPhone.length !== 10 ||
      cleanPincode.length !== 6 ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.house.trim() ||
      !address.area.trim()
    ) {
      setError(
        "Please fill all shipping address fields correctly."
      );
      return;
    }

    if (placingOrder) {
      return;
    }

    try {
      setPlacingOrder(true);

      const shippingAddress =
        `${address.fullName.trim()}, ` +
        `${cleanPhone}, ` +
        `${address.house.trim()}, ` +
        `${address.area.trim()}, ` +
        `${address.city.trim()}, ` +
        `${address.state.trim()} - ` +
        `${cleanPincode}`;

      await api.post(
        "/orders",
        {
          shippingAddress,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAddress({
        fullName: "",
        phone: "",
        pincode: "",
        city: "",
        state: "",
        house: "",
        area: "",
      });

      setCart({
        ...cart,
        items: [],
      });

      alert("Order placed successfully! 🎉");

      navigate("/orders");
    } catch (err) {
      console.error("Place order error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p>Loading...</p>
      </div>
    );
  }

  const items = cart?.items || [];

  // ==================================================
  // TOTAL
  // ==================================================

  const total = items.reduce((sum, item) => {
    return (
      sum +
      (item.product?.price || 0) * item.quantity
    );
  }, 0);

  // ==================================================
  // EMPTY CART
  // ==================================================

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>

        <div className="checkout-empty">
          <h2>Your cart is empty</h2>

          <p>
            Add products before proceeding to checkout.
          </p>

          <button
            className="place-order-btn"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {error && (
        <div className="checkout-error">
          {error}
        </div>
      )}

      <div className="checkout-layout">

        {/* =========================
            CHECKOUT FORM
        ========================== */}

        <form
          className="checkout-form"
          onSubmit={placeOrder}
        >

          {/* SHIPPING ADDRESS */}

          <div className="checkout-card">
            <h2>Shipping Address</h2>

            <div className="address-grid">

              <div className="address-field">
                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="Enter full name"
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      fullName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="address-field">
                <label>Mobile Number</label>

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  maxLength="10"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      phone: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10),
                    })
                  }
                />
              </div>

              <div className="address-field">
                <label>PIN Code</label>

                <input
                  type="text"
                  placeholder="Enter PIN code"
                  maxLength="6"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      pincode: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6),
                    })
                  }
                />
              </div>

              <div className="address-field">
                <label>City</label>

                <input
                  type="text"
                  placeholder="Enter city"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      city: e.target.value,
                    })
                  }
                />
              </div>

              <div className="address-field">
                <label>State</label>

                <input
                  type="text"
                  placeholder="Enter state"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      state: e.target.value,
                    })
                  }
                />
              </div>

              <div className="address-field">
                <label>House / Building</label>

                <input
                  type="text"
                  placeholder="House / Flat / Building"
                  value={address.house}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      house: e.target.value,
                    })
                  }
                />
              </div>

              <div className="address-field full-width">
                <label>Area / Street</label>

                <input
                  type="text"
                  placeholder="Enter area, street or locality"
                  value={address.area}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      area: e.target.value,
                    })
                  }
                />
              </div>

            </div>
          </div>

          {/* PAYMENT */}

          <div className="checkout-card">

            <h2>Payment Method</h2>

            <label className="payment-option">

              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />

              <span>Cash on Delivery</span>

            </label>

            <label className="payment-option">

              <input
                type="radio"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />

              <span>Online Payment</span>

            </label>

          </div>

          {/* PLACE ORDER */}

          <button
            type="submit"
            className="place-order-btn"
            disabled={placingOrder}
          >
            {placingOrder
              ? "Placing Order..."
              : "Place Order"}
          </button>

        </form>

        {/* =========================
            ORDER SUMMARY
        ========================== */}

        <div className="checkout-summary">

          <h2>Order Summary</h2>

          {items.map((item) => (

            <div
              className="checkout-product"
              key={item.product._id}
            >

              <img
                src={
                  item.product.images?.[0] ||
                  "https://via.placeholder.com/80"
                }
                alt={item.product.name}
              />

              <div>

                <h3>
                  {item.product.name}
                </h3>

                <p>
                  Qty: {item.quantity}
                </p>

                <strong>
                  ₹
                  {(
                    item.product.price *
                    item.quantity
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

            </div>

          ))}

          <div className="checkout-total">

            <span>Total</span>

            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Checkout;