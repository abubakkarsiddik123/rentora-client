"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addReview, getPropertyReviews } from "@/lib/api/reviews";

export default function PropertyReviews({ propertyId, user, role }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getPropertyReviews(propertyId);
        setReviews(Array.isArray(data) ? data : data.items || []);
      } catch (error) {
        toast.error(error.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [propertyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      return toast.error("Please write a review.");
    }

    setSubmitting(true);

    try {
      await addReview({
        propertyId,
        rating,
        comment: comment.trim(),
      });

      toast.success("Review submitted successfully!");
      setComment("");
      setRating(5);
      const data = await getPropertyReviews(propertyId);
      setReviews(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-[#e6e1d6] bg-white p-6">
      <h2 className="text-2xl font-bold text-[#0f2a47]">Customer Reviews</h2>

      {role === "tenant" && (
        <form onSubmit={handleSubmit} className="mt-6">
          <h3 className="font-semibold text-[#0f2a47]">Write a Review</h3>

          <label className="mt-4 block text-sm font-medium text-slate-600">
            Rating
          </label>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="mt-2 rounded-lg border border-[#e6e1d6] px-4 py-2 text-slate-700"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} Star{value > 1 ? "s" : ""}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-sm font-medium text-slate-600">
            Your Review
          </label>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Share your experience..."
            className="mt-2 w-full rounded-lg border border-[#e6e1d6] p-3 text-slate-700 outline-none focus:border-[#0f2a47]"
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {comment.length}/1000
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 rounded-lg bg-[#0f2a47] px-6 py-3 text-sm font-semibold text-white hover:bg-[#091b30] disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      <div className="mt-8 border-t border-[#e6e1d6] pt-6">
        <h3 className="font-semibold text-[#0f2a47]">
          All Reviews ({reviews.length})
        </h3>

        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No reviews yet. Be the first to share your experience!
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="rounded-xl bg-[#faf8f4] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-[#0f2a47]">
                    {review.name || "Tenant"}
                  </p>

                  <span className="text-sm text-amber-500">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>

                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {review.comment}
                </p>

                <p className="mt-3 text-xs text-slate-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
