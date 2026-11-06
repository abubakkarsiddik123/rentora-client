"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageHeader from "@/components/dashboard/PageHeader";
import { getAllBookings } from "@/lib/api/admin/admin-lists";

const statusStyle = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const tabs = ["all", "pending", "approved", "rejected"];

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export default function AllBookingsPage() {
  const [bookings, setBookings] = useState(null); // null মানে এখনও লোড হয়নি
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let ignore = false;
    getAllBookings()
      .then((data) => {
        if (!ignore) setBookings(data);
      })
      .catch((err) => {
        toast.error(err.message);
        if (!ignore) setBookings([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const loading = bookings === null;
  const all = bookings ?? [];
  const count = (t) =>
    t === "all" ? all.length : all.filter((b) => b.status === t).length;

  const q = search.trim().toLowerCase();
  const list = all.filter((b) => {
    if (tab !== "all" && b.status !== tab) return false;
    if (!q) return true;
    return [
      b.propertyTitle,
      b.tenantName,
      b.tenantEmail,
      b.ownerName,
      b.ownerEmail,
    ]
      .filter(Boolean)
      .some((v) => v.toLowerCase().includes(q));
  });

  return (
    <div>
      <PageHeader
        title="All Bookings"
        subtitle="Every booking made on the platform."
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
        placeholder="Search by property, tenant or owner..."
        className="mb-6 w-full rounded-lg border border-[#e6e1d6] bg-white px-4 py-3 text-sm text-[#0b1220] placeholder:text-slate-400 focus:border-[#0f2a47] focus:outline-none focus:ring-2 focus:ring-[#0f2a47]/20 sm:max-w-md"
      />

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-[#e6e1d6] bg-white p-10 text-center">
          <p className="text-sm text-slate-500">No bookings found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#e6e1d6] bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-[#e6e1d6] bg-[#faf8f4] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Property</th>
                <th className="px-4 py-3 font-semibold">Tenant</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Move-in</th>
                <th className="px-4 py-3 font-semibold">Fee</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Booked on</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e1d6]">
              {list.map((b) => (
                <tr key={b._id} className="align-top">
                  <td className="max-w-[220px] px-4 py-3 font-semibold text-[#0b1220]">
                    <span className="line-clamp-2">{b.propertyTitle}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700">{b.tenantName}</p>
                    <p className="text-xs text-slate-500">{b.tenantEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700">{b.ownerName}</p>
                    <p className="text-xs text-slate-500">{b.ownerEmail}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {b.moveInDate}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#0f2a47]">
                    ৳{Number(b.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${
                        statusStyle[b.status] || "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${
                        b.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {formatDate(b.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
