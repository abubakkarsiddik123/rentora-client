"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { AlertDialog, Button } from "@heroui/react";
import PageHeader from "@/components/dashboard/PageHeader";
import {
  getAllPropertiesForAdmin,
  updatePropertyStatus,
} from "@/lib/api/admin/admin-properties";

const statusStyle = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  booked: "bg-slate-200 text-slate-600",
};

const rentLabels = { Monthly: "month", Weekly: "week", Daily: "day" };

const tabs = ["pending", "approved", "rejected", "booked", "all"];

export default function ManagePropertiesPage() {
  const [properties, setProperties] = useState(null); // null মানে এখনও লোড হয়নি
  const [tab, setTab] = useState("pending");
  const [busyId, setBusyId] = useState(null);

  const [rejectTarget, setRejectTarget] = useState(null);
  const [reason, setReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    let ignore = false;
    getAllPropertiesForAdmin()
      .then((data) => {
        if (!ignore) setProperties(data);
      })
      .catch((err) => {
        toast.error(err.message);
        if (!ignore) setProperties([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const loading = properties === null;
  const all = properties ?? [];
  const list = all.filter((p) => tab === "all" || p.status === tab);
  const count = (t) =>
    t === "all" ? all.length : all.filter((p) => p.status === t).length;

  const patchLocal = (id, changes) =>
    setProperties((prev) =>
      prev.map((p) => (p._id === id ? { ...p, ...changes } : p)),
    );

  const approve = async (p) => {
    setBusyId(p._id);
    try {
      await updatePropertyStatus(p._id, "approved");
      patchLocal(p._id, { status: "approved", rejectionReason: "" });
      toast.success("Property approved.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const openReject = (p) => {
    setRejectTarget(p);
    setReason("");
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    if (!reason.trim()) {
      toast.error("Please write a rejection reason.");
      return;
    }

    setRejecting(true);
    try {
      await updatePropertyStatus(rejectTarget._id, "rejected", reason.trim());
      patchLocal(rejectTarget._id, {
        status: "rejected",
        rejectionReason: reason.trim(),
      });
      toast.success("Property rejected.");
      setRejectTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Manage Properties"
        subtitle="Review new listings and approve or reject them."
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
            {t} {!loading && <span className="opacity-70">({count(t)})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-[#e6e1d6] bg-white p-10 text-center">
          <p className="text-sm text-slate-500">No properties found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((p) => (
            <div
              key={p._id}
              className="flex flex-col gap-4 rounded-2xl border border-[#e6e1d6] bg-white p-5 shadow-sm sm:flex-row"
            >
              <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-40">
                {p.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.images[0]}
                    alt={p.title}
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
                    {p.title}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${
                      statusStyle[p.status] || "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {p.location} · {p.type}
                </p>

                <div className="mt-2 grid gap-x-6 gap-y-1 text-sm text-slate-600 sm:grid-cols-2">
                  <p className="font-semibold text-[#0f2a47]">
                    ৳{Number(p.price).toLocaleString()}
                    <span className="text-xs font-normal text-slate-500">
                      {" "}
                      / {rentLabels[p.rentType] || "month"}
                    </span>
                  </p>
                  <p>
                    {p.bedrooms} bed · {p.bathrooms} bath · {p.area} sq ft
                  </p>
                  <p>
                    <span className="text-slate-400">Owner: </span>
                    {p.ownerName}
                  </p>
                  <p className="truncate">
                    <span className="text-slate-400">Email: </span>
                    {p.ownerEmail}
                  </p>
                </div>

                {p.status === "rejected" && p.rejectionReason && (
                  <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    <span className="font-semibold">Reason: </span>
                    {p.rejectionReason}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/properties/${p._id}`}
                    className="rounded-lg border border-[#0f2a47] px-4 py-2 text-sm font-semibold text-[#0f2a47] transition-colors hover:bg-[#0f2a47] hover:text-white"
                  >
                    View
                  </Link>
                  {(p.status === "pending" || p.status === "rejected") && (
                    <Button
                      isDisabled={busyId === p._id}
                      onPress={() => approve(p)}
                    >
                      {busyId === p._id ? "Please wait..." : "Approve"}
                    </Button>
                  )}
                  {(p.status === "pending" || p.status === "approved") && (
                    <Button
                      variant="danger"
                      isDisabled={busyId === p._id}
                      onPress={() => openReject(p)}
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject modal: কারণ লিখতে হয় */}
      <AlertDialog.Backdrop
        isOpen={!!rejectTarget}
        onOpenChange={(open) => {
          if (!open && !rejecting) setRejectTarget(null);
        }}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[440px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Reject this property?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                Tell the owner why <strong>{rejectTarget?.title}</strong> is
                being rejected. They will see this feedback.
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="e.g. Photos are unclear, please upload better images."
                className="mt-3 w-full rounded-lg border border-[#e6e1d6] bg-white px-4 py-3 text-sm text-[#0b1220] placeholder:text-slate-400 focus:border-[#0f2a47] focus:outline-none focus:ring-2 focus:ring-[#0f2a47]/20"
              />
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                variant="tertiary"
                isDisabled={rejecting}
                onPress={() => setRejectTarget(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                isDisabled={rejecting}
                onPress={confirmReject}
              >
                {rejecting ? "Rejecting..." : "Reject Property"}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </div>
  );
}
