"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import PageHeader from "@/components/dashboard/PageHeader";

const inputClass =
  "w-full rounded-lg border border-[#e6e1d6] bg-white px-4 py-3 text-sm text-[#0b1220] placeholder:text-slate-400 focus:border-[#0f2a47] focus:outline-none focus:ring-2 focus:ring-[#0f2a47]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

const roleInfo = {
  tenant: {
    style: "bg-slate-200 text-slate-600",
    text: "You can browse properties, book them and keep favorites.",
  },
  owner: {
    style: "bg-amber-100 text-amber-700",
    text: "You can list properties and manage booking requests.",
  },
  admin: {
    style: "bg-[#0f2a47] text-white",
    text: "You can manage users, properties, bookings and transactions.",
  },
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

function ProfileForm({ user }) {
  const role = user.role || "tenant";
  const info = roleInfo[role] || roleInfo.tenant;

  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [saving, setSaving] = useState(false);

  const initials = (user.name || "U").slice(0, 2).toUpperCase();
  const changed =
    name.trim() !== (user.name || "") || image.trim() !== (user.image || "");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
      });
      if (error) throw new Error(error.message || "Failed to update profile.");
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid max-w-4xl gap-6 lg:grid-cols-3">
      {/* Summary card */}
      <div className="h-fit rounded-2xl border border-[#e6e1d6] bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex size-24 items-center justify-center overflow-hidden rounded-full bg-[#0f2a47]/10 text-2xl font-bold text-[#0f2a47]">
          {image.trim() ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.trim()}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <h2 className="mt-4 text-lg font-bold text-[#0f2a47]">{user.name}</h2>
        <p className="truncate text-sm text-slate-500">{user.email}</p>
        <span
          className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${info.style}`}
        >
          {role}
        </span>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          {info.text}
        </p>
        <p className="mt-4 border-t border-[#e6e1d6] pt-4 text-xs text-slate-400">
          Member since {formatDate(user.createdAt)}
        </p>
      </div>

      {/* Edit form */}
      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-[#e6e1d6] bg-white p-6 shadow-sm lg:col-span-2"
      >
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            value={user.email || ""}
            disabled
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-400">
            Email cannot be changed.
          </p>
        </div>

        <div>
          <label htmlFor="image" className={labelClass}>
            Photo URL
          </label>
          <input
            id="image"
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://i.ibb.co.com/.../photo.jpg"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="role" className={labelClass}>
            Role
          </label>
          <input
            id="role"
            value={role}
            disabled
            className={`${inputClass} capitalize`}
          />
          <p className="mt-1 text-xs text-slate-400">
            Only an admin can change your role.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving || !changed}
          className="w-full rounded-lg bg-[#0f2a47] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#091b30] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="View and update your account information."
      />

      {isPending || !user ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : (
        // key দিলে সেশন বদলালে ফর্মের মান নতুন করে বসে
        <ProfileForm key={user.id} user={user} />
      )}
    </div>
  );
}