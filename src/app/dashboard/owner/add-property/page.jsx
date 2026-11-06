"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client"; // আপনার auth client ফাইলের পাথ দিন
import PageHeader from "@/components/dashboard/PageHeader";
import { createProperty } from "@/lib/api/properties/add-properties";

const propertyTypes = ["Apartment", "House", "Villa", "Studio", "Office"];

const inputClass =
  "w-full rounded-lg border border-[#e6e1d6] bg-white px-4 py-3 text-sm text-[#0b1220] placeholder:text-slate-400 focus:border-[#0f2a47] focus:outline-none focus:ring-2 focus:ring-[#0f2a47]/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

export default function AddPropertyPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([""]);

  const updateImage = (i, value) =>
    setImages(images.map((img, idx) => (idx === i ? value : img)));
  const addImageField = () => setImages([...images, ""]);
  const removeImageField = (i) =>
    setImages(images.filter((_, idx) => idx !== i));

  const onSubmit = async (e) => {
    e.preventDefault();

    if (isPending || !user?.id) {
      console.log("user object:", user);
      toast.error("User not loaded yet. Please try again.");
      return;
    }

    const f = new FormData(e.currentTarget);

    const data = {
      title: f.get("title")?.trim(),
      description: f.get("description")?.trim(),
      price: Number(f.get("price")),
      location: f.get("location")?.trim(),
      type: f.get("type"),
      bedrooms: Number(f.get("bedrooms")),
      bathrooms: Number(f.get("bathrooms")),
      area: Number(f.get("area")),
      images: images.map((s) => s.trim()).filter(Boolean),
      amenities: (f.get("amenities") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      ownerId: user.id,
      ownerEmail: user.email,
      ownerName: user.name,
    };
    console.log("property of data",data);

    if (data.images.length === 0) {
      toast.error("Please add at least one image URL");
      return;
    }

    console.log("sending:", data);

    setSaving(true);
    try {
      await createProperty(data);
      toast.success("Property added successfully!");
      router.push("/dashboard/owner/my-properties");
    } catch (err) {
      console.log("Property data:", data);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Add Property"
        subtitle="Fill in the details to list a new rental property."
      />

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-[#e6e1d6] bg-white p-6 shadow-sm"
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder="e.g. Modern 3-bedroom apartment"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Describe the property..."
            className={inputClass}
          />
        </div>

        {/* Price + Type */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className={labelClass}>
              Monthly rent (৳)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              required
              placeholder="e.g. 25000"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="type" className={labelClass}>
              Property type
            </label>
            <select
              id="type"
              name="type"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Select type
              </option>
              {propertyTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className={labelClass}>
            Location
          </label>
          <input
            id="location"
            name="location"
            required
            placeholder="e.g. Sonadanga, Khulna"
            className={inputClass}
          />
        </div>

        {/* Beds, baths, area */}
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="bedrooms" className={labelClass}>
              Bedrooms
            </label>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              min="0"
              max="20"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="bathrooms" className={labelClass}>
              Bathrooms
            </label>
            <input
              id="bathrooms"
              name="bathrooms"
              type="number"
              min="0"
              max="20"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="area" className={labelClass}>
              Area (sq ft)
            </label>
            <input
              id="area"
              name="area"
              type="number"
              min="0"
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label htmlFor="amenities" className={labelClass}>
            Amenities (comma separated)
          </label>
          <input
            id="amenities"
            name="amenities"
            placeholder="e.g. Parking, Lift, Generator, Wi-Fi"
            className={inputClass}
          />
        </div>

        {/* Images */}
        <div>
          <label className={labelClass}>Image URLs</label>
          <div className="space-y-3">
            {images.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateImage(i, e.target.value)}
                  placeholder="https://i.ibb.co.com/.../photo.jpg"
                  className={inputClass}
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(i)}
                    className="rounded-lg border border-[#e6e1d6] px-4 text-sm text-red-500 hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addImageField}
            className="mt-3 text-sm font-semibold text-[#b8893a] hover:underline"
          >
            + Add another image
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-[#0f2a47] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#091b30] disabled:opacity-60 sm:w-auto"
        >
          {saving ? "Saving..." : "Add Property"}
        </button>
      </form>
    </div>
  );
}
