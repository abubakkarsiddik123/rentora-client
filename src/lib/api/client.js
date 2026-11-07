import { authClient } from "@/lib/auth-client";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

async function getToken() {
  try {
    const { data } = await authClient.token();
    return data?.token || null;
  } catch {
    return null;
  }
}

export async function request(path, options = {}) {
  const token = await getToken();

  const res = await fetch(`${BASE}${path}`, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let body = null;
  try {
    body = await res.json();
  } catch {}

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Your session has expired. Please sign in again.");
    }
    throw new Error(body?.message || `Request failed (${res.status})`);
  }
  return body;
}
