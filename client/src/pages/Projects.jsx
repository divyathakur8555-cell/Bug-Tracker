
import { useState } from "react";
import { useProjects } from "../context/ProjectContext";
import ProjectList from "../components/projects/ProjectList";
import ProjectForm from "../components/projects/ProjectForm";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";

export default function Projects() {
  const { projects, loading, addProject } = useProjects();
  const [open, setOpen] = useState(false);

  if (loading) return <Loader />;

  return (
    <div className="projects-page">
      <div className="projects-heading">
        <div>
          <span className="projects-eyebrow">WORKSPACE MANAGEMENT</span>
          <h1>Projects</h1>
          <p>Manage and organize all your workspace projects.</p>
        </div>

        <button className="projects-add-btn" onClick={() => setOpen(true)}>
          + Add Project
        </button>
      </div>

      <div className="projects-total-card">
        <div className="projects-total-icon">▦</div>
        <div>
          <span>Total Projects</span>
          <strong>{projects.length}</strong>
        </div>
      </div>

      <div className="projects-list-heading">
        <div>
          <h2>Your Projects</h2>
          <p>All projects created in your workspace.</p>
        </div>
        <strong>{projects.length} projects</strong>
      </div>

      <ProjectList projects={projects} />

      {open && (
        <Modal title="Create project" onClose={() => setOpen(false)}>
          <ProjectForm
            onSubmit={async (formData) => {
              await addProject(formData);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
