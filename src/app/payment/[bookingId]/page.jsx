"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PaymentCard from "@/components/payment/PaymentCard";
import { getBookingById } from "@/lib/api/bookings";

export default function PaymentPage() {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(undefined); // undefined মানে এখনও লোড হয়নি

  useEffect(() => {
    let ignore = false;
    getBookingById(bookingId).then((data) => {
      if (!ignore) setBooking(data);
    });

    return () => {
      ignore = true;
    };
  }, [bookingId]);

  if (booking === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e6e1d6] border-t-[#0f2a47]" />
      </div>
    );
  }

  if (!booking) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[#faf8f4] px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-extrabold text-[#0f2a47]">
            Booking not found
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            This booking does not exist, or you do not have access to it.
          </p>
          <Link
            href="/dashboard/tenant/bookings"
            className="mt-6 inline-block rounded-lg bg-[#0f2a47] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#091b30]"
          >
            My bookings
          </Link>
        </div>
      </section>
    );
  }

  return <PaymentCard booking={booking} />;
}