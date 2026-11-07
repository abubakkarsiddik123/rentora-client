import { request } from "@/lib/api/client";

export const getPropertyReviews = (propertyId) =>
  request(`/api/reviews/${propertyId}`);
export const getLatestReviews = () => request("/api/reviews");

export const addReview = (data) =>
  request("/api/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });