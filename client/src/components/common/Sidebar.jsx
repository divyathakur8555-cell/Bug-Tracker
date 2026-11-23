
import { NavLink } from "react-router-dom";

const links = [
  { name: "Dashboard", icon: "⌂", path: "/dashboard" },
  { name: "Projects", icon: "▦", path: "/projects" },
  { name: "Bugs & Tickets", icon: "◈", path: "/tickets" },
  { name: "My Profile", icon: "◉", path: "/profile" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand">
        <span className="brand-mark">T</span>
        <span>trackwise</span>
      </NavLink>

      <div className="workspace-info">
        <span className="workspace-label">WORKSPACE</span>
        <div className="workspace-name">
          <span className="workspace-dot"></span>
          My Workspace
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-heading">MENU</p>

        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{link.icon}</span>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="upgrade-card">
          <strong>Make work flow better</strong>
          <p>Keep your projects organized with Trackwise.</p>
        </div>

        <p className="sidebar-version">
          Trackwise · Project Management
        </p>
      </div>
    </aside>
  );
}
