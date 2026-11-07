"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Calendar,
  ChartColumn,
  CircleDollar,
  House,
  LayoutSideContentLeft,
  Person,
  Plus,
  Persons,
  FileText,
} from "@gravity-ui/icons";
import { Avatar, Button, Drawer } from "@heroui/react";

const navByRole = {
  tenant: [
    {
      icon: Calendar,
      href: "/dashboard/tenant/bookings",
      label: "My Bookings",
    },
    {
      icon: Bookmark,
      href: "/dashboard/tenant/favorites",
      label: "Favorites",
    },
    {
      icon: FileText,
      href: "/dashboard/tenant/become-owner",
      label: "Become an Owner",
    },
    {
      icon: Person,
      href: "/dashboard/profile",
      label: "Profile",
    },
  ],
  owner: [
    { icon: ChartColumn, href: "/dashboard/owner", label: "Analytics" },
    {
      icon: Plus,
      href: "/dashboard/owner/add-property",
      label: "Add Property",
    },
    {
      icon: House,
      href: "/dashboard/owner/my-properties",
      label: "My Properties",
    },
    {
      icon: FileText,
      href: "/dashboard/owner/booking-requests",
      label: "Booking Requests",
    },
    { icon: Person, href: "/dashboard/profile", label: "Profile" },
  ],
  admin: [
    { icon: Persons, href: "/dashboard/admin/users", label: "Manage Users" },
    {
      icon: House,
      href: "/dashboard/admin/properties",
      label: "Manage Properties",
    },
    {
      icon: Calendar,
      href: "/dashboard/admin/bookings",
      label: "All Bookings",
    },
    {
      icon: CircleDollar,
      href: "/dashboard/admin/transactions",
      label: "Transactions",
    },
    {
      icon: FileText,
      href: "/dashboard/admin/owner-requests",
      label: "Owner Requests",
    },
    { icon: Person, href: "/dashboard/profile", label: "Profile" },
  ],
};

export default function DashboardSidebar({ user, role = "tenant" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = navByRole[role] || [];
  const initials = user?.name?.slice(0, 2).toUpperCase() || "U";

  const profileBox = (
    <div className="mb-5 flex items-center gap-3 border-b border-default pb-5">
      <Avatar size="md">
        <Avatar.Image alt={user?.name} src={user?.image || ""} />
        <Avatar.Fallback>{initials}</Avatar.Fallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {user?.name}
        </p>
        <span className="mt-0.5 inline-block rounded-full bg-[#b8893a]/15 px-2 py-0.5 text-[11px] font-semibold capitalize text-[#b8893a]">
          {role}
        </span>
      </div>
    </div>
  );

  const navContent = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              active
                ? "bg-[#0f2a47] font-semibold text-white"
                : "text-foreground hover:bg-default"
            }`}
          >
            <item.icon
              className={`size-5 ${active ? "text-white" : "text-muted"}`}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
        {profileBox}
        {navContent}
      </aside>

      {/* Mobile */}
      <div className="border-b border-default p-3 lg:hidden">
        <Drawer isOpen={open} onOpenChange={setOpen}>
          <Button variant="secondary" onPress={() => setOpen(true)}>
            <LayoutSideContentLeft />
            Menu
          </Button>
          <Drawer.Backdrop>
            <Drawer.Content placement="left">
              <Drawer.Dialog>
                <Drawer.CloseTrigger />
                <Drawer.Header>
                  <Drawer.Heading>Navigation</Drawer.Heading>
                </Drawer.Header>
                <Drawer.Body>
                  {profileBox}
                  {navContent}
                </Drawer.Body>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </div>
    </>
  );
}
