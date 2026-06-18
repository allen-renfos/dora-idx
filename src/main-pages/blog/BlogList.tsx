"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useBlogList } from "@/services/blog/BlogQueries";
import { Blog } from "@/types/Blog";
import { useQueryClient } from "@tanstack/react-query";
import { dateToString } from "@/helpers/DateConverters";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
  const perPage = 6;

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] animate-pulse"
          >
            <div className="aspect-[16/10] bg-white/5" />
            <div className="p-6 flex flex-col gap-3">
              <div className="h-3 w-24 bg-white/10" />
              <div className="h-5 w-full bg-white/10" />
              <div className="h-5 w-[70%] bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-white/55">Error loading articles.</div>;
  }

  if (!filtered.length) {
    return (
      <div className="py-20 border border-dashed border-white/10 text-center text-white/55">
        No articles found.
      </div>
    );
  }

  return (
    <>
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
        {filtered.map((item: any) => (
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
            className="w-10 h-10 inline-flex items-center justify-center border border-[var(--line-soft)] text-white/80 hover:text-[var(--gold-500)] hover:border-[var(--gold-500)]/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <FiChevronLeft size={16} />
          </button>
          {window.map((p, i) =>
            p === "…" ? (
              <span
                key={`el-${i}`}
                className="w-10 h-10 inline-flex items-center justify-center text-white/35"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-10 h-10 inline-flex items-center justify-center text-[13px] border transition-colors ${
                  p === currentPage
                    ? "bg-[var(--gold-500)] text-[var(--surface-ink)] border-[var(--gold-500)] font-bold"
                    : "border-[var(--line-soft)] text-white/80 hover:text-[var(--gold-500)] hover:border-[var(--gold-500)]/60"
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
            className="w-10 h-10 inline-flex items-center justify-center border border-[var(--line-soft)] text-white/80 hover:text-[var(--gold-500)] hover:border-[var(--gold-500)]/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </>
  );
}

function BlogCard({ item }: { item: any }) {
  return (
    <Link
      href={`/blog/${item.slug}`}
      className="group flex flex-col h-full bg-[var(--surface-obsidian)] border border-[var(--line-soft)] hover:border-[var(--gold-500)]/60 transition-colors duration-500"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-charcoal)]">
        <Image
          src={resolveImage(item.image)}
          alt={item.title || "Article"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>
      <div className="flex flex-col gap-3 p-6 flex-1">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/45">
          {item.publishDate && <time>{dateToString(item.publishDate)}</time>}
          {item.publishDate && (
            <span className="inline-block w-6 h-px bg-[var(--gold-500)]/60" />
          )}
          <span className="text-[var(--gold-500)]">
            {item.category || "Insight"}
          </span>
        </div>
        <h3 className="font-serif text-[1.35rem] md:text-[1.55rem] leading-[1.25] text-white group-hover:text-[var(--gold-500)] transition-colors">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="text-[14px] text-white/65 line-clamp-2">
            {item.subtitle}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-white/60 group-hover:text-[var(--gold-500)] transition-colors">
          Read
          <FiArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
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
