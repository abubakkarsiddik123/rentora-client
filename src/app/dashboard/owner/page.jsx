"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { authClient } from "@/lib/auth-client";
import PageHeader from "@/components/dashboard/PageHeader";
import { getMyProperties } from "@/lib/api/properties/my-properties";
import { getOwnerBookings } from "@/lib/api/bookings/owner-bookings";
import { getOwnerTransactions } from "@/lib/api/owner-transactions";

const propertyColors = {
  approved: "#16a34a",
  pending: "#d97706",
  rejected: "#dc2626",
  booked: "#64748b",
};

const bookingColors = {
  pending: "#d97706",
  approved: "#16a34a",
  rejected: "#dc2626",
};

const statusStyle = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const countBy = (items, key, values) =>
  values.map((v) => ({
    name: v,
    value: items.filter((i) => i[key] === v).length,
  }));

// শেষ ৬ মাসের আয় (শূন্য মাসও দেখায়)
const monthlyEarnings = (transactions) => {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: d.toLocaleString("en-GB", { month: "short" }),
      earnings: 0,
    });
  }
  transactions.forEach((t) => {
    const d = new Date(t.createdAt);
    const m = months.find(
      (x) => x.key === `${d.getFullYear()}-${d.getMonth()}`,
    );
    if (m) m.earnings += Number(t.amount) || 0;
  });
  return months;
};

function StatCard({ label, value, hint, accent = "text-[#0f2a47]" }) {
  return (
    <div className="rounded-2xl border border-[#e6e1d6] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-extrabold ${accent}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default function OwnerAnalyticsPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [data, setData] = useState(null); // null মানে এখনও লোড হয়নি

  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;
    Promise.all([
      getMyProperties(user.id),
      getOwnerBookings(user.id),
      getOwnerTransactions(user.id),
    ])
      .then(([properties, bookings, transactions]) => {
        if (!ignore) setData({ properties, bookings, transactions });
      })
      .catch((err) => {
        toast.error(err.message);
        if (!ignore)
          setData({ properties: [], bookings: [], transactions: [] });
      });

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  const loading = isPending || (!!user?.id && data === null);

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Analytics"
          subtitle="An overview of your listings, bookings and earnings."
        />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  const { properties = [], bookings = [], transactions = [] } = data ?? {};

  const totalEarnings = transactions.reduce(
    (sum, t) => sum + (Number(t.amount) || 0),
    0,
  );
  const propertyStatus = countBy(properties, "status", [
    "approved",
    "pending",
    "rejected",
    "booked",
  ]);
  const bookingStatus = countBy(bookings, "status", [
    "pending",
    "approved",
    "rejected",
  ]);
  const earningsByMonth = monthlyEarnings(transactions);
  const recent = bookings.slice(0, 5);

  const pendingBookings = bookingStatus.find((b) => b.name === "pending").value;

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="An overview of your listings, bookings and earnings."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total properties" value={properties.length} />
        <StatCard
          label="Total bookings"
          value={bookings.length}
          hint={`${pendingBookings} pending`}
        />
        <StatCard label="Transactions" value={transactions.length} />
        <StatCard
          label="Total earnings"
          value={`৳${totalEarnings.toLocaleString()}`}
          hint="Booking fees received"
          accent="text-[#b8893a]"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#e6e1d6] bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#0f2a47]">
            Earnings, last 6 months
          </h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={60} />
                <Tooltip
                  formatter={(v) => [
                    `৳${Number(v).toLocaleString()}`,
                    "Earnings",
                  ]}
                />
                <Bar dataKey="earnings" fill="#b8893a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e6e1d6] bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#0f2a47]">
            Bookings by status
          </h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingStatus}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  className="capitalize"
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip />
                <Bar dataKey="value" name="Bookings" radius={[6, 6, 0, 0]}>
                  {bookingStatus.map((b) => (
                    <Cell key={b.name} fill={bookingColors[b.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#e6e1d6] bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#0f2a47]">
            Properties by status
          </h2>
          {properties.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">No properties yet.</p>
          ) : (
            <>
              <div className="mt-2 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyStatus.filter((p) => p.value > 0)}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={75}
                    >
                      {propertyStatus
                        .filter((p) => p.value > 0)
                        .map((p) => (
                          <Cell key={p.name} fill={propertyColors[p.name]} />
                        ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1 text-sm">
                {propertyStatus.map((p) => (
                  <li
                    key={p.name}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2 capitalize text-slate-600">
                      <span
                        className="inline-block size-2.5 rounded-full"
                        style={{ background: propertyColors[p.name] }}
                      />
                      {p.name}
                    </span>
                    <span className="font-semibold text-[#0f2a47]">
                      {p.value}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-[#e6e1d6] bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-[#0f2a47]">
            Recent bookings
          </h2>
          {recent.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">No bookings yet.</p>
          ) : (
            <div className="mt-3 divide-y divide-[#e6e1d6]">
              {recent.map((b) => (
                <div
                  key={b._id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0b1220]">
                      {b.propertyTitle}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {b.tenantName} · ৳{Number(b.amount).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${
                      statusStyle[b.status] || "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
