const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export async function getFeaturedProperties() {
  const res = await fetch(`${BASE_URL}/api/properties/featured`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load featured properties (${res.status})`);
  }

  return res.json();
}

export async function getProperties(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v != null),
  ).toString();
  const res = await fetch(`${BASE_URL}/api/properties?${qs}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json(); // { items, total, page, limit, totalPages }
}

export async function getPropertyById(id) {
  const res = await fetch(`${BASE_URL}/api/properties/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}
