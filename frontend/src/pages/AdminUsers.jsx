import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data.users || response.data || []);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load users."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (loading) {
    return (
      <div className="admin-users-status">
        Loading users...
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <div className="admin-users-header">
        <h1>User Management</h1>
        <p>View all registered users and their roles</p>
      </div>

      {error && (
        <div className="admin-users-error">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className="admin-users-empty">
          <h2>No Users Found</h2>
        </div>
      ) : (
        <div className="admin-users-card">
          <div className="admin-users-table-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Seller Status</th>
                  <th>Joined</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={`user-role ${user.role}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {user.role === "seller" ? (
                        <span
                          className={
                            user.sellerApproved
                              ? "seller-approved"
                              : "seller-pending"
                          }
                        >
                          {user.sellerApproved
                            ? "Approved"
                            : "Pending"}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td>
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;