import Link from "next/link";
import { stripe } from "@/lib/stripe";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export default async function PaymentSuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  let ok = false;
  let message = "Payment could not be verified.";

  try {
    if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status === "paid") {
        const res = await fetch(`${API}/api/payments/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: session.metadata.bookingId,
            sessionId: session.id,
            amount: session.amount_total / 100,
          }),
        });
        ok = res.ok;
        if (!ok) message = "Payment received, but we could not update your booking.";
      }
    }
  } catch (err) {
    console.error(err.message);
  }

  return (
    <section className="bg-[#faf8f4] py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-[#e6e1d6] bg-white p-8 text-center shadow-sm">
        {ok ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
              ✓
            </div>
            <h1 className="mt-5 text-2xl font-bold text-[#0f2a47]">Payment successful</h1>
            <p className="mt-2 text-sm text-slate-500">
              Your booking is now waiting for the owners approval.
            </p>
            <Link
              href="/dashboard/tenant/bookings"
              className="mt-6 inline-block rounded-lg bg-[#0f2a47] px-6 py-3 text-sm font-semibold text-white hover:bg-[#091b30]"
            >
              View My Bookings
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-[#0f2a47]">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-500">{message}</p>
            <Link
              href="/properties"
              className="mt-6 inline-block rounded-lg bg-[#0f2a47] px-6 py-3 text-sm font-semibold text-white hover:bg-[#091b30]"
            >
              Back to properties
            </Link>
          </>
        )}
      </div>
    </section>
  );
}