"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { motion, useReducedMotion } from "framer-motion";
import { useNeighborhoodList } from "@/services/neighborhood/NeighborhoodQueries";
import { SectionHeading } from "@/component/ui/SectionHeading";

type Neighborhood = {
  id: number;
  name?: string;
  city?: string;
  county?: string;
  state?: string;
  description?: string;
  image?: string;
  images?: string;
};

const fallbackImg =
  process.env.NEXT_PUBLIC_NEIGHBORHOOD_NO_IMAGE || "/images/neighborhood-1.png";

function resolveImage(item: Neighborhood): string {
  const img = item.image ?? item.images;
  if (typeof img === "string" && img.trim() !== "") {
    if (img.startsWith("http")) return img;
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://stgadm.realtipro.com/api";
    return `${base.replace("/api", "")}/${img}`;
  }
  return fallbackImg;
}

const labelOf = (item: Neighborhood) =>
  item.name || item.city || item.county || item.state || "Neighborhood";

export default function HomeNeighborhoods() {
  const { data, isLoading } = useNeighborhoodList();
  const neighborhoods: Neighborhood[] = (data?.data || []).slice(0, 6);
  const [active, setActive] = useState(0);

  return (
    <section className="bg-[var(--canvas)] text-[var(--ink)] section-pad relative overflow-hidden">
      {/* oversized quiet word mark */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -bottom-16 -right-6 font-serif italic text-[clamp(7rem,16vw,15rem)] leading-none text-[var(--ink)]/[0.03]"
      >
        place
      </span>

      <div className="container-wide relative">
        <SectionHeading
          eyebrow="Neighborhoods"
          title={
            <>
              Find your{" "}
              <em className="not-italic italic text-[var(--gold-deep)]">place</em>
              <br />
              in the life of a place.
            </>
          }
          description="From shoreline pockets to streets with history, wander the corners we know by heart — and where we settle clients with real care."
        />

        <div className="mt-14">
          {isLoading ? (
            <div className="flex flex-col lg:flex-row gap-3 lg:h-[600px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[240px] lg:h-auto lg:flex-1 rounded-[var(--radius-md)] bg-[var(--canvas-2)] animate-pulse"
                />
              ))}
            </div>
          ) : neighborhoods.length ? (
            <div className="flex flex-col lg:flex-row gap-3 lg:h-[600px]">
              {neighborhoods.map((item, i) => (
                <Panel
                  key={item.id}
                  item={item}
                  index={i}
                  isActive={i === active}
                  onActivate={() => setActive(i)}
                />
              ))}
            </div>
          ) : (
            <div className="w-full py-20 text-center text-[var(--ink-faint)]">
              The map is filling in — neighborhoods coming soon.
            </div>
          )}
        </div>

        <div className="flex justify-center md:justify-end mt-12">
          <Link href="/neighborhoods" className="link-underline">
            Wander every neighborhood
            <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Panel({
  item,
  index,
  isActive,
  onActivate,
}: {
  item: Neighborhood;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const reduce = useReducedMotion();
  const label = labelOf(item);
  const href = `/properties?keyword=${encodeURIComponent(label)}`;
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      onMouseEnter={onActivate}
      animate={{ flexGrow: isActive ? 4 : 1 }}
      transition={{ duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative h-[240px] lg:h-auto lg:basis-0"
    >
      <Link
        href={href}
        onFocus={onActivate}
        aria-label={`Explore ${label}`}
        className="group relative block w-full h-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--canvas-2)] border border-[var(--line)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
      >
        <Image
          src={resolveImage(item)}
          alt={label}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isActive ? "scale-100" : "scale-105 grayscale-[0.25]"
          }`}
        />

        {/* pine veil — deeper when collapsed */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
            isActive
              ? "bg-gradient-to-t from-[var(--pine)]/90 via-[var(--pine)]/20 to-transparent"
              : "bg-[var(--pine)]/55"
          }`}
        />

        {/* Collapsed: vertical name label (lg only, when inactive) */}
        <div
          className={`absolute inset-0 hidden items-center justify-center transition-opacity duration-500 ${
            isActive ? "lg:hidden" : "lg:flex"
          }`}
        >
          <span className="[writing-mode:vertical-rl] rotate-180 font-serif text-xl text-[var(--on-pine)] tracking-wide whitespace-nowrap drop-shadow">
            {label}
          </span>
          <span className="absolute top-6 left-1/2 -translate-x-1/2 font-[family-name:var(--font-accent)] text-[11px] tracking-[0.25em] text-[var(--gold-300)]">
            {num}
          </span>
        </div>

        {/* Expanded content (active on lg; always on mobile) */}
        <div
          className={`absolute inset-x-0 bottom-0 p-6 lg:p-8 flex-col gap-3 ${
            isActive ? "lg:flex" : "lg:hidden"
          } flex`}
        >
          <span className="font-[family-name:var(--font-accent)] text-[12px] tracking-[0.3em] text-[var(--gold-300)]">
            {num}
          </span>
          <div className="flex items-end justify-between gap-4">
            <h3 className="font-serif text-[clamp(1.5rem,1.6vw+1rem,2.4rem)] text-[var(--on-pine)] leading-[1.05] tracking-tight">
              {label}
            </h3>
            <span className="shrink-0 w-11 h-11 rounded-full border border-[rgba(241,237,227,0.35)] flex items-center justify-center text-[var(--on-pine)] group-hover:bg-[var(--gold-300)] group-hover:border-[var(--gold-300)] group-hover:text-[var(--pine)] transition-all duration-300">
              <FiArrowRight size={15} />
            </span>
          </div>

          {item.description && (
            <motion.p
              initial={false}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.4, delay: isActive ? 0.15 : 0 }}
              className="text-[13.5px] leading-relaxed text-[var(--on-pine-soft)] line-clamp-3 max-w-md hidden lg:block"
            >
              {item.description}
            </motion.p>
          )}
          {/* mobile description (no fade dependency on flex grow) */}
          {item.description && (
            <p className="text-[13px] leading-relaxed text-[var(--on-pine-soft)] line-clamp-2 max-w-md lg:hidden">
              {item.description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
