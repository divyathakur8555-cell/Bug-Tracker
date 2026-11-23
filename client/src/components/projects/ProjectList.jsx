
import ProjectCard from "./ProjectCard";

export default function ProjectList({ projects = [] }) {
  return projects.length ? (
    <div
      className="stats-grid"
      style={{
        gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))"
      }}
    >
      {projects.map((project) => (
        <ProjectCard
          key={project._id || project.id}
          project={project}
        />
      ))}
    </div>
  ) : (
    <div className="card empty">
      No projects yet. Create your first project.
    </div>
  );
}
