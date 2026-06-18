"use client";

import { dateToString } from "@/helpers/DateConverters";
import { Blog } from "@/types/Blog";
import Image from "next/image";
import { useState } from "react";

interface Props {
  blog: Blog;
}

const fallbackImg =
  process.env.NEXT_PUBLIC_BLOG_NO_IMAGE || "/images/image3.png";

export const SingleBlogBanner = ({ blog }: Props) => {
  const [imgError, setImgError] = useState(false);
  const banner = blog?.image && !imgError ? blog.image : fallbackImg;

  return (
    <section className="relative isolate min-h-[60vh] md:min-h-[72vh] w-full flex items-end overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={banner}
          alt={blog?.title || "Article"}
          fill
          priority
          sizes="100vw"
          onError={() => setImgError(true)}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/55 to-black/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-transparent to-transparent" />
      </div>

      <div className="container-wide w-full pt-32 pb-16 md:pb-20">
        <div className="max-w-3xl flex flex-col gap-5">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[var(--gold-500)]">
            {blog?.publishDate && <span>{dateToString(blog.publishDate)}</span>}
            {blog?.publishDate && blog?.category && (
              <span className="inline-block w-6 h-px bg-[var(--gold-500)]/60" />
            )}
            {blog?.category && (
              <span className="text-white/65">{blog.category}</span>
            )}
          </div>
          <h1 className="display-xl text-white">{blog?.title}</h1>
          {blog?.subtitle && (
            <p className="lede max-w-2xl">{blog.subtitle}</p>
          )}
          {blog?.author && (
            <div className="flex items-center gap-3 mt-2 text-[13px] text-white/60">
              <span className="inline-block h-px w-8 bg-[var(--gold-500)]" />
              <span>By {blog.author}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
