
"use client";

import { useEffect, useState } from "react";
import {
  getOwnerRequests,
  reviewOwnerRequest,
} from "@/lib/api/owner-requests";

export default function OwnerRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadRequests = async () => {
    try {
      const result = await getOwnerRequests();
      setRequests(result);
    } catch (error) {
      setError(error.message || "Failed to load owner requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const result = await getOwnerRequests();
        setRequests(result);
      } catch (error) {
        setError(error.message || "Failed to load owner requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleReview = async (id, status, reason = "") => {
    setSubmitting(true);
    setError("");

    try {
      await reviewOwnerRequest(id, status, reason);
      setSelectedRequest(null);
      setRejectionReason("");
      await loadRequests();
    } catch (error) {
      setError(error.message || "Failed to review application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading owner requests...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Owner Requests</h1>
        <p className="mt-2 text-gray-500">
          Review and manage tenant applications to become property owners.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-red-600">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-gray-500">Total Requests</p>
          <h2 className="mt-2 text-2xl font-bold">{requests.length}</h2>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="mt-2 text-2xl font-bold">
            {requests.filter((item) => item.status === "pending").length}
          </h2>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-gray-500">Approved</p>
          <h2 className="mt-2 text-2xl font-bold">
            {requests.filter((item) => item.status === "approved").length}
          </h2>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="text-lg font-semibold">No owner requests yet</h2>
          <p className="mt-2 text-gray-500">
            New applications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border border-default p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">{item.email}</p>
                  <p className="mt-1 text-sm text-gray-500">{item.phone}</p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    item.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : item.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <div>
                  <p className="text-sm font-semibold">Address</p>
                  <p className="mt-1 text-sm text-gray-500">{item.address}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold">Reason</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.reason || "Not provided"}
                  </p>
                </div>

                {item.status === "rejected" && item.rejectionReason && (
                  <div>
                    <p className="text-sm font-semibold text-red-600">
                      Rejection Reason
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.rejectionReason}
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  Submitted: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>

              {item.status === "pending" && (
                <div className="mt-5 flex flex-wrap gap-3 border-t border-default pt-4">
                  <button
                    onClick={() => handleReview(item._id, "approved")}
                    disabled={submitting}
                    className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => setSelectedRequest(item)}
                    disabled={submitting}
                    className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <h2 className="text-xl font-bold">Reject Application</h2>

            <p className="mt-2 text-sm text-gray-500">
              Provide a reason for rejecting {selectedRequest.name}s
              application.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="mt-5 w-full rounded-lg border border-default bg-transparent p-3 outline-none focus:border-blue-500"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setRejectionReason("");
                }}
                disabled={submitting}
                className="rounded-lg border border-default px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  handleReview(
                    selectedRequest._id,
                    "rejected",
                    rejectionReason,
                  )
                }
                disabled={submitting || !rejectionReason.trim()}
                className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}