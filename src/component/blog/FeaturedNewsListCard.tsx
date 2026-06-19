"use client";

import Image from "next/image";
import Link from "next/link";
import { dateToString } from "@/helpers/DateConverters";
import { Blog } from "@/types/Blog";

interface Props {
  item: Blog;
}

const fallbackImg =
  process.env.NEXT_PUBLIC_BLOG_NO_IMAGE || "/images/image3.png";

function resolveImage(src?: string | null) {
  if (!src || !src.trim()) return fallbackImg;
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return fallbackImg;
}

export const FeaturedNewsListCard = ({ item }: Props) => {
  return (
    <Link
      href={`/blog/${item.slug}`}
      className="group flex items-stretch gap-4 py-4 border-b border-[var(--line-soft)] last:border-0 transition-colors hover:bg-[var(--surface-graphite)]"
    >
      <div className="relative w-[112px] h-[88px] shrink-0 overflow-hidden bg-[var(--surface-charcoal)]">
        <Image
          src={resolveImage(item.image)}
          alt={item.title || "Article"}
          fill
          sizes="112px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
      </div>
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        {item.publishDate && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent-text)]">
            {dateToString(item.publishDate)}
          </span>
        )}
        <h4 className="font-serif text-[15px] leading-[1.35] text-[var(--ink)] line-clamp-3 group-hover:text-[var(--accent-text)] transition-colors">
          {item.title}
        </h4>
      </div>
    </Link>
  );
};
