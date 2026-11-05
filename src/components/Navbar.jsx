"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

const links = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "All Properties" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
//   console.log(user,"navbar user");

  const initials = user?.name?.slice(0, 2).toUpperCase() || "U";
  const profileImage =
    user?.image?.startsWith("https://") || user?.image?.startsWith("http://")
      ? user.image
      : null;
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await authClient.signOut();
    closeMenu();
    router.push("/");
    router.refresh();
  };

  const linkClass = (href) =>
    `text-sm font-medium transition-colors ${
      pathname === href || (href !== "/" && pathname.startsWith(href))
        ? "text-[#0f2a47] font-semibold"
        : "text-slate-600 hover:text-[#0f2a47]"
    }`;

  const btnOutline =
    "inline-flex items-center justify-center rounded-lg border border-[#0f2a47] px-4 py-2 text-sm font-semibold text-[#0f2a47] transition-colors hover:bg-[#0f2a47]/5";
  const btnPrimary =
    "inline-flex items-center justify-center rounded-lg bg-[#0f2a47] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#091b30]";

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#e6e1d6] bg-[#faf8f4]/80 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: brand */}
        <Link
          href="/"
          onClick={closeMenu}
          className="text-2xl font-extrabold tracking-tight text-[#0f2a47]"
          aria-label="Rentora home"
        >
          Rent<span className="text-[#b8893a]">ora</span>
        </Link>

        {/* Center: desktop links */}
        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={linkClass(l.href)}>
                {l.label}
              </Link>
            </li>
          ))}
          {/* Dashboard: লগইন থাকলে দেখাবে (কাজ পরে) */}
          {user && (
            <li>
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        {/* Right: auth (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? null : user ? (
            <>
              <Avatar size="sm">
                {profileImage && (
                  <Avatar.Image alt={user.name} src={profileImage} />
                )}
                <Avatar.Fallback>{initials}</Avatar.Fallback>
              </Avatar>
              <Button
                variant="outline"
                className="border-[#0f2a47] text-[#0f2a47]"
                onPress={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className={btnOutline}>
                Login
              </Link>
              <Link href="/auth/signup" className={btnPrimary}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Right: menu toggle (mobile) */}
        <button
          className="md:hidden text-[#0f2a47]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Menu</span>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-[#e6e1d6] bg-[#faf8f4] md:hidden">
          <ul className="flex flex-col gap-2 p-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={closeMenu}
                  className={`block py-2 ${linkClass(l.href)}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}

            {user ? (
              <>
                <li>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className={`block py-2 ${linkClass("/dashboard")}`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full border-[#0f2a47] text-[#0f2a47]"
                    onPress={handleLogout}
                  >
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <li className="flex gap-3 pt-2">
                <Link
                  href="/auth/signin"
                  onClick={closeMenu}
                  className={`${btnOutline} flex-1`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={closeMenu}
                  className={`${btnPrimary} flex-1`}
                >
                  Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
