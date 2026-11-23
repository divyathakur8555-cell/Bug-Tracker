
import ProjectCard from "./ProjectCard";
import { useProjects } from "../../context/ProjectContext";

export default function ProjectList({ projects = [] }) {
  const { removeProject } = useProjects();

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project and all its tickets?"
    );

    if (!confirmed) return;

    try {
      await removeProject(id);
    } catch (error) {
      alert(error.message || "Could not delete project");
    }
  };

  return projects.length ? (
    <div
      className="stats-grid"
      style={{
        gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))"
      }}
    >
      {projects.map((project) => (
        <div key={project._id || project.id}>
          <ProjectCard project={project} />

          <button
            type="button"
            className="btn danger"
            onClick={() => handleDelete(project._id || project.id)}
          >
            Delete Project
          </button>
        </div>
      ))}
    </div>
  ) : (
    <div className="card empty">
      No projects yet. Create your first project.
    </div>
  );
}
