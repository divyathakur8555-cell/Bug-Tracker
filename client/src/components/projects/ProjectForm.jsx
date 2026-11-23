
import { useState } from "react";

export default function ProjectForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim()
      });
    } catch (err) {
      setError(err.message || "Could not save project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <label>
        Project name
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          placeholder="Enter project name"
        />
      </label>

      <label>
        Description
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          placeholder="Describe your project"
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create project"}
      </button>

      <button
        type="button"
        className="btn secondary"
        onClick={onCancel}
        disabled={submitting}
      >
        Cancel
      </button>
    </form>
  );
}
