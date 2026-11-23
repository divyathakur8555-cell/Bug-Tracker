
import { useState } from "react";

export default function TicketCard({
  ticket,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const [expanded, setExpanded] = useState(false);

  const priority = (ticket.priority || "Low").toLowerCase();
  const status = ticket.status || "Open";

  const formattedStatus = status.replaceAll("_", " ");

  return (
    <article className="ticket-card interactive-ticket-card">
      <div className="ticket-card-top">
        <span className={`badge ${priority}`}>
          {priority.toUpperCase()} PRIORITY
        </span>

        <span className={`ticket-status status-${status.toLowerCase().replaceAll(" ", "-")}`}>
          {formattedStatus}
        </span>
      </div>

      <h3>{ticket.title || "Untitled ticket"}</h3>

      <p className="muted ticket-description">
        {ticket.description || "No description provided."}
      </p>

      <div className="ticket-card-info">
        <span>
          <strong>Ticket ID:</strong>{" "}
          {(ticket._id || ticket.id || "").slice(-6) || "N/A"}
        </span>

        <span>
          <strong>Priority:</strong> {ticket.priority || "Low"}
        </span>
      </div>

      {expanded && (
        <div className="ticket-expanded-details">
          <p>
            <strong>Full description</strong>
          </p>
          <p>{ticket.description || "No description available."}</p>

          <p>
            <strong>Project:</strong>{" "}
            {ticket.project?.name || ticket.projectName || "Not specified"}
          </p>

          <p>
            <strong>Assignee:</strong>{" "}
            {ticket.assignee?.name || ticket.assigneeName || "Unassigned"}
          </p>
        </div>
      )}

      <button
        type="button"
        className="ticket-details-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Show less ↑" : "View details ↓"}
      </button>

      {onStatusChange && (
        <div className="ticket-status-control">
          <label>Update status</label>

          <select
            value={status}
            onChange={(e) =>
              onStatusChange(ticket, e.target.value)
            }
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      )}

      <div className="ticket-card-actions">
        <button
          type="button"
          className="btn secondary"
          onClick={() => onEdit(ticket)}
        >
          Edit
        </button>

        <button
          type="button"
          className="btn danger"
          onClick={() => onDelete(ticket)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
