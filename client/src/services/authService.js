
import { api } from "./api";

export const loginUser = async (data) => {
  return await api("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const registerUser = async (data) => {
  return await api("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getCurrentUser = async () => {
  return await api("/auth/me");
};
