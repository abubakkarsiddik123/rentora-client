import { request } from "@/lib/api/client";

export const getMyProperties = () => request("/api/my/properties");

export const getPropertyById = (id) => request(`/api/my/properties/${id}`);

export const updateProperty = (id, _ownerId, data) =>
  request(`/api/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteProperty = (id) =>
  request(`/api/properties/${id}`, {
    method: "DELETE",
  });