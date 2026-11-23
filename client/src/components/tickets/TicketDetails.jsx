
import { useState } from "react";
import { deleteTicket } from "../../services/ticketService";

export default function TicketDetails({ ticket, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!ticket) return null;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteTicket(ticket._id || ticket.id);

      if (onDelete) {
        await onDelete(ticket._id || ticket.id);
      }
    } catch (err) {
      setError(err.message || "Could not delete ticket");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="card">
      <h2>{ticket.title}</h2>

      <p>{ticket.description}</p>

      <p className="muted">
        {ticket.status} · {ticket.priority}
      </p>

      {error && <p className="error">{error}</p>}

      <button
        type="button"
        className="btn danger"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete Ticket"}
      </button>
    </div>
  );
}
