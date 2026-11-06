"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getMyBookings } from "@/lib/api/bookings";
import PageHeader from "@/components/dashboard/PageHeader";

const statusStyle = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const paymentStyle = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-slate-200 text-slate-600",
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function TenantBookingsPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getMyBookings(userId)
      .then(setBookings)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div>
      <PageHeader
        title="My Bookings"
        subtitle="All the properties you have booked."
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e6e1d6] border-t-[#0f2a47]" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e6e1d6] bg-white py-16 text-center">
          <p className="text-slate-500">You have no bookings yet.</p>
          <Link
            href="/properties"
            className="mt-4 inline-block rounded-lg bg-[#0f2a47] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#091b30]"
          >
            Browse properties
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#e6e1d6] bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-[#e6e1d6] bg-[#faf8f4] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Property</th>
                <th className="px-5 py-3">Booking date</th>
                <th className="px-5 py-3">Amount paid</th>
                <th className="px-5 py-3">Booking status</th>
                <th className="px-5 py-3">Payment status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e1d6]">
              {bookings.map((b) => {
                const paid = b.paymentStatus === "paid";
                return (
                  <tr key={b._id}>
                    <td className="px-5 py-4 font-semibold text-[#0f2a47]">
                      <Link
                        href={`/properties/${b.propertyId}`}
                        className="hover:underline"
                      >
                        {b.propertyTitle}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(b.createdAt)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#b8893a]">
                      ৳{paid ? Number(b.amount).toLocaleString() : 0}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          statusStyle[b.status] || "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          paymentStyle[b.paymentStatus] ||
                          "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {!paid && b.status !== "rejected" ? (
                        <Link
                          href={`/payment/${b._id}`}
                          className="rounded-lg bg-[#0f2a47] px-4 py-2 text-xs font-semibold text-white hover:bg-[#091b30]"
                        >
                          Pay Now
                        </Link>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
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
