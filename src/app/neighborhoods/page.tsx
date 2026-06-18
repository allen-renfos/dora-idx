"use client";

import NeighborhoodList from "@/main-pages/neighborhood/NeighborhoodList";
import HomeNewsletter from "@/main-pages/home/HomeNewsletter";
import { Reveal } from "@/component/ui/Reveal";
import { useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function NeighborhoodsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <>
      <main className="bg-[var(--surface-ink)] text-white">
        {/* Hero */}
        <section className="relative isolate pt-32 pb-14 md:pt-40 md:pb-16 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--surface-obsidian)] via-[var(--surface-ink)] to-[var(--surface-ink)]"
          />
          <div
            aria-hidden
            className="absolute -top-24 right-10 w-[460px] h-[460px] rounded-full opacity-[0.06] blur-[120px] bg-[var(--gold-500)]"
          />

          <div className="container-wide flex flex-col gap-6 max-w-3xl">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-[var(--gold-500)]" />
                Neighborhoods
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="display-xl text-white">
                Find the place that{" "}
                <em className="not-italic italic text-[var(--gold-500)]">feels</em>{" "}
                like home.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="lede max-w-xl">
                Explore communities we know intimately — from coastal enclaves
                to historic districts — and discover where you belong.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="relative max-w-xl mt-2">
                <div className="flex items-center h-12 bg-[var(--surface-charcoal)] border border-[var(--line-soft)] focus-within:border-[var(--gold-500)]/60 transition-colors">
                  <span className="pl-4 text-[var(--gold-500)]">
                    {isSearching ? (
                      <svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <FiSearch size={16} />
                    )}
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.trim()) {
                        setIsSearching(true);
                        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
                        searchTimerRef.current = setTimeout(() => setIsSearching(false), 400);
                      } else {
                        setIsSearching(false);
                      }
                    }}
                    placeholder="Search by name, city, or county"
                    className="flex-1 px-3 bg-transparent outline-none text-[14px] text-white placeholder:text-white/45 font-serif"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="pr-3 text-white/55 hover:text-white"
                      aria-label="Clear search"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <NeighborhoodList searchQuery={searchQuery} />
      </main>

      <HomeNewsletter />
    </>
  );
}
