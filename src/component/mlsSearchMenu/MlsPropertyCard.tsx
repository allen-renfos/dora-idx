"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IoBedOutline } from "react-icons/io5";
import { PiBathtub } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { FiHeart, FiMapPin } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useUserWishlist } from "@/services/profile/ProfileQueries";

interface PropertyCardProps {
  item: any;
  handleModal: () => void;
  postWishlistMutation: (data: any) => void;
  removeWishlistMutation?: (id: string) => void;
}

export const MlsPropertyCard = ({
  item,
  handleModal,
  postWishlistMutation,
  removeWishlistMutation,
}: PropertyCardProps) => {
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [isFavorited, setIsFavorited] = useState(item?.is_wishlisted || false);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const { data: wishlistData } = useUserWishlist();

  useEffect(() => {
    if (wishlistData?.data) {
      const matched = (wishlistData.data as any[]).find(
        (w: any) =>
          (w.listing_key && w.listing_key === item.mls_listingkey) ||
          (w.listing_id && w.listing_id === item.mls_listingid)
      );
      if (matched) {
        setIsFavorited(true);
        setWishlistItemId(matched.id ? String(matched.id) : null);
      } else {
        setIsFavorited(item?.is_wishlisted || false);
        setWishlistItemId(null);
      }
    } else {
      setIsFavorited(item?.is_wishlisted || false);
    }
  }, [item?.is_wishlisted, item.mls_listingkey, item.mls_listingid, wishlistData]);

  const handleAddWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = sessionStorage.getItem("access_token");
    if (!token) return handleModal();
    if (isAddingToFavorites) return;

    if (isFavorited && wishlistItemId && removeWishlistMutation) {
      setIsAddingToFavorites(true);
      setIsFavorited(false);
      removeWishlistMutation(wishlistItemId);
      setTimeout(() => setIsAddingToFavorites(false), 1000);
      return;
    }

    if (!isFavorited) {
      setIsAddingToFavorites(true);
      setIsFavorited(true);
      postWishlistMutation({
        listing_id: item.mls_listingid,
        listing_key: item.mls_listingkey,
        agent_id: 12,
        user_id: sessionStorage.getItem("customer_id"),
        uuid: process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID,
      });
      setTimeout(() => setIsAddingToFavorites(false), 1000);
    }
  };

  const handleOpen = () => {
    window.location.href = `/properties/${item.id}`;
  };

  const formattedPrice = item?.price
    ? `$${Number(item.price).toLocaleString()}`
    : "Price upon request";

  return (
    <article
      onClick={handleOpen}
      className="group relative flex flex-col h-full cursor-pointer bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--accent)]/60 hover:shadow-[var(--shadow-soft)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ borderRadius: "var(--radius-sm)" }}
    >
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10 pointer-events-none" />

        {item.status && (
          <span
            className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] uppercase bg-[var(--ink)] text-white"
            style={{ borderRadius: "var(--radius-xs)" }}
          >
            {item.status}
          </span>
        )}

        <button
          onClick={handleAddWishlist}
          disabled={isAddingToFavorites}
          aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
          className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center border transition-all duration-300 backdrop-blur-md"
          style={{
            borderRadius: "999px",
            background: isFavorited ? "rgba(166,130,76,0.95)" : "rgba(0,0,0,0.35)",
            borderColor: isFavorited ? "rgba(166,130,76,1)" : "rgba(255,255,255,0.35)",
            color: isFavorited ? "#ffffff" : "#fff",
          }}
        >
          {isAddingToFavorites ? (
            <svg
              className="animate-spin"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
          ) : isFavorited ? (
            <FaHeart size={16} />
          ) : (
            <FiHeart size={18} strokeWidth={2} />
          )}
        </button>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <span className="text-white/85 text-[11px] uppercase tracking-[0.22em] font-semibold">
            View details
          </span>
          <span className="text-white/85 text-lg transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-sans font-bold text-[clamp(1.35rem,1.2vw+0.8rem,1.65rem)] text-[var(--ink)] leading-none tracking-[-0.02em]">
            {formattedPrice}
          </h3>
        </div>

        {item.address && (
          <div className="flex items-start gap-2.5 min-h-[44px]">
            <FiMapPin size={16} className="text-[var(--gold-500)] mt-[3px] shrink-0" />
            <p className="text-[17px] leading-[1.5] text-[var(--ink-soft)] font-sans font-semibold">
              {String(item.address).replace(/±/g, "#")}
            </p>
          </div>
        )}

        <div className="flex items-center gap-5 pt-4 border-t border-[var(--line)] text-[13px] text-[var(--ink-soft)]">
          {item.beds ? (
            <span className="inline-flex items-center gap-2">
              <IoBedOutline size={16} className="text-[var(--gold-500)]" />
              <span>{item.beds} Beds</span>
            </span>
          ) : null}
          {item.baths ? (
            <span className="inline-flex items-center gap-2">
              <PiBathtub size={16} className="text-[var(--gold-500)]" />
              <span>{item.baths} Baths</span>
            </span>
          ) : null}
          {item.bua ? (
            <span className="inline-flex items-center gap-2">
              <BiArea size={16} className="text-[var(--gold-500)]" />
              <span>{Number(item.bua).toLocaleString()} SqFt</span>
            </span>
          ) : null}
        </div>

        {item.listed_with && (
          <div className="flex items-center gap-2 pt-3 mt-auto">
            {item.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.logo}
                alt="MLS"
                width={18}
                height={18}
                className="rounded-full object-cover shrink-0"
                style={{ width: 18, height: 18 }}
              />
            )}
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[var(--ink-faint)]">
              Listed with {item.listed_with}
            </span>
          </div>
        )}
      </div>
    </article>
  );
};
