
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  ArrowUpRight,
  Trash2
} from "lucide-react";

import { useProjects } from "../../context/ProjectContext";

export default function ProjectCard({ project }) {
  const id = project._id || project.id;

  const { deleteProject } = useProjects();

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const isOwner =
    project.owner?._id === project.owner?.toString() ||
    project.owner === project.owner?._id;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${project.name || project.title}"?\n\nAll tickets belonging to this project will also be deleted. This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteProject(id);
    } catch (err) {
      setError(
        err.message || "Could not delete this project. Please try again."
      );
      setDeleting(false);
    }
  };

  return (
    <div className="project-modern-card">
      <div className="project-card-top">
        <div className="project-card-icon">
          <FolderKanban size={22} />
        </div>

        <span className="project-card-label">
          PROJECT
        </span>
      </div>

      <h3>{project.name || project.title}</h3>

      <p className="project-card-description">
        {project.description || "No description added yet."}
      </p>

      {error && (
        <p className="project-delete-error">
          {error}
        </p>
      )}

      <div className="project-card-footer">
        <Link
          to={`/projects/${id}`}
          className="project-open-link"
        >
          View project details
          <ArrowUpRight size={18} />
        </Link>

        <button
          type="button"
          className="project-delete-btn"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete project"
        >
          <Trash2 size={16} />
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
