
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuthContext();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [theme, setTheme] = useState(
    localStorage.getItem("trackwise_theme") || "system"
  );

  const displayName =
    user?.name || user?.username || user?.email || "User";

  const changeTheme = (newTheme) => {
    localStorage.setItem("trackwise_theme", newTheme);
    setTheme(newTheme);

    window.dispatchEvent(new Event("trackwise-theme-change"));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="breadcrumb">Workspace</span>
        <span className="breadcrumb-divider"> / </span>
        <strong>Trackwise</strong>
      </div>

      <div className="topbar-actions">
        {!loading && (
          <>
            {/* Notifications */}
            <div className="navbar-dropdown">
              <button
                className="icon-button notification-button"
                title="Notifications"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
              >
                🔔
              </button>

              {notificationsOpen && (
                <div className="navbar-popup notification-popup">
                  <h3>Notifications</h3>
                  <p className="muted">You're all caught up! 🎉</p>
                </div>
              )}
            </div>

            {/* Profile */}
            {user ? (
              <div className="navbar-dropdown">
                <button
                  className={`profile-trigger ${profileOpen ? "active" : ""}`}
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotificationsOpen(false);
                  }}
                >
                  <span className="profile-avatar">😊</span>
                  <span className="profile-trigger-name">
                    {displayName}
                  </span>
                  <span className="profile-arrow">
                    {profileOpen ? "▲" : "▼"}
                  </span>
                </button>

                {profileOpen && (
                  <div className="navbar-popup profile-popup">
                    <div className="profile-popup-header">
                      <span className="profile-avatar large">😊</span>
                      <div>
                        <strong>{displayName}</strong>
                        <p className="muted">{user.email}</p>
                      </div>
                    </div>

                    <div className="popup-divider" />

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/profile");
                      }}
                    >
                      👤 My Profile
                    </button>

                    <div className="appearance-section">
                      <strong>🎨 Appearance</strong>

                      <p className="muted">Choose your theme</p>

                      <select
                        value={theme}
                        onChange={(e) => changeTheme(e.target.value)}
                        className="theme-select"
                      >
                        <option value="light">☀️ Light</option>
                        <option value="dark">🌙 Dark</option>
                        <option value="system">💻 System default</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/profile");
                      }}
                    >
                      ⚙️ Account Settings
                    </button>

                    <div className="popup-divider" />

                    <button
                      className="popup-logout"
                      onClick={handleLogout}
                    >
                      🚪 Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="login-button"
                onClick={() => navigate("/login")}
              >
                Log in
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
}
