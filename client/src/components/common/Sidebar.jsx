import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Bug,
  UserRound,
  Settings,
  Sparkles,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Projects",
    icon: FolderKanban,
    path: "/projects",
  },
  {
    name: "Bugs & Tickets",
    icon: Bug,
    path: "/tickets",
  },
  {
    name: "My Profile",
    icon: UserRound,
    path: "/profile",
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className="brand">
        <span className="brand-mark">
          T
        </span>
        <span className="brand-name">
          Trackwise
        </span>
      </NavLink>

      <div className="workspace-info">
        <span className="workspace-label">
          WORKSPACE
        </span>

        <div className="workspace-name">
          <span className="workspace-dot"></span>
          My Workspace
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-heading">
          MENU
        </p>

        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} strokeWidth={2} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="upgrade-card">
          <div className="upgrade-icon">
            <Sparkles size={20} />
          </div>

          <strong>
            Make work flow better
          </strong>

          <p>
            Keep your projects organized
            and your team moving forward.
          </p>
        </div>

        <div className="sidebar-version">
          <Settings size={14} />
          <span>Trackwise · Project Management</span>
        </div>
      </div>
    </aside>
  );
}