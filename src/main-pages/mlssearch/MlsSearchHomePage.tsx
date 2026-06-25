"use client";

import FilterTop from "@/component/mlsSearchMenu/filterTop";
import { MlsPropertyMapPage } from "@/component/mlsSearchMenu/MlsPropertyMapPage";
import { MlsListingOptions } from "@/component/mlsSearchMenu/MlsListingOptions";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMlsPropertyListInfinite } from "@/services/properties/PropertyQueries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { MlsPropertyCard } from "@/component/mlsSearchMenu/MlsPropertyCard";
import RegistrationModal from "../auth/RegistrationModal";
import LoginModal from "../auth/LoginModal";
import { GoogleMapComponent } from "@/component/mlsSearchMenu/MlsMap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  postUserPropertyWishlist,
  removeWishlistItem,
} from "@/services/profile/ProfileServices";
import { useUserWishlist } from "@/services/profile/ProfileQueries";
import { saveSearches } from "@/services/properties/PropertyServices";
import GoogleMapsProvider from "@/provider/GoogleMapProvider";
import type { SearchFilters } from "@/types/Property";
import { DEFAULT_PROPERTY_STATUS, isValidAreaSearch } from "@/component/mlsSearchMenu/filterDefaults";
import { FiSearch } from "react-icons/fi";

type Property = { id: string; [key: string]: any };

const SAVED_FILTERS_STORAGE_KEY = "saved_search_filters";

const DEFAULT_FILTERS: SearchFilters = {
  keyword: "",
  pageLimit: 20,
  page: 1,
  property_status: DEFAULT_PROPERTY_STATUS,
  property_type: "",
  property_for: "",
  category_type: "",
  price_min: 0,
  price_max: 0,
  bed_min: 0,
  bed_max: 0,
  bath_min: 0,
  bath_max: 0,
  garage_min: 0,
  garage_max: 0,
  square_footage_min: 0,
  square_footage_max: 0,
  community_amenities: "",
  property_view: "",
  lot_size_min: 0,
  lot_size_max: 0,
  year_built_min: 0,
  year_built_max: 0,
  max_annual_tax: 0,
  stories: 0,
  premium: false,
  exclusive: false,
  price_on_request: false,
  construction_status: "",
  furnishing: "",
  available_from: "",
  rented: false,
  mls_city: "",
  mls_state: "",
  zip: "",
  mls_county: "",
  mls_basement: "",
  mls_sewer: "",
  mls_school_district: "",
  mls_builder_name: "",
  mls_list_agent: "",
  mls_site_features: "",
  mls_lot_feature: "",
  interior_features: "",
};

const canPinOnMap = (value: unknown): boolean => {
  if (value === false || value === 0) return false;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized !== "false" && normalized !== "0";
  }
  return true;
};

/**
 * Advanced (area-gated) filter keys. These predicates are non-indexable on the
 * MLS side and must never be sent without a location anchor, or the backend
 * scans millions of rows and times out (503).
 */
const ADVANCED_FILTER_KEYS: (keyof SearchFilters)[] = [
  "garage_min", "garage_max", "square_footage_min", "square_footage_max",
  "lot_size_min", "lot_size_max", "year_built_min", "year_built_max",
  "max_annual_tax", "stories", "mls_basement", "mls_sewer",
  "mls_school_district", "mls_builder_name", "mls_list_agent",
  "mls_site_features", "mls_lot_feature", "community_amenities",
  "property_view", "interior_features", "furnishing", "available_from",
];

/** Advanced filters unlock only with a valid AREA: a city or a ZIP code. */
const hasAreaSelected = (f: SearchFilters): boolean =>
  isValidAreaSearch(f.keyword) || Boolean(f.mls_city) || Boolean(f.zip);

/**
 * Produce the filters actually sent to the backend:
 *  - strip every advanced predicate when no area is selected (defense in depth);
 *  - auto-correct inverted numeric ranges (min must be <= max).
 */
const buildEffectiveFilters = (f: SearchFilters): SearchFilters => {
  const out: SearchFilters = { ...f };

  if (!hasAreaSelected(out)) {
    for (const key of ADVANCED_FILTER_KEYS) {
      (out as Record<string, unknown>)[key] =
        typeof DEFAULT_FILTERS[key] === "number" ? 0 : "";
    }
  }

  const swapIfInverted = (minKey: keyof SearchFilters, maxKey: keyof SearchFilters) => {
    const min = Number(out[minKey] ?? 0);
    const max = Number(out[maxKey] ?? 0);
    if (min && max && min > max) {
      (out as Record<string, unknown>)[minKey] = max;
      (out as Record<string, unknown>)[maxKey] = min;
    }
  };
  swapIfInverted("price_min", "price_max");
  swapIfInverted("bed_min", "bed_max");
  swapIfInverted("bath_min", "bath_max");
  swapIfInverted("square_footage_min", "square_footage_max");
  swapIfInverted("lot_size_min", "lot_size_max");
  swapIfInverted("year_built_min", "year_built_max");

  return out;
};

