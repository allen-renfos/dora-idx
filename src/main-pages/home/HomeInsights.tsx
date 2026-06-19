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
    <section className="bg-[var(--canvas-2)] text-[var(--ink)] section-pad">
      <div className="container-wide">
        <SectionHeading
          eyebrow="The Journal"
          title={
            <>
              Notes on the market, <br />
              &amp; <em className="not-italic italic text-[var(--gold-deep)]">lived-in</em> counsel
            </>
          }
          description="Quiet writing on architecture, the shape of the market, and what truly weighs when you choose where to put down roots."
          align="between"
          action={
            <Link href="/blog" className="btn-outline-new">
              Open the journal
            </Link>
          }
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[var(--radius-md)] overflow-hidden bg-[var(--cream)] border border-[var(--line)] animate-pulse"
                >
                  <div className="aspect-[16/11] bg-[var(--surface-graphite)]" />
                  <div className="p-6 flex flex-col gap-3">
                    <div className="h-3 w-24 bg-[var(--surface-graphite)]" />
                    <div className="h-5 w-full bg-[var(--surface-graphite)]" />
                    <div className="h-5 w-[70%] bg-[var(--surface-graphite)]" />
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
                    className="group flex flex-col h-full rounded-[var(--radius-md)] overflow-hidden bg-[var(--cream)] border border-[var(--line)] hover:border-[var(--sage-deep)]/50 hover:shadow-[var(--shadow-soft)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  >
                    <div className="relative aspect-[16/11] overflow-hidden bg-[var(--canvas-2)]">
                      <Image
                        src={resolveImage(item.image)}
                        alt={item.title || "Article"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)]/30 to-transparent pointer-events-none" />
                    </div>
                    <div className="flex flex-col gap-3 p-6 flex-1">
                      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)]">
                        <time>{dateToString(item?.publishDate)}</time>
                        <span className="inline-block w-6 h-px bg-[var(--gold)]" />
                        <span className="text-[var(--gold-deep)]">Journal</span>
                      </div>
                      <h3 className="font-serif text-[1.35rem] md:text-[1.55rem] leading-[1.25] text-[var(--ink)] group-hover:text-[var(--gold-deep)] transition-colors">
                        {item.title}
                      </h3>
                      <span className="mt-auto inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[var(--ink-soft)] group-hover:text-[var(--gold-deep)] transition-colors font-[family-name:var(--font-accent)]">
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
            <div className="col-span-full py-20 text-center text-[var(--ink-faint)] rounded-[var(--radius-md)] border border-dashed border-[var(--line)] bg-[var(--cream)]">
              New writing is taking shape — back soon.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
