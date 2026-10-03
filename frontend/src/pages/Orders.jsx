import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingOrder, setCancellingOrder] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders || []);
      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // CANCEL ORDER
  // ==========================================

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancellingOrder(orderId);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.patch(
        `/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const cancelledOrder = response.data.order;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? cancelledOrder
            : order
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to cancel order."
      );
    } finally {
      setCancellingOrder("");
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>

        <div className="orders-message">
          Loading orders...
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="orders-page">

      {/* Header */}

      <div className="orders-header">
        <div>
          <h1>My Orders</h1>

          <p>
            View and track your recent orders.
          </p>
        </div>

        <Link to="/products">
          Continue Shopping
        </Link>
      </div>

      {/* Error */}

      {error && (
        <div className="orders-error">
          {error}
        </div>
      )}

      {/* Empty */}

      {orders.length === 0 ? (
        <div className="empty-orders">

          <div className="empty-orders-icon">
            📦
          </div>

          <h2>No orders yet</h2>

          <p>
            Your placed orders will appear here.
          </p>

          <Link
            to="/products"
            className="shop-orders-btn"
          >
            Start Shopping
          </Link>

        </div>
      ) : (
        <div className="orders-list">

          {orders.map((order) => {

            const status =
              String(
                order.orderStatus || "pending"
              ).toLowerCase();

            const canCancel =
              ![
                "shipped",
                "delivered",
                "cancelled",
                "returned",
              ].includes(status);

            return (
              <div
                className="order-card"
                key={order._id}
              >

                {/* Order Header */}

                <div className="order-top">

                  <div>
                    <span className="order-label">
                      Order ID
                    </span>

                    <strong>
                      #{order._id.slice(-8)}
                    </strong>
                  </div>

                  <div>
                    <span className="order-label">
                      Order Date
                    </span>

                    <strong>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div>
                    <span className="order-label">
                      Status
                    </span>

                    <span
                      className={`order-status ${status}`}
                    >
                      {status}
                    </span>
                  </div>

                </div>

                {/* Products */}

                <div className="order-products">

                  {order.items.map(
                    (item, index) => (
                      <div
                        className="order-product"
                        key={index}
                      >

                        <div className="order-product-info">

                          <h3>
                            {item.name}
                          </h3>

                          <p>
                            SKU: {item.sku}
                          </p>

                          <p>
                            Quantity:{" "}
                            {item.quantity}
                          </p>

                        </div>

                        <div className="order-product-price">
                          ₹
                          {Number(
                            item.subtotal || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </div>

                      </div>
                    )
                  )}

                </div>

                {/* Footer */}

                <div className="order-bottom">

                  <div>
                    Payment:{" "}
                    <strong>
                      {order.paymentMethod ===
                      "cod"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </strong>
                  </div>

                  <div className="order-total">
                    Total: ₹
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </div>

                </div>

                {/* Cancel Order */}

                {canCancel && (
                  <div className="order-actions">

                    <button
                      className="cancel-order-btn"
                      disabled={
                        cancellingOrder ===
                        order._id
                      }
                      onClick={() =>
                        handleCancelOrder(
                          order._id
                        )
                      }
                    >
                      {cancellingOrder ===
                      order._id
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Orders;