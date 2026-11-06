import { notFound } from "next/navigation";
import PaymentCard from "@/components/payment/PaymentCard";
import { getBookingById } from "@/lib/api/bookings";

export default async function PaymentPage({ params }) {
  const { bookingId } = await params;
  const booking = await getBookingById(bookingId);
  if (!booking) notFound();

  return <PaymentCard booking={booking} />;
}