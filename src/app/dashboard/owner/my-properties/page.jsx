"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { AlertDialog, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import PageHeader from "@/components/dashboard/PageHeader";
import {
  deleteProperty,
  getMyProperties,
} from "@/lib/api/properties/my-properties";

const statusStyle = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  booked: "bg-slate-200 text-slate-600",
};

const rentLabels = { Monthly: "month", Weekly: "week", Daily: "day" };

export default function MyPropertiesPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [properties, setProperties] = useState(null); // null মানে এখনও লোড হয়নি
  const [deleteTarget, setDeleteTarget] = useState(null); // যে প্রপার্টি ডিলিট হবে
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;
    getMyProperties(user.id)
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
  }, [user?.id]);

  const loading = isPending || (!!user?.id && properties === null);

  const confirmDelete = async () => {
    if (!deleteTarget || !user?.id) return;

    setDeleting(true);
    try {
      await deleteProperty(deleteTarget._id, user.id);
      setProperties((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success("Property deleted.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="My Properties"
        subtitle="Manage the properties you have listed."
      />

      <div className="mb-6">
        <Link
          href="/dashboard/owner/add-property"
          className="inline-block rounded-lg bg-[#0f2a47] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#091b30]"
        >
          + Add Property
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : (properties ?? []).length === 0 ? (
        <div className="rounded-2xl border border-[#e6e1d6] bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            You have not listed any property yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {(properties ?? []).map((p) => (
            <div
              key={p._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#e6e1d6] bg-white shadow-sm"
            >
              <div className="relative h-44 bg-slate-100">
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
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      statusStyle[p.status] || "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {p.status}
                  </span>
                  {p.status === "rejected" && (
                    <button
                      type="button"
                      onClick={() =>
                        alert(p.rejectionReason || "No feedback provided.")
                      }
                      title="View rejection feedback"
                      aria-label="View rejection feedback"
                      className="rounded-full bg-white/90 px-2 py-0.5 text-base shadow-sm hover:bg-white"
                    >
                      👁️
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-1 text-base font-semibold text-[#0b1220]">
                  {p.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                  {p.location} · {p.type}
                </p>

                <p className="mt-3 text-lg font-bold text-[#0f2a47]">
                  ৳{Number(p.price).toLocaleString()}
                  <span className="text-xs font-normal text-slate-500">
                    {" "}
                    / {rentLabels[p.rentType] || "month"}
                  </span>
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {p.bedrooms} bed · {p.bathrooms} bath · {p.area} sq ft
                </p>

                <div className="mt-5 flex gap-3">
                  <Link
                    href={`/dashboard/owner/my-properties/${p._id}/edit`}
                    className="flex-1 rounded-lg border border-[#0f2a47] px-4 py-2 text-center text-sm font-semibold text-[#0f2a47] transition-colors hover:bg-[#0f2a47] hover:text-white"
                  >
                    Edit
                  </Link>
                  <Button
                    variant="danger"
                    className="flex-1"
                    onPress={() => setDeleteTarget(p)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <AlertDialog.Backdrop
        isOpen={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>
                Delete property permanently?
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                This will permanently delete{" "}
                <strong>{deleteTarget?.title}</strong> and all of its data. This
                action cannot be undone.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                variant="tertiary"
                isDisabled={deleting}
                onPress={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                isDisabled={deleting}
                onPress={confirmDelete}
              >
                {deleting ? "Deleting..." : "Delete Property"}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </div>
  );
}
