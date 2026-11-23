
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

export default function Profile() {
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [theme, setTheme] = useState(
    localStorage.getItem("trackwise_theme") || "system"
  );
  const [notifications, setNotifications] = useState(true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Keep appearance synchronized with Navbar
  useEffect(() => {
    const syncTheme = () => {
      setTheme(localStorage.getItem("trackwise_theme") || "system");
    };

    window.addEventListener("trackwise-theme-change", syncTheme);

    return () => {
      window.removeEventListener("trackwise-theme-change", syncTheme);
    };
  }, []);

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;

    localStorage.setItem("trackwise_theme", newTheme);
    setTheme(newTheme);

    window.dispatchEvent(new Event("trackwise-theme-change"));
  };

  // UPDATE PROFILE
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("trackwise_token");

      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile");
      }

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // CHANGE PASSWORD
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("New password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      const token = localStorage.getItem("trackwise_token");

      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password change failed.");
      }

      setPasswordMessage(data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  // DEACTIVATE ACCOUNT
  const handleDeactivate = async () => {
    if (!window.confirm("Are you sure you want to deactivate your account?")) {
      return;
    }

    try {
      const token = localStorage.getItem("trackwise_token");

      const response = await fetch(
        "http://localhost:5000/api/auth/deactivate",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Deactivation failed");
      }

      logout();
      window.location.href = "/login";
    } catch (err) {
      alert(err.message);
    }
  };

  // DELETE ACCOUNT
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!deletePassword) {
      alert("Please enter your current password.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to schedule your account for deletion? You can recover it within 30 days by logging in again."
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const token = localStorage.getItem("trackwise_token");

      const response = await fetch(
        "http://localhost:5000/api/auth/account",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: deletePassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Account deletion failed.");
      }

      alert(data.message);
      logout();
      window.location.href = "/login";
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <span className="settings-eyebrow">ACCOUNT MANAGEMENT</span>
          <h1>Profile Settings</h1>
          <p>Manage your personal information and preferences.</p>
        </div>

        <div className="profile-status">
          <span className="status-dot"></span>
          Active account
        </div>
      </div>

      <div className="settings-profile-banner">
        <div className="settings-avatar">
          {name.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="settings-user-info">
          <h2>{name || "Your Name"}</h2>
          <p>{user?.email || "No email available"}</p>
          <span>Trackwise Member</span>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <section className="settings-section">
          <div className="settings-section-heading">
            <div className="settings-icon">♙</div>
            <div>
              <h2>Personal Information</h2>
              <p>Update your basic account details.</p>
            </div>
          </div>

          <div className="settings-form-grid">
            <div className="settings-field">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="settings-field">
              <label>Email Address</label>
              <input type="email" value={user?.email || ""} disabled />
            </div>
          </div>

          <div className="settings-save-row">
            <button type="submit" className="settings-primary-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {message && <p className="settings-message">{message}</p>}
          {error && <p className="settings-error">{error}</p>}
        </section>
      </form>

      <section className="settings-section">
        <div className="settings-section-heading">
          <div className="settings-icon">⚙</div>
          <div>
            <h2>Personalization</h2>
            <p>Customize your Trackwise experience.</p>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <strong>Appearance</strong>
            <p>Choose your preferred application theme.</p>
          </div>

          <select value={theme} onChange={handleThemeChange}>
            <option value="light">☀️ Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="system">💻 System Default</option>
          </select>
        </div>

        <div className="settings-option">
          <div>
            <strong>Email Notifications</strong>
            <p>Receive updates about projects and tickets.</p>
          </div>

          <label className="settings-switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <span></span>
          </label>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <div className="settings-icon">♢</div>
          <div>
            <h2>Security</h2>
            <p>Keep your account protected.</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="settings-password-form">
          <div className="settings-field">
            <label htmlFor="current-password">Current Password</label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="settings-field">
            <label htmlFor="new-password">New Password</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className="settings-field">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter new password again"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {passwordError && <p className="settings-error" role="alert">{passwordError}</p>}
          {passwordMessage && <p className="settings-message" role="status">{passwordMessage}</p>}

          <button type="submit" className="settings-primary-btn" disabled={changingPassword}>
            {changingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </section>

      <section className="settings-section settings-danger">
        <div className="settings-section-heading">
          <div className="settings-icon danger-icon">!</div>
          <div>
            <h2>Account Management</h2>
            <p>Manage the status of your account.</p>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <strong>Deactivate Account</strong>
            <p>Temporarily disable your account. Your projects and tickets will remain saved.</p>
          </div>

          <button type="button" className="settings-danger-btn" onClick={handleDeactivate}>
            Deactivate Account
          </button>
        </div>

        <div className="settings-option">
          <div>
            <strong>Delete Account Permanently</strong>
            <p>Schedule your account for permanent deletion. You have 30 days to recover it by logging in again.</p>
          </div>
        </div>

        <form onSubmit={handleDeleteAccount} className="settings-password-form">
          <div className="settings-field">
            <label htmlFor="delete-account-password">Confirm your current password</label>
            <input
              id="delete-account-password"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter your current password"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="settings-danger-btn" disabled={deleting}>
            {deleting ? "Processing..." : "Delete Account"}
          </button>
        </form>
      </section>
    </div>
  );
}
