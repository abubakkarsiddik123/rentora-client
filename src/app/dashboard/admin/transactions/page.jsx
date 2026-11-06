"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageHeader from "@/components/dashboard/PageHeader";
import { getAllTransactions } from "@/lib/api/admin/admin-lists";

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(null); // null মানে এখনও লোড হয়নি
  const [search, setSearch] = useState("");

  useEffect(() => {
    let ignore = false;
    getAllTransactions()
      .then((data) => {
        if (!ignore) setTransactions(data);
      })
      .catch((err) => {
        toast.error(err.message);
        if (!ignore) setTransactions([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const loading = transactions === null;
  const all = transactions ?? [];
  const total = all.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const q = search.trim().toLowerCase();
  const list = all.filter((t) => {
    if (!q) return true;
    return [t.transactionId, t.propertyTitle, t.tenantName, t.ownerName]
      .filter(Boolean)
      .some((v) => v.toLowerCase().includes(q));
  });

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="All booking payments received on the platform."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#e6e1d6] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total revenue
          </p>
          <p className="mt-2 text-2xl font-extrabold text-[#b8893a]">
            ৳{total.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-[#e6e1d6] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total transactions
          </p>
          <p className="mt-2 text-2xl font-extrabold text-[#0f2a47]">
            {loading ? "-" : all.length}
          </p>
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by transaction ID, property, tenant or owner..."
        className="mb-6 w-full rounded-lg border border-[#e6e1d6] bg-white px-4 py-3 text-sm text-[#0b1220] placeholder:text-slate-400 focus:border-[#0f2a47] focus:outline-none focus:ring-2 focus:ring-[#0f2a47]/20 sm:max-w-md"
      />

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-[#e6e1d6] bg-white p-10 text-center">
          <p className="text-sm text-slate-500">No transactions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#e6e1d6] bg-white shadow-sm">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-[#e6e1d6] bg-[#faf8f4] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Transaction ID</th>
                <th className="px-4 py-3 font-semibold">Property</th>
                <th className="px-4 py-3 font-semibold">Tenant</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e1d6]">
              {list.map((t) => (
                <tr key={t._id} className="align-top">
                  <td
                    className="max-w-[160px] truncate px-4 py-3 font-mono text-xs text-slate-500"
                    title={t.transactionId}
                  >
                    {t.transactionId}
                  </td>
                  <td className="max-w-[220px] px-4 py-3 font-semibold text-[#0b1220]">
                    <span className="line-clamp-2">{t.propertyTitle}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{t.tenantName}</td>
                  <td className="px-4 py-3 text-slate-700">{t.ownerName}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#0f2a47]">
                    ৳{Number(t.amount).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {formatDate(t.createdAt)}
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
