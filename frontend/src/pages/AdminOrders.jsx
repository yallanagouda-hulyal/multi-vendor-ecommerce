import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(
        `/admin/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchOrders();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update order status."
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-orders-status">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <h1>Order Management</h1>
        <p>View and manage all customer orders</p>
      </div>

      {error && (
        <div className="admin-orders-error">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="admin-orders-empty">
          <h2>No Orders Found</h2>
          <p>Customer orders will appear here.</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <div className="admin-order-card" key={order._id}>
              <div className="admin-order-header">
                <div>
                  <h3>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h3>

                  <p>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    updateStatus(
                      order._id,
                      e.target.value
                    )
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              <div className="admin-order-customer">
                <strong>Customer:</strong>{" "}
                {order.customer?.name || "Unknown"}
                <br />
                <strong>Email:</strong>{" "}
                {order.customer?.email || "N/A"}
              </div>

              <div className="admin-order-items">
                {order.items.map((item, index) => (
                  <div
                    className="admin-order-item"
                    key={`${order._id}-${index}`}
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <p>SKU: {item.sku}</p>
                    </div>

                    <span>
                      Qty: {item.quantity}
                    </span>

                    <span>
                      ₹
                      {item.subtotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="admin-order-footer">
                <span>
                  Payment:{" "}
                  {String(
                    order.paymentMethod || "cod"
                  ).toUpperCase()}
                </span>

                <strong>
                  Total: ₹
                  {order.totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;