import { useState } from "react";
import {
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  CircleDot,
} from "lucide-react";

export default function TicketCard({
  ticket,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const [expanded, setExpanded] = useState(false);

  const priority = ticket.priority || "Low";
  const status = ticket.status || "Todo";

  return (
    <article className="modern-ticket-card">
      <div className="modern-ticket-card-top">
        <span className={`ticket-priority priority-${priority.toLowerCase()}`}>
          {priority} Priority
        </span>

        <span className={`modern-ticket-status status-${status.toLowerCase().replaceAll(" ", "-")}`}>
          <CircleDot size={12} />
          {status}
        </span>
      </div>

      <h3>{ticket.title || "Untitled ticket"}</h3>

      <p className="modern-ticket-description">
        {ticket.description || "No description provided."}
      </p>

      <div className="modern-ticket-meta">
        <span>
          ID: {(ticket._id || ticket.id || "").slice(-6) || "N/A"}
        </span>

        <span>
          {ticket.project?.name ||
            ticket.projectName ||
            "Project ticket"}
        </span>
      </div>

      {expanded && (
        <div className="modern-ticket-expanded">
          <p>
            <strong>Full description</strong>
          </p>
          <p>{ticket.description || "No description available."}</p>

          <p>
            <strong>Assignee:</strong>{" "}
            {ticket.assignee?.name ||
              ticket.assigneeName ||
              "Unassigned"}
          </p>
        </div>
      )}

      <button
        type="button"
        className="modern-ticket-details-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <>
            Show less <ChevronUp size={15} />
          </>
        ) : (
          <>
            View details <ChevronDown size={15} />
          </>
        )}
      </button>

      {onStatusChange && (
        <div className="modern-ticket-status-control">
          <label>Update status</label>

          <select
            value={status}
            onChange={(e) =>
              onStatusChange(ticket, e.target.value)
            }
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      )}

      <div className="modern-ticket-actions">
        <button
          type="button"
          className="ticket-edit-btn"
          onClick={() => onEdit(ticket)}
        >
          <Pencil size={15} />
          Edit
        </button>

        <button
          type="button"
          className="ticket-delete-btn"
          onClick={() => onDelete(ticket)}
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </article>
  );
}