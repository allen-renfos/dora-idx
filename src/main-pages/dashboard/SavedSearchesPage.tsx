"use client";

import { useRouter } from "next/navigation";
import {
  FiBookmark,
  FiSearch,
  FiMapPin,
  FiHome,
  FiDollarSign,
  FiCalendar,
  FiArrowRight,
  FiTrash2,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useSavedSearches, useDeleteSavedSearch } from "@/services/properties/PropertyQueries";
import { DashboardLayout } from "@/component/ui/DashboardLayout";

const SAVED_FILTERS_KEY = "saved_search_filters";

const SavedSearchesPage = () => {
  const { data, isLoading } = useSavedSearches();
  const deleteSavedSearch = useDeleteSavedSearch();
  const router = useRouter();

  const savedSearches: any[] = data?.data || [];

  const handleDelete = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    deleteSavedSearch.mutate(id, {
      onSuccess: () => {
        toast.success("Saved search removed", {
          style: { background: "#ffffff", color: "#1a1a1a", border: "1px solid #c2a878" },
          iconTheme: { primary: "#c2a878", secondary: "#ffffff" },
        });
      },
      onError: () => {
        toast.error("Failed to delete saved search");
      },
    });
  };

  const handleClick = (search: any) => {
    const filters = search.filters;
    if (!filters) return;

    sessionStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(filters));
    if (filters.property_type)
      sessionStorage.setItem("prop_type", filters.property_type || "");
    if (filters.price_max)
      sessionStorage.setItem("prop_max_price", filters.price_max.toString());

    let path = "/properties";
    if (filters.keyword) {
      path += `?keyword=${encodeURIComponent(filters.keyword)}`;
    }
    router.push(path);
  };

  const formatDate = (s: string) => {
    if (!s) return "";
    try {
      return new Date(s).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const formatPrice = (price: number) =>
    !price
      ? ""
      : price >= 1_000_000
        ? `$${(price / 1_000_000).toFixed(1)}M`
        : `$${price.toLocaleString()}`;

  const tagsFor = (filters: any) => {
    const tags: { label: string; Icon?: React.ComponentType<{ size?: number }> }[] = [];
    if (!filters) return tags;
    if (filters.property_type)
      tags.push({ label: filters.property_type, Icon: FiHome });
    if (filters.bed_min || filters.bed_max) {
      const v =
        filters.bed_min && filters.bed_max
          ? `${filters.bed_min}–${filters.bed_max} beds`
          : filters.bed_min
            ? `${filters.bed_min}+ beds`
            : `Up to ${filters.bed_max} beds`;
      tags.push({ label: v });
    }
    if (filters.bath_min || filters.bath_max) {
      const v =
        filters.bath_min && filters.bath_max
          ? `${filters.bath_min}–${filters.bath_max} baths`
          : filters.bath_min
            ? `${filters.bath_min}+ baths`
            : `Up to ${filters.bath_max} baths`;
      tags.push({ label: v });
    }
    if (filters.price_min || filters.price_max) {
      const v =
        filters.price_min && filters.price_max
          ? `${formatPrice(filters.price_min)} – ${formatPrice(filters.price_max)}`
          : filters.price_min
            ? `From ${formatPrice(filters.price_min)}`
            : `Up to ${formatPrice(filters.price_max)}`;
      tags.push({ label: v, Icon: FiDollarSign });
    }
    if (filters.mls_city)
      tags.push({ label: filters.mls_city, Icon: FiMapPin });
    if (filters.zip) tags.push({ label: `ZIP ${filters.zip}` });
    return tags;
  };

  return (
    <DashboardLayout
      active="Saved Searches"
      eyebrow="Saved"
      title="Your saved searches"
      description={
        savedSearches.length
          ? `${savedSearches.length} saved ${savedSearches.length === 1 ? "search" : "searches"}, ready when you are.`
          : "Save the criteria you care about and return to them in a single click."
      }
      actions={
        savedSearches.length > 0 ? (
          <button
            onClick={() => router.push("/properties")}
            className="btn-outline-new"
          >
            <FiSearch size={14} />
            New search
          </button>
        ) : undefined
      }
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] p-6 animate-pulse h-[180px]"
            >
              <div className="h-3 w-24 bg-[var(--canvas-2)] rounded-[var(--radius-xs)] mb-3" />
              <div className="h-5 w-3/4 bg-[var(--canvas-2)] rounded-[var(--radius-xs)] mb-3" />
              <div className="h-4 w-1/2 bg-[var(--canvas-2)] rounded-[var(--radius-xs)]" />
            </div>
          ))}
        </div>
      ) : savedSearches.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedSearches.map((s, i) => {
            const filters = s.filters || {};
            const tags = tagsFor(filters);
            return (
              <button
                key={s.id}
                onClick={() => handleClick(s)}
                className="group relative text-left bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] hover:border-[var(--sage-deep)]/60 hover:shadow-[var(--shadow-soft)] p-6 transition-all flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--canvas)] border border-[var(--line)] flex items-center justify-center text-[var(--sage-deep)]">
                    <FiBookmark size={16} />
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, s.id)}
                    disabled={deleteSavedSearch.isPending && deleteSavedSearch.variables === s.id}
                    aria-label="Delete saved search"
                    className="w-8 h-8 flex items-center justify-center text-[var(--ink-faint)] hover:text-red-500 transition-colors disabled:opacity-40"
                  >
                    {deleteSavedSearch.isPending && deleteSavedSearch.variables === s.id ? (
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <FiTrash2 size={15} />
                    )}
                  </button>
                </div>

                <h3 className="font-serif text-xl text-[var(--ink)] leading-tight line-clamp-2">
                  {s.name || filters.keyword || "Untitled search"}
                </h3>

                {filters.keyword && (
                  <p className="flex items-center gap-2 text-[13px] text-[var(--ink-soft)]">
                    <FiMapPin size={12} className="text-[var(--sage-deep)]" />
                    {filters.keyword}
                  </p>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tags.map((t, idx) => {
                      const Icon = t.Icon;
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 h-7 px-2.5 bg-[var(--canvas)] border border-[var(--line)] text-[11px] text-[var(--ink-soft)] rounded-full"
                        >
                          {Icon && <Icon size={11} />}
                          {t.label}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-[var(--line)] flex items-center justify-between text-[12px] text-[var(--ink-faint)]">
                  {s.created_at && (
                    <span className="inline-flex items-center gap-1.5">
                      <FiCalendar size={12} />
                      {formatDate(s.created_at)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-[var(--sage-deep)] uppercase tracking-[0.18em] font-[family-name:var(--font-accent)] group-hover:translate-x-0.5 transition-transform">
                    View results
                    <FiArrowRight size={12} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="bg-[var(--cream)] border border-dashed border-[var(--line-medium)] rounded-[var(--radius-md)] py-20 px-6 flex flex-col items-center text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[var(--canvas)] border border-[var(--line)] flex items-center justify-center mb-6">
            <FiBookmark size={22} className="text-[var(--sage-deep)]" />
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-[var(--ink)] mb-3">
            No saved searches yet
          </h3>
          <p className="text-[var(--ink-soft)] mb-8 leading-relaxed">
            From any results page, save the filters that matter to you and
            we&rsquo;ll keep them here for a one-click return.
          </p>
          <button
            onClick={() => router.push("/properties")}
            className="btn-gold-new"
          >
            <FiSearch size={14} />
            Start a search
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SavedSearchesPage;
