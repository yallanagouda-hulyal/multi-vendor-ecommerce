import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/SellerDashboard.css";

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    lowStockProducts: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch seller products
  const fetchProducts = async () => {
    try {
      const response = await api.get(
        "/products/my-products",
        authConfig
      );

      setProducts(response.data.products || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load seller products."
      );
    }
  };

  // Fetch seller statistics
  const fetchStats = async () => {
    try {
      const response = await api.get(
        "/orders/seller/stats",
        authConfig
      );

      setStats(
        response.data || {
          totalProducts: 0,
          totalOrders: 0,
          totalSales: 0,
          pendingOrders: 0,
          deliveredOrders: 0,
          lowStockProducts: 0,
        }
      );
    } catch (err) {
      console.error(
        "Failed to load seller statistics:",
        err
      );
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([
          fetchProducts(),
          fetchStats(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Delete product
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/products/${productId}`,
        authConfig
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== productId
        )
      );

      // Update total products immediately
      setStats((currentStats) => ({
        ...currentStats,
        totalProducts: Math.max(
          currentStats.totalProducts - 1,
          0
        ),
      }));
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  if (loading) {
    return (
      <div className="seller-status">
        Loading seller dashboard...
      </div>
    );
  }

  return (
    <div className="seller-dashboard">

      {/* Header */}
      <div className="seller-header">
        <div>
          <h1>Seller Dashboard</h1>
          <p>Manage your products, inventory and sales</p>
        </div>

        <Link
          to="/seller/products/add"
          className="add-product-btn"
        >
          + Add Product
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="seller-error">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="seller-stats">

        <div className="seller-stat-card">
          <span>📦 Total Products</span>
          <strong>{stats.totalProducts}</strong>
        </div>

        <div className="seller-stat-card">
          <span>🛒 Total Orders</span>
          <strong>{stats.totalOrders}</strong>
        </div>

        <div className="seller-stat-card">
          <span>💰 Total Sales</span>
          <strong>
            ₹{Number(stats.totalSales || 0).toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="seller-stat-card">
          <span>⏳ Pending Orders</span>
          <strong>{stats.pendingOrders}</strong>
        </div>

        <div className="seller-stat-card">
          <span>✅ Delivered Orders</span>
          <strong>{stats.deliveredOrders}</strong>
        </div>

        <div className="seller-stat-card">
          <span>⚠️ Low Stock</span>
          <strong>{stats.lowStockProducts}</strong>
        </div>

      </div>

      {/* Inventory Summary */}
      <div className="seller-stats">

        <div className="seller-stat-card">
          <span>🟢 In Stock</span>
          <strong>
            {
              products.filter(
                (product) => product.stock > 0
              ).length
            }
          </strong>
        </div>

        <div className="seller-stat-card">
          <span>🔴 Out of Stock</span>
          <strong>
            {
              products.filter(
                (product) => product.stock === 0
              ).length
            }
          </strong>
        </div>

      </div>

      {/* Products */}
      <div className="seller-products-section">
        <div className="seller-section-header">
          <div>
            <h2>My Products</h2>
            <p>Manage your products and inventory</p>
          </div>

          <Link
            to="/seller/products/add"
            className="add-product-btn"
          >
            + Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="seller-empty">
            <p>You haven't added any products yet.</p>

            <Link to="/seller/products/add">
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="seller-table-wrapper">

            <table className="seller-products-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>

                    <td>
                      <div className="seller-product-info">

                        <img
                          src={
                            product.images?.[0] ||
                            "https://via.placeholder.com/80"
                          }
                          alt={product.name}
                        />

                        <span>{product.name}</span>

                      </div>
                    </td>

                    <td>{product.sku}</td>

                    <td>{product.category}</td>

                    <td>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span
                        className={
                          product.stock > 0
                            ? "stock-available"
                            : "stock-out"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td>
                      <div className="seller-actions">

                        <Link
                          to={`/seller/products/edit/${product._id}`}
                          className="edit-btn"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(product._id)
                          }
                          className="delete-btn"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default SellerDashboard;