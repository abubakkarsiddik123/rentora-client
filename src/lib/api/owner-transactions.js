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

export const getOwnerTransactions = (ownerId) =>
  request(`/api/transactions?ownerId=${encodeURIComponent(ownerId)}`);
