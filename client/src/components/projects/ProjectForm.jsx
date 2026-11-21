
import { useState } from "react";
import { FolderKanban } from "lucide-react";

export default function ProjectForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await onSubmit({
        title: form.name.trim(),
        description: form.description.trim(),
      });
    } catch (err) {
      setError(err.message || "Could not save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form project-modern-form" onSubmit={submit}>
      <div className="project-form-intro">
        <div className="project-card-icon">
          <FolderKanban size={22} />
        </div>
        <p>
          Add a name and description to create your new project.
        </p>
      </div>

      <label>
        Project name
        <input
          type="text"
          placeholder="e.g. Website Redesign"
          required
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </label>

      <label>
        Description
        <textarea
          rows="4"
          placeholder="What is this project about?"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </label>

      {error && <p className="error">{error}</p>}

      <div className="project-form-actions">
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
          className="projects-create-btn"
          disabled={saving}
        >
          {saving ? "Creating..." : "Create Project"}
        </button>
      </div>
    </form>
  );
}
