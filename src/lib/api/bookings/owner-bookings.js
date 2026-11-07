import { request } from "@/lib/api/client";

export const getOwnerBookings = () => request("/api/bookings");

export const updateBookingStatus = (id, _ownerId, status) =>
  request(`/api/bookings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });