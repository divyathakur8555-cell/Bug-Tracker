import { useState } from "react";
import { FolderKanban } from "lucide-react";
import {
  PRIORITIES,
  TICKET_STATUSES,
} from "../../utils/constants";

export default function TicketForm({
  initial = {},
  projects = [],
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    priority: initial.priority || "Medium",
    status: initial.status || "Todo",
    projectId:
      initial.projectId ||
      initial.project?._id ||
      initial.project ||
      projects[0]?._id ||
      projects[0]?.id ||
      "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await onSubmit(form);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not save ticket"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form modern-ticket-form" onSubmit={submit}>
      <div className="ticket-form-intro">
        <div className="project-card-icon">
          <FolderKanban size={22} />
        </div>
        <p>
          Add the details below to create or update your ticket.
        </p>
      </div>

      <label>
        Ticket title
        <input
          name="title"
          type="text"
          placeholder="e.g. Fix login page bug"
          required
          value={form.title}
          onChange={change}
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          rows="4"
          placeholder="Describe the task or issue..."
          value={form.description}
          onChange={change}
        />
      </label>

      <label>
        Project
        <select
          name="projectId"
          required
          value={form.projectId}
          onChange={change}
        >
          <option value="">Select project</option>

          {projects.map((project) => (
            <option
              key={project._id || project.id}
              value={project._id || project.id}
            >
              {project.name || project.title}
            </option>
          ))}
        </select>
      </label>

      <div className="ticket-form-two-columns">
        <label>
          Priority
          <select
            name="priority"
            value={form.priority}
            onChange={change}
          >
            {PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select
            name="status"
            value={form.status}
            onChange={change}
          >
            {TICKET_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="ticket-form-actions">
        <button
          type="button"
          className="btn secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="tickets-create-btn"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Ticket"}
        </button>
      </div>
    </form>
  );
}