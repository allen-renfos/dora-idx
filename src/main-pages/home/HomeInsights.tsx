"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useNewsList } from "@/services/blog/BlogQueries";
import { SectionHeading } from "@/component/ui/SectionHeading";
import { dateToString } from "@/helpers/DateConverters";
import type { Blog } from "@/types/Blog";

const fallbackImg =
  process.env.NEXT_PUBLIC_BLOG_NO_IMAGE || "/images/image3.png";

function resolveImage(src?: string | null) {
  if (!src || !src.trim()) return fallbackImg;
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return fallbackImg;
}

export default function HomeInsights() {
  const { data, isLoading } = useNewsList();
  const blogs: Blog[] = (data?.data || []).slice(0, 3);

  return (
    <section className="bg-[var(--surface-ink)] text-white section-pad">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Journal"
          title={
            <>
              Insights, market notes, <br />
              &amp; <em className="not-italic italic text-[var(--gold-500)]">lived-in</em> advice
            </>
          }
          description="Essays on architecture, market momentum, and what actually matters when you're deciding where to plant roots."
          align="between"
          action={
            <Link href="/blog" className="btn-outline-new">
              Read the journal
            </Link>
          }
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[var(--surface-charcoal)] border border-white/5 animate-pulse"
                >
                  <div className="aspect-[16/11] bg-white/5" />
                  <div className="p-6 flex flex-col gap-3">
                    <div className="h-3 w-24 bg-white/10" />
                    <div className="h-5 w-full bg-white/10" />
                    <div className="h-5 w-[70%] bg-white/10" />
                  </div>
                </div>
              ))
            : blogs.map((item: any, i: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={`/blog/${item.slug}`}
                    className="group flex flex-col h-full bg-[var(--surface-obsidian)] border border-white/8 hover:border-[var(--gold-500)]/60 transition-colors duration-500"
                  >
                    <div className="relative aspect-[16/11] overflow-hidden bg-[var(--surface-charcoal)]">
                      <Image
                        src={resolveImage(item.image)}
                        alt={item.title || "Article"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    </div>
                    <div className="flex flex-col gap-3 p-6 flex-1">
                      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/45">
                        <time>{dateToString(item?.publishDate)}</time>
                        <span className="inline-block w-6 h-px bg-[var(--gold-500)]/60" />
                        <span className="text-[var(--gold-500)]">Insights</span>
                      </div>
                      <h3 className="font-serif text-[1.35rem] md:text-[1.55rem] leading-[1.25] text-white group-hover:text-[var(--gold-500)] transition-colors">
                        {item.title}
                      </h3>
                      <span className="mt-auto inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-white/60 group-hover:text-[var(--gold-500)] transition-colors">
                        Read
                        <FiArrowRight
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}

          {!isLoading && blogs.length === 0 && (
            <div className="col-span-full py-16 text-center text-white/50 border border-dashed border-white/10">
              Fresh essays are on the way.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
