import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Automatically redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* LEFT SIDE */}

        <div className="login-info">

          <div className="login-brand">
            <div className="login-brand-icon">M</div>

            <div>
              <h2>Multi-Vendor</h2>
              <span>STORE</span>
            </div>
          </div>

          <div className="login-info-content">
            <h1>
              Everything you need,
              <br />
              all in one place.
            </h1>

            <p>
              Shop products from multiple sellers
              through one simple and secure
              marketplace.
            </p>

            <div className="login-features">

              <div className="login-feature">
                <span>✓</span>
                <p>Multiple trusted sellers</p>
              </div>

              <div className="login-feature">
                <span>✓</span>
                <p>Secure shopping experience</p>
              </div>

              <div className="login-feature">
                <span>✓</span>
                <p>Easy order management</p>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="login-card">

          <div className="login-card-header">

            <div className="login-mobile-logo">
              M
            </div>

            <h1>Welcome Back</h1>

            <p>
              Sign in to your Multi-Vendor Store account
            </p>

          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />

            </div>

            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />

            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>

          <div className="login-role-info">
            <strong>One account. One login.</strong>
            <p>
              Your account type is automatically recognized
              after you sign in.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;