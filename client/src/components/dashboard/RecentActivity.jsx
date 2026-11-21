import { Link } from "react-router-dom";
import { ArrowRight, Ticket } from "lucide-react";

export default function RecentActivity({ tickets = [] }) {
  return (
    <section className="card recent-activity-card">

      <div className="activity-header">
        <div>
          <h3>Recent Tickets</h3>
          <p>Your latest reported issues</p>
        </div>

        <Link to="/tickets" className="activity-view-all">
          View All
          <ArrowRight size={15} />
        </Link>
      </div>

      {tickets.length > 0 ? (
        <div className="activity-list">

          {tickets.slice(0, 5).map((ticket) => {

            const status = ticket.status || "Todo";

            const statusClass = status
              .toLowerCase()
              .replace(/\s+/g, "-");

            return (
              <div
                className="activity-item"
                key={ticket._id || ticket.id}
              >

                <div className="activity-ticket-icon">
                  <Ticket size={18} />
                </div>

                <div className="activity-ticket-info">
                  <strong>{ticket.title}</strong>
                  <span>
                    {ticket.priority || "Normal"} Priority
                  </span>
                </div>

                <span className={`activity-status ${statusClass}`}>
                  {status}
                </span>

              </div>
            );
          })}

        </div>
      ) : (
        <div className="activity-empty">
          <Ticket size={30} />
          <strong>No tickets yet</strong>
          <p>Your recent tickets will appear here.</p>
        </div>
      )}

    </section>
  );
}