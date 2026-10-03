import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/products/${id}`);

        console.log(
          "PRODUCT DATA:",
          JSON.stringify(response.data, null, 2)
        );

        setProduct(response.data.product || response.data);
        setError("");
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

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setReviewLoading(true);

      const response = await api.get(
        `/reviews/product/${id}`
      );

      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error(
        "Failed to fetch reviews:",
        error
      );
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  // Add to wishlist
  const handleAddToWishlist = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!token) {
      alert("Please login to add products to wishlist.");
      return;
    }

    if (user?.role !== "customer") {
      alert("Only customers can use wishlist.");
      return;
    }

    try {
      await api.post(
        "/wishlist",
        {
          productId: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product added to wishlist ❤️");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add to wishlist"
      );
    }
  };

  // Add to cart
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!token) {
      setMessage("Please login to add products to cart.");
      return;
    }

    if (user?.role !== "customer") {
      setMessage(
        "Only customers can add products to cart."
      );
      return;
    }

    try {
      await api.post(
        "/cart/add",
        {
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        "Product added to cart successfully! 🛒"
      );
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Failed to add product."
      );
    }
  };

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!token) {
      alert("Please login to write a review.");
      return;
    }

    if (user?.role !== "customer") {
      alert("Only customers can write reviews.");
      return;
    }

    if (!comment.trim()) {
      alert("Please enter a review.");
      return;
    }

    try {
      setReviewSubmitting(true);

      await api.post(
        `/reviews/product/${id}`,
        {
          rating,
          comment: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComment("");
      setRating(5);

      alert("Review added successfully! ⭐");

      // Refresh reviews
      await fetchReviews();

      // Refresh product rating/count
      const productResponse = await api.get(
        `/products/${id}`
      );

      setProduct(
        productResponse.data.product ||
          productResponse.data
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="product-details-status">
        Loading product...
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="product-details-status error">
        {error}
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="product-details-status">
        Product not found.
      </div>
    );
  }

  return (
    <div className="product-details-page">

      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

      {/* Product Details Card */}
      <div className="product-details-card">

        {/* Product Image */}
        <div className="product-details-image">
          <img
            src={
              product.images?.[0] ||
              "https://via.placeholder.com/500"
            }
            alt={product.name}
          />
        </div>

        {/* Product Information */}
        <div className="product-details-info">

          <span className="product-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <div className="product-rating">
            ⭐ {product.rating || 0} (
            {product.reviewCount || 0} reviews)
          </div>

          <p className="product-description">
            {product.description}
          </p>

          <h2 className="product-price">
            ₹
            {Number(
              product.price || 0
            ).toLocaleString()}
          </h2>

          <p className="product-stock">
            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of stock"}
          </p>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="quantity-section">
              <label>Quantity:</label>

              <div className="quantity-controls">
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.max(1, q - 1)
                    )
                  }
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(
                        product.stock,
                        q + 1
                      )
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="product-actions">

            <button
              className="add-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              🛒 Add to Cart
            </button>

            <button
              className="wishlist-detail-btn"
              onClick={handleAddToWishlist}
            >
              ❤️ Add to Wishlist
            </button>

            <Link
              to="/checkout"
              state={{
                productId: product._id,
                quantity,
              }}
              className="buy-now-btn"
            >
              Buy Now
            </Link>

          </div>

          {/* Success / Error Message */}
          {message && (
            <p className="product-message">
              {message}
            </p>
          )}

          {/* Extra Information */}
          <div className="product-extra-info">

            <p>
              <strong>SKU:</strong>{" "}
              {product.sku}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {product.category}
            </p>

            <p>
              <strong>Secure Shopping:</strong>{" "}
              Safe and reliable checkout
            </p>

          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">

        <h2>Customer Reviews ⭐</h2>


        {/* Add Review */}
<div className="review-form">
  <h3>Write a Review</h3>

  <p className="review-note">
    You can review this product after purchasing and
    receiving it.
  </p>

  <form onSubmit={handleSubmitReview}>
    <label>Rating</label>

    <select
      value={rating}
      onChange={(e) =>
        setRating(Number(e.target.value))
      }
    >
      <option value={5}>⭐⭐⭐⭐⭐ - 5</option>
      <option value={4}>⭐⭐⭐⭐ - 4</option>
      <option value={3}>⭐⭐⭐ - 3</option>
      <option value={2}>⭐⭐ - 2</option>
      <option value={1}>⭐ - 1</option>
    </select>

    <label>Review</label>

    <textarea
      value={comment}
      onChange={(e) =>
        setComment(e.target.value)
      }
      placeholder="Write your review..."
      maxLength={500}
      rows={4}
    />

    <button
      type="submit"
      disabled={reviewSubmitting}
    >
      {reviewSubmitting
        ? "Submitting..."
        : "Submit Review"}
    </button>
  </form>
</div>



        {/* Existing Reviews */}
        <div className="reviews-list">

          {reviewLoading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p>
              No reviews yet. Be the first to review
              this product!
            </p>
          ) : (
            reviews.map((review) => (
              <div
                className="review-card"
                key={review._id}
              >

                <div className="review-header">

                  <strong>
                    {review.customer?.name ||
                      "Customer"}
                  </strong>

                  <span>
                    {"⭐".repeat(review.rating)}
                  </span>

                </div>

                <p>{review.comment}</p>

                <small>
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </small>

              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;