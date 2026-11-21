import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";

import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../services/ticketService";

import { useProjects } from "../context/ProjectContext";
import KanbanBoard from "../components/kanban/KanbanBoard";
import TicketForm from "../components/tickets/TicketForm";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";

export default function ProjectDetails() {
  const { id } = useParams();
  const { projects } = useProjects();

  const project = projects.find(
    (item) => (item._id || item.id) === id
  );

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const refresh = async () => {
    const data = await getTickets(id);
    setTickets(data.tickets || data.data || data || []);
  };

  useEffect(() => {
    setLoading(true);

    refresh()
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, [id]);

  const save = async (form) => {
    if (editing) {
      await updateTicket(editing._id || editing.id, form);
    } else {
      await createTicket({
        ...form,
        projectId: id,
      });
    }

    await refresh();
    setOpen(false);
    setEditing(null);
  };

  const remove = async (ticket) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) {
      return;
    }

    await deleteTicket(ticket._id || ticket.id);
    await refresh();
  };

  const move = async (ticket, newStatus) => {
    await updateTicket(ticket._id || ticket.id, {
      status: newStatus,
    });

    await refresh();
  };

  if (loading) return <Loader />;

  return (
    <div className="modern-board-page">
      <div className="board-welcome">
        <div>
          <div className="welcome-label">
            <Sparkles size={15} />
            PROJECT WORKSPACE
          </div>

          <h1>{project?.name || project?.title || "Project Board"}</h1>

          <p>
            {project?.description ||
              "Manage your project tasks and track progress."}
          </p>
        </div>

        <button
          className="tickets-create-btn"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus size={18} />
          New Ticket
        </button>
      </div>

      <div className="board-summary">
        <div>
          <strong>{tickets.length}</strong>
          <span>Total tickets in this project</span>
        </div>
      </div>

      <div className="board-section-heading">
        <div>
          <h2>Project Board</h2>
          <p>Move tickets through each stage of work</p>
        </div>
      </div>

      <KanbanBoard
        tickets={tickets}
        onEdit={(ticket) => {
          setEditing(ticket);
          setOpen(true);
        }}
        onDelete={remove}
        onMove={move}
      />

      {open && (
        <Modal
          title={editing ? "Edit Ticket" : "Create a New Ticket"}
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
        >
          <TicketForm
            initial={editing || {}}
            projects={projects}
            onSubmit={save}
            onCancel={() => {
              setOpen(false);
              setEditing(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}