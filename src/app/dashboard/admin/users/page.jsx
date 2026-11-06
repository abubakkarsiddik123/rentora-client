"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import PageHeader from "@/components/dashboard/PageHeader";
import { getUsers, updateUserRole } from "@/lib/api/admin/admin-users";

const roleStyle = {
  tenant: "bg-slate-200 text-slate-600",
  owner: "bg-amber-100 text-amber-700",
  admin: "bg-[#0f2a47] text-white",
};

const roles = ["tenant", "owner", "admin"];
const tabs = ["all", ...roles];

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export default function ManageUsersPage() {
  const { data: session } = authClient.useSession();
  const myId = session?.user?.id;

  const [users, setUsers] = useState(null); // null মানে এখনও লোড হয়নি
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let ignore = false;
    getUsers()
      .then((data) => {
        if (!ignore) setUsers(data);
      })
      .catch((err) => {
        toast.error(err.message);
        if (!ignore) setUsers([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const loading = users === null;
  const all = users ?? [];
  const roleOf = (u) => u.role || "tenant";
  const count = (t) =>
    t === "all" ? all.length : all.filter((u) => roleOf(u) === t).length;

  const q = search.trim().toLowerCase();
  const list = all.filter((u) => {
    if (tab !== "all" && roleOf(u) !== tab) return false;
    if (!q) return true;
    return [u.name, u.email]
      .filter(Boolean)
      .some((v) => v.toLowerCase().includes(q));
  });

  const changeRole = async (u, role) => {
    if (role === roleOf(u)) return;
    if (
      role === "admin" &&
      !window.confirm(`Make ${u.name} an admin? They will get full access.`)
    ) {
      return;
    }

    setBusyId(u._id);
    try {
      await updateUserRole(u._id, role);
      setUsers((prev) =>
        prev.map((x) => (x._id === u._id ? { ...x, role } : x)),
      );
      toast.success(`${u.name} is now ${role}.`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Manage Users"
        subtitle="See all users and change their roles."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
              tab === t
                ? "bg-[#0f2a47] text-white"
                : "border border-[#e6e1d6] bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t} {!loading && <span className="opacity-70">({count(t)})</span>}
          </button>
        ))}
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="mb-6 w-full rounded-lg border border-[#e6e1d6] bg-white px-4 py-3 text-sm text-[#0b1220] placeholder:text-slate-400 focus:border-[#0f2a47] focus:outline-none focus:ring-2 focus:ring-[#0f2a47]/20 sm:max-w-md"
      />

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-[#e6e1d6] bg-white p-10 text-center">
          <p className="text-sm text-slate-500">No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#e6e1d6] bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[#e6e1d6] bg-[#faf8f4] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Change role</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e1d6]">
              {list.map((u) => {
                const isMe = String(u._id) === String(myId);
                return (
                  <tr key={u._id} className="align-middle">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0f2a47]/10 text-xs font-bold text-[#0f2a47]">
                          {u.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={u.image}
                              alt={u.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            (u.name || "U").slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <span className="font-semibold text-[#0b1220]">
                          {u.name}
                          {isMe && (
                            <span className="ml-2 text-xs font-normal text-slate-400">
                              (you)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${
                          roleStyle[roleOf(u)] || "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {roleOf(u)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={roleOf(u)}
                        disabled={isMe || busyId === u._id}
                        onChange={(e) => changeRole(u, e.target.value)}
                        title={isMe ? "You cannot change your own role" : ""}
                        className="rounded-lg border border-[#e6e1d6] bg-white px-3 py-2 text-sm capitalize text-[#0b1220] focus:border-[#0f2a47] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatDate(u.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
