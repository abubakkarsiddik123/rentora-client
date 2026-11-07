import { request } from "@/lib/api/client";

export const getAllPropertiesForAdmin = () => request("/api/my/properties");

export const updatePropertyStatus = (id, status, rejectionReason = "") =>
  request(`/api/properties/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, rejectionReason }),
  });
