"use client";

import { useEffect, useState } from "react";
import { applyForOwner, getMyOwnerRequest } from "@/lib/api/owner-requests";

export default function BecomeOwnerPage() {
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    reason: "",
  });

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadApplication = async () => {
    try {
      const result = await getMyOwnerRequest();
      setApplication(result);
    } catch (error) {
      setError(error.message || "Failed to load application.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const result = await getMyOwnerRequest();
        setApplication(result);
      } catch (error) {
        setError(error.message || "Failed to load application.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await applyForOwner(formData);
      setFormData({
        phone: "",
        address: "",
        reason: "",
      });
      await loadApplication();
    } catch (error) {
      setError(error.message || "Application submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading application...</p>;
  }

  if (application?.status === "pending") {
    return (
      <div className="max-w-2xl rounded-xl border p-6">
        <h2 className="text-2xl font-semibold">Application Pending</h2>
        <p className="mt-3 text-gray-500">
          Your owner application is waiting for admin approval.
        </p>
        <p className="mt-4">
          Submitted: {new Date(application.createdAt).toLocaleDateString()}
        </p>
      </div>
    );
  }

  if (application?.status === "approved") {
    return (
      <div className="max-w-2xl rounded-xl border p-6">
        <h2 className="text-2xl font-semibold text-green-600">
          Application Approved
        </h2>
        <p className="mt-3 text-gray-500">
          Your owner application has been approved. Please log out and log in
          again to refresh your role.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold">Become an Owner</h1>
      <p className="mt-2 text-gray-500">
        Submit your information to become a property owner on Rentora.
      </p>

      {application?.status === "rejected" && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          <h3 className="font-semibold">Previous Application Rejected</h3>
          <p className="mt-2">{application.rejectionReason}</p>
          <p className="mt-2 text-sm">You can submit a new application.</p>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-600">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your full address"
            required
            rows={3}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Why do you want to become an owner?
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Tell us why you want to become an owner"
            rows={4}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
