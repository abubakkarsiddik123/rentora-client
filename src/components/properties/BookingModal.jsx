"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createBooking } from "@/lib/api/bookings";

const inputClass =
  "w-full rounded-lg border border-[#e6e1d6] bg-white px-4 py-3 text-sm text-[#0b1220] placeholder:text-slate-400 focus:border-[#0f2a47] focus:outline-none focus:ring-2 focus:ring-[#0f2a47]/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

export default function BookingModal({ property, user, onClose }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);

    setSaving(true);
    try {
      const result = await createBooking({
        propertyId: property._id,
        tenantId: user.id,
        tenantName: user.name,
        tenantEmail: user.email,
        moveInDate: f.get("moveInDate"),
        phone: f.get("phone")?.trim(),
        notes: f.get("notes")?.trim(),
      });
      toast.success("Booking created. Proceed to payment.");
      router.push(`/payment/${result.insertedId}`);
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0f2a47]">Book Property</h2>
            <p className="mt-1 text-sm text-slate-500">{property.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-slate-400 hover:text-slate-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          {/* User info (read-only) */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Name</label>
              <input
                value={user.name || ""}
                disabled
                className={`${inputClass} bg-slate-50 text-slate-500`}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                value={user.email || ""}
                disabled
                className={`${inputClass} bg-slate-50 text-slate-500`}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="moveInDate" className={labelClass}>
                Move-in date
              </label>
              <input
                id="moveInDate"
                name="moveInDate"
                type="date"
                min={today}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>
                Contact number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                pattern="[0-9+\-\s]{7,15}"
                title="Enter a valid phone number"
                placeholder="01XXXXXXXXX"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className={labelClass}>
              Additional notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Anything the owner should know..."
              className={inputClass}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-[#faf8f4] px-4 py-3">
            <span className="text-sm text-slate-600">Amount to pay</span>
            <span className="text-lg font-extrabold text-[#b8893a]">
              ৳{Number(property.price).toLocaleString()}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-[#0f2a47] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#091b30] disabled:opacity-60"
            >
              {saving ? "Please wait..." : "Confirm & Pay"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#e6e1d6] px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}