
import { api } from "./api";

export const getProjects = async () => {
  return await api("/projects");
};

export const getProject = async (id) => {
  return await api(`/projects/${id}`);
};

export const createProject = async (data) => {
  return await api("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateProject = async (id, data) => {
  return await api(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteProject = async (id) => {
  return await api(`/projects/${id}`, {
    method: "DELETE",
  });
};
