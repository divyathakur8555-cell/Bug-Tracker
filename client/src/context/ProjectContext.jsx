
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  createProject,
  getProjects,
  deleteProject as deleteProjectRequest
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
      const data = await getProjects();
      setProjects(data.projects || data.data || data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProjects().catch(() => {});
  }, [user]);

  const addProject = async (form) => {
    const data = await createProject(form);
    await refreshProjects();
    return data;
  };

  const deleteProject = async (id) => {
    await deleteProjectRequest(id);
    await refreshProjects();
  };

  return (
    <C.Provider
      value={{
        projects,
        loading,
        refreshProjects,
        addProject,
        deleteProject
      }}
    >
      {children}
    </C.Provider>
  );
}
