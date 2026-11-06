import Link from "next/link";
import PropertyCard from "@/components/properties/PropertyCard";
import { getFeaturedProperties } from "@/lib/api/properties/properties";
import {
  FadeUp,
  StaggerGrid,
  StaggerItem,
} from "@/components/home/MotionWrappers";

export default async function FeaturedProperties() {
  let properties = [];
  let failed = false;

  try {
    properties = await getFeaturedProperties();
  } catch (err) {
    console.error("Failed to load featured properties:", err.message);
    failed = true;
  }

  return (
    <section className="bg-[#faf8f4] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#b8893a]">
              Handpicked for you
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0f2a47] sm:text-4xl">
              Featured Properties
            </h2>
          </div>
          <Link
            href="/properties"
            className="text-sm font-semibold text-[#0f2a47] hover:underline"
          >
            View all →
          </Link>
        </FadeUp>

        {failed ? (
          <FadeUp>
            <p className="rounded-xl border border-dashed border-red-200 bg-white py-12 text-center text-red-500">
              Failed to load featured properties. Please try again later.
            </p>
          </FadeUp>
        ) : properties.length === 0 ? (
          <FadeUp>
            <p className="rounded-xl border border-dashed border-[#e6e1d6] bg-white py-12 text-center text-slate-500">
              No properties available yet.
            </p>
          </FadeUp>
        ) : (
          <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <StaggerItem key={p._id}>
                <PropertyCard property={p} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>
    </section>
  );
}
