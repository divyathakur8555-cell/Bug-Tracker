import ProjectCard from "./ProjectCard";
import { FolderOpen } from "lucide-react";

export default function ProjectList({ projects = [] }) {
  if (!projects.length) {
    return (
      <div className="projects-empty">
        <div className="projects-empty-icon">
          <FolderOpen size={30} />
        </div>

        <h3>No projects yet</h3>

        <p>
          Create your first project to start organizing
          your team's work.
        </p>
      </div>
    );
  }

  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <ProjectCard
          key={project._id || project.id}
          project={project}
        />
      ))}
    </div>
  );
}