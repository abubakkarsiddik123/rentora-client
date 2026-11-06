"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import PageHeader from "@/components/dashboard/PageHeader";
import { getPropertyById, updateProperty } from "@/lib/api/properties/my-properties";

const propertyTypes = ["Apartment", "House", "Villa", "Studio", "Office"];

const inputClass =
  "w-full rounded-lg border border-[#e6e1d6] bg-white px-4 py-3 text-sm text-[#0b1220] placeholder:text-slate-400 focus:border-[#0f2a47] focus:outline-none focus:ring-2 focus:ring-[#0f2a47]/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

export default function EditPropertyPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPropertyById(id)
      .then((p) => {
        setProperty(p);
        setImages(p.images?.length ? p.images : [""]);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const updateImage = (i, value) =>
    setImages(images.map((img, idx) => (idx === i ? value : img)));
  const addImageField = () => setImages([...images, ""]);
  const removeImageField = (i) =>
    setImages(images.filter((_, idx) => idx !== i));

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
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
      status: f.get("status"),
      bedrooms: Number(f.get("bedrooms")),
      bathrooms: Number(f.get("bathrooms")),
      area: Number(f.get("area")),
      images: images.map((s) => s.trim()).filter(Boolean),
      amenities: (f.get("amenities") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (data.images.length === 0) {
      toast.error("Please add at least one image URL");
      return;
    }

    setSaving(true);
    try {
      await updateProperty(id, user.id, data);
      toast.success("Property updated successfully!");
      router.push("/dashboard/owner/my-properties");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || isPending) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  if (!property) {
    return <p className="text-sm text-red-500">Property not found.</p>;
  }

  if (user?.id && property.ownerId !== user.id) {
    return (
      <p className="text-sm text-red-500">
        You are not allowed to edit this property.
      </p>
    );
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Edit Property"
        subtitle="Update the details of your listing."
      />

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-[#e6e1d6] bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={property.title}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            defaultValue={property.description}
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
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
              defaultValue={property.price}
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
              defaultValue={property.type}
              className={inputClass}
            >
              {propertyTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className={labelClass}>
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={property.status || "available"}
              className={inputClass}
            >
              <option value="available">Available</option>
              <option value="booked">Booked</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="location" className={labelClass}>
            Location
          </label>
          <input
            id="location"
            name="location"
            required
            defaultValue={property.location}
            className={inputClass}
          />
        </div>

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
              defaultValue={property.bedrooms}
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
              defaultValue={property.bathrooms}
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
              defaultValue={property.area}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="amenities" className={labelClass}>
            Amenities (comma separated)
          </label>
          <input
            id="amenities"
            name="amenities"
            defaultValue={(property.amenities || []).join(", ")}
            className={inputClass}
          />
        </div>

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

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#0f2a47] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#091b30] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/owner/my-properties")}
            className="rounded-lg border border-[#e6e1d6] px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}