/** Filter keys mirrored to the URL query string for shareable / back-forward UX. */
const URL_SYNC_KEYS: (keyof SearchFilters)[] = [
  "keyword", "property_status", "property_type", "property_for", "category_type",
  "price_min", "price_max", "bed_min", "bed_max", "bath_min", "bath_max",
  "mls_city", "mls_state", "zip", "mls_county",
  ...ADVANCED_FILTER_KEYS,
];

/** Serialize non-default filter values into URLSearchParams (empty/zero omitted). */
const filtersToSearchParams = (f: SearchFilters): URLSearchParams => {
  const params = new URLSearchParams();
  for (const key of URL_SYNC_KEYS) {
    const value = f[key];
    if (value === undefined || value === null) continue;
    if (typeof value === "number") {
      if (value) params.set(key, String(value));
    } else if (typeof value === "string") {
      if (value.trim()) params.set(key, value);
    }
  }
  return params;
};

/** Hydrate a partial filter object from URL params (numbers coerced). */
const searchParamsToPartial = (sp: URLSearchParams): Partial<SearchFilters> => {
  const partial: Record<string, unknown> = {};
  for (const key of URL_SYNC_KEYS) {
    const raw = sp.get(key);
    if (raw == null || raw === "") continue;
    partial[key] = typeof DEFAULT_FILTERS[key] === "number" ? Number(raw) : raw;
  }
  return partial as Partial<SearchFilters>;
};


