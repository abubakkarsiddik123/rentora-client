import { request } from "@/lib/api/client";

export const createBooking = (data) =>
  request("/api/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });

export async function getBookingById(id) {
  try {
    return await request(`/api/bookings/${id}`);
  } catch {
    return null;
  }
}

export const getMyBookings = () => request("/api/bookings");