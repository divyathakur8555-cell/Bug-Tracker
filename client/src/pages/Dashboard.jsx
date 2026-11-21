import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Ticket,
  Clock3,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { useProjects } from "../context/ProjectContext";
import { getTickets } from "../services/ticketService";

import StatsCard from "../components/dashboard/StatsCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import Loader from "../components/common/Loader";

export default function Dashboard() {
  const { projects } = useProjects();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTickets()
      .then((data) => {
        setTickets(data.tickets || data.data || data || []);
      })
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const completed = tickets.filter(
    (ticket) => ticket.status === "Done"
  ).length;

  const inProgress = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const todo = tickets.filter(
    (ticket) => ticket.status === "Todo"
  ).length;

  const displayName =
    localStorage.getItem("trackwise_user_name") || "there";

  return (
    <div className="dashboard-page">

      <div className="dashboard-welcome">
        <div>
          <div className="welcome-label">
            <Sparkles size={15} />
            YOUR WORKSPACE
          </div>

          <h1>Welcome back, {displayName}!</h1>

          <p>
            Here's what's happening with your projects today.
          </p>
        </div>

        <Link to="/projects" className="dashboard-create-btn">
          <Plus size={18} />
          View Projects
        </Link>
      </div>

      <div className="dashboard-section-heading">
        <div>
          <h2>Workspace Overview</h2>
          <p>Your project progress at a glance</p>
        </div>
      </div>

      <div className="stats-grid dashboard-stats-grid">

        <StatsCard
          label="Total Projects"
          value={projects.length}
          icon={FolderKanban}
          color="purple"
          description="Projects in your workspace"
        />

        <StatsCard
          label="Total Tickets"
          value={tickets.length}
          icon={Ticket}
          color="blue"
          description="All reported tickets"
        />

        <StatsCard
          label="In Progress"
          value={inProgress}
          icon={Clock3}
          color="orange"
          description="Tickets being worked on"
        />

        <StatsCard
          label="Completed"
          value={completed}
          icon={CheckCircle2}
          color="green"
          description="Successfully completed"
        />

      </div>

      <div className="dashboard-section-heading">
        <div>
          <h2>Project Activity</h2>
          <p>Keep track of your latest work</p>
        </div>
      </div>

      <div className="dashboard-main-grid">

        <RecentActivity tickets={tickets} />

        <div className="dashboard-side-card">

          <div className="side-card-icon">
            <FolderKanban size={22} />
          </div>

          <h3>Project Summary</h3>

          <p>
            Keep your work organized and stay on top of
            every project and task.
          </p>

          <div className="summary-stat">
            <span>Total Projects</span>
            <strong>{projects.length}</strong>
          </div>

          <div className="summary-stat">
            <span>To Do</span>
            <strong>{todo}</strong>
          </div>

          <div className="summary-stat">
            <span>In Progress</span>
            <strong>{inProgress}</strong>
          </div>

          <div className="summary-stat">
            <span>Completed</span>
            <strong>{completed}</strong>
          </div>

          <Link to="/projects" className="summary-link">
            Explore Projects
            <ArrowRight size={16} />
          </Link>

        </div>

      </div>

    </div>
  );
}