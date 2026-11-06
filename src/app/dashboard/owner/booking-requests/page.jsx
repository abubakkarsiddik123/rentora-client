"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AlertDialog, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import PageHeader from "@/components/dashboard/PageHeader";
import {
  getOwnerBookings,
  updateBookingStatus,
} from "@/lib/api/bookings/owner-bookings";

const statusStyle = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const tabs = ["all", "pending", "approved", "rejected"];

export default function BookingRequestsPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState(null); // null মানে এখনও লোড হয়নি
  const [tab, setTab] = useState("all");
  const [action, setAction] = useState(null); // { booking, status }
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;
    getOwnerBookings(user.id)
      .then((data) => {
        if (!ignore) setBookings(data);
      })
      .catch((err) => {
        toast.error(err.message);
        if (!ignore) setBookings([]);
      });

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  const loading = isPending || (!!user?.id && bookings === null);

  const list = (bookings ?? []).filter(
    (b) => tab === "all" || b.status === tab,
  );

  const confirmAction = async () => {
    if (!action || !user?.id) return;

    const { booking, status } = action;
    setWorking(true);
    try {
      await updateBookingStatus(booking._id, user.id, status);
      // approve করলে একই প্রপার্টির বাকি pending বুকিং সার্ভারে rejected হয়, তাই নতুন করে আনি
      setBookings(await getOwnerBookings(user.id));
      toast.success(
        status === "approved" ? "Booking approved." : "Booking rejected.",
      );
      setAction(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setWorking(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Booking Requests"
        subtitle="Review and respond to booking requests for your properties."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
              tab === t
                ? "bg-[#0f2a47] text-white"
                : "border border-[#e6e1d6] bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-[#e6e1d6] bg-white p-10 text-center">
          <p className="text-sm text-slate-500">No booking requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((b) => (
            <div
              key={b._id}
              className="flex flex-col gap-4 rounded-2xl border border-[#e6e1d6] bg-white p-5 shadow-sm sm:flex-row"
            >
              <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-40">
                {b.propertyImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={b.propertyImage}
                    alt={b.propertyTitle}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="line-clamp-1 text-base font-semibold text-[#0b1220]">
                    {b.propertyTitle}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${
                      statusStyle[b.status] || "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {b.status}
                  </span>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${
                      b.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {b.paymentStatus}
                  </span>
                </div>

                <div className="mt-3 grid gap-x-6 gap-y-1 text-sm text-slate-600 sm:grid-cols-2">
                  <p>
                    <span className="text-slate-400">Tenant: </span>
                    {b.tenantName}
                  </p>
                  <p className="truncate">
                    <span className="text-slate-400">Email: </span>
                    {b.tenantEmail}
                  </p>
                  <p>
                    <span className="text-slate-400">Phone: </span>
                    {b.phone}
                  </p>
                  <p>
                    <span className="text-slate-400">Move-in: </span>
                    {b.moveInDate}
                  </p>
                  <p>
                    <span className="text-slate-400">Booking fee: </span>৳
                    {Number(b.amount).toLocaleString()}
                  </p>
                </div>

                {b.notes && (
                  <p className="mt-2 text-sm text-slate-500">
                    <span className="text-slate-400">Note: </span>
                    {b.notes}
                  </p>
                )}

                {b.status === "pending" && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button
                      isDisabled={b.paymentStatus !== "paid"}
                      onPress={() =>
                        setAction({ booking: b, status: "approved" })
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      onPress={() =>
                        setAction({ booking: b, status: "rejected" })
                      }
                    >
                      Reject
                    </Button>
                    {b.paymentStatus !== "paid" && (
                      <span className="text-xs text-slate-500">
                        Waiting for the tenant&apos;s payment.
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approve / Reject confirmation modal */}
      <AlertDialog.Backdrop
        isOpen={!!action}
        onOpenChange={(open) => {
          if (!open && !working) setAction(null);
        }}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon
                status={action?.status === "approved" ? "success" : "danger"}
              />
              <AlertDialog.Heading>
                {action?.status === "approved"
                  ? "Approve this booking?"
                  : "Reject this booking?"}
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                {action?.status === "approved" ? (
                  <>
                    <strong>{action?.booking?.propertyTitle}</strong> will be
                    marked as booked and other pending requests for it will be
                    rejected.
                  </>
                ) : (
                  <>
                    You are rejecting the request from{" "}
                    <strong>{action?.booking?.tenantName}</strong>.
                  </>
                )}
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                variant="tertiary"
                isDisabled={working}
                onPress={() => setAction(null)}
              >
                Cancel
              </Button>
              <Button
                variant={action?.status === "approved" ? "primary" : "danger"}
                isDisabled={working}
                onPress={confirmAction}
              >
                {working
                  ? "Please wait..."
                  : action?.status === "approved"
                    ? "Approve"
                    : "Reject"}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </div>
  );
}
