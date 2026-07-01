"use client";

import { postUserPropertyWishlist } from "@/services/profile/ProfileServices";
import { getAccessToken, getCustomerId } from "@/services/auth/authStorage";
import { recordCityEvent } from "@/helpers/cityInterest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiHeart, FiMapPin } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import Image from "next/image";
import { IoBedOutline } from "react-icons/io5";
import { PiBathtub } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ListingTags } from "@/component/sharable/ListingTag";
import { MlsProviderBadge } from "@/component/sharable/MlsProviderBadge";

interface PropertyCardProps {
  item: any;
  handleModal: () => void;
  hideWishlist?: boolean;
}

export const PropertyCard = ({ item, handleModal, hideWishlist }: PropertyCardProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [isFavorited, setIsFavorited] = useState(item?.is_wishlisted || false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setIsFavorited(item?.is_wishlisted || false);
  }, [item?.is_wishlisted]);

  const handleCardClick = () => router.push(`/properties/${item.id}`);

  const postWishlistMutation = useMutation({
    mutationFn: (property: any) => postUserPropertyWishlist(property),
    onSuccess: () => {
      setIsFavorited(true);
      setIsAddingToFavorites(false);
      // City personalization: a favorite is the strongest interest signal.
      recordCityEvent(item?.mls_city ?? item?.city, "favorite", item?.price);
      toast.success("Added to favorites", {
        style: { background: "#ffffff", color: "#1a1a1a", border: "1px solid #c2a878" },
        iconTheme: { primary: "#c2a878", secondary: "#ffffff" },
      });
      queryClient.invalidateQueries({ queryKey: ["userWishlistInfo"] });
      queryClient.invalidateQueries({ queryKey: ["mlsProperties"] });
    },
    onError: () => {
      setIsAddingToFavorites(false);
      toast.error("Failed to add to favorites");
    },
  });

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = getAccessToken();
    if (!token) return handleModal();
    if (isFavorited || isAddingToFavorites) return;

    setIsAddingToFavorites(true);
    postWishlistMutation.mutate({
      listing_id: item.mls_listingid,
      listing_key: item.mls_listingkey,
      agent_id: 12,
      user_id: getCustomerId(),
      uuid: process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID,
    });
  };

  const formattedPrice = item?.price
    ? `$${Number(item.price).toLocaleString()}`
    : "Price upon request";

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col h-full cursor-pointer overflow-hidden bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--accent)]/60 hover:shadow-[var(--shadow-soft)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ borderRadius: "var(--radius-md)" }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-[var(--surface-charcoal)]">
        {!item.cover_photo || imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[var(--surface-graphite)] to-[var(--surface-charcoal)]">
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
              <polyline points="9 21 9 13 15 13 15 21" />
            </svg>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
              Image coming soon
            </span>
          </div>
        ) : (
          <Image
            src={item.cover_photo}
            alt={item?.address ? String(item.address).replace(/±/g, "#") : "Property"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Gradient veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent pointer-events-none" />

        {/* Status / marketing tags (API-provided, ordered, max 2) */}
        <ListingTags tags={item.tags} className="absolute top-4 left-4 z-10" />

        {/* Favorite */}
        {!hideWishlist && (
          <button
            onClick={handleAddToFavorites}
            disabled={isAddingToFavorites}
            aria-label={isFavorited ? "Saved to favorites" : "Save to favorites"}
            className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center border transition-all duration-300 backdrop-blur-md"
            style={{
              borderRadius: "999px",
              background: isFavorited
                ? "rgba(194, 168, 120,0.95)"
                : "rgba(0,0,0,0.35)",
              borderColor: isFavorited
                ? "rgba(194, 168, 120,1)"
                : "rgba(255,255,255,0.35)",
              color: isFavorited ? "#ffffff" : "#fff",
            }}
          >
            {isAddingToFavorites ? (
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
            ) : isFavorited ? (
              <FaHeart size={16} />
            ) : (
              <FiHeart size={18} strokeWidth={2} />
            )}
          </button>
        )}

        {/* Price overlay (appears on hover) */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <span className="text-white/85 text-[11px] uppercase tracking-[0.22em] font-semibold">
            View details
          </span>
          <span className="text-white/85 text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-sans font-bold text-[clamp(1.35rem,1.2vw+0.8rem,1.65rem)] text-[var(--ink)] leading-none tracking-[-0.02em]">
            {formattedPrice}
          </h3>
        </div>

        {/* Address */}
        {item.address && (
          <div className="flex items-start gap-2.5 min-h-[44px]">
            <FiMapPin size={16} className="text-[var(--accent)] mt-[3px] shrink-0" />
            <p className="text-[17px] leading-[1.5] text-[var(--ink-soft)] font-sans font-semibold">
              {String(item.address).replace(/±/g, "#")}
            </p>
          </div>
        )}

        {/* Specs */}
        <div className="flex items-center gap-5 pt-4 border-t border-[var(--line)] text-[13px] text-[var(--ink-soft)]">
          {item.beds ? (
            <span className="inline-flex items-center gap-2">
              <IoBedOutline size={16} className="text-[var(--accent)]" />
              <span>{item.beds} Beds</span>
            </span>
          ) : null}
          {item.baths ? (
            <span className="inline-flex items-center gap-2">
              <PiBathtub size={16} className="text-[var(--accent)]" />
              <span>{item.baths} Baths</span>
            </span>
          ) : null}
          {item.bua ? (
            <span className="inline-flex items-center gap-2">
              <BiArea size={16} className="text-[var(--accent)]" />
              <span>{Number(item.bua).toLocaleString()} SqFt</span>
            </span>
          ) : null}
        </div>

        {/* MLS attribution */}
        <MlsProviderBadge item={item} />
      </div>
    </article>
  );
};
