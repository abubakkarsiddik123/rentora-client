const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export async function getFeaturedProperties() {
  const res = await fetch(`${BASE_URL}/api/properties/featured`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to load featured properties (${res.status})`);
  }

  return res.json();
}