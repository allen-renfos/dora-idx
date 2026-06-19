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
      title="Your saved homes"
      description={`${count} ${count === 1 ? "home" : "homes"} you're keeping close.`}
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
              className="bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-[var(--canvas-2)]" />
              <div className="p-6 flex flex-col gap-3">
                <div className="h-7 w-40 bg-[var(--canvas-2)] rounded-[var(--radius-xs)]" />
                <div className="h-4 w-full bg-[var(--canvas-2)] rounded-[var(--radius-xs)]" />
                <div className="h-4 w-3/4 bg-[var(--canvas-2)] rounded-[var(--radius-xs)]" />
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
        <div className="bg-[var(--cream)] border border-dashed border-[var(--line-medium)] rounded-[var(--radius-md)] py-20 px-6 flex flex-col items-center text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[var(--canvas)] border border-[var(--line)] flex items-center justify-center mb-6">
            <FiHeart size={22} className="text-[var(--sage-deep)]" />
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-[var(--ink)] mb-3">
            Nothing saved just yet
          </h3>
          <p className="text-[var(--ink-soft)] mb-8 leading-relaxed">
            Tap the heart on any home and we&rsquo;ll keep it here for you to
            return to whenever you like.
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
