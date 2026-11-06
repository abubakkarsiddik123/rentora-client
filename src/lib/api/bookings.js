const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export async function createBooking(data) {
  const res = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Failed to create booking");
  return json; // { insertedId }
}

export async function getBookingById(id) {
  const res = await fetch(`${BASE_URL}/api/bookings/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getMyBookings(tenantId) {
  const res = await fetch(`${BASE_URL}/api/bookings?tenantId=${tenantId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}