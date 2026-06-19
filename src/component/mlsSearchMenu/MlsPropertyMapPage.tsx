"use client";

import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMapComponent } from "./MlsMap";
import { MlsPropertyCard } from "./MlsPropertyCard";
import { FiSearch } from "react-icons/fi";

const canPinOnMap = (value: unknown): boolean => {
  if (value === false || value === 0) return false;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized !== "false" && normalized !== "0";
  }
  return true;
};

interface Props {
  properties: any[];
  handleModal: () => void;
  postWishlistMutation: (data: any) => void;
  removeWishlistMutation?: (id: string) => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export const MlsPropertyMapPage = ({
  properties,
  handleModal,
  postWishlistMutation,
  removeWishlistMutation,
  isLoading,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
}: Props) => {
  const [, setHoveredProperty] = useState<any | null>(null);

  // Infinite scroll bound to the *inner* list scroll container (the page itself
  // doesn't scroll in split view).
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollState = useRef({ hasNextPage, isFetchingNextPage, fetchNextPage });
  scrollState.current = { hasNextPage, isFetchingNextPage, fetchNextPage };

  const sentinelCallbackRef = useCallback((el: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    sentinelElRef.current = el;
    const root = scrollContainerRef.current;
    if (!el || !root) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const s = scrollState.current;
          if (s.hasNextPage && !s.isFetchingNextPage) s.fetchNextPage?.();
        }
      },
      { root, rootMargin: "400px" }
    );
    observerRef.current.observe(el);
  }, []);

  // After a page lands, if the sentinel is still inside the inner scroll
  // viewport (e.g. first page didn't fill it), kick off the next fetch — the
  // observer only fires on intersection-state *changes*.
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !fetchNextPage) return;
    const el = sentinelElRef.current;
    const root = scrollContainerRef.current;
    if (!el || !root) return;
    const elRect = el.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    if (elRect.top - rootRect.bottom < 400) {
      fetchNextPage();
    }
  }, [properties.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const mappableProperties = properties
    .filter((p: any) => canPinOnMap(p?.NWM_ShowMapLink))
    .map((p: any) => ({ ...p, lat: Number(p.latitude), lng: Number(p.longitude) }))
    .filter(
      (p: any) => !isNaN(p.lat) && !isNaN(p.lng) && p.lat !== 0 && p.lng !== 0
    );
  const showMapSection = mappableProperties.length > 0;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* List column */}
        <div
          className={`${
            showMapSection ? "lg:col-span-7" : "lg:col-span-12"
          } flex flex-col gap-4`}
        >
          <div
            ref={scrollContainerRef}
            className="max-h-[calc(100vh-220px)] min-h-[560px] overflow-y-auto pr-1 custom-scrollbar"
          >
            {isLoading ? (
              <SplitSkeleton count={6} />
            ) : properties.length ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.map((item: any) => (
                    <MlsPropertyCard
                      key={item.id}
                      item={item}
                      postWishlistMutation={postWishlistMutation}
                      removeWishlistMutation={removeWishlistMutation}
                      handleModal={handleModal}
                    />
                  ))}
                </div>
                <div ref={sentinelCallbackRef} aria-hidden="true" />
                {isFetchingNextPage && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] overflow-hidden animate-pulse"
                      >
                        <div className="aspect-[4/3] bg-[var(--surface-graphite)]" />
                        <div className="p-5 flex flex-col gap-2.5">
                          <div className="h-6 w-32 bg-[var(--surface-graphite)]" />
                          <div className="h-3 w-full bg-[var(--surface-graphite)]" />
                          <div className="h-3 w-3/4 bg-[var(--surface-graphite)]" />
                          <div className="h-px bg-[var(--line)] my-1" />
                          <div className="h-3 w-1/2 bg-[var(--surface-graphite)]" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!hasNextPage && properties.length > 0 && (
                  <p className="text-center text-[var(--ink-faint)] text-[12px] py-6 tracking-wide">
                    All {properties.length.toLocaleString()} listings loaded
                  </p>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-24 text-[var(--ink-soft)]">
                <div className="w-14 h-14 rounded-full bg-[var(--sage)]/12 border border-[var(--sage)]/40 flex items-center justify-center mb-4">
                  <FiSearch className="text-[var(--sage-deep)]" size={20} />
                </div>
                <p className="font-serif text-xl text-[var(--ink)] mb-1">
                  No residences within this view
                </p>
                <p className="text-sm">
                  Widen the search or draw back the map to uncover more.
                </p>
              </div>
            )}
          </div>

          {/* Hint pill */}
          <div
            className="flex items-center justify-center gap-2 py-3 px-4 border border-[var(--line)] rounded-[var(--radius-md)] bg-[var(--cream)] cursor-pointer hover:border-[var(--sage-deep)]/40 transition-colors"
            onClick={() => {
              const el = document.getElementById("mls-search-input");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                (el as HTMLInputElement).focus();
              }
            }}
          >
            <span className="text-[13px] text-[var(--ink-soft)]">
              Search an area to reveal more residences —
            </span>
            <span className="text-[12px] text-[var(--sage-deep)] uppercase tracking-[0.2em] font-[family-name:var(--font-accent)]">
              Search
            </span>
          </div>
        </div>

        {/* Map column — sticky */}
        {showMapSection && (
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-[180px] h-[calc(100vh-220px)] min-h-[560px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)]">
              {isLoading ? (
                <div className="w-full h-full bg-[var(--surface-graphite)] animate-pulse" />
              ) : (
                <GoogleMapComponent
                  markers={mappableProperties}
                  onMarkerHover={(p: any) => setHoveredProperty(p)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function SplitSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/3] bg-[var(--surface-graphite)]" />
          <div className="p-5 flex flex-col gap-2.5">
            <div className="h-6 w-32 bg-[var(--surface-graphite)]" />
            <div className="h-3 w-full bg-[var(--surface-graphite)]" />
            <div className="h-3 w-3/4 bg-[var(--surface-graphite)]" />
            <div className="h-px bg-[var(--line)] my-1" />
            <div className="h-3 w-1/2 bg-[var(--surface-graphite)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
