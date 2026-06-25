"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useBlogList } from "@/services/blog/BlogQueries";
import { Blog } from "@/types/Blog";
import { useQueryClient } from "@tanstack/react-query";
import { dateToString } from "@/helpers/DateConverters";
import { FiArrowRight, FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Props {
  searchQuery?: string;
}

const fallbackImg =
  process.env.NEXT_PUBLIC_BLOG_NO_IMAGE || "/images/image3.png";

function resolveImage(src?: string | null) {
  if (!src || !src.trim()) return fallbackImg;
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return fallbackImg;
}

export default function BlogList({ searchQuery = "" }: Props) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 7;

  const { data, isLoading, error } = useBlogList({
    page: currentPage,
    per_page: perPage,
  });

  useEffect(() => {
    if (data && !isLoading && !error) {
      setBlogs(data.data || []);
      setTotalPages(data.meta?.last_page || 1);
    }
  }, [data, isLoading, error]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["bloglist"] });
  }, [currentPage, queryClient]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter((b: any) => {
      return [b.title, b.subtitle, b.content, b.author, b.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [blogs, searchQuery]);

  const window = buildPageWindow(currentPage, totalPages);

  // Feature the latest piece on the first page when not searching.
  const showFeature = !searchQuery && currentPage === 1 && filtered.length >= 3;
  const lead = showFeature ? filtered[0] : null;
  const rest = showFeature ? filtered.slice(1) : filtered;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="bg-[var(--cream)] rounded-[var(--radius-md)] border border-[var(--line)] animate-pulse overflow-hidden aspect-[16/8]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--cream)] rounded-[var(--radius-md)] border border-[var(--line)] animate-pulse overflow-hidden"
            >
              <div className="aspect-[16/10] bg-[var(--canvas-2)]" />
              <div className="p-6 flex flex-col gap-3">
                <div className="h-3 w-24 bg-[var(--canvas-2)]" />
                <div className="h-5 w-full bg-[var(--canvas-2)]" />
                <div className="h-5 w-[70%] bg-[var(--canvas-2)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-[var(--ink-faint)]">Error loading articles.</div>;
  }

  if (!filtered.length) {
    return (
      <div className="py-20 rounded-[var(--radius-md)] border border-dashed border-[var(--line)] bg-[var(--cream)] text-center text-[var(--ink-faint)]">
        No writing matches that search just yet.
      </div>
    );
  }

  return (
    <>
      {lead && <FeaturedLead item={lead} />}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {rest.map((item: any) => (
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
            <BlogCard item={item} />
          </motion.div>
        ))}
      </motion.div>

      {!searchQuery && totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--gold-deep)] hover:border-[var(--gold-deep)]/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <FiChevronLeft size={16} />
          </button>
          {window.map((p, i) =>
            p === "…" ? (
              <span
                key={`el-${i}`}
                className="w-10 h-10 inline-flex items-center justify-center text-[var(--ink-faint)]"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-10 h-10 inline-flex items-center justify-center text-[13px] rounded-full border transition-colors ${
                  p === currentPage
                    ? "bg-[var(--pine)] text-[var(--on-pine)] border-[var(--pine)]"
                    : "border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--gold-deep)] hover:border-[var(--gold-deep)]/60"
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
            className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--gold-deep)] hover:border-[var(--gold-deep)]/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </>
  );
}

function Meta({ item, light }: { item: any; light?: boolean }) {
  const faint = light ? "text-[var(--on-pine-faint)]" : "text-[var(--ink-faint)]";
  const accent = light ? "text-[var(--gold-300)]" : "text-[var(--gold-deep)]";
  return (
    <div
      className={`flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] ${faint} font-[family-name:var(--font-accent)]`}
    >
      {item.publishDate && <time>{dateToString(item.publishDate)}</time>}
      {item.publishDate && (
        <span className="inline-block w-6 h-px bg-[var(--gold)]/70" />
      )}
      <span className={accent}>{item.category || "Insight"}</span>
    </div>
  );
}

function FeaturedLead({ item }: { item: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-10"
    >
      <Link
        href={`/blog/${item.slug}`}
        className="group grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--pine)] text-[var(--on-pine)] hover:shadow-[var(--shadow-lift)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="relative aspect-[16/11] lg:aspect-auto lg:min-h-[340px] overflow-hidden">
          <Image
            src={resolveImage(item.image)}
            alt={item.title || "Article"}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
          <span className="absolute top-4 left-4 inline-flex items-center rounded-[var(--radius-pill)] bg-[var(--gold-300)] text-[var(--pine)] px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] font-[family-name:var(--font-accent)]">
            Latest
          </span>
        </div>
        <div className="flex flex-col justify-center gap-4 p-8 lg:p-10">
          <Meta item={item} light />
          <h2 className="font-serif text-[clamp(1.7rem,2vw+1rem,2.6rem)] leading-[1.12] text-[var(--on-pine)] group-hover:text-[var(--gold-300)] transition-colors">
            {item.title}
          </h2>
          {item.subtitle && (
            <p className="text-[15px] leading-relaxed text-[var(--on-pine-soft)] line-clamp-3 max-w-lg">
              {item.subtitle}
            </p>
          )}
          <span className="mt-2 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[var(--on-pine)] group-hover:text-[var(--gold-300)] transition-colors font-[family-name:var(--font-accent)]">
            Read the piece
            <FiArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function BlogCard({ item }: { item: any }) {
  return (
    <Link
      href={`/blog/${item.slug}`}
      className="group flex flex-col h-full bg-[var(--cream)] rounded-[var(--radius-md)] border border-[var(--line)] overflow-hidden hover:shadow-[var(--shadow-lift)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--canvas-2)]">
        <Image
          src={resolveImage(item.image)}
          alt={item.title || "Article"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)]/25 to-transparent pointer-events-none" />
      </div>
      <div className="flex flex-col gap-3 p-7 flex-1">
        <Meta item={item} />
        <h3 className="font-serif text-[1.45rem] md:text-[1.65rem] leading-[1.2] text-[var(--ink)] group-hover:text-[var(--gold-deep)] transition-colors">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="text-[14px] text-[var(--ink-soft)] leading-relaxed line-clamp-2">
            {item.subtitle}
          </p>
        )}
        <span className="mt-auto pt-2 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)] group-hover:text-[var(--gold-deep)] transition-colors">
          Read
          <FiArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

function buildPageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  pages.push(1);
  if (left > 2) pages.push("…");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}
