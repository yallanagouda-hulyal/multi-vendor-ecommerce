import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me", {
          headers,
        });

        const user = response.data.user;

        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await api.put(
        "/auth/profile",
        {
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
        },
        { headers }
      );

      setProfile((current) => ({
        ...current,
        ...response.data.user,
      }));

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      setChangingPassword(true);
      setMessage("");
      setError("");

      await api.put(
        "/auth/change-password",
        passwordData,
        { headers }
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });

      setMessage("Password changed successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-status">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>

        {message && (
          <div className="profile-success">
            {message}
          </div>
        )}

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        <div className="profile-grid">

          {/* Profile Information */}
          <div className="profile-card">
            <h2>Profile Information</h2>

            <form onSubmit={handleProfileSubmit}>

              <div className="profile-field">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="profile-field">
                <label>Email</label>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                />
              </div>

              <div className="profile-field">
                <label>Phone</label>

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="profile-field">
                <label>Address</label>

                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                  rows="4"
                />
              </div>

              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </form>
          </div>

          {/* Change Password */}
          <div className="profile-card">
            <h2>Change Password</h2>

            <form onSubmit={handlePasswordSubmit}>

              <div className="profile-field">
                <label>Current Password</label>

                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="profile-field">
                <label>New Password</label>

                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  minLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                className="profile-password-btn"
                disabled={changingPassword}
              >
                {changingPassword
                  ? "Changing..."
                  : "Change Password"}
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;