import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getServerToken() {
  const res = await auth.api.getToken({ headers: await headers() });
  return res?.token || null;
}