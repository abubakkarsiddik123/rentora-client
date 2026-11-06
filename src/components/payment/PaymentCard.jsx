"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function PaymentCard({ booking }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.replace(`/auth/signin?redirect=${encodeURIComponent(pathname)}`);
    } else if (booking.tenantId !== user.id) {
      router.replace("/dashboard");
    }
  }, [isPending, user, booking.tenantId, pathname, router]);

  if (isPending || !user || booking.tenantId !== user.id) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e6e1d6] border-t-[#0f2a47]" />
      </div>
    );
  }

  const paid = booking.paymentStatus === "paid";

  return (
    <section className="bg-[#faf8f4] py-12">
      <div className="mx-auto max-w-lg px-4">
        <div className="rounded-2xl border border-[#e6e1d6] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-[#0f2a47]">Complete Payment</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review your booking and pay securely with Stripe.
          </p>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Property</dt>
              <dd className="text-right font-semibold text-[#0f2a47]">{booking.propertyTitle}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Move-in date</dt>
              <dd className="font-semibold text-[#0f2a47]">{booking.moveInDate}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Contact</dt>
              <dd className="font-semibold text-[#0f2a47]">{booking.phone}</dd>
            </div>
            <div className="flex justify-between border-t border-[#e6e1d6] pt-3">
              <dt className="text-slate-500">Amount</dt>
              <dd className="text-lg font-extrabold text-[#b8893a]">
                ৳{Number(booking.amount).toLocaleString()}
              </dd>
            </div>
          </dl>

          {paid ? (
            <p className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              This booking is already paid.
            </p>
          ) : (
            <form action="/api/checkout_sessions" method="POST">
              <input type="hidden" name="bookingId" value={booking._id} />
              <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-[#0f2a47] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#091b30]"
              >
                Pay with Stripe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}