import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminCategories.css";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      alert(error.response?.data?.message || "Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    setLoading(true);

    try {
      const data = {
        name: name.trim(),
        description: description.trim(),
      };

      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Category updated successfully");
      } else {
        await api.post("/admin/categories", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Category created successfully");
      }

      setName("");
      setDescription("");
      setEditingId(null);

      fetchCategories();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to save category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setDescription(category.description || "");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/admin/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Category deleted successfully");

      fetchCategories();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  const handleToggle = async (category) => {
    try {
      await api.put(
        `/admin/categories/${category._id}`,
        {
          isActive: !category.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCategories();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update category"
      );
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
  };

  return (
    <div className="admin-categories-page">
      <div className="admin-categories-container">

        <div className="admin-categories-header">
          <div>
            <h1>Category Management</h1>
            <p>
              Create and manage product categories
            </p>
          </div>
        </div>

        {/* Add / Edit Category */}
        <div className="category-form-card">
          <h2>
            {editingId
              ? "Edit Category"
              : "Add New Category"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="category-form-grid">

              <div className="form-group">
                <label>Category Name</label>

                <input
                  type="text"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <input
                  type="text"
                  placeholder="Enter category description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </div>

            </div>

            <div className="category-form-actions">
              <button
                type="submit"
                className="save-category-btn"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Category"
                  : "Add Category"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="categories-card">

          <div className="categories-card-header">
            <h2>Categories</h2>

            <span>
              {categories.length} Categories
            </span>
          </div>

          {categories.length === 0 ? (
            <div className="empty-categories">
              <h3>No categories found</h3>
              <p>
                Create your first product category.
              </p>
            </div>
          ) : (
            <div className="categories-table-wrapper">

              <table className="categories-table">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id}>

                      <td>
                        <strong>
                          {category.name}
                        </strong>
                      </td>

                      <td>
                        {category.description ||
                          "No description"}
                      </td>

                      <td>
                        <button
                          className={`status-btn ${
                            category.isActive
                              ? "active"
                              : "inactive"
                          }`}
                          onClick={() =>
                            handleToggle(category)
                          }
                        >
                          {category.isActive
                            ? "Active"
                            : "Inactive"}
                        </button>
                      </td>

                      <td>
                        {new Date(
                          category.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        <div className="category-actions">

                          <button
                            className="edit-category-btn"
                            onClick={() =>
                              handleEdit(category)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-category-btn"
                            onClick={() =>
                              handleDelete(category._id)
                            }
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
    </div>
  );
}

export default AdminCategories;