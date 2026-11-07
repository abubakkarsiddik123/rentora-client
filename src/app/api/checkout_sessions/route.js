import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { CURRENCY, stripe } from "../../../lib/stripe";
import { getServerToken } from "@/lib/core/server-token";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || new URL(request.url).origin;

    const formData = await request.formData();
    const bookingId = formData.get("bookingId");

    // সেশন থেকে JWT নেওয়া হচ্ছে, কারণ সার্ভারের রুট এখন সুরক্ষিত
    const token = await getServerToken();
    if (!token) {
      return NextResponse.json(
        { error: "Please login again" },
        { status: 401 },
      );
    }

    // দাম সার্ভারের বুকিং থেকে নেওয়া হচ্ছে, ক্লায়েন্ট থেকে নয়
    const res = await fetch(`${API}/api/bookings/${bookingId}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    const booking = await res.json();

    if (booking.paymentStatus === "paid") {
      return NextResponse.json({ error: "Already paid" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: booking.tenantEmail,
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            unit_amount: Math.round(booking.amount * 100),
            product_data: { name: booking.propertyTitle },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { bookingId },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/${bookingId}`,
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}