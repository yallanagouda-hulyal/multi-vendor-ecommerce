import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/SellerOrders.css";

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState("");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // FETCH SELLER ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/orders/seller",
        authConfig
      );

      // Backend returns the orders array directly
      setOrders(response.data || []);
    } catch (err) {
      console.error("Fetch seller orders error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load seller orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    const confirmed = window.confirm(
      `Change order status to "${newStatus}"?`
    );

    if (!confirmed) return;

    try {
      setUpdatingOrder(orderId);
      setError("");

      const response = await api.patch(
        `/orders/seller/${orderId}/status`,
        {
          // Backend expects "status"
          status: newStatus,
        },
        authConfig
      );

      const updatedOrder = response.data.order;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? updatedOrder
            : order
        )
      );
    } catch (err) {
      console.error(
        "Update seller order status error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrder("");
    }
  };

  // ==========================================
  // STATUS OPTIONS
  // ==========================================

  const getNextStatusOptions = (currentStatus) => {
    const statuses = [
      "confirmed",
      "processing",
      "shipped",
      "delivered",
    ];

    const currentIndex =
      statuses.indexOf(currentStatus);

    if (currentIndex === -1) {
      return statuses;
    }

    return statuses.slice(currentIndex + 1);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="seller-orders-status">
        Loading seller orders...
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="seller-orders-page">

      {/* Header */}
      <div className="seller-orders-header">
        <div>
          <h1>Seller Orders</h1>

          <p>
            View and manage orders containing your products
          </p>
        </div>

        <button
          className="refresh-orders-btn"
          onClick={fetchOrders}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="seller-orders-error">
          {error}
        </div>
      )}

      {/* Empty */}
      {orders.length === 0 ? (
        <div className="seller-orders-empty">
          <h2>No Orders Yet</h2>

          <p>
            Orders containing your products will appear here.
          </p>
        </div>
      ) : (
        <div className="seller-orders-list">

          {orders.map((order) => {
            const currentStatus =
              String(
                order.orderStatus || "pending"
              ).toLowerCase();

            const nextStatuses =
              getNextStatusOptions(
                currentStatus
              );

            return (
              <div
                className="seller-order-card"
                key={order._id}
              >

                {/* Top */}
                <div className="seller-order-top">

                  <div>
                    <h3>
                      Order #
                      {order._id
                        .slice(-8)
                        .toUpperCase()}
                    </h3>

                    <p>
                      Date:{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <span
                    className={`order-status ${currentStatus}`}
                  >
                    {currentStatus}
                  </span>

                </div>

                {/* Customer */}
                <div className="seller-order-customer">
                  <strong>Customer:</strong>{" "}
                  {order.customer?.name || "Customer"}

                  {order.customer?.email && (
                    <span>
                      {" "}
                      ({order.customer.email})
                    </span>
                  )}
                </div>

                {/* Products */}
                <div className="seller-order-items">

                  {order.items?.map(
                    (item, index) => (
                      <div
                        className="seller-order-item"
                        key={`${order._id}-${index}`}
                      >

                        <div>
                          <strong>
                            {item.name}
                          </strong>

                          <p>
                            SKU: {item.sku}
                          </p>
                        </div>

                        <div>
                          Qty: {item.quantity}
                        </div>

                        <div>
                          ₹
                          {Number(
                            item.subtotal || 0
                          ).toLocaleString("en-IN")}
                        </div>

                      </div>
                    )
                  )}

                </div>

                {/* Bottom */}
                <div className="seller-order-bottom">

                  <span>
                    Payment:{" "}
                    {String(
                      order.paymentMethod || "cod"
                    ).toUpperCase()}
                  </span>

                  <strong>
                    Order Total: ₹
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>

                {/* Status Update */}
                {currentStatus !== "delivered" &&
                  currentStatus !== "cancelled" &&
                  currentStatus !== "returned" && (
                    <div className="seller-order-status-update">

                      <label>
                        Update Order Status
                      </label>

                      <select
                        value=""
                        disabled={
                          updatingOrder === order._id
                        }
                        onChange={(e) => {
                          if (e.target.value) {
                            handleStatusChange(
                              order._id,
                              e.target.value
                            );
                          }
                        }}
                      >
                        <option value="">
                          Select next status
                        </option>

                        {nextStatuses.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status
                                .charAt(0)
                                .toUpperCase() +
                                status.slice(1)}
                            </option>
                          )
                        )}
                      </select>

                      {updatingOrder === order._id && (
                        <span>
                          Updating...
                        </span>
                      )}

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

export default SellerOrders;