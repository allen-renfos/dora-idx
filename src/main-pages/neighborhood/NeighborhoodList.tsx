"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { useNeighborhoodList } from "@/services/neighborhood/NeighborhoodQueries";

type Neighborhood = {
  city: string | null;
  id: string;
  name: string | null;
  slug: string;
  city_id: string | null;
  state_id: string | null;
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

const NeighborhoodList = ({ searchQuery = "" }: Props) => {
  const [neighborhood, setNeighborhood] = useState<Neighborhood[]>([]);
  const { data, isLoading } = useNeighborhoodList();

  useEffect(() => {
    if (data?.data) setNeighborhood(data.data);
  }, [data]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return neighborhood;
    return neighborhood.filter((item) => {
      const name = item.name?.toLowerCase() || "";
      const city = item.city_id != null ? String(item.city_id).toLowerCase() : "";
      const description = item.description?.toLowerCase() || "";
      return (
        name.includes(q) || city.includes(q) || description.includes(q)
      );
    });
  }, [neighborhood, searchQuery]);

  return (
    <section className="container-wide">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-[var(--radius-md)] bg-[var(--canvas-2)] animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length ? (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <NeighborhoodCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full border border-[var(--gold)]/40 bg-[var(--cream)] flex items-center justify-center mb-6">
            <FiSearch size={22} className="text-[var(--gold-deep)]" />
          </div>
          <h3 className="display-md text-[var(--ink)] mb-3">
            {neighborhood.length && searchQuery
              ? "Nothing matches that search just yet"
              : "New neighborhoods, arriving soon"}
          </h3>
          <p className="text-[var(--ink-soft)] leading-relaxed">
            Try another name, city, or county — or return shortly as the
            collection continues to grow.
          </p>
        </div>
      )}
    </section>
  );
};

function NeighborhoodCard({ item }: { item: Neighborhood }) {
  const label = item.name||item.city || "Neighborhood";
  const href = `/properties?keyword=${encodeURIComponent(label)}`;
  return (
    <Link
      href={href}
      className="group relative block aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] bg-[var(--pine)] border border-[var(--line)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      aria-label={`Explore ${label}`}
    >
      <Image
        src={resolveImage(item)}
        alt={label}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)] via-[var(--pine)]/30 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-serif text-2xl text-[var(--on-pine)] leading-tight">
            {label}
          </h3>
          <span className="shrink-0 w-9 h-9 rounded-full border border-[var(--on-pine-faint)] flex items-center justify-center text-[var(--on-pine)] group-hover:bg-[var(--gold-300)] group-hover:border-[var(--gold-300)] group-hover:text-[var(--pine)] transition-all duration-300">
            <FiArrowRight size={14} />
          </span>
        </div>
        {item.description && (
          <p className="text-[13px] text-[var(--on-pine-soft)] line-clamp-2 max-w-xs">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export default NeighborhoodList;
