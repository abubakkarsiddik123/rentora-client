import { request } from "@/lib/api/client";

export const getUsers = () => request("/api/users");

export const updateUserRole = (id, role) =>
  request(`/api/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });