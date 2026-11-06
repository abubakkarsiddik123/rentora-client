"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const defaultRoute = {
  tenant: "/dashboard/tenant/bookings",
  owner: "/dashboard/owner",
  admin: "/dashboard/admin/users",
};

export default function DashboardIndex() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending || !session?.user) return;
    router.replace(defaultRoute[session.user.role || "tenant"]);
  }, [isPending, session, router]);

  return null;
}