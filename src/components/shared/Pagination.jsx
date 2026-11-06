"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ page, totalPages }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (p) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p);
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const btn =
    "min-w-10 rounded-lg border px-3 py-2 text-sm font-medium transition-colors";

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className={`${btn} border-[#e6e1d6] bg-white text-[#0f2a47] hover:bg-slate-50 disabled:opacity-40`}
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`${btn} ${
            p === page
              ? "border-[#0f2a47] bg-[#0f2a47] text-white"
              : "border-[#e6e1d6] bg-white text-[#0f2a47] hover:bg-slate-50"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className={`${btn} border-[#e6e1d6] bg-white text-[#0f2a47] hover:bg-slate-50 disabled:opacity-40`}
      >
        Next
      </button>
    </div>
  );
}