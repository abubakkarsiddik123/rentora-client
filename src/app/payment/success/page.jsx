"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { request } from "@/lib/api/client";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [state, setState] = useState(sessionId ? "verifying" : "error");
  const [message, setMessage] = useState(
    sessionId ? "" : "Payment could not be verified.",
  );
  const started = useRef(false);

  useEffect(() => {
    if (!sessionId || started.current) return;
    started.current = true;

    request("/api/payments/confirm", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    })
      .then(() => setState("ok"))
      .catch((err) => {
        setMessage(err.message);
        setState("error");
      });
  }, [sessionId]);

  return (
    <section className="bg-[#faf8f4] py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-[#e6e1d6] bg-white p-8 text-center shadow-sm">
        {state === "verifying" && (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#e6e1d6] border-t-[#0f2a47]" />
            <h1 className="mt-5 text-xl font-bold text-[#0f2a47]">
              Verifying your payment...
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Please do not close this page.
            </p>
          </>
        )}

        {state === "ok" && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
              ✓
            </div>
            <h1 className="mt-5 text-2xl font-bold text-[#0f2a47]">
              Payment successful
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Your booking is now waiting for the owner&apos;s approval.
            </p>
            <Link
              href="/dashboard/tenant/bookings"
              className="mt-6 inline-block rounded-lg bg-[#0f2a47] px-6 py-3 text-sm font-semibold text-white hover:bg-[#091b30]"
            >
              View My Bookings
            </Link>
          </>
        )}

        {state === "error" && (
          <>
            <h1 className="text-2xl font-bold text-[#0f2a47]">
              Something went wrong
            </h1>
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

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e6e1d6] border-t-[#0f2a47]" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}