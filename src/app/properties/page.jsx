import { Suspense } from "react";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import Pagination from "@/components/shared/Pagination";
import { getProperties } from "@/lib/api/properties/properties";


export const metadata = {
  title: "All Properties | Rentora",
};

export default async function PropertiesPage({ searchParams }) {
  const params = await searchParams;

  let data = { items: [], total: 0, page: 1, totalPages: 0 };
  try {
    data = await getProperties(params);
  } catch (err) {
    console.error(err.message);
  }

  return (
    <section className="bg-[#faf8f4] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#b8893a]">
            Browse rentals
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-[#0f2a47] sm:text-4xl">
            All Properties
          </h1>
        </div>

        <Suspense fallback={null}>
          <PropertyFilters />
        </Suspense>

        <p className="mb-6 mt-8 text-sm text-slate-500">
          {data.total} {data.total === 1 ? "property" : "properties"} found
        </p>

        {data.items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#e6e1d6] bg-white py-16 text-center text-slate-500">
            No properties match your filters.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        )}

        <Suspense fallback={null}>
          <Pagination page={data.page} totalPages={data.totalPages} />
        </Suspense>
      </div>
    </section>
  );
}