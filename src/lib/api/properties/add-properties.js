import { request } from "@/lib/api/client";

export const createProperty = (data) =>
  request("/api/properties", {
    method: "POST",
    body: JSON.stringify(data),
  });