const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

// একটা প্রপার্টি এই ইউজারের ফেভারিটে আছে কিনা (থাকলে ডকুমেন্ট, না থাকলে null)
export async function getFavorite(userId, propertyId) {
  const res = await fetch(
    `${BASE_URL}/api/favorites?userId=${userId}&propertyId=${propertyId}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Failed to check favorite");
  const data = await res.json();
  return data[0] || null;
}

export async function getMyFavorites(userId) {
  const res = await fetch(`${BASE_URL}/api/favorites?userId=${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch favorites");
  return res.json();
}

export async function addFavorite(data) {
  const res = await fetch(`${BASE_URL}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Failed to add favorite");
  return json;
}

export async function removeFavorite(id, userId) {
  const res = await fetch(`${BASE_URL}/api/favorites/${id}?userId=${userId}`, {
    method: "DELETE",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Failed to remove favorite");
  return json;
}
