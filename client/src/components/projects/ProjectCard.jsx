
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import { useAuthContext } from "../../context/AuthContext";

export default function ProjectCard({ project }) {
  const id = project._id || project.id;

  const { removeProject } = useProjects();
  const { user } = useAuthContext();

  const [deleting, setDeleting] = useState(false);

  const ownerId =
    project.owner?._id ||
    project.owner?.id ||
    project.owner;

  const userId = user?._id || user?.id;

  const isOwner =
    ownerId && userId &&
    String(ownerId) === String(userId);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name || project.title}"? All tickets in this project will also be deleted.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await removeProject(id);
    } catch (error) {
      window.alert(
        error.message || "Unable to delete project."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="card project-card">
      <div className="project-card-icon">▦</div>

      <h3>{project.name || project.title}</h3>

      <p className="project-description">
        {project.description || "No description provided."}
      </p>

      <div className="project-card-footer">
        <Link
          className="btn secondary"
          to={`/projects/${id}`}
        >
          Open Project
        </Link>

        {isOwner && (
          <button
            type="button"
            className="btn"
            onClick={handleDelete}
            disabled={deleting}
            style={{
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              cursor: deleting ? "not-allowed" : "pointer"
            }}
          >
            {deleting ? "Deleting..." : "Delete Project"}
          </button>
        )}
      </div>
    </div>
  );
}
