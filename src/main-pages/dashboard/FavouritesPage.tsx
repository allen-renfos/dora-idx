"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiHeart, FiSearch } from "react-icons/fi";
import { useUserWishlist } from "@/services/profile/ProfileQueries";
import { PropertyCard } from "@/component/properties/PropertyCard";
import { DashboardLayout } from "@/component/ui/DashboardLayout";
import { PropertyWishlistCard } from "@/component/properties/PropertyWishlistCard";

const FavouritesPage = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const { data, isLoading } = useUserWishlist();

  useEffect(() => {
    setFavorites(data?.data || []);
    setCount(data?.count || 0);
  }, [data]);

  return (
    <DashboardLayout
      active="Favourites"
      eyebrow="Collection"
      title="Saved listings"
      description={`${count} ${count === 1 ? "home" : "homes"} you're keeping an eye on.`}
      actions={
        <Link href="/properties" className="btn-outline-new">
          <FiSearch size={14} />
          Browse listings
        </Link>
      }
    >
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] animate-pulse"
            >
              <div className="aspect-[4/3] bg-white/5" />
              <div className="p-6 flex flex-col gap-3">
                <div className="h-7 w-40 bg-white/10" />
                <div className="h-4 w-full bg-white/5" />
                <div className="h-4 w-3/4 bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <PropertyWishlistCard
              key={item.id}
              item={item}
              hideWishlist={false}
              handleModal={() => undefined}
            />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-white/10 py-20 px-6 flex flex-col items-center text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[var(--gold-500)]/10 border border-[var(--gold-500)]/30 flex items-center justify-center mb-6">
            <FiHeart size={22} className="text-[var(--gold-500)]" />
          </div>
          <h3 className="font-serif text-2xl text-white mb-3">
            No saved listings yet
          </h3>
          <p className="text-white/55 mb-8 leading-relaxed">
            Tap the heart on any property card and we&rsquo;ll keep it here so
            you can revisit anytime.
          </p>
          <Link href="/properties" className="btn-gold-new">
            <FiSearch size={14} />
            Find listings
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FavouritesPage;
