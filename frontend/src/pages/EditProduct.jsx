import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/EditProduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    category: "",
    image: "",
    stock: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);

        const product = response.data.product || response.data;

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          sku: product.sku || "",
          category: product.category || "",
          image: product.images?.[0] || "",
          stock: product.stock ?? "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await api.put(
        `/products/${id}`,
        {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          sku: formData.sku,
          category: formData.category,
          images: formData.image ? [formData.image] : [],
          stock: Number(formData.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product updated successfully! ✅");

      navigate("/seller/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-product-status">
        Loading product...
      </div>
    );
  }

  return (
    <div className="edit-product-page">
      <div className="edit-product-card">
        <div className="edit-product-header">
          <h1>Edit Product</h1>
          <p>Update your product information and inventory</p>
        </div>

        {error && (
          <div className="edit-product-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="edit-form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="edit-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <div className="edit-form-row">
            <div className="edit-form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="edit-form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="edit-form-group">
            <label>SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
            />
          </div>

          <div className="edit-form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Shoes">Shoes</option>
              <option value="Bags">Bags</option>
              <option value="Watches">Watches</option>
              <option value="Home & Kitchen">
                Home & Kitchen
              </option>
            </select>
          </div>

          <div className="edit-form-group">
            <label>Product Image URL</label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/product.jpg"
            />
          </div>

          <div className="edit-form-actions">
            <button
              type="button"
              className="edit-cancel-btn"
              onClick={() => navigate("/seller/dashboard")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-save-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;