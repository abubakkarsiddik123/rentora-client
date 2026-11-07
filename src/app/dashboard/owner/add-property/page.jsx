// lib/api/properties/add-properties.js

import { authClient } from "@/lib/auth-client";

const BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

async function request(path, options = {}, requiresAuth = false) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (requiresAuth) {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication failed. Please login again.");
    }

    headers.Authorization = `Bearer ${data.token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body?.message || `Request failed (${res.status})`);
  }

  return body;
}

// Protected API: Add Property
export const createProperty = (data) =>
  request(
    "/api/properties",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true
  );