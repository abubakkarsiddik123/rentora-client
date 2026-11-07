"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import BookingModal from "@/components/properties/BookingModal";
import { addFavorite, getFavorite, removeFavorite } from "@/lib/api/favorites";
import PropertyReviews from "@/components/properties/PropertyReviews";

const rentLabels = { Monthly: "month", Weekly: "week", Daily: "day" };

export default function PropertyDetails({ property }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = user?.role || "tenant";

  const [active, setActive] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [favorite, setFavorite] = useState(null);
  const [favLoading, setFavLoading] = useState(false);

  // প্রাইভেট রুট: লগইন না থাকলে সাইন-ইনে
  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.replace(`/auth/signin?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, user, pathname, router]);

  useEffect(() => {
    if (!user?.id) return;
    getFavorite(user.id, property._id)
      .then(setFavorite)
      .catch(() => {});
  }, [user?.id, property._id]);

  if (isPending || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e6e1d6] border-t-[#0f2a47]" />
      </div>
    );
  }

  const {
    _id,
    title,
    description,
    location,
    type,
    price,
    rentType,
    bedrooms,
    bathrooms,
    area,
    images = [],
    amenities = [],
    extraFeatures = [],
    status,
    ownerName,
    ownerEmail,
  } = property;

  const isAvailable = status === "approved";
  const rentLabel = rentLabels[rentType] || "month";

  const handleBook = () => setShowBooking(true);

  const handleFavorite = async () => {
    setFavLoading(true);
    try {
      if (favorite) {
        await removeFavorite(favorite._id, user.id);
        setFavorite(null);
        toast.success("Removed from favorites");
      } else {
        await addFavorite({ propertyId: _id, userId: user.id });
        setFavorite(await getFavorite(user.id, _id));
        toast.success("Added to favorites");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <section className="bg-[#faf8f4] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/properties"
          className="text-sm font-semibold text-[#0f2a47] hover:underline"
        >
          ← Back to properties
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {/* Left: images + details */}
          <div className="lg:col-span-2">
            <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-[420px]">
              {images[active] ? (
                <Image
                  src={images[active]}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  No image
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 ${
                      i === active ? "border-[#b8893a]" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${title} ${i + 1}`}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-[#e6e1d6] bg-white p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#0f2a47] px-3 py-1 text-xs font-semibold text-white">
                  {type}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {status}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold text-[#0f2a47]">
                {title}
              </h1>
              <p className="mt-1 text-slate-500">📍 {location}</p>

              <div className="mt-6 grid grid-cols-3 gap-4 border-y border-[#e6e1d6] py-4 text-center">
                <div>
                  <p className="text-xl font-bold text-[#0f2a47]">{bedrooms}</p>
                  <p className="text-xs text-slate-500">Bedrooms</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#0f2a47]">
                    {bathrooms}
                  </p>
                  <p className="text-xs text-slate-500">Bathrooms</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#0f2a47]">{area}</p>
                  <p className="text-xs text-slate-500">Sq ft</p>
                </div>
              </div>

              <h2 className="mt-6 text-lg font-bold text-[#0f2a47]">
                Description
              </h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-600">
                {description || "No description provided."}
              </p>

              {amenities.length > 0 && (
                <>
                  <h2 className="mt-6 text-lg font-bold text-[#0f2a47]">
                    Amenities
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {amenities.map((a) => (
                      <span
                        key={a}
                        className="rounded-full border border-[#e6e1d6] bg-[#faf8f4] px-3 py-1 text-sm text-slate-600"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {extraFeatures.length > 0 && (
                <>
                  <h2 className="mt-6 text-lg font-bold text-[#0f2a47]">
                    Extra Features
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {extraFeatures.map((x) => (
                      <span
                        key={x}
                        className="rounded-full border border-[#e6e1d6] bg-[#faf8f4] px-3 py-1 text-sm text-slate-600"
                      >
                        {x}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: price + book + owner */}
          <aside className="h-fit rounded-2xl border border-[#e6e1d6] bg-white p-6 lg:sticky lg:top-24">
            <p className="text-3xl font-extrabold text-[#b8893a]">
              ৳{Number(price).toLocaleString()}
              <span className="text-sm font-medium text-slate-500">
                {" "}
                /{rentLabel}
              </span>
            </p>

            {role === "tenant" ? (
              <>
                <button
                  type="button"
                  onClick={handleBook}
                  disabled={!isAvailable}
                  className="mt-5 w-full rounded-lg bg-[#0f2a47] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#091b30] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAvailable ? "Book Now" : "Not available"}
                </button>

                <button
                  type="button"
                  onClick={handleFavorite}
                  disabled={favLoading}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-60 ${
                    favorite
                      ? "border-[#b8893a] bg-[#b8893a]/10 text-[#b8893a]"
                      : "border-[#0f2a47] text-[#0f2a47] hover:bg-[#0f2a47]/5"
                  }`}
                >
                  <span aria-hidden="true">{favorite ? "♥" : "♡"}</span>
                  {favorite ? "Remove from Favorites" : "Add to Favorites"}
                </button>
              </>
            ) : (
              <p className="mt-5 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Only tenants can book properties.
              </p>
            )}

            <div className="mt-6 border-t border-[#e6e1d6] pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Listed by
              </p>
              <p className="mt-2 font-semibold text-[#0f2a47]">
                {ownerName || "Owner"}
              </p>
              {ownerEmail && (
                <p className="text-sm text-slate-500">{ownerEmail}</p>
              )}
            </div>
          </aside>
        </div>
      </div>
      <PropertyReviews propertyId={_id} user={user} role={role} />

      {showBooking && (
        <BookingModal
          property={property}
          user={user}
          onClose={() => setShowBooking(false)}
        />
      )}
    </section>
  );
}
