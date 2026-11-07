
import Link from "next/link";
import { getTopLocations } from "@/lib/api/properties/properties";
import {
  FadeUp,
  StaggerGrid,
  StaggerItem,
} from "@/components/home/MotionWrappers";

export default async function TopLocations() {
  let locations = [];

  try {
    locations = await getTopLocations();
  } catch (error) {
    console.error("Failed to load top locations:", error.message);
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#b8893a]">
            Explore Areas
          </span>

          <h2 className="mt-2 text-3xl font-extrabold text-[#0f2a47] sm:text-4xl">
            Explore Top Locations
          </h2>

          <p className="mt-4 text-slate-500">
            Find your perfect property in popular locations.
          </p>
        </FadeUp>

        {locations.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#e6e1d6] bg-[#faf8f4] py-12 text-center text-slate-500">
            No locations available yet.
          </p>
        ) : (
          <StaggerGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((item) => (
              <StaggerItem key={item._id}>
                <Link
                  href={`/properties?location=${encodeURIComponent(item._id)}`}
                  className="group flex items-center justify-between rounded-2xl border border-[#e6e1d6] bg-[#faf8f4] p-6 transition hover:border-[#b8893a] hover:shadow-md"
                >
                  <div>
                    <h3 className="font-bold text-[#0f2a47] transition group-hover:text-[#b8893a]">
                      {item._id}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {item.propertyCount} Properties
                    </p>
                  </div>

                  <span className="text-2xl text-[#b8893a] transition group-hover:translate-x-1">
                    →
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
