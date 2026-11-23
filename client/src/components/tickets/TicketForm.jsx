
import { useState } from "react";
import { PRIORITIES, TICKET_STATUSES } from "../../utils/constants";

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
      initial.projectId ||
      initial.project ||
      projects[0]?._id ||
      projects[0]?.id ||
      ""
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const selectedProjectId = String(form.projectId || "").trim();

    console.log("Selected project ID:", selectedProjectId);
    console.log("Available projects:", projects);

    if (!form.title.trim()) {
      setError("Please enter a ticket title.");
      return;
    }

    if (!selectedProjectId) {
      setError("Please select a project before creating a ticket.");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        project: selectedProjectId,
        projectId: selectedProjectId
      });
    } catch (err) {
      console.error("CREATE TICKET ERROR:", err);
      setError(err.message || "Could not save ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <label>
        Ticket title
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter ticket title"
          required
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the issue"
        />
      </label>

      <label>
        Project
        <select
          name="projectId"
          value={form.projectId}
          onChange={handleChange}
          required
        >
          <option value="">Select a project</option>
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
          onChange={handleChange}
        >
          {(PRIORITIES || ["Low", "Medium", "High"]).map((item) => (
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
          onChange={handleChange}
        >
          {(TICKET_STATUSES || ["Todo", "In Progress", "Done"]).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="error">{error}</p>}

      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save ticket"}
      </button>

      <button
        className="btn secondary"
        type="button"
        onClick={onCancel}
        disabled={submitting}
      >
        Cancel
      </button>
    </form>
  );
}
