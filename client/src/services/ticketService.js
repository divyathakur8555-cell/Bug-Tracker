
import { api } from "./api";

export const getTickets = async (projectId) => {
  const query = projectId
    ? `?project=${encodeURIComponent(projectId)}`
    : "";

  return await api(`/tickets${query}`);
};

export const createTicket = async (data) => {
  return await api("/tickets", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateTicket = async (id, data) => {
  return await api(`/tickets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteTicket = async (id) => {
  return await api(`/tickets/${id}`, {
    method: "DELETE",
  });
};
