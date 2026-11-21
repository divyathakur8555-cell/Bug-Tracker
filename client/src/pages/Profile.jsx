
import { useEffect, useState } from "react";
import {
  UserRound,
  Settings,
  ShieldCheck,
  AlertTriangle,
  Save,
  Lock,
  Trash2,
  Users,
  ArrowRightLeft,
} from "lucide-react";

import { useAuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuthContext();

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [name, setName] = useState(user?.name || "");
  const [theme, setTheme] = useState(
    localStorage.getItem("trackwise_theme") || "light"
  );
  const [notifications, setNotifications] = useState(true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Change password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Account deletion states
  const [projects, setProjects] = useState([]);
  const [projectActions, setProjectActions] = useState({});
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Load projects owned by the current user
  useEffect(() => {
    const loadOwnedProjects = async () => {
      try {
        setLoadingProjects(true);
        setProjectsError("");

        const token = localStorage.getItem("trackwise_token");

        const response = await fetch(`${API_URL}/auth/owned-projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load your projects.");
        }

        setProjects(data.projects || []);
      } catch (err) {
        setProjectsError(err.message);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadOwnedProjects();
  }, [API_URL]);

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("trackwise_token");

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile.");
      }

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must contain at least 8 characters.");
      return;
    }

    setChangingPassword(true);

    try {
      const token = localStorage.getItem("trackwise_token");

      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password update failed.");
      }

      setPasswordMessage("Password changed. Logging you out...");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        logout();
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  // Theme
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);

    localStorage.setItem("trackwise_theme", newTheme);

    document.documentElement.setAttribute("data-theme", newTheme);

    window.dispatchEvent(new Event("trackwise-theme-change"));
  };

  // Deactivate account
  const handleDeactivate = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your account?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("trackwise_token");

      const response = await fetch(`${API_URL}/auth/deactivate`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Account deactivation failed.");
      }

      logout();
      window.location.href = "/login";
    } catch (err) {
      setError(err.message);
    }
  };

  // Select delete or transfer for a project
  const handleProjectAction = (projectId, action) => {
    setProjectActions((previous) => ({
      ...previous,
      [projectId]: {
        action,
        newOwner: "",
      },
    }));
  };

  // Select a new project owner
  const handleNewOwner = (projectId, newOwner) => {
    setProjectActions((previous) => ({
      ...previous,
      [projectId]: {
        ...previous[projectId],
        newOwner,
      },
    }));
  };

  // Permanently delete account
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    setDeleteError("");

    if (!deletePassword) {
      setDeleteError("Please enter your current password.");
      return;
    }

    const incompleteProject = projects.find((project) => {
      const choice = projectActions[project._id];

      return (
        !choice?.action ||
        (choice.action === "transfer" && !choice.newOwner)
      );
    });

    if (incompleteProject) {
      setDeleteError(
        `Please choose whether to delete or transfer "${incompleteProject.title}".`
      );
      return;
    }

    const confirmed = window.confirm(
      "This action is permanent. Your account will be deleted and cannot be recovered. Continue?"
    );

    if (!confirmed) return;

    setDeletingAccount(true);

    try {
      const token = localStorage.getItem("trackwise_token");

      const actions = projects.map((project) => ({
        projectId: project._id,
        action: projectActions[project._id].action,
        ...(projectActions[project._id].action === "transfer"
          ? { newOwner: projectActions[project._id].newOwner }
          : {}),
      }));

      const response = await fetch(`${API_URL}/auth/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: deletePassword,
          projectActions: actions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Account deletion failed.");
      }

      window.alert("Your account has been permanently deleted.");

      logout();
      window.location.href = "/login";
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeletingAccount(false);
    }
  };

  const displayName = name.trim() || "Your Name";

  return (
    <div className="settings-page">

      {/* Header */}
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

      {/* Profile banner */}
      <div className="settings-profile-banner">
        <div className="settings-avatar">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <div className="settings-user-info">
          <h2>{displayName}</h2>
          <p>{user?.email || "No email available"}</p>
          <span>Trackwise Member</span>
        </div>
      </div>

      {/* Personal information */}
      <form onSubmit={handleSave}>
        <section className="settings-section">
          <div className="settings-section-heading">
            <div className="settings-icon">
              <UserRound size={20} />
            </div>

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
              <small>Email editing is not available yet.</small>
            </div>
          </div>

          <div className="settings-save-row">
            <button
              type="submit"
              className="settings-primary-btn"
              disabled={saving}
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {message && <p className="settings-message">{message}</p>}
          {error && <p className="settings-error">{error}</p>}
        </section>
      </form>

      {/* Personalization */}
      <section className="settings-section">
        <div className="settings-section-heading">
          <div className="settings-icon">
            <Settings size={20} />
          </div>

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

          <select
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
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

      {/* Security */}
      <section className="settings-section">
        <div className="settings-section-heading">
          <div className="settings-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2>Security</h2>
            <p>Keep your account protected.</p>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <strong>Change Password</strong>
            <p>Update your password to protect your account.</p>
          </div>
          <Lock size={20} />
        </div>

        <form
          onSubmit={handleChangePassword}
          className="settings-password-form"
        >
          <div className="settings-field">
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="settings-field">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              minLength={8}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="settings-field">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              minLength={8}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="settings-primary-btn"
            disabled={changingPassword}
          >
            <Lock size={17} />
            {changingPassword ? "Updating..." : "Update Password"}
          </button>

          {passwordMessage && (
            <p className="settings-message">{passwordMessage}</p>
          )}

          {passwordError && (
            <p className="settings-error">{passwordError}</p>
          )}
        </form>
      </section>

      {/* Deactivate account */}
      <section className="settings-section">
        <div className="settings-section-heading">
          <div className="settings-icon">
            <AlertTriangle size={20} />
          </div>

          <div>
            <h2>Deactivate Account</h2>
            <p>Temporarily disable your account.</p>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <strong>Deactivate Account</strong>
            <p>
              Your projects and tickets will remain saved.
            </p>
          </div>

          <button
            type="button"
            className="settings-danger-btn"
            onClick={handleDeactivate}
          >
            Deactivate Account
          </button>
        </div>
      </section>

      {/* Permanent account deletion */}
      <section className="settings-section settings-danger">
        <div className="settings-section-heading">
          <div className="settings-icon danger-icon">
            <Trash2 size={20} />
          </div>

          <div>
            <h2>Permanently Delete Account</h2>
            <p>
              This action cannot be undone. Review your projects before
              continuing.
            </p>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <strong>Your owned projects</strong>
            <p>
              Choose what happens to each project before deleting your
              account.
            </p>
          </div>

          <Users size={21} />
        </div>

        {loadingProjects && (
          <p>Loading your projects...</p>
        )}

        {projectsError && (
          <p className="settings-error">{projectsError}</p>
        )}

        {!loadingProjects && !projectsError && projects.length === 0 && (
          <p className="settings-message">
            You don't own any projects. You can proceed with account deletion.
          </p>
        )}

        {!loadingProjects && projects.map((project) => {
          const choice = projectActions[project._id] || {};
          const members = project.teamMembers || [];

          return (
            <div
              key={project._id}
              className="settings-project-delete-card"
            >
              <h3>{project.title}</h3>

              <p>
                {project.description || "No project description."}
              </p>

              <div className="settings-field">
                <label>What should happen to this project?</label>

                <select
                  value={choice.action || ""}
                  onChange={(e) =>
                    handleProjectAction(project._id, e.target.value)
                  }
                >
                  <option value="">Choose an action</option>
                  <option value="delete">Permanently delete project</option>
                  <option value="transfer">Transfer project ownership</option>
                </select>
              </div>

              {choice.action === "delete" && (
                <p className="settings-error">
                  This project and all its tickets will be permanently deleted.
                  Other team members will lose access.
                </p>
              )}

              {choice.action === "transfer" && (
                <div className="settings-field">
                  <label>
                    <ArrowRightLeft size={16} /> Select an existing team member
                  </label>

                  {members.length === 0 ? (
                    <p className="settings-error">
                      This project has no team members to transfer ownership to.
                      Choose permanent deletion instead.
                    </p>
                  ) : (
                    <select
                      value={choice.newOwner || ""}
                      onChange={(e) =>
                        handleNewOwner(project._id, e.target.value)
                      }
                    >
                      <option value="">Choose a new owner</option>

                      {members.map((member) => (
                        <option
                          key={member._id}
                          value={member._id}
                          disabled={!member.isActive}
                        >
                          {member.name} ({member.email})
                          {!member.isActive ? " - Inactive" : ""}
                        </option>
                      ))}
                    </select>
                  )}

                  <small>
                    The selected member will become the project owner.
                    The project and its tickets will be preserved.
                  </small>
                </div>
              )}
            </div>
          );
        })}

        <form onSubmit={handleDeleteAccount}>
          <div className="settings-field">
            <label>Confirm Your Current Password</label>

            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter your password to confirm deletion"
              autoComplete="current-password"
              required
            />
          </div>

          {deleteError && (
            <p className="settings-error">{deleteError}</p>
          )}

          <button
            type="submit"
            className="settings-danger-btn"
            disabled={
              deletingAccount ||
              loadingProjects ||
              !!projectsError ||
              projects.some((project) => {
                const choice = projectActions[project._id];

                return (
                  !choice?.action ||
                  (choice.action === "transfer" && !choice.newOwner)
                );
              })
            }
          >
            <Trash2 size={17} />
            {deletingAccount
              ? "Deleting Account..."
              : "Permanently Delete My Account"}
          </button>
        </form>
      </section>

    </div>
  );
}
