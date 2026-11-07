"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getLatestReviews } from "@/lib/api/reviews";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getLatestReviews();
        setReviews(Array.isArray(data.items) ? data.items : []);
      } catch (error) {
        toast.error(error.message || "Failed to load reviews");
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="bg-[#faf8f4] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#b8893a]">
            Testimonials
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-[#0f2a47] sm:text-4xl">
            What Our Customers Say
          </h2>

          <p className="mt-4 text-slate-500">
            Discover what our customers think about their Rentora experience.
          </p>
        </div>

        {reviews.length === 0 ? (
          <p className="mt-12 text-center text-slate-500">
            No customer reviews available yet.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {reviews.slice(0, 4).map((review) => (
              <div
                key={review._id}
                className="rounded-2xl border border-[#e6e1d6] bg-white p-6 shadow-sm"
              >
                <div className="text-xl text-amber-500">
                  {"★".repeat(Math.min(5, Math.max(0, review.rating || 0)))}
                  {"☆".repeat(5 - Math.min(5, Math.max(0, review.rating || 0)))}
                </div>

                <p className="mt-4 min-h-24 text-sm leading-relaxed text-slate-600">
                  {review.comment}
                </p>

                <div className="mt-6 border-t border-[#e6e1d6] pt-4">
                  <h3 className="font-bold text-[#0f2a47]">
                    {review.name || "Customer"}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    {review.propertyTitle || "Rentora Property"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
