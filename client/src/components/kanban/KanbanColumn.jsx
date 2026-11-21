import TicketCard from "../tickets/TicketCard";
import { Circle, Clock3, CheckCircle2 } from "lucide-react";

const columnIcons = {
  Todo: Circle,
  "In Progress": Clock3,
  Done: CheckCircle2,
};

export default function KanbanColumn({
  title,
  tickets,
  onEdit,
  onDelete,
  onMove,
}) {
  const Icon = columnIcons[title] || Circle;

  return (
    <section className="kanban-modern-column">
      <div className="kanban-column-heading">
        <div>
          <Icon size={19} />
          <h3>{title}</h3>
        </div>
        <span>{tickets.length}</span>
      </div>

      <div className="kanban-column-content">
        {tickets.map((ticket) => (
          <div
            className="kanban-ticket-wrapper"
            key={ticket._id || ticket.id}
          >
            <TicketCard
              ticket={ticket}
              onEdit={onEdit}
              onDelete={onDelete}
            />

            <div className="kanban-move-control">
              <label>Move to</label>
              <select
                value={ticket.status || "Todo"}
                onChange={(e) => onMove(ticket, e.target.value)}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
        ))}

        {tickets.length === 0 && (
          <div className="kanban-empty-column">
            No tickets here yet
          </div>
        )}
      </div>
    </section>
  );
}