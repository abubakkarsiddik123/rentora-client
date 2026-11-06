import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-[#faf8f4] px-4">
      <div className="max-w-md text-center">
        <p className="text-6xl font-extrabold text-[#b8893a]">404</p>
        <h1 className="mt-4 text-2xl font-extrabold text-[#0f2a47]">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-[#0f2a47] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#091b30]"
          >
            Go home
          </Link>
          <Link
            href="/properties"
            className="rounded-lg border border-[#0f2a47] px-5 py-2.5 text-sm font-semibold text-[#0f2a47] transition-colors hover:bg-[#0f2a47] hover:text-white"
          >
            Browse properties
          </Link>
        </div>
      </div>
    </section>
  );
}
