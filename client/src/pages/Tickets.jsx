
import { useEffect, useMemo, useState } from "react";
import {
  Ticket,
  Circle,
  Clock3,
  CheckCircle2,
  Plus,
  Sparkles,
} from "lucide-react";

import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
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

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Fetch tickets
  const refresh = async () => {
    const data = await getTickets();

    setTickets(
      data.tickets ||
      data.data ||
      data ||
      []
    );
  };

  useEffect(() => {
    refresh()
      .catch((error) => {
        console.error("Error loading tickets:", error);
        setTickets([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter tickets
  const filtered = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch = (ticket.title || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        !status || ticket.status === status;

      const matchesPriority =
        !priority || ticket.priority === priority;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [tickets, search, status, priority]);

  // Open create form
  const openCreateForm = () => {
    setEditing(null);
    setOpen(true);
  };

  // Open edit form
  const openEditForm = (ticket) => {
    setEditing(ticket);
    setOpen(true);
  };

  // Close form
  const closeForm = () => {
    setOpen(false);
    setEditing(null);
  };

  // Create or update ticket
  const save = async (form) => {
    if (editing) {
      await updateTicket(
        editing._id || editing.id,
        form
      );
    } else {
      await createTicket(form);
    }

    await refresh();
    closeForm();
  };

  // Delete ticket
  const remove = async (ticket) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) return;

    await deleteTicket(
      ticket._id || ticket.id
    );

    await refresh();
  };

  // Update ticket status
  const changeStatus = async (ticket, newStatus) => {
    await updateTicket(
      ticket._id || ticket.id,
      { status: newStatus }
    );

    await refresh();
  };

  if (loading) {
    return <Loader />;
  }

  // Ticket statistics
  const totalCount = tickets.length;

  const todoCount = tickets.filter(
    (ticket) => ticket.status === "Todo"
  ).length;

  const progressCount = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const doneCount = tickets.filter(
    (ticket) => ticket.status === "Done"
  ).length;

  return (
    <div className="tickets-page">

      {/* Page heading */}
      <div className="tickets-welcome">
        <div>
          <h1>Tickets</h1>

          <p>
            Manage your tasks, track progress, and keep
            your projects moving forward.
          </p>
        </div>

        <button
          className="btn primary"
          onClick={openCreateForm}
        >
          <Plus size={17} />
          Create Ticket
        </button>
      </div>

      {/* Ticket statistics */}
      <div className="ticket-overview-grid">

        <div className="ticket-overview-card">
          <div className="ticket-overview-icon purple">
            <Ticket size={22} />
          </div>

          <div>
            <span>Total Tickets</span>
            <strong>{totalCount}</strong>
          </div>
        </div>

        <div className="ticket-overview-card">
          <div className="ticket-overview-icon blue">
            <Circle size={22} />
          </div>

          <div>
            <span>To Do</span>
            <strong>{todoCount}</strong>
          </div>
        </div>

        <div className="ticket-overview-card">
          <div className="ticket-overview-icon amber">
            <Clock3 size={22} />
          </div>

          <div>
            <span>In Progress</span>
            <strong>{progressCount}</strong>
          </div>
        </div>

        <div className="ticket-overview-card">
          <div className="ticket-overview-icon green">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <span>Completed</span>
            <strong>{doneCount}</strong>
          </div>
        </div>

      </div>

      {/* Ticket list heading */}
      <div className="tickets-list-heading">
        <div>
          <h2>All Tickets</h2>

          <p>
            View and manage all your project tickets.
          </p>
        </div>

        <span className="ticket-result-count">
          {filtered.length} shown
        </span>
      </div>

      {/* Search and filters */}
      <TicketFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
      />

      {/* Ticket cards */}
      {filtered.length > 0 ? (
        <div className="tickets-modern-grid">
          {filtered.map((ticket) => (
            <TicketCard
              key={ticket._id || ticket.id}
              ticket={ticket}
              onEdit={() => openEditForm(ticket)}
              onDelete={() => remove(ticket)}
              onStatusChange={(newStatus) =>
                changeStatus(ticket, newStatus)
              }
            />
          ))}
        </div>
      ) : (
        <div className="tickets-empty">
          <Sparkles size={34} />

          <h3>No tickets found</h3>

          <p>
            {search || status || priority
              ? "Try changing your search or filters."
              : "Create your first ticket to get started."}
          </p>
        </div>
      )}

      {/* Create / Edit ticket modal */}
      {open && (
        <Modal
          title={editing ? "Edit Ticket" : "Create Ticket"}
          onClose={closeForm}
        >
          <TicketForm
            projects={projects}
            initialData={editing}
            onSubmit={save}
            onCancel={closeForm}
          />
        </Modal>
      )}

    </div>
  );
}
