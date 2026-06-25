"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNewListings } from "@/services/properties/PropertyQueries";
import { PropertyCard } from "@/component/properties/PropertyCard";
import { Reveal } from "@/component/ui/Reveal";

type Property = { id: string; [key: string]: any };

export default function HomeFeatured() {
  const { data, isLoading } = useNewListings();
  const properties: Property[] = (data?.data || []).slice(0, 8);

  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync, properties.length]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="relative bg-[var(--canvas-2)] text-[var(--ink)] section-pad overflow-hidden">
      {/* Soft sage halo */}
      <div
        aria-hidden
        className="absolute -top-40 right-0 w-[560px] h-[560px] rounded-full opacity-[0.08] blur-[130px] bg-[var(--sage)]"
      />

      <div className="container-wide relative">
        {/* ── Heading row: text left · CTA + arrows right ── */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal className="flex flex-col gap-5 max-w-2xl">
            <span className="eyebrow inline-flex items-center gap-4">
              <span className="inline-block h-px w-10 bg-[var(--gold)]" />
              Newly Listed
            </span>
            <h2 className="display-lg text-[var(--ink)]">
              Homes fresh
              <br /> to the{" "}
              <em className="italic text-[var(--gold-deep)]">market</em>
            </h2>
            <p className="lede text-[var(--ink-soft)] max-w-xl">
              The latest additions to our collection — kept current, so the
              right home never slips past you.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="flex items-center gap-6 shrink-0">
            <div className="hidden sm:flex items-center gap-3">
              <RailArrow
                dir="prev"
                disabled={atStart}
                onClick={() => scrollByCards(-1)}
              />
              <RailArrow
                dir="next"
                disabled={atEnd}
                onClick={() => scrollByCards(1)}
              />
            </div>
            <Link href="/properties" className="btn-outline-new">
              See every listing
            </Link>
          </Reveal>
        </div>

        {/* ── Gallery rail ── */}
        <div className="mt-14">
          {isLoading ? (
            <div className="flex gap-6 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[82vw] sm:w-[380px] xl:w-[31%] flex flex-col bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-[var(--surface-graphite)]" />
                  <div className="p-6 flex flex-col gap-3">
                    <div className="h-7 w-40 bg-[var(--surface-graphite)] rounded-sm" />
                    <div className="h-4 w-full bg-[var(--surface-graphite)] rounded-sm" />
                    <div className="h-px bg-[var(--line)] my-1" />
                    <div className="h-4 w-1/2 bg-[var(--surface-graphite)] rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length ? (
            <Reveal>
              <div
                ref={railRef}
                onScroll={sync}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2 -mx-1 px-1"
              >
                {properties.map((item) => (
                  <div
                    key={item.id}
                    data-card
                    className="shrink-0 snap-start w-[82vw] sm:w-[380px] xl:w-[31%]"
                  >
                    <PropertyCard
                      item={item}
                      handleModal={() => undefined}
                      hideWishlist={true}
                    />
                  </div>
                ))}
              </div>

              {/* Progress track */}
              <div className="mt-8 flex items-center gap-5">
                <div className="relative h-px flex-1 bg-[var(--line)] overflow-hidden">
                  <span
                    className="absolute inset-y-0 left-0 bg-[var(--gold-deep)] transition-[width] duration-200 ease-out"
                    style={{
                      width: `${Math.max(12, progress * 100)}%`,
                    }}
                  />
                </div>
                <span className="font-[family-name:var(--font-accent)] text-[11px] tracking-[0.28em] uppercase text-[var(--ink-faint)] shrink-0">
                  Drag or scroll
                </span>
              </div>
            </Reveal>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </section>
  );
}

function RailArrow({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous listings" : "Next listings"}
      className="w-12 h-12 rounded-full border border-[var(--line-medium)] flex items-center justify-center text-[var(--ink)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[var(--sage-deep)] hover:text-[var(--sage-deep)] hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-[var(--line-medium)] disabled:hover:text-[var(--ink)]"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: dir === "prev" ? "scaleX(-1)" : undefined }}
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="13 6 19 12 13 18" />
      </svg>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 rounded-[var(--radius-md)] border border-dashed border-[var(--line)] bg-[var(--cream)]">
      <div className="w-14 h-14 rounded-full bg-[var(--canvas-2)] flex items-center justify-center mb-5">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--gold-deep)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
          <polyline points="9 21 9 13 15 13 15 21" />
        </svg>
      </div>
      <h3 className="font-serif text-2xl text-[var(--ink)]">Nothing new at this moment</h3>
      <p className="text-[var(--ink-soft)] mt-3 max-w-md">
        New homes arrive often — look in again soon, or{" "}
        <Link href="/properties" className="text-[var(--gold-deep)] underline underline-offset-4">
          wander the full collection
        </Link>
        .
      </p>
    </div>
  );
}
