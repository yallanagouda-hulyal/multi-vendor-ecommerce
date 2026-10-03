import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo-icon">
            M
          </div>

          <div className="navbar-brand-text">
            <span className="navbar-brand-name">
              Multi-Vendor
            </span>

            <span className="navbar-brand-subtitle">
              STORE
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className="navbar-links">

          <Link to="/">Home</Link>

          <Link to="/products">Products</Link>

          {/* Customer Links */}
          {token && user?.role === "customer" && (
            <>
              <Link to="/cart">Cart</Link>

              <Link to="/wishlist">
                Wishlist ❤️
              </Link>

              <Link to="/orders">
                Orders
              </Link>

              <Link to="/profile">
                Profile
              </Link>
            </>
          )}

          {/* Seller Links */}
          {token && user?.role === "seller" && (
            <>
              <Link to="/seller/dashboard">
                Seller Dashboard
              </Link>

              <Link to="/seller/orders">
                Seller Orders
              </Link>

              <Link to="/profile">
                Profile
              </Link>
            </>
          )}

          {/* Admin Links */}
          {token && user?.role === "admin" && (
            <>
              <Link to="/admin">
                Admin Dashboard
              </Link>

              <Link to="/admin/users">
                Users
              </Link>

              <Link to="/admin/orders">
                Admin Orders
              </Link>

              <Link to="/admin/categories">
                Categories
              </Link>

              <Link to="/profile">
                Profile
              </Link>
            </>
          )}

          {/* Login / Register */}
          {!token ? (
            <>
              <Link to="/login">
                Login
              </Link>

              <Link to="/register">
                Register
              </Link>
            </>
          ) : (
            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;