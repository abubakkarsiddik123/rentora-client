const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
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

// Add Property পেজ ব্যবহার করে (POST)
export const createProperty = (data) =>
  request("/api/properties", {
    method: "POST",
    body: JSON.stringify(data),
  });

