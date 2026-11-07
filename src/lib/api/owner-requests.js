import { request } from "@/lib/api/client";

// Tenant: Apply for owner
export const applyForOwner = (data) =>
  request("/api/owner-requests", {
    method: "POST",
    body: JSON.stringify(data),
  });

// Tenant: Get own application
export const getMyOwnerRequest = () =>
  request("/api/owner-requests/mine");

// Admin: Get all applications
export const getOwnerRequests = () =>
  request("/api/owner-requests");

// Admin: Approve or reject application
export const reviewOwnerRequest = (id, status, rejectionReason = "") =>
  request(`/api/owner-requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
      rejectionReason,
    }),
  });