const MlsSerchHomePage = () => {
  const searchParams = useSearchParams();
  const locationFromParams = searchParams.get("keyword") || "";

  const queryClient = useQueryClient();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  // Stable ref holding live scroll state — avoids stale closures in the observer callback
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  const scrollState = useRef<{ hasNextPage: boolean; isFetchingNextPage: boolean; fetchNextPage: () => void }>({
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: () => {},
  });
  // Default to split view (list + map) on first open
  const [openMapPropertyGrid, setOpenMapPropertyGrid] = useState(true);
  const [openMapGrid, setOpenMapGrid] = useState(false);
  const [openPropertyGrid, setOpenPropertyGrid] = useState(false);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>(() => {
    const base: SearchFilters = { ...DEFAULT_FILTERS, keyword: locationFromParams };

    if (typeof window !== "undefined") {
      // Hydrate from the URL query string first so shared / bookmarked searches
      // and browser back/forward restore the full filter state.
      const urlPartial = searchParamsToPartial(
        new URLSearchParams(window.location.search),
      );
      Object.assign(base, urlPartial);

      const legacyType = sessionStorage.getItem("prop_type") ?? "";
      const legacyMaxPrice = sessionStorage.getItem("prop_max_price") ?? "";
      if (legacyType) base.property_type = legacyType;
      if (legacyMaxPrice) base.price_max = Number(legacyMaxPrice);

      const raw = sessionStorage.getItem(SAVED_FILTERS_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            return {
              ...base,
              ...parsed,
              page: 1,
              pageLimit: 20,
              keyword: parsed.keyword || parsed.mls_city || base.keyword,
              mls_city: parsed.mls_city || base.mls_city,
            };
          }
        } catch (err) {
          console.error("Failed to parse saved search filters:", err);
        }
      }
    }
    return base;
  });

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("prop_type");
      sessionStorage.removeItem("prop_max_price");
      sessionStorage.removeItem(SAVED_FILTERS_STORAGE_KEY);
    };
  }, []);

  useEffect(() => {
    if (!locationFromParams) return;
    setSearchFilters((prev) => ({
      ...prev,
      keyword: locationFromParams,
    }));
  }, [locationFromParams]);

  const clearFilters = () => setSearchFilters(DEFAULT_FILTERS);

  /* -------- Mutations -------- */
  const postSaveSearchMutation = useMutation({
    mutationFn: (data: any) => saveSearches(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedSearches"] });
      toast.success("Search saved successfully", { autoClose: 3000 });
    },
    onError: () => {
      toast.error("Failed to save search", { autoClose: 3000 });
    },
  });

  const postWishlistMutation = useMutation({
    mutationFn: (property: any) => postUserPropertyWishlist(property),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["userWishlistInfo"] });
      queryClient.invalidateQueries({ queryKey: ["mlsPropertyList"] });
      toast.success(data?.message || "Added to favorites", { autoClose: 3000 });
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.", { autoClose: 5000 });
    },
  });

  const removeWishlistMutation = useMutation({
    mutationFn: (id: string) => removeWishlistItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userWishlistInfo"] });
      queryClient.invalidateQueries({ queryKey: ["mlsPropertyList"] });
      toast.success("Removed from favorites", { autoClose: 3000 });
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.", { autoClose: 5000 });
    },
  });

  /* -------- Data -------- */
  // Gate full property search at >= 2 chars; faster debounce for snappier results.
  // Empty keyword still fires (no filter), and 1-char input is suggestion-only.
  const [debouncedKeyword, setDebouncedKeyword] = useState(searchFilters.keyword);
  useEffect(() => {
    const trimmed = (searchFilters.keyword || "").trim();
    if (!trimmed) return setDebouncedKeyword("");
    if (trimmed.length < 2) return; // hold last results while typing first char
    const id = setTimeout(() => setDebouncedKeyword(searchFilters.keyword), 250);
    return () => clearTimeout(id);
  }, [searchFilters.keyword]);

  const mlsQueryFilters = { ...searchFilters, keyword: debouncedKeyword };
  // Defense in depth: never send advanced predicates without an area anchor,
  // and auto-correct inverted ranges before the request leaves the client.
  const effectiveFilters = useMemo(
    () => buildEffectiveFilters(mlsQueryFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(mlsQueryFilters)],
  );
  const areaSelected = hasAreaSelected(searchFilters);

  // When the area anchor is removed, advanced filters become invalid (locked).
  // Reset them while preserving still-valid basic filters across area changes.
  useEffect(() => {
    if (areaSelected) return;
    setSearchFilters((prev) => {
      let changed = false;
      const next: SearchFilters = { ...prev };
      for (const key of ADVANCED_FILTER_KEYS) {
        const cleared = typeof DEFAULT_FILTERS[key] === "number" ? 0 : "";
        if (next[key] !== cleared) {
          (next as Record<string, unknown>)[key] = cleared;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [areaSelected]);

  // Mirror the full filter state into the URL (shareable + back/forward).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = filtersToSearchParams(searchFilters);
    const query = params.toString();
    const next = `${window.location.pathname}${query ? `?${query}` : ""}`;
    if (next !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState({}, "", next);
    }
  }, [searchFilters]);

  const {
    data: infiniteData,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useMlsPropertyListInfinite(effectiveFilters);
  const { data: wishlistData } = useUserWishlist();

  const properties = useMemo(() => {
    const raw: Property[] = infiniteData?.pages.flatMap((p: any) => p.data || []) ?? [];
    const wishlistItems: any[] = wishlistData?.data || [];
    const keys = new Set(wishlistItems.map((w: any) => w.listing_key || w.mls_listingkey));
    const ids = new Set(wishlistItems.map((w: any) => w.listing_id || w.mls_listingid));
    return raw.map((p) => ({
      ...p,
      is_wishlisted:
        keys.has(p.mls_listingkey) ||
        ids.has(p.mls_listingid) ||
        p.is_wishlisted ||
        false,
    }));
  }, [infiniteData, wishlistData]);

  const totalCount: number = (infiniteData?.pages[0] as any)?.meta?.total ?? 0;

  // Sync scroll state into a ref so the observer callback always reads fresh values
  // without needing to reconnect the observer on every state change.
  scrollState.current = { hasNextPage: hasNextPage ?? false, isFetchingNextPage, fetchNextPage };

  // Stable callback ref — React calls this when the sentinel mounts/unmounts.
  // The observer is created once per sentinel mount; stale-closure bugs are avoided
  // because the callback reads from scrollState.current at fire-time.
  const sentinelCallbackRef = useCallback((el: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    sentinelElRef.current = el;
    if (!el) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const { hasNextPage, isFetchingNextPage, fetchNextPage } = scrollState.current;
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }
      },
      { rootMargin: "400px" }
    );
    observerRef.current.observe(el);
  }, []); // intentionally empty — stability is the goal

  // Follow-up: after a page loads, if the sentinel is still in/near the viewport
  // (e.g. first page didn't fill the screen), kick off the next fetch. The
  // IntersectionObserver only fires on intersection-state changes, so without
  // this we'd stall when the sentinel never leaves the visible area.
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const el = sentinelElRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top - window.innerHeight < 400) {
      fetchNextPage();
    }
  }, [properties.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const mappableProperties = (properties as Property[])
    .filter((p) => canPinOnMap(p?.NWM_ShowMapLink))
    .map((p) => ({ ...p, lat: Number(p.latitude), lng: Number(p.longitude) }))
    .filter(
      (p) => !isNaN(p.lat) && !isNaN(p.lng) && p.lat !== 0 && p.lng !== 0
    );
  const canShowMapViews = mappableProperties.length > 0;

  useEffect(() => {
    // While the first page is still loading, keep whatever view is mounted
    // (split is the default) so we don't flash split → grid → split.
    if (isLoading) return;
    if (!canShowMapViews) {
      setOpenPropertyGrid(true);
      setOpenMapGrid(false);
      setOpenMapPropertyGrid(false);
      return;
    }
    if (showMap) {
      setOpenMapPropertyGrid(true);
      setOpenMapGrid(false);
      setOpenPropertyGrid(false);
    } else {
      setOpenPropertyGrid(true);
      setOpenMapGrid(false);
      setOpenMapPropertyGrid(false);
    }
  }, [showMap, canShowMapViews, isLoading]);

  /* -------- Handlers -------- */
  const handleSearch = (value: string, key: keyof SearchFilters) => {
    if (key === "price_max") sessionStorage.setItem("prop_max_price", value);
    if (key === "property_type") sessionStorage.setItem("prop_type", value);
    setSearchFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleModal = () => setIsLoginModalOpen(true);
  const handleOpenRegistration = () => {
    setIsLoginModalOpen(false);
    setIsRegistrationModalOpen(true);
  };

  const handleSaveSearch = () => {
    const token = sessionStorage.getItem("access_token");
    const customerId = sessionStorage.getItem("customer_id");
    if (!token || !customerId) {
      toast.info("Please login to save your search.", { autoClose: 3000 });
      setIsLoginModalOpen(true);
      return;
    }
    const nameParts: string[] = [];
    if (searchFilters.keyword) nameParts.push(searchFilters.keyword);
    if (searchFilters.property_type) nameParts.push(searchFilters.property_type);
    if (searchFilters.property_for) nameParts.push(searchFilters.property_for);
    if (searchFilters.property_status) nameParts.push(searchFilters.property_status);
    if (searchFilters.price_min || searchFilters.price_max) {
      nameParts.push(
        `$${searchFilters.price_min || 0}-$${searchFilters.price_max || "Any"}`
      );
    }
    if (searchFilters.bed_min || searchFilters.bed_max) {
      nameParts.push(
        `${searchFilters.bed_min || 0}-${searchFilters.bed_max || "Any"} beds`
      );
    }
    const searchName =
      nameParts.length > 0
        ? nameParts.join(" | ")
        : `Search ${new Date().toLocaleDateString()}`;
    postSaveSearchMutation.mutate({
      user_id: customerId,
      filters: searchFilters,
      name: searchName,
      uuid: process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID,
    });
  };



  return (
    <GoogleMapsProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
      <RegistrationModal
        handleModal={handleModal}
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onSuccess={() => undefined}
        onOpenLogin={handleModal}
      />
      <LoginModal
        isHeader={false}
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsLoginModalOpen(false)}
        onOpenRegistration={handleOpenRegistration}
      />

      <FilterTop
        handleSearch={handleSearch}
        searchFilters={searchFilters}
        handleSaveSearch={handleSaveSearch}
        handleClearFilters={clearFilters}
        isSavingSearch={postSaveSearchMutation.isPending}
      />

      <div className="container-wide py-6">
        {/* Results bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[var(--line)]">
          <div className="text-[13px] text-[var(--ink-faint)] tracking-wide font-[family-name:var(--font-accent)]">
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                </svg>
                Gathering listings…
              </span>
            ) : properties.length ? (
              <span>
                <strong className="text-[var(--sage-deep)] font-normal">
                  {properties.length}
                </strong>{" "}
                {totalCount > 0 ? (
                  <>
                    <span className="text-[var(--ink-faint)]">of</span>{" "}
                    <strong className="text-[var(--ink)] font-normal">
                      {totalCount.toLocaleString()}
                    </strong>{" "}
                    residences in view
                  </>
                ) : (
                  <span className="text-[var(--ink-faint)]">
                    {hasNextPage ? "residences in view — draw down for more" : "residences in view"}
                  </span>
                )}
              </span>
            ) : (
              <span>No residences answer to these filters</span>
            )}
          </div>
          <MlsListingOptions
            handleOpenMapPropertyGrid={() => {
              setOpenMapPropertyGrid(true);
              setOpenMapGrid(false);
              setOpenPropertyGrid(false);
            }}
            openMapPropertyGrid={openMapPropertyGrid}
            handleOpenMapGrid={() => {
              setOpenMapGrid(true);
              setOpenMapPropertyGrid(false);
              setOpenPropertyGrid(false);
            }}
            openMapGrid={openMapGrid}
            handleOpenPropertyGrid={() => {
              setOpenPropertyGrid(true);
              setOpenMapPropertyGrid(false);
              setOpenMapGrid(false);
            }}
            openPropertyGrid={openPropertyGrid}
            canShowMapViews={canShowMapViews}
            handleSearch={handleSearch}
            searchFilters={searchFilters}
            handleShowmapDongle={() => setShowMap((s) => !s)}
            showMap={showMap}
          />
        </div>

        <div className="mt-8 min-h-[500px]">
          {openMapPropertyGrid && (
            <MlsPropertyMapPage
              postWishlistMutation={(data: any) =>
                postWishlistMutation.mutate(data)
              }
              removeWishlistMutation={(id: string) =>
                removeWishlistMutation.mutate(id)
              }
              properties={properties}
              handleModal={handleModal}
              isLoading={isLoading}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          )}

          {openPropertyGrid && (
            <>
              {isLoading ? (
                <GridSkeleton />
              ) : properties.length ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {properties.map((item) => (
                      <MlsPropertyCard
                        key={item.id}
                        item={item}
                        handleModal={handleModal}
                        postWishlistMutation={(data: any) =>
                          postWishlistMutation.mutate(data)
                        }
                        removeWishlistMutation={(id: string) =>
                          removeWishlistMutation.mutate(id)
                        }
                      />
                    ))}
                  </div>
                  {/* Infinite scroll sentinel — callback ref fires when this mounts/unmounts */}
                  <div ref={sentinelCallbackRef} aria-hidden="true" />

                  {/* Loading skeleton cards while fetching the next page */}
                  {isFetchingNextPage && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-6">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] overflow-hidden animate-pulse"
                        >
                          <div className="aspect-[4/3] bg-[var(--surface-graphite)]" />
                          <div className="p-6 flex flex-col gap-3">
                            <div className="h-7 w-40 bg-[var(--surface-graphite)]" />
                            <div className="h-4 w-full bg-[var(--surface-graphite)]" />
                            <div className="h-4 w-3/4 bg-[var(--surface-graphite)]" />
                            <div className="h-px bg-[var(--line)] my-1" />
                            <div className="h-4 w-1/2 bg-[var(--surface-graphite)]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!hasNextPage && properties.length > 0 && (
                    <p className="text-center text-[var(--ink-faint)] text-[13px] py-10 tracking-[0.2em] uppercase font-[family-name:var(--font-accent)]">
                      You have reached the end of the collection · {properties.length.toLocaleString()} residences
                    </p>
                  )}
                </>
              ) : (
                <EmptyState onClear={clearFilters} />
              )}
            </>
          )}

          {openMapGrid && (
            properties.length ? (
              <div className="h-[calc(100vh-200px)] min-h-[560px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)]">
                <GoogleMapComponent
                  markers={mappableProperties}
                  onMarkerHover={(p: any) => setHoveredProperty(p)}
                />
              </div>
            ) : (
              <EmptyState onClear={clearFilters} />
            )
          )}
        </div>
      </div>
    </GoogleMapsProvider>
  );
};

