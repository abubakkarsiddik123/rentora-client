import Image from "next/image";
import Link from "next/link";

export default function PropertyCard({ property }) {
  const {
    _id,
    title,
    location,
    type,
    price,
    bedrooms,
    bathrooms,
    area,
    images,
  } = property;
  const cover = images?.[0];

  return (
    <div className="group overflow-hidden rounded-2xl border border-[#e6e1d6] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-52 w-full bg-slate-100">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-[#0f2a47] px-3 py-1 text-xs font-semibold text-white">
          {type}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="truncate text-lg font-bold text-[#0f2a47]">{title}</h3>
        <p className="mt-1 truncate text-sm text-slate-500">📍 {location}</p>

        <div className="mt-4 flex items-center gap-4 border-y border-[#e6e1d6] py-3 text-sm text-slate-600">
          <span>🛏 {bedrooms} Beds</span>
          <span>🛁 {bathrooms} Baths</span>
          <span>📐 {area} sqft</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-extrabold text-[#b8893a]">
            ৳{Number(price).toLocaleString()}
            <span className="text-xs font-medium text-slate-500"> /month</span>
          </p>
          <Link
            href={`/properties/${_id}`}
            className="rounded-lg bg-[#0f2a47] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#091b30]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
