
import Link from "next/link";
import { getPropertyTypes } from "@/lib/api/properties/properties";
import {
  FadeUp,
  StaggerGrid,
  StaggerItem,
} from "@/components/home/MotionWrappers";

const typeIcons = {
  Apartment: "🏢",
  House: "🏠",
  Villa: "🏡",
  Studio: "🏙️",
};

export default async function BrowseByType() {
  let types = [];

  try {
    types = await getPropertyTypes();
  } catch (error) {
    console.error("Failed to load property types:", error.message);
  }

  return (
    <section className="bg-[#faf8f4] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#b8893a]">
            Find Your Space
          </span>

          <h2 className="mt-2 text-3xl font-extrabold text-[#0f2a47] sm:text-4xl">
            Browse by Property Type
          </h2>

          <p className="mt-4 text-slate-500">
            Explore properties that match your lifestyle.
          </p>
        </FadeUp>

        {types.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#e6e1d6] bg-white py-12 text-center text-slate-500">
            No property types available yet.
          </p>
        ) : (
          <StaggerGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {types.map((item) => (
              <StaggerItem key={item._id}>
                <Link
                  href={`/properties?type=${encodeURIComponent(item._id)}`}
                  className="group block rounded-2xl border border-[#e6e1d6] bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#b8893a] hover:shadow-lg"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#faf8f4] text-3xl transition group-hover:bg-[#f5ead5]">
                    {typeIcons[item._id] || "🏘️"}
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#0f2a47]">
                    {item._id}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {item.propertyCount} Properties
                  </p>

                  <span className="mt-4 inline-block text-sm font-semibold text-[#b8893a]">
                    Explore Properties →
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>
    </section>
  );
}
