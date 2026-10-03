import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">M</span>
            <div>
              <h2>Multi-Vendor</h2>
              <span>STORE</span>
            </div>
          </div>

          <p>
            Your trusted online marketplace for quality
            products from multiple sellers.
          </p>

          <Link to="/products" className="footer-story">
            Start Shopping →
          </Link>
        </div>

        {/* Shop */}
        <div className="footer-column">
          <h3>Shop</h3>

          <Link to="/products">All Products</Link>
          <Link to="/products?category=Electronics">
            Electronics
          </Link>
          <Link to="/products?category=Clothing">
            Clothing
          </Link>
          <Link to="/products?category=Shoes">
            Shoes
          </Link>
          <Link to="/products?category=Bags">
            Bags
          </Link>
          <Link to="/products?category=Watches">
            Watches
          </Link>
        </div>

        {/* Account */}
        <div className="footer-column">
          <h3>Account</h3>

          <Link to="/login">Login</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/cart">Shopping Cart</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/products">Wishlist</Link>
        </div>

        {/* Support */}
        <div className="footer-column">
          <h3>Support</h3>

          <a href="#">Help Center</a>
          <a href="#">Shipping Information</a>
          <a href="#">Returns & Refunds</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Contact Us</a>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h3>Contact</h3>

          <a href="mailto:support@multivendorstore.com">
            support@multivendorstore.com
          </a>

          <a
            href="tel:+919876543210"
            className="footer-phone"
          >
            +91 98765 43210
          </a>

          <div className="social-links">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">◎</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Multi-Vendor Store.
          All rights reserved.
        </p>

        <div>
          <span>Secure Shopping</span>
          <span> • </span>
          <span>Trusted Sellers</span>
        </div>
      </div>

    </footer>
  );
}

export default Footer;