"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const BANNER_IMAGE = "https://i.ibb.co.com/ZRNP8GC1/luxury-home.jpg";

const propertyTypes = ["Apartment", "House", "Villa", "Studio", "Office"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};

export default function Banner() {
  const router = useRouter();
  const [form, setForm] = useState({
    location: "",
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/properties?${params.toString()}`);
  };

  const field =
    "w-full rounded-lg border border-[#e6e1d6] bg-white px-4 py-3 text-sm text-[#0b1220] placeholder:text-slate-400 focus:border-[#0f2a47] focus:outline-none focus:ring-2 focus:ring-[#0f2a47]/20";

  const label =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <section className="relative flex min-h-[640px] items-center overflow-hidden">
      {/* Background image */}
      <Image
        src={BANNER_IMAGE}
        alt="Modern rental home"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f2a47]/95 via-[#0f2a47]/80 to-[#0f2a47]/40" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-block rounded-full border border-[#b8893a]/60 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#b8893a]"
          >
            Verified rentals, secure payments
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            Find a place that feels like{" "}
            <span className="text-[#b8893a]">home</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg"
          >
            Discover trusted rental properties, book instantly and pay your
            reservation fee online. Simple, transparent and secure.
          </motion.p>
        </div>

        {/* Search bar */}
        <motion.form
          onSubmit={handleSearch}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.45}
          className="mt-10 grid gap-4 rounded-2xl bg-white p-5 shadow-xl sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
        >
          <div className="lg:col-span-1">
            <label htmlFor="location" className={label}>
              Location
            </label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Khulna"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="type" className={label}>
              Property type
            </label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className={field}
            >
              <option value="">All types</option>
              {propertyTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="minPrice" className={label}>
              Min price
            </label>
            <input
              id="minPrice"
              name="minPrice"
              type="number"
              min="0"
              value={form.minPrice}
              onChange={handleChange}
              placeholder="0"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="maxPrice" className={label}>
              Max price
            </label>
            <input
              id="maxPrice"
              name="maxPrice"
              type="number"
              min="0"
              value={form.maxPrice}
              onChange={handleChange}
              placeholder="Any"
              className={field}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#0f2a47] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#091b30] sm:col-span-2 lg:col-span-1"
          >
            Search
          </button>
        </motion.form>
      </div>
    </section>
  );
}
