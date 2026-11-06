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

export const getMyProperties = async (ownerId) => {
  const data = await request(
    `/api/properties?ownerId=${encodeURIComponent(ownerId)}&limit=50`,
  );
  return data.items;
};

export const getPropertyById = (id) => request(`/api/properties/${id}`);

export const updateProperty = (id, ownerId, data) =>
  request(`/api/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ ...data, ownerId }),
  });

export const deleteProperty = (id, ownerId) =>
  request(`/api/properties/${id}?ownerId=${encodeURIComponent(ownerId)}`, {
    method: "DELETE",
  });
