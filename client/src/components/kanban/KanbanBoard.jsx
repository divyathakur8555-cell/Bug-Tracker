
import KanbanColumn from "./KanbanColumn";
import { TICKET_STATUSES } from "../../utils/constants";

export default function KanbanBoard({
  tickets = [],
  onEdit,
  onDelete,
  onMove
}) {
  return (
    <div className="kanban">
      {TICKET_STATUSES.map((status) => {
        const filteredTickets = tickets.filter(
          (ticket) => (ticket.status || "Todo") === status
        );

        return (
          <KanbanColumn
            key={status}
            title={status}
            tickets={filteredTickets}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        );
      })}
    </div>
  );
}
