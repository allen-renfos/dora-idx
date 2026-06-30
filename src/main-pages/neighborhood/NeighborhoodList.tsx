"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiSearch } from "react-icons/fi";
import { useNeighborhoodList } from "@/services/neighborhood/NeighborhoodQueries";

type Neighborhood = {
  city: string | null;
  id: string;
  name: string | null;
  slug: string;
  city_id: string | null;
  state_id: string | null;
  county: string | null;
  state: string | null;
  zipcode: string | null;
  description: string | null;
  image: string | null;
  images: string | null;
};

interface Props {
  searchQuery?: string;
}

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

function labelOf(item: Neighborhood): string {
  return item.name || item.city || "Neighborhood";
}

function metaOf(item: Neighborhood): string {
  return [item.county, item.state, item.zipcode]
    .map((v) => (v ?? "").toString().trim())
    .filter(Boolean)
    .join("  ·  ");
}

function hrefOf(item: Neighborhood): string {
  return `/properties?keyword=${encodeURIComponent(labelOf(item))}`;
}

const NeighborhoodList = ({ searchQuery = "" }: Props) => {
  const { data, isLoading } = useNeighborhoodList();
  const neighborhood: Neighborhood[] = data?.data ?? [];

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return neighborhood;
    return neighborhood.filter((item) =>
      [item.name, item.city, item.county, item.state, item.zipcode, item.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [neighborhood, searchQuery]);

  if (isLoading) return <LoadingState />;

  if (!filtered.length) {
    return (
      <EmptyState searching={Boolean(neighborhood.length && searchQuery)} />
    );
  }

  return (
    <section className="container-wide">
      {/* Index header */}
      <div className="flex items-end justify-between gap-6 mb-8 md:mb-12">
        <span className="eyebrow inline-flex items-center gap-3">
          <span className="inline-block h-px w-10 bg-[var(--gold)]" />
          Explore
        </span>
        <span className="font-[family-name:var(--font-accent)] text-[12px] tracking-[0.28em] uppercase text-[var(--ink-faint)]">
          {filtered.length} {filtered.length === 1 ? "place" : "places"}
        </span>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
      >
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <NeighborhoodTile item={item} index={i} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

function NeighborhoodTile({
  item,
  index,
}: {
  item: Neighborhood;
  index: number;
}) {
  const label = labelOf(item);
  const meta = metaOf(item);
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={hrefOf(item)}
      aria-label={`Explore ${label}`}
      className="group relative block w-full aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--pine)] border border-[var(--line)] hover:shadow-[var(--shadow-lift)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      <Image
        src={resolveImage(item)}
        alt={label}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)] via-[var(--pine)]/30 to-transparent pointer-events-none" />

      {/* Ghost numeral */}
      <span
        aria-hidden
        className="absolute top-3 right-5 font-serif leading-none text-[var(--on-pine)]/[0.16] select-none pointer-events-none text-[clamp(2.5rem,5vw,4rem)]"
      >
        {num}
      </span>
      {/* Index tick */}
      <span className="absolute top-5 left-5 font-[family-name:var(--font-accent)] text-[11px] tracking-[0.28em] text-[var(--on-pine-soft)]">
        {num}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-2.5">
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-serif text-[var(--on-pine)] leading-tight tracking-tight text-[clamp(1.6rem,1.4vw+1rem,2rem)]">
            {label}
          </h3>
          <span className="shrink-0 w-9 h-9 rounded-full border border-[var(--on-pine-faint)] flex items-center justify-center text-[var(--on-pine)] group-hover:bg-[var(--gold-300)] group-hover:border-[var(--gold-300)] group-hover:text-[var(--pine)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300">
            <FiArrowUpRight size={15} />
          </span>
        </div>

        {meta && (
          <span className="font-[family-name:var(--font-accent)] text-[10px] tracking-[0.22em] uppercase text-[var(--gold-300)]">
            {meta}
          </span>
        )}

        {/* Description reveals on hover */}
        {item.description && (
          <p className="text-[13px] leading-[1.6] text-[var(--on-pine-soft)] line-clamp-2 max-h-0 opacity-0 -translate-y-1 group-hover:max-h-24 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
}

function LoadingState() {
  return (
    <section className="container-wide">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] rounded-[var(--radius-lg)] bg-[var(--canvas-2)] animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}

function EmptyState({ searching }: { searching: boolean }) {
  return (
    <section className="container-wide">
      <div className="py-24 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full border border-[var(--gold)]/40 bg-[var(--cream)] flex items-center justify-center mb-6">
          <FiSearch size={22} className="text-[var(--gold-deep)]" />
        </div>
        <h3 className="display-md text-[var(--ink)] mb-3">
          {searching
            ? "Nothing matches that search just yet"
            : "New neighborhoods, arriving soon"}
        </h3>
        <p className="text-[var(--ink-soft)] leading-relaxed">
          Try another name, city, or county — or return shortly as the
          collection continues to grow.
        </p>
      </div>
    </section>
  );
}

export default NeighborhoodList;
