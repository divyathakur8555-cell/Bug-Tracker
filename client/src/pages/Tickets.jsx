
import { useEffect, useMemo, useState } from "react";
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket
} from "../services/ticketService";

import { useProjects } from "../context/ProjectContext";
import TicketFilters from "../components/tickets/TicketFilters";
import TicketCard from "../components/tickets/TicketCard";
import TicketForm from "../components/tickets/TicketForm";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";

export default function Tickets() {
  const { projects } = useProjects();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const refresh = async () => {
    try {
      setError("");

      const data = await getTickets();

      const list = Array.isArray(data)
        ? data
        : data.tickets || data.data || [];

      setTickets(list);
    } catch (err) {
      console.error("FETCH TICKETS ERROR:", err);
      setError(err.message || "Could not fetch tickets.");
      throw err;
    }
  };

  useEffect(() => {
    refresh()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch = (ticket.title || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        !status || ticket.status === status;

      const matchesPriority =
        !priority || ticket.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, status, priority]);

  const save = async (formData) => {
    if (editing) {
      await updateTicket(editing._id || editing.id, formData);
    } else {
      await createTicket(formData);
    }

    await refresh();

    setOpen(false);
    setEditing(null);
  };

  const remove = async (ticket) => {
    if (!window.confirm("Delete this ticket?")) return;

    try {
      await deleteTicket(ticket._id || ticket.id);
      await refresh();
    } catch (err) {
      setError(err.message || "Could not delete ticket.");
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Tickets</h1>
          <p className="muted">Search and manage issues</p>
        </div>

        <button
          className="btn"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          + New ticket
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <TicketFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
      />

      <div className="stats-grid">
        {filtered.map((ticket) => (
          <TicketCard
            key={ticket._id || ticket.id}
            ticket={ticket}
            onEdit={(item) => {
              setEditing(item);
              setOpen(true);
            }}
            onDelete={remove}
          />
        ))}
      </div>

      {!filtered.length && (
        <div className="card empty">
          {error ? "Tickets could not be loaded." : "No matching tickets."}
        </div>
      )}

      {open && (
        <Modal
          title={editing ? "Edit ticket" : "New ticket"}
          onClose={() => setOpen(false)}
        >
          <TicketForm
            initial={editing || {}}
            projects={projects}
            onSubmit={save}
            onCancel={() => setOpen(false)}
          />
        </Modal>
      )}
    </>
  );
}