export default MlsSerchHomePage;

/* ---------- Helpers ---------- */

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/3] bg-[var(--surface-graphite)]" />
          <div className="p-6 flex flex-col gap-3">
            <div className="h-7 w-40 bg-[var(--surface-graphite)]" />
            <div className="h-4 w-full bg-[var(--surface-graphite)]" />
            <div className="h-4 w-3/4 bg-[var(--surface-graphite)]" />
            <div className="h-px bg-[var(--line)] my-1" />
            <div className="h-4 w-1/2 bg-[var(--surface-graphite)]" />
          </div>
        </div>
      ))}
    </div>
  );
}



function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="py-24 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-full border border-[var(--sage)]/40 bg-[var(--sage)]/10 flex items-center justify-center mb-6">
        <FiSearch size={24} className="text-[var(--sage-deep)]" />
      </div>
      <span className="eyebrow mb-4">Nothing yet</span>
      <h3 className="font-serif text-3xl text-[var(--ink)] mb-3">
        No residences answer to this search
      </h3>
      <p className="text-[var(--ink-soft)] mb-8 leading-relaxed">
        Widen your locale, ease the price, or lift a filter or two — there may be
        something lovely waiting just outside these bounds.
      </p>
      <button onClick={onClear} className="btn-outline-new">
        Reset the search
      </button>
    </div>
  );
}
