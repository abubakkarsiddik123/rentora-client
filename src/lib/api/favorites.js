import { request } from "@/lib/api/client";


export async function getFavorite(_userId, propertyId) {
  const data = await request(
    `/api/favorites?propertyId=${encodeURIComponent(propertyId)}`,
  );
  return data[0] || null;
}

export const getMyFavorites = () => request("/api/favorites");

export const addFavorite = ({ propertyId }) =>
  request("/api/favorites", {
    method: "POST",
    body: JSON.stringify({ propertyId }),
  });

export const removeFavorite = (id) =>
  request(`/api/favorites/${id}`, {
    method: "DELETE",
  });