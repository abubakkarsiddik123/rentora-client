const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(body?.message || `Request failed (${res.status})`);
  }
  return body;
}

const statuses = ["pending", "approved", "rejected", "booked"];


export const getAllPropertiesForAdmin = async () => {
  const results = await Promise.all(
    statuses.map((s) => request(`/api/properties?status=${s}&limit=50`)),
  );
  return results
    .flatMap((r) => r.items)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const updatePropertyStatus = (id, status, rejectionReason = "") =>
  request(`/api/properties/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, rejectionReason }),
  });