"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiChevronDown, FiSliders, FiX, FiBookmark } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import {
  useAutocomplete,
  AutocompleteSuggestion,
} from "@/services/search/AutocompleteQueries";
import { FilterTopProps } from "@/types/Property";
import MLSAdvanceSearch from "./MLSAdvanceSearch";

const PRICE_STEPS = [
  50000, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000,
  1000000, 1500000, 2000000, 3000000, 5000000, 10000000, 20000000,
];
const BED_STEPS = [1, 2, 3, 4, 5, 6];
const BATH_STEPS = [1, 2, 3, 4, 5, 6];

const formatPrice = (n: number) => {
  if (n >= 1_000_000) return `$${n / 1_000_000}M`.replace(".0M", "M");
  if (n >= 1_000) return `$${n / 1_000}K`;
  return `$${n}`;
};

type Props = FilterTopProps & { handleClearFilters?: () => void };

const FilterTop = ({
  handleSearch,
  searchFilters,
  handleSaveSearch,
  handleClearFilters,
  isSavingSearch,
}: Props) => {
  const searchParams = useSearchParams();
  const keywordFromParams = searchParams.get("keyword") || "";

  const [inputValue, setInputValue] = useState(searchFilters.keyword || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [openPopover, setOpenPopover] = useState<
    "price" | "beds" | "baths" | null
  >(null);
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const { data: autocompleteResults, isFetching } = useAutocomplete(inputValue);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isFetching) setIsSearching(false);
  }, [isFetching]);
  const trimmedInput = inputValue.trim();

  useEffect(() => {
    if (keywordFromParams) setInputValue(keywordFromParams);
  }, [keywordFromParams]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowDropdown(false);
      }
      if (popoverRef.current && !popoverRef.current.contains(target)) {
        setOpenPopover(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const groupedSuggestions = useMemo(() => {
    const visible = trimmedInput.length >= 1 ? autocompleteResults || [] : [];
    const grouped = visible.reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      const dup = acc[curr.category].some(
        (s: AutocompleteSuggestion) =>
          s.label.toLowerCase() === curr.label.toLowerCase()
      );
      if (!dup) acc[curr.category].push(curr);
      return acc;
    }, {} as Record<string, AutocompleteSuggestion[]>);

    const priority: Record<string, number> = {
      address: 0,
      zip: 1,
      zipcode: 1,
      county: 2,
      city: 3,
    };
    return Object.entries(grouped).sort(
      ([a], [b]) =>
        (priority[a.toLowerCase()] ?? 99) -
        (priority[b.toLowerCase()] ?? 99)
    );
  }, [autocompleteResults, trimmedInput]);

  // Active states
  const isPriceActive = !!(searchFilters.price_min || searchFilters.price_max);
  const isBedActive = !!(searchFilters.bed_min || searchFilters.bed_max);
  const isBathActive = !!(searchFilters.bath_min || searchFilters.bath_max);
  const hasAny =
    !!inputValue ||
    isPriceActive ||
    isBedActive ||
    isBathActive ||
    !!searchFilters.property_type ||
    !!searchFilters.property_for ||
    !!searchFilters.property_status ||
    !!(searchFilters.square_footage_min || searchFilters.square_footage_max) ||
    !!(searchFilters.mls_city || searchFilters.mls_state || searchFilters.zip) ||
    !!searchFilters.community_amenities ||
    !!searchFilters.property_view ||
    !!searchFilters.interior_features ||
    !!searchFilters.mls_site_features ||
    !!searchFilters.mls_lot_feature ||
    !!searchFilters.construction_status ||
    !!searchFilters.furnishing;

  const activeCount = [
    isPriceActive,
    isBedActive,
    isBathActive,
    !!searchFilters.property_type,
    !!searchFilters.property_for,
    !!searchFilters.property_status,
    !!(searchFilters.square_footage_min || searchFilters.square_footage_max),
    !!(searchFilters.mls_city || searchFilters.mls_state || searchFilters.zip),
    !!inputValue,
  ].filter(Boolean).length;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim()) setIsSearching(true);
    setShowDropdown(true);
    const url = new URL(window.location.href);
    url.searchParams.delete("keyword");
    window.history.replaceState({}, "", url.toString());
    handleSearch(value, "keyword");
    // Clear location-specific fields so free-text input doesn't carry over old city/zip filters
    handleSearch("", "mls_city");
    handleSearch("", "zip");
  };

  const onSuggestionClick = (s: AutocompleteSuggestion) => {
    setInputValue(s.value);
    handleSearch(s.value, "keyword");
    // Map autocomplete category to the correct filter field
    const cat = (s.category ?? "").toLowerCase();
    if (cat === "city") {
      handleSearch(s.value, "mls_city");
      handleSearch("", "zip");
    } else if (cat === "zip" || cat === "zipcode") {
      handleSearch(s.value, "zip");
      handleSearch("", "mls_city");
    } else {
      handleSearch("", "mls_city");
      handleSearch("", "zip");
    }
    setShowDropdown(false);
  };

  const togglePopover = (key: "price" | "beds" | "baths") => {
    setOpenPopover((prev) => (prev === key ? null : key));
  };

  const clearAll = () => {
    setInputValue("");
    setOpenPopover(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("keyword");
    window.history.replaceState({}, "", url.toString());
    if (handleClearFilters) handleClearFilters();
  };

  // Build active filter chip list
  const chips: { label: string; onRemove: () => void }[] = [];
  if (inputValue) {
    chips.push({
      label: inputValue,
      onRemove: () => {
        setInputValue("");
        handleSearch("", "keyword");
      },
    });
  }
  if (searchFilters.price_min || searchFilters.price_max) {
    chips.push({
      label: `${searchFilters.price_min ? formatPrice(Number(searchFilters.price_min)) : "Any"}–${searchFilters.price_max ? formatPrice(Number(searchFilters.price_max)) : "Any"}`,
      onRemove: () => {
        handleSearch("", "price_min" as any);
        handleSearch("", "price_max" as any);
      },
    });
  }
  if (searchFilters.bed_min || searchFilters.bed_max) {
    chips.push({
      label: `${searchFilters.bed_min || "Any"}–${searchFilters.bed_max || "Any"} beds`,
      onRemove: () => {
        handleSearch("", "bed_min" as any);
        handleSearch("", "bed_max" as any);
      },
    });
  }
  if (searchFilters.bath_min || searchFilters.bath_max) {
    chips.push({
      label: `${searchFilters.bath_min || "Any"}–${searchFilters.bath_max || "Any"} baths`,
      onRemove: () => {
        handleSearch("", "bath_min" as any);
        handleSearch("", "bath_max" as any);
      },
    });
  }
  // Advanced filter group chips
  const advancedGroups: { key: keyof typeof searchFilters; label: string }[] = [
    { key: "property_type", label: "Type" },
    { key: "property_status", label: "Status" },
    { key: "community_amenities", label: "Amenities" },
    { key: "property_view", label: "View" },
    { key: "interior_features", label: "Interior" },
    { key: "mls_site_features", label: "Site" },
    { key: "mls_lot_feature", label: "Lot" },
    { key: "construction_status", label: "Construction" },
    { key: "furnishing", label: "Furnishing" },
  ];
  advancedGroups.forEach(({ key, label }) => {
    const val = searchFilters[key] as string;
    if (!val) return;
    const items = val.split("|").filter(Boolean);
    if (!items.length) return;
    chips.push({
      label: items.length === 1 ? `${label}: ${items[0]}` : `${label} (${items.length})`,
      onRemove: () => handleSearch("", key),
    });
  });

  return (
    <div className="sticky top-[68px] z-30 border-y border-[var(--line)] bg-[var(--canvas-2)]/95 backdrop-blur-xl">
      <div className="container-wide py-4 flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div
          ref={dropdownRef}
          className="relative flex-1 min-w-[260px] md:min-w-[320px]"
        >
          <div className="flex items-center h-11 rounded-[var(--radius-pill)] bg-[var(--cream)] border border-[var(--line)] hover:border-[var(--line-medium)] focus-within:border-[var(--sage-deep)]/60 transition-colors">
            <span className="pl-4 text-[var(--sage-deep)]">
              {isSearching ? (
                <svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                </svg>
              ) : (
                <HiOutlineLocationMarker size={16} />
              )}
            </span>
            <input
              id="mls-search-input"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowDropdown(false);
                  handleSearch(inputValue, "keyword");
                }
              }}
              type="text"
              placeholder="Search by city, county, or zip"
              autoComplete="off"
              className="flex-1 px-3 bg-transparent outline-none text-[15px] font-sans text-[var(--ink)] placeholder:text-[var(--ink-faint)]"
            />
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue("");
                  handleSearch("", "keyword");
                  handleSearch("", "mls_city");
                  handleSearch("", "zip");
                  const url = new URL(window.location.href);
                  url.searchParams.delete("keyword");
                  window.history.replaceState({}, "", url.toString());
                }}
                className="pr-3 text-[var(--ink-faint)] hover:text-[var(--ink)]"
                aria-label="Clear search"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 top-full mt-2 bg-[var(--cream)] rounded-[var(--radius-md)] shadow-[var(--shadow-lift)] z-50 max-h-[380px] overflow-y-auto custom-scrollbar border border-[var(--line)] overflow-hidden"
              >
                {trimmedInput.length === 0 ? (
                  <EmptyRow
                    title="Begin typing to find a home"
                    subtitle="Try a city, neighborhood, or zip"
                  />
                ) : groupedSuggestions.length > 0 ? (
                  groupedSuggestions.map(([category, suggestions]) => (
                    <div
                      key={category}
                      className="border-b last:border-0 border-[var(--line)]"
                    >
                      <div className="px-5 py-2 bg-[var(--canvas-2)] text-[10px] text-[var(--ink-faint)] uppercase tracking-[0.24em] flex items-center justify-between font-[family-name:var(--font-accent)]">
                        <span>{category}</span>
                        <span className="h-px flex-1 ml-4 bg-[var(--line)]" />
                      </div>
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => onSuggestionClick(s)}
                          className="w-full text-left px-5 py-3 hover:bg-[var(--canvas)] transition-colors duration-150 flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-[var(--sage)]/15 flex items-center justify-center shrink-0">
                            <HiOutlineLocationMarker
                              className="text-[var(--sage-deep)]"
                              size={14}
                            />
                          </div>
                          <span className="text-[14px] text-[var(--ink)] truncate">
                            {s.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  ))
                ) : (
                  <EmptyRow
                    title="Nothing matches that yet"
                    subtitle="Try a broader keyword"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pill filters */}
        <div
          ref={popoverRef}
          className="flex items-center gap-2 flex-wrap"
        >
          <FilterPill
            label="Price"
            active={isPriceActive}
            open={openPopover === "price"}
            onClick={() => togglePopover("price")}
            activeValue={
              isPriceActive
                ? `${searchFilters.price_min ? formatPrice(Number(searchFilters.price_min)) : "Any"} – ${
                    searchFilters.price_max
                      ? formatPrice(Number(searchFilters.price_max))
                      : "Any"
                  }`
                : undefined
            }
          >
            <RangeSelect
              minLabel="Min"
              maxLabel="Max"
              min={searchFilters.price_min ? String(searchFilters.price_min) : ""}
              max={searchFilters.price_max ? String(searchFilters.price_max) : ""}
              options={PRICE_STEPS.map((n) => ({
                value: String(n),
                label: formatPrice(n),
              }))}
              onChangeMin={(v) => handleSearch(v, "price_min")}
              onChangeMax={(v) => handleSearch(v, "price_max")}
            />
          </FilterPill>

          <FilterPill
            label="Beds"
            active={isBedActive}
            open={openPopover === "beds"}
            onClick={() => togglePopover("beds")}
            activeValue={
              isBedActive
                ? `${searchFilters.bed_min || "Any"} – ${searchFilters.bed_max || "Any"}`
                : undefined
            }
          >
            <RangeSelect
              minLabel="Min"
              maxLabel="Max"
              min={searchFilters.bed_min ? String(searchFilters.bed_min) : ""}
              max={searchFilters.bed_max ? String(searchFilters.bed_max) : ""}
              options={BED_STEPS.map((n) => ({
                value: String(n),
                label: `${n}+`,
              }))}
              onChangeMin={(v) => handleSearch(v, "bed_min")}
              onChangeMax={(v) => handleSearch(v, "bed_max")}
            />
          </FilterPill>

          <FilterPill
            label="Baths"
            active={isBathActive}
            open={openPopover === "baths"}
            onClick={() => togglePopover("baths")}
            activeValue={
              isBathActive
                ? `${searchFilters.bath_min || "Any"} – ${searchFilters.bath_max || "Any"}`
                : undefined
            }
          >
            <RangeSelect
              minLabel="Min"
              maxLabel="Max"
              min={searchFilters.bath_min ? String(searchFilters.bath_min) : ""}
              max={searchFilters.bath_max ? String(searchFilters.bath_max) : ""}
              options={BATH_STEPS.map((n) => ({
                value: String(n),
                label: `${n}+`,
              }))}
              onChangeMin={(v) => handleSearch(v, "bath_min")}
              onChangeMax={(v) => handleSearch(v, "bath_max")}
            />
          </FilterPill>

          <button
            onClick={() => setOpenAdvanced(true)}
            className="relative h-11 px-4 inline-flex items-center gap-2 bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-pill)] hover:border-[var(--sage-deep)]/60 text-[var(--ink)] transition-colors"
            aria-label="All filters"
          >
            <FiSliders size={14} className="text-[var(--sage-deep)]" />
            <span className="text-[13px] tracking-[0.06em] font-[family-name:var(--font-accent)]">
              All Filters
            </span>
            {activeCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[var(--pine)] text-[var(--on-pine)] text-[10px] font-bold rounded-full">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Right side — actions */}
        <div className="ml-auto flex items-center gap-2">
          {hasAny && (
            <button
              onClick={clearAll}
              className="h-11 px-4 inline-flex items-center gap-2 text-[13px] text-[var(--sage-deep)] hover:text-[var(--ink)] transition-colors"
            >
              <FiX size={14} />
              Clear
            </button>
          )}
          <button
            onClick={handleSaveSearch}
            disabled={isSavingSearch}
            className="h-11 px-5 inline-flex items-center gap-2 bg-[var(--pine)] hover:bg-[var(--pine-soft)] text-[var(--on-pine)] text-[12px] tracking-[0.18em] uppercase rounded-[var(--radius-pill)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-[family-name:var(--font-accent)]"
          >
            {isSavingSearch ? (
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
            ) : (
              <FiBookmark size={14} />
            )}
            Save Search
          </button>
        </div>
      </div>

      {/* Active chips */}
      {chips.length > 0 && (
        <div className="container-wide pb-3 flex flex-wrap gap-2">
          {chips.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 h-8 px-3 bg-[var(--sage)]/12 border border-[var(--sage)]/35 text-[12px] text-[var(--sage-deep)] rounded-full"
            >
              {c.label}
              <button
                onClick={c.onRemove}
                className="w-4 h-4 flex items-center justify-center hover:text-[var(--ink)]"
                aria-label={`Remove ${c.label}`}
              >
                <FiX size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {mounted && createPortal(
        <MLSAdvanceSearch
          open={openAdvanced}
          onClose={() => setOpenAdvanced(false)}
          onApply={() => undefined}
          handleSearch={handleSearch}
          searchFilters={searchFilters}
        />,
        document.body
      )}
    </div>
  );
};

export default FilterTop;

/* ---------- Sub-components ---------- */

function EmptyRow({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="px-5 py-5 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-[var(--sage)]/15 flex items-center justify-center">
        <HiOutlineLocationMarker className="text-[var(--sage-deep)]" size={14} />
      </div>
      <div className="flex flex-col">
        <span className="text-[14px] text-[var(--ink)] font-medium">{title}</span>
        <span className="text-[11px] text-[var(--ink-faint)]">{subtitle}</span>
      </div>
    </div>
  );
}

function FilterPill({
  label,
  activeValue,
  active,
  open,
  onClick,
  children,
}: {
  label: string;
  activeValue?: string;
  active: boolean;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`h-11 px-4 inline-flex items-center gap-2 border rounded-[var(--radius-pill)] transition-colors text-[13px] ${
          active
            ? "bg-[var(--sage)]/12 border-[var(--sage-deep)]/60 text-[var(--sage-deep)]"
            : "bg-[var(--cream)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--sage-deep)]/60"
        }`}
      >
        <span className="font-medium">{activeValue || label}</span>
        <FiChevronDown
          size={14}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-2 min-w-[340px] bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] shadow-[var(--shadow-lift)] z-40 p-5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RangeSelect({
  min,
  max,
  options,
  onChangeMin,
  onChangeMax,
  minLabel,
  maxLabel,
}: {
  min: string;
  max: string;
  options: { value: string; label: string }[];
  onChangeMin: (v: string) => void;
  onChangeMax: (v: string) => void;
  minLabel: string;
  maxLabel: string;
}) {
  const minOptions = [{ value: "", label: "No min" }, ...options.filter((o) => !max || Number(o.value) <= Number(max))];
  const maxOptions = [{ value: "", label: "No max" }, ...options.filter((o) => !min || Number(o.value) >= Number(min))];

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Min */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)] font-semibold">
          {minLabel}
        </span>
        <div className="flex flex-col overflow-y-auto max-h-[220px] border border-[var(--line)] rounded-[var(--radius-sm)] custom-scrollbar">
          {minOptions.map((o) => {
            const selected = o.value === min;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => onChangeMin(o.value)}
                className={`text-left px-4 py-2.5 text-[13px] transition-colors duration-150 border-b border-[var(--line)] last:border-0 ${
                  selected
                    ? "bg-[var(--pine)] text-[var(--on-pine)] font-semibold"
                    : "text-[var(--ink-soft)] hover:bg-[var(--canvas-2)] hover:text-[var(--ink)]"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)] font-semibold">
          {maxLabel}
        </span>
        <div className="flex flex-col overflow-y-auto max-h-[220px] border border-[var(--line)] rounded-[var(--radius-sm)] custom-scrollbar">
          {maxOptions.map((o) => {
            const selected = o.value === max;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => onChangeMax(o.value)}
                className={`text-left px-4 py-2.5 text-[13px] transition-colors duration-150 border-b border-[var(--line)] last:border-0 ${
                  selected
                    ? "bg-[var(--pine)] text-[var(--on-pine)] font-semibold"
                    : "text-[var(--ink-soft)] hover:bg-[var(--canvas-2)] hover:text-[var(--ink)]"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
