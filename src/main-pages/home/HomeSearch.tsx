"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { useAutocomplete, AutocompleteSuggestion } from "@/services/search/AutocompleteQueries";
import SellModal from "./SellEnquiryModal";

interface HomeSearchProps {
  keyword: string;
  setKeyword: (k: string) => void;
}

const TABS = [
  { key: "buy", label: "Buy" },
  { key: "sell", label: "Sell" },
] as const;

export default function HomeSearch({ keyword, setKeyword }: HomeSearchProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("buy");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: autocompleteResults, isFetching } = useAutocomplete(keyword);
  const trimmedKeyword = keyword.trim();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isFetching) setIsSearching(false);
  }, [isFetching]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToResults = (value: string) => {
    if (value.trim()) {
      window.location.href = `/properties?keyword=${encodeURIComponent(value)}`;
    } else {
      window.location.href = "/properties";
    }
  };

  const handleSuggestionClick = (s: AutocompleteSuggestion) => {
    setKeyword(s.value);
    setShowDropdown(false);
    goToResults(s.value);
  };

  const groupedEntries = useMemo(() => {
    const visible = trimmedKeyword.length >= 1 ? autocompleteResults || [] : [];
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
    return Object.entries(grouped).sort(([a], [b]) => {
      return (priority[a.toLowerCase()] ?? 99) - (priority[b.toLowerCase()] ?? 99);
    });
  }, [autocompleteResults, trimmedKeyword]);

  return (
    <div className="w-full max-w-[860px]">
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4">
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-5 py-2.5 text-[11px] font-bold tracking-[0.22em] uppercase transition-colors duration-300 ${
                active ? "text-[var(--ink)]" : "text-[var(--ink-faint)] hover:text-[var(--ink-soft)]"
              }`}
            >
              {tab.label}
              {active && (
                <motion.span
                  layoutId="search-tab-indicator"
                  className="absolute left-3 right-3 -bottom-[1px] h-px bg-[var(--gold-500)]"
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Search surface */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === "buy" ? (
            <motion.div
              key="buy"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              ref={dropdownRef}
              className="relative"
            >
              {/* Search bar */}
              <div className="flex items-stretch bg-white/97 backdrop-blur-md shadow-[0_24px_60px_-18px_rgba(0,0,0,0.5)]">
                <div className="pl-4 flex items-center text-[var(--gold-600)] shrink-0">
                  {isSearching ? (
                    <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <FiSearch size={18} strokeWidth={1.8} />
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setShowDropdown(true);
                    if (e.target.value.trim()) setIsSearching(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") goToResults(keyword);
                  }}
                  placeholder="City, address or zip"
                  autoComplete="off"
                  className="flex-1 min-w-0 h-[58px] sm:h-[64px] px-3 text-[14px] sm:text-[15px] font-sans text-[#1a1a1a] bg-transparent border-0 outline-none placeholder:text-[#999]"
                />
                {/* Desktop: button inside bar */}
                <button
                  onClick={() => goToResults(keyword)}
                  className="hidden sm:flex shrink-0 items-center h-[64px] px-9 text-[11px] font-bold tracking-[0.2em] uppercase bg-[var(--ink)] text-white hover:bg-[var(--accent)] hover:text-white transition-colors duration-300"
                >
                  Search
                </button>
              </div>
              {/* Mobile: full-width button below the bar */}
              <button
                onClick={() => goToResults(keyword)}
                className="sm:hidden w-full mt-3 h-[50px] flex items-center justify-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase bg-[var(--ink)] text-white hover:bg-[var(--accent-text)] transition-colors duration-300"
              >
                <FiSearch size={15} strokeWidth={2.5} />
                Search
              </button>

              {/* Autocomplete dropdown */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full mt-1 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-[100] max-h-[380px] overflow-y-auto custom-scrollbar border-t border-[var(--gold-500)]/30"
                  >
                    {trimmedKeyword.length === 0 ? (
                      <EmptyRow
                        title="Start typing to discover properties"
                        subtitle="Try a city, neighborhood, or zip code"
                      />
                    ) : groupedEntries.length > 0 ? (
                      groupedEntries.map(([category, suggestions]) => (
                        <div
                          key={category}
                          className="border-b last:border-0 border-gray-100"
                        >
                          <div className="px-5 py-2 bg-[#f9f8f5] text-[10px] font-bold text-[#6d6c67] uppercase tracking-[0.24em] flex items-center justify-between">
                            <span>{category}</span>
                            <span className="h-[1px] flex-1 ml-4 bg-gray-200" />
                          </div>
                          {suggestions.map((s, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSuggestionClick(s)}
                              className="w-full text-left px-5 py-3 hover:bg-[#f9f8f5] transition-colors duration-150 flex items-center gap-3"
                            >
                              <div className="w-8 h-8 rounded-full bg-[#f4f1ea] flex items-center justify-center shrink-0">
                                <HiOutlineLocationMarker
                                  className="text-[var(--gold-600)]"
                                  size={14}
                                />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="truncate text-[14px] text-[#1a1a1a] font-medium">
                                  {s.label}
                                </span>
                                <span className="text-[11px] text-[#888] capitalize">
                                  {category.toLowerCase()}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ))
                    ) : (
                      <EmptyRow
                        title="No matches found"
                        subtitle="Try a broader area or different spelling"
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="sell"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Sell bar */}
              <div className="flex items-stretch bg-white/97 backdrop-blur-md shadow-[0_24px_60px_-18px_rgba(0,0,0,0.5)]">
                <div className="flex-1 min-w-0 px-5 h-[58px] sm:h-[64px] flex flex-col justify-center">
                  <span className="font-serif text-[14px] sm:text-[15px] text-[#1a1a1a] leading-tight">
                    Ready to list with intention?
                  </span>
                  <span className="text-[11px] text-[#888] mt-0.5 hidden sm:block">
                    Receive a complimentary advisor valuation.
                  </span>
                </div>
                {/* Desktop: button inside bar */}
                <button
                  onClick={() => setIsSellModalOpen(true)}
                  className="hidden sm:flex shrink-0 items-center h-[64px] px-8 text-[11px] font-bold tracking-[0.2em] uppercase bg-[var(--ink)] text-white hover:bg-[var(--accent)] hover:text-white transition-colors duration-300 whitespace-nowrap"
                >
                  Request Valuation
                </button>
              </div>
              {/* Mobile: full-width button below the bar */}
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="sm:hidden w-full mt-3 h-[50px] flex items-center justify-center text-[11px] font-bold tracking-[0.2em] uppercase bg-[var(--ink)] text-white hover:bg-[var(--accent-text)] transition-colors duration-300"
              >
                Request Valuation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isSellModalOpen && (
        <SellModal handleOpenModal={() => setIsSellModalOpen(false)} />
      )}
    </div>
  );
}

function EmptyRow({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="px-5 py-5 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-[#f4f1ea] flex items-center justify-center">
        <HiOutlineLocationMarker className="text-[var(--gold-600)]" size={14} />
      </div>
      <div className="flex flex-col">
        <span className="text-[14px] text-[#1a1a1a] font-medium">{title}</span>
        <span className="text-[11px] text-[#888]">{subtitle}</span>
      </div>
    </div>
  );
}
