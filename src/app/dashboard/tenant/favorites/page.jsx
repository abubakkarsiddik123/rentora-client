"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { getMyFavorites, removeFavorite } from "@/lib/api/favorites";
import PageHeader from "@/components/dashboard/PageHeader";

export default function TenantFavoritesPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!userId) return;
    getMyFavorites(userId)
      .then(setFavorites)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleRemove = async (id) => {
    setRemovingId(id);
    try {
      await removeFavorite(id, userId);
      setFavorites((prev) => prev.filter((f) => f._id !== id));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Favorites"
        subtitle="Properties you have saved for later."
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e6e1d6] border-t-[#0f2a47]" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e6e1d6] bg-white py-16 text-center">
          <p className="text-slate-500">You have no favorite properties yet.</p>
          <Link
            href="/properties"
            className="mt-4 inline-block rounded-lg bg-[#0f2a47] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#091b30]"
          >
            Browse properties
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#e6e1d6] bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[#e6e1d6] bg-[#faf8f4] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Property</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Rent</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e1d6]">
              {favorites.map((f) => (
                <tr key={f._id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        {f.image && (
                          <Image
                            src={f.image}
                            alt={f.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <Link
                        href={`/properties/${f.propertyId}`}
                        className="font-semibold text-[#0f2a47] hover:underline"
                      >
                        {f.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{f.location}</td>
                  <td className="px-5 py-4 text-slate-600">{f.type}</td>
                  <td className="px-5 py-4 font-semibold text-[#b8893a]">
                    ৳{Number(f.price).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/properties/${f.propertyId}`}
                        className="rounded-lg border border-[#0f2a47] px-3 py-1.5 text-xs font-semibold text-[#0f2a47] hover:bg-[#0f2a47]/5"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove(f._id)}
                        disabled={removingId === f._id}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {removingId === f._id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
