"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-[#faf8f4] px-4">
      <div className="max-w-md text-center">
        <p className="text-5xl">⚠️</p>
        <h1 className="mt-4 text-2xl font-extrabold text-[#0f2a47]">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {error?.message ||
            "An unexpected error occurred. Please try again."}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-[#0f2a47] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#091b30]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-[#0f2a47] px-5 py-2.5 text-sm font-semibold text-[#0f2a47] transition-colors hover:bg-[#0f2a47] hover:text-white"
          >
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}