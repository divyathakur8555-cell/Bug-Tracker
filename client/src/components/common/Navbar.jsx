import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import {
  Bell,
  ChevronDown,
  UserRound,
  Palette,
  LogOut,
  Settings,
  Sun,
  Moon,
  Monitor,
  Check,
} from "lucide-react";

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
    setProfileOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="breadcrumb">Workspace</span>
        <span className="breadcrumb-divider">/</span>
        <strong>Overview</strong>
      </div>

      <div className="topbar-actions">
        {!loading && (
          <>
            <div className="navbar-dropdown">
              <button
                className="icon-button notification-button"
                title="Notifications"
                aria-label="Notifications"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
              >
                <Bell size={19} />
              </button>

              {notificationsOpen && (
                <div className="navbar-popup notification-popup">
                  <h3>Notifications</h3>
                  <div className="notification-empty">
                    <span className="notification-empty-icon">
                      <Bell size={22} />
                    </span>
                    <strong>You're all caught up!</strong>
                    <p className="muted">
                      No new notifications right now.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <div className="navbar-dropdown">
                <button
                  className={`profile-trigger ${
                    profileOpen ? "active" : ""
                  }`}
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotificationsOpen(false);
                  }}
                >
                  <span className="profile-avatar">
                    {displayName.charAt(0).toUpperCase()}
                  </span>

                  <span className="profile-trigger-name">
                    {displayName}
                  </span>

                  <ChevronDown
                    size={16}
                    className="profile-arrow"
                  />
                </button>

                {profileOpen && (
                  <div className="navbar-popup profile-popup">
                    <div className="profile-popup-header">
                      <span className="profile-avatar large">
                        {displayName.charAt(0).toUpperCase()}
                      </span>

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
                      <UserRound size={17} />
                      My Profile
                    </button>

                    <div className="appearance-section">
                      <div className="appearance-title">
                        <Palette size={17} />
                        <strong>Appearance</strong>
                      </div>

                      <p className="muted">Choose your theme</p>

                      <div className="theme-options">
                        <button
                          className={
                            theme === "light" ? "selected" : ""
                          }
                          onClick={() => changeTheme("light")}
                        >
                          <Sun size={16} />
                          Light
                          {theme === "light" && <Check size={15} />}
                        </button>

                        <button
                          className={
                            theme === "dark" ? "selected" : ""
                          }
                          onClick={() => changeTheme("dark")}
                        >
                          <Moon size={16} />
                          Dark
                          {theme === "dark" && <Check size={15} />}
                        </button>

                        <button
                          className={
                            theme === "system" ? "selected" : ""
                          }
                          onClick={() => changeTheme("system")}
                        >
                          <Monitor size={16} />
                          System
                          {theme === "system" && <Check size={15} />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/profile");
                      }}
                    >
                      <Settings size={17} />
                      Account Settings
                    </button>

                    <div className="popup-divider" />

                    <button
                      className="popup-logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={17} />
                      Log out
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