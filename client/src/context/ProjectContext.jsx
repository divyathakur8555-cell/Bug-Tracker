
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
      const data = await getProjects();
      const list = Array.isArray(data)
        ? data
        : data.projects || data.data || [];

      setProjects(list);
      return list;
    } catch (error) {
      console.error("FETCH PROJECTS ERROR:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshProjects().catch(console.error);
    } else {
      setProjects([]);
    }
  }, [user]);

  const addProject = async (formData) => {
    try {
      const result = await createProject(formData);
      await refreshProjects();
      return result;
    } catch (error) {
      console.error("CREATE PROJECT ERROR:", error);
      throw error;
    }
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
