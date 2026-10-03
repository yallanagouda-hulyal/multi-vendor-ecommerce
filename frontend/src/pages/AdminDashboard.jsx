import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH ADMIN DATA
  // ==========================================

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        usersResponse,
        sellersResponse,
        productsResponse,
      ] = await Promise.all([
        api.get("/admin/users", { headers }),
        api.get("/admin/sellers", { headers }),
        api.get("/admin/products", { headers }),
      ]);

      setUsers(
        usersResponse.data.users ||
          usersResponse.data ||
          []
      );

      setSellers(
        sellersResponse.data.sellers ||
          sellersResponse.data ||
          []
      );

      setProducts(
        productsResponse.data.products ||
          productsResponse.data ||
          []
      );
    } catch (err) {
      console.error("Admin dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // ==========================================
  // SELLER APPROVAL
  // ==========================================

  const handleSellerStatus = async (
    sellerId,
    status
  ) => {
    try {
      await api.patch(
        `/admin/sellers/${sellerId}/status`,
        {
          approved: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchAdminData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update seller status."
      );
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/admin/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            product._id !== productId
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-status">
        Loading admin dashboard...
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="admin-dashboard">

      {/* ================= HEADER ================= */}

      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Manage users, sellers and products
          </p>
        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div className="admin-quick-actions">

        <Link
          to="/admin/categories"
          className="admin-action-card"
        >
          <div className="admin-action-icon">
            🗂️
          </div>

          <div>
            <h3>Manage Categories</h3>

            <p>
              Create, edit and manage product
              categories
            </p>
          </div>

          <span className="admin-action-arrow">
            →
          </span>
        </Link>

        <Link
          to="/admin/orders"
          className="admin-action-card"
        >
          <div className="admin-action-icon">
            📦
          </div>

          <div>
            <h3>Manage Orders</h3>

            <p>
              View and manage all customer orders
            </p>
          </div>

          <span className="admin-action-arrow">
            →
          </span>
        </Link>

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* ================= STATS ================= */}

      <div className="admin-stats">

        <div className="admin-stat-card">
          <span>Total Users</span>
          <strong>
            {users.length}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Sellers</span>
          <strong>
            {sellers.length}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Products</span>
          <strong>
            {products.length}
          </strong>
        </div>

      </div>

      {/* ================= SELLER MANAGEMENT ================= */}

      <section className="admin-section">

        <h2>Seller Management</h2>

        {sellers.length === 0 ? (
          <div className="admin-empty">
            No sellers found.
          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {sellers.map((seller) => (
                  <tr key={seller._id}>

                    <td>
                      {seller.name}
                    </td>

                    <td>
                      {seller.email}
                    </td>

                    <td>

                      <span
                        className={
                          seller.sellerApproved
                            ? "admin-approved"
                            : "admin-pending"
                        }
                      >
                        {seller.sellerApproved
                          ? "Approved"
                          : "Pending"}
                      </span>

                    </td>

                    <td>

                      {seller.sellerApproved ? (
                        <button
                          className="admin-reject-btn"
                          onClick={() =>
                            handleSellerStatus(
                              seller._id,
                              false
                            )
                          }
                        >
                          Reject
                        </button>
                      ) : (
                        <button
                          className="admin-approve-btn"
                          onClick={() =>
                            handleSellerStatus(
                              seller._id,
                              true
                            )
                          }
                        >
                          Approve
                        </button>
                      )}

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>

      {/* ================= PRODUCT MANAGEMENT ================= */}

      <section className="admin-section">

        <h2>Product Management</h2>

        {products.length === 0 ? (
          <div className="admin-empty">
            No products found.
          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {products.map((product) => (
                  <tr key={product._id}>

                    <td>
                      <div className="admin-product">

                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                          />
                        ) : (
                          <div className="admin-product-placeholder">
                            📦
                          </div>
                        )}

                        <span>
                          {product.name}
                        </span>

                      </div>
                    </td>

                    <td>
                      {product.category || "-"}
                    </td>

                    <td>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      {product.stock ?? 0}
                    </td>

                    <td>

                      <button
                        className="admin-delete-btn"
                        onClick={() =>
                          handleDeleteProduct(
                            product._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
  );
}

export default AdminDashboard;