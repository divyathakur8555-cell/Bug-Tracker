
import { useState } from "react";
import {
  PRIORITIES,
  TICKET_STATUSES
} from "../../utils/constants";

export default function TicketForm({
  initial = {},
  projects = [],
  onSubmit,
  onCancel
}) {
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    priority: initial.priority || "Medium",
    status: initial.status || "Todo",
    projectId:
      initial.project?._id ||
      initial.project ||
      projects[0]?._id ||
      projects[0]?.id ||
      ""
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.projectId) {
      setError("Please select a project first.");
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter a ticket title.");
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        projectId: form.projectId
      });
    } catch (err) {
      setError(err.message || "Could not save ticket.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={change}
          placeholder="Enter ticket title"
          maxLength={150}
          required
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={change}
          placeholder="Describe the issue"
        />
      </label>

      <label>
        Project
        <select
          name="projectId"
          value={form.projectId}
          onChange={change}
          required
        >
          <option value="">Select project</option>

          {projects.map((project) => (
            <option
              key={project._id || project.id}
              value={project._id || project.id}
            >
              {project.title || project.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Priority
        <select
          name="priority"
          value={form.priority}
          onChange={change}
        >
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
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
          {TICKET_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <button
        className="btn"
        type="submit"
        disabled={saving || projects.length === 0}
      >
        {saving ? "Saving..." : "Save ticket"}
      </button>

      <button
        type="button"
        className="btn secondary"
        onClick={onCancel}
      >
        Cancel
      </button>

      {projects.length === 0 && (
        <p className="error">
          Create a project before creating a ticket.
        </p>
      )}
    </form>
  );
}
