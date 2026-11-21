import { TICKET_STATUSES } from "../../utils/constants";
import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard(props) {
  return (
    <div className="modern-kanban-board">
      {TICKET_STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          title={status}
          tickets={props.tickets.filter(
            (ticket) => (ticket.status || "Todo") === status
          )}
          {...props}
        />
      ))}
    </div>
  );
}