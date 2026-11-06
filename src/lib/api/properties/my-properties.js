const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // খালি রেসপন্স হলে কিছু করার নেই
  }

  if (!res.ok) {
    throw new Error(body?.message || `Request failed (${res.status})`);
  }
  return body;
}

// My Properties লিস্ট: শুধু ওই owner-এর প্রপার্টি (GET)
export const getMyProperties = (ownerId) =>
  request(`/api/properties?ownerId=${encodeURIComponent(ownerId)}`);

// Edit পেজ: একটা প্রপার্টি আনা (GET)
export const getPropertyById = (id) => request(`/api/properties/${id}`);

// Edit পেজ: সেভ করা (PATCH), ownerId দিয়ে সার্ভার মালিক চেক করে
export const updateProperty = (id, ownerId, data) =>
  request(`/api/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ ...data, ownerId }),
  });

// লিস্ট পেজ: ডিলিট (DELETE), ownerId দিয়ে সার্ভার মালিক চেক করে
export const deleteProperty = (id, ownerId) =>
  request(`/api/properties/${id}?ownerId=${encodeURIComponent(ownerId)}`, {
    method: "DELETE",
  });