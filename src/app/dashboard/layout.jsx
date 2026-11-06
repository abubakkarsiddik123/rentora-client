"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const defaultRoute = {
  tenant: "/dashboard/tenant/bookings",
  owner: "/dashboard/owner",
  admin: "/dashboard/admin/users",
};

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user?.role || "tenant";

  // /dashboard/<tenant|owner|admin>/... এর দ্বিতীয় অংশ
  const section = pathname.split("/")[2];
  const isRoleSection = ["tenant", "owner", "admin"].includes(section);
  const forbidden = isRoleSection && section !== role;

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.replace(`/auth/signin?redirect=${encodeURIComponent(pathname)}`);
    } else if (forbidden) {
      router.replace(defaultRoute[role]);
    }
  }, [isPending, user, forbidden, role, pathname, router]);

  if (isPending || !user || forbidden) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e6e1d6] border-t-[#0f2a47]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <DashboardSidebar user={user} role={role} />
      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
};

export default DashboardLayout;
