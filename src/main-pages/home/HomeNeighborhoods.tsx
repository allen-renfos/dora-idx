"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
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
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://adminapi.realtipro.com/api";
    return `${base.replace("/api", "")}/${img}`;
  }
  return fallbackImg;
}

export default function HomeNeighborhoods() {
  const { data, isLoading } = useNeighborhoodList();
  const neighborhoods: Neighborhood[] = data?.data || [];
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const refresh = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanLeft(scrollLeft > 4);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  useEffect(() => {
    requestAnimationFrame(refresh);
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", refresh, { passive: true });
    window.addEventListener("resize", refresh);
    return () => {
      el.removeEventListener("scroll", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, [neighborhoods.length]);

  const scrollBy = (dir: 1 | -1) => {
    if (!scrollRef.current) return;
    const step = Math.min(scrollRef.current.clientWidth * 0.8, 560);
    scrollRef.current.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="bg-[var(--surface-ink)] text-white section-pad relative overflow-hidden">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Neighborhoods"
          title={
            <>
              Find your <em className="not-italic italic text-[var(--gold-500)]">place</em>
              <br />
              in the story of a place.
            </>
          }
          description="From coastal enclaves to historic districts, explore the neighborhoods we know intimately — and where we place clients with care."
          align="between"
          action={
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollBy(-1)}
                disabled={!canLeft}
                aria-label="Scroll left"
                className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--gold-500)] hover:text-[var(--gold-500)] transition-colors"
              >
                <FiArrowLeft size={16} />
              </button>
              <button
                onClick={() => scrollBy(1)}
                disabled={!canRight}
                aria-label="Scroll right"
                className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--gold-500)] hover:text-[var(--gold-500)] transition-colors"
              >
                <FiArrowRight size={16} />
              </button>
            </div>
          }
        />

        <div
          ref={scrollRef}
          className="mt-12 flex gap-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2 -mx-[clamp(1.25rem,3vw,3rem)] px-[clamp(1.25rem,3vw,3rem)]"
        >
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 snap-start w-[min(78vw,320px)] aspect-[3/4] bg-[var(--surface-charcoal)] animate-pulse"
                />
              ))
            : neighborhoods.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    delay: Math.min(i * 0.05, 0.3),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="shrink-0 snap-start w-[min(78vw,320px)]"
                >
                  <NeighborhoodCard item={item} />
                </motion.div>
              ))}

          {!isLoading && neighborhoods.length === 0 && (
            <div className="w-full py-20 text-center text-white/50">
              No neighborhoods to display yet.
            </div>
          )}
        </div>

        <div className="flex justify-center md:justify-end mt-10">
          <Link href="/neighborhoods" className="link-underline">
            Explore all neighborhoods
            <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function NeighborhoodCard({ item }: { item: Neighborhood }) {
  const label =
    item.name || item.city || item.county || item.state || "Neighborhood";
  const href = `/properties?keyword=${encodeURIComponent(label)}`;

  return (
    <Link
      href={href}
      className="group relative block aspect-[3/4] overflow-hidden bg-[var(--surface-obsidian)]"
      aria-label={`Explore ${label}`}
    >
      <Image
        src={resolveImage(item)}
        alt={label}
        fill
        sizes="(max-width: 768px) 78vw, 320px"
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-serif text-2xl text-white leading-tight tracking-tight">
            {label}
          </h3>
          <span className="shrink-0 w-9 h-9 rounded-full border border-white/25 flex items-center justify-center text-white group-hover:bg-[var(--gold-500)] group-hover:border-[var(--gold-500)] group-hover:text-[var(--surface-ink)] transition-all duration-300">
            <FiArrowRight size={14} />
          </span>
        </div>
        {item.description && (
          <p className="text-[13px] text-white/70 line-clamp-2 max-w-xs">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
}
