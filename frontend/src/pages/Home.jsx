import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/App.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    {
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=700&q=80",
      text: "Smart technology for everyday life",
    },
    {
      name: "Clothing",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=700&q=80",
      text: "Fresh styles for every occasion",
    },
    {
      name: "Shoes",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
      text: "Step into your next favorite pair",
    },
    {
      name: "Bags",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
      text: "Carry your style everywhere",
    },
    {
      name: "Watches",
      image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80",
      text: "Timeless designs for every day",
    },
    {
      name: "Home & Kitchen",
      image:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=700&q=80",
      text: "Make your space feel like home",
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          "/products?limit=8&sort=-createdAt"
        );

        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-page">

      {/* ================= HERO ================= */}

      <section className="modern-hero">

        <div className="modern-hero-content">

        <span className="hero-badge">
  ✦ YOUR SHOPPING DESTINATION
</span>

<h1>
  Everything you need.
  <br />
  <span>All in one place.</span>
</h1>

<p>
  Shop products from different categories
  and discover something perfect for you.
</p>

<div className="hero-buttons">

  <Link
    to="/products"
    className="primary-hero-btn"
  >
    Shop Now →
  </Link>

  <Link
    to="/products"
    className="secondary-hero-btn"
  >
    Explore Categories
  </Link>

</div>

          <div className="hero-trust">

          <div>
            <strong>60+</strong>
            <span>Products</span>
          </div>

          <div>
            <strong>6</strong>
            <span>Categories</span>
          </div>

          <div>
            <strong>3+</strong>
            <span>Sellers</span>
          </div>

          </div>

        </div>

        <div className="modern-hero-visual">

          <div className="hero-main-image">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1100&q=85"
              alt="Shopping collection"
            />
          </div>

          <div className="hero-floating-card">
            <span>🔥</span>
            <div>
              <strong>Trending</strong>
              <small>Shop what's popular</small>
            </div>
          </div>

        </div>

      </section>

   
      {/* ================= CATEGORIES ================= */}

      <section className="modern-section">

        <div className="modern-section-heading">

          <div>
            <span>EXPLORE</span>
            <h2>Shop by category</h2>
          </div>

          <Link to="/products">
            View all categories →
          </Link>

        </div>

        <div className="modern-category-grid">

          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(
                category.name
              )}`}
              className="modern-category-card"
            >

              <img
                src={category.image}
                alt={category.name}
              />

              <div className="category-overlay">

                <div>
                  <h3>{category.name}</h3>
                  <p>{category.text}</p>
                </div>

                <span>→</span>

              </div>

            </Link>
          ))}

        </div>

      </section>

      {/* ================= FEATURED PRODUCTS ================= */}

      <section className="modern-section products-home-section">

        <div className="modern-section-heading">

          <div>
            <span>JUST FOR YOU</span>
            <h2>Featured products</h2>
          </div>

          <Link to="/products">
            Shop all products →
          </Link>

        </div>

        {loading ? (
          <div className="home-loading">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="home-loading">
            No products available.
          </div>
        ) : (
          <div className="modern-product-grid">

            {products.map((product) => (

              <div
                className="modern-product-card"
                key={product._id}
              >

                <Link
                  to={`/products/${product._id}`}
                  className="modern-product-image"
                >

                  <img
                    src={
                      product.images?.[0] ||
                      "https://via.placeholder.com/500"
                    }
                    alt={product.name}
                  />

                  {product.stock > 0 && (
                    <span className="product-stock-badge">
                      In Stock
                    </span>
                  )}

                </Link>

                <div className="modern-product-content">

                  <small>
                    {product.category}
                  </small>

                  <Link
                    to={`/products/${product._id}`}
                    className="modern-product-title"
                  >
                    {product.name}
                  </Link>

                  <div className="modern-rating">
                    ⭐ {product.rating || 0}
                    <span>
                      ({product.reviewCount || 0})
                    </span>
                  </div>

                  <div className="modern-product-footer">

                    <strong>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString()}
                    </strong>

                    <Link
                      to={`/products/${product._id}`}
                      className="quick-view-btn"
                    >
                      View →
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

      {/* ================= PROMOTIONAL BANNER ================= */}

      <section className="home-promo">

        <div className="promo-content">

          <span>DISCOVER MORE</span>

          <h2>
            Your next favorite
            <br />
            thing is waiting.
          </h2>

          <p>
            Browse our collection and discover
            products selected for everyday life.
          </p>

          <Link
            to="/products"
            className="promo-btn"
          >
            Start Shopping →
          </Link>

        </div>

        <div className="promo-image">

          <img
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1000&q=85"
            alt="Shopping"
          />

        </div>

      </section>
      {/* ================= WHY SHOP WITH US ================= */}

      <section className="why-shop-section">

        <div className="why-shop-heading">
          <span>WHY SHOP WITH US</span>

          <h2>
            A simpler way to shop
          </h2>

          <p>
            Everything you need for a smooth and convenient
            online shopping experience.
          </p>
        </div>

        <div className="why-shop-grid">

          <div className="why-shop-card">
            <div className="why-shop-icon">🛍️</div>

            <h3>Multiple Categories</h3>

            <p>
              Discover products across electronics,
              clothing, shoes, home and more.
            </p>
          </div>

          <div className="why-shop-card">
            <div className="why-shop-icon">🏪</div>

            <h3>Multiple Sellers</h3>

            <p>
              Explore products from different sellers
              on one convenient platform.
            </p>
          </div>

          <div className="why-shop-card">
            <div className="why-shop-icon">🔍</div>

            <h3>Easy Product Discovery</h3>

            <p>
              Search, filter and compare products
              to find what you need quickly.
            </p>
          </div>

          <div className="why-shop-card">
            <div className="why-shop-icon">🔒</div>

            <h3>Secure Shopping</h3>

            <p>
              Enjoy a protected shopping experience
              from cart to order.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}


     
export default Home;