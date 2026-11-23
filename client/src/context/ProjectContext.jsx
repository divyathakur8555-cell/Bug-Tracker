
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  createProject,
  getProjects,
  deleteProject
} from "../services/projectService";

import { useAuthContext } from "./AuthContext";

const C = createContext(null);

export const useProjects = () => useContext(C);

export function ProjectProvider({ children }) {
  const { user } = useAuthContext();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshProjects = async () => {
    if (!user) {
      setProjects([]);
      return;
    }

    setLoading(true);

    try {
      const d = await getProjects();
      setProjects(d.projects || d.data || d || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProjects().catch(() => {});
  }, [user]);

  const addProject = async (formData) => {
    const d = await createProject(formData);
    await refreshProjects();
    return d;
  };

  const removeProject = async (id) => {
    await deleteProject(id);
    await refreshProjects();
  };

  return (
    <C.Provider
      value={{
        projects,
        loading,
        refreshProjects,
        addProject,
        removeProject
      }}
    >
      {children}
    </C.Provider>
  );
}
