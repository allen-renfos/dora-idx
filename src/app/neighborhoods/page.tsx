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
      <main className="bg-[var(--canvas)] text-[var(--ink)]">
        {/* Hero — pine band */}
        <section className="relative isolate overflow-hidden bg-[var(--pine)] pt-36 pb-16 md:pt-44 md:pb-24">
          <span
            aria-hidden
            className="pointer-events-none select-none absolute -bottom-16 right-[2vw] font-serif text-[clamp(7rem,20vw,18rem)] leading-none text-[var(--on-pine)]/[0.04]"
          >
            Places
          </span>

          <div className="container-wide flex flex-col gap-7 max-w-3xl relative">
            <Reveal>
              <span className="eyebrow on-dark inline-flex items-center gap-4">
                <span className="inline-block h-px w-12 bg-[var(--gold-300)]" />
                The Neighborhoods
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="display-xl text-[var(--on-pine)]">
                The place that quietly{" "}
                <em className="text-[var(--gold-300)]">becomes</em> home.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="lede max-w-xl text-[var(--on-pine-soft)]">
                Communities we know street by street — from coastal enclaves to
                storied districts — gathered so you can find exactly where you
                belong.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="relative max-w-xl mt-2">
                <div className="flex items-center h-14 bg-[var(--cream)] rounded-[var(--radius-pill)] border border-[var(--line)] focus-within:border-[var(--gold-deep)]/60 transition-colors shadow-[var(--shadow-soft)]">
                  <span className="pl-5 text-[var(--gold-deep)]">
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
                    className="flex-1 px-4 bg-transparent outline-none text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-faint)] font-serif"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="pr-5 text-[var(--ink-faint)] hover:text-[var(--ink)]"
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

        <div className="section-pad">
          <NeighborhoodList searchQuery={searchQuery} />
        </div>
      </main>

      <HomeNewsletter />
    </>
  );
}
