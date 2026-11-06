"use client";

import { useRouter, useSearchParams } from "next/navigation";

const propertyTypes = ["Apartment", "House", "Villa", "Studio", "Office"];

const field =
  "w-full rounded-lg border border-[#e6e1d6] bg-white px-4 py-2.5 text-sm text-[#0b1220] placeholder:text-slate-400 focus:border-[#0f2a47] focus:outline-none focus:ring-2 focus:ring-[#0f2a47]/20";
const label =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of f.entries()) {
      if (value) params.set(key, value);
    }
    router.push(`/properties?${params.toString()}`);
  };

  const onReset = () => router.push("/properties");

  const get = (key) => searchParams.get(key) || "";

  return (
    // key দেওয়ায় URL বদলালে ফর্মের ভ্যালু নতুন করে বসে
    <form
      key={searchParams.toString()}
      onSubmit={onSubmit}
      className="grid gap-4 rounded-2xl border border-[#e6e1d6] bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
    >
      <div className="sm:col-span-2">
        <label htmlFor="search" className={label}>Search</label>
        <input
          id="search"
          name="search"
          defaultValue={get("search")}
          placeholder="Title or location"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="location" className={label}>Location</label>
        <input
          id="location"
          name="location"
          defaultValue={get("location")}
          placeholder="e.g. Khulna"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="type" className={label}>Type</label>
        <select id="type" name="type" defaultValue={get("type")} className={field}>
          <option value="">All types</option>
          {propertyTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="minPrice" className={label}>Min price</label>
        <input
          id="minPrice"
          name="minPrice"
          type="number"
          min="0"
          defaultValue={get("minPrice")}
          placeholder="0"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="maxPrice" className={label}>Max price</label>
        <input
          id="maxPrice"
          name="maxPrice"
          type="number"
          min="0"
          defaultValue={get("maxPrice")}
          placeholder="Any"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="bedrooms" className={label}>Min bedrooms</label>
        <select id="bedrooms" name="bedrooms" defaultValue={get("bedrooms")} className={field}>
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}+</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sort" className={label}>Sort by</label>
        <select id="sort" name="sort" defaultValue={get("sort") || "newest"} className={field}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className="flex gap-3 sm:col-span-2 lg:col-span-4">
        <button
          type="submit"
          className="rounded-lg bg-[#0f2a47] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#091b30]"
        >
          Apply filters
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-[#e6e1d6] px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </form>
  );
}