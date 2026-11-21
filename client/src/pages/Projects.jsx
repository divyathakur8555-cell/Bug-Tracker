import { useState } from "react";
import { useProjects } from "../context/ProjectContext";
import ProjectList from "../components/projects/ProjectList";
import ProjectForm from "../components/projects/ProjectForm";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import { Plus, FolderKanban, Sparkles } from "lucide-react";

export default function Projects() {
  const { projects, loading, addProject } = useProjects();
  const [open, setOpen] = useState(false);

  if (loading) return <Loader />;

  return (
    <div className="projects-page">
      <div className="projects-welcome">
        <div>
          <div className="welcome-label">
            <Sparkles size={15} />
            YOUR WORKSPACE
          </div>
          <h1>Projects</h1>
          <p>
            Organize your work, manage progress, and bring
            your ideas to life.
          </p>
        </div>

        <button
          className="projects-create-btn"
          onClick={() => setOpen(true)}
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="projects-overview">
        <div className="projects-overview-icon">
          <FolderKanban size={22} />
        </div>
        <div>
          <span>Total Projects</span>
          <strong>{projects.length}</strong>
        </div>
      </div>

      <div className="projects-section-heading">
        <div>
          <h2>All Projects</h2>
          <p>Your projects in one place</p>
        </div>
      </div>

      <ProjectList projects={projects} />

      {open && (
        <Modal
          title="Create a New Project"
          onClose={() => setOpen(false)}
        >
          <ProjectForm
            onSubmit={async (form) => {
              await addProject(form);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}