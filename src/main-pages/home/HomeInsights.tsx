"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { useNewsList } from "@/services/blog/BlogQueries";
import { SectionHeading } from "@/component/ui/SectionHeading";
import { Reveal, StaggerGroup, StaggerItem } from "@/component/ui/Reveal";
import { dateToString } from "@/helpers/DateConverters";
import type { Blog } from "@/types/Blog";

const fallbackImg =
  process.env.NEXT_PUBLIC_BLOG_NO_IMAGE || "/images/image3.png";

function resolveImage(src?: string | null) {
  if (!src || !src.trim()) return fallbackImg;
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return fallbackImg;
}

function Meta({ item }: { item: Blog }) {
  return (
    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)]">
      <time>{dateToString(item?.publishDate)}</time>
      <span className="inline-block w-6 h-px bg-[var(--gold)]" />
      <span className="text-[var(--gold-deep)]">{item?.category || "Journal"}</span>
    </div>
  );
}

export default function HomeInsights() {
  const { data, isLoading } = useNewsList();
  const blogs: Blog[] = (data?.data || []).slice(0, 5);
  const [lead, ...rest] = blogs;

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

        <div className="mt-16">
          {isLoading ? (
            <LoadingState />
          ) : blogs.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              {/* ── Featured lead article ── */}
              <Reveal className="lg:col-span-7" y={32}>
                <Link
                  href={`/blog/${lead.slug}`}
                  className="group flex flex-col h-full"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-md)] bg-[var(--canvas-2)] border border-[var(--line)]">
                    <Image
                      src={resolveImage(lead.image)}
                      alt={lead.title || "Article"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)]/45 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--canvas)]/90 backdrop-blur px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] font-[family-name:var(--font-accent)] text-[var(--gold-deep)]">
                      Latest
                    </span>
                  </div>

                  <div className="mt-7 flex flex-col gap-4">
                    <Meta item={lead} />
                    <h3 className="font-serif text-[clamp(1.7rem,2.2vw+1rem,2.6rem)] leading-[1.12] text-[var(--ink)] group-hover:text-[var(--gold-deep)] transition-colors max-w-2xl">
                      {lead.title}
                    </h3>
                    {lead.subtitle && (
                      <p className="lede text-[var(--ink-soft)] max-w-xl line-clamp-2">
                        {lead.subtitle}
                      </p>
                    )}
                    <span className="mt-1 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[var(--ink)] group-hover:text-[var(--gold-deep)] transition-colors font-[family-name:var(--font-accent)]">
                      Read the piece
                      <FiArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>

              {/* ── Index of recent pieces ── */}
              {rest.length > 0 && (
              <div className="lg:col-span-5 flex flex-col">
                <span className="hidden lg:flex eyebrow items-center gap-3 mb-2">
                  <span className="inline-block h-px w-8 bg-[var(--gold)]" />
                  More from the journal
                </span>
                <StaggerGroup className="flex flex-col" stagger={0.1}>
                  {rest.map((item) => (
                    <StaggerItem key={item.id}>
                      <Link
                        href={`/blog/${item.slug}`}
                        className="group flex items-center gap-5 py-5 border-t border-[var(--line)] last:border-b"
                      >
                        <div className="relative w-24 h-20 sm:w-28 sm:h-24 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--canvas-2)]">
                          <Image
                            src={resolveImage(item.image)}
                            alt={item.title || "Article"}
                            fill
                            sizes="120px"
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                          />
                        </div>
                        <div className="flex flex-col gap-2 min-w-0">
                          <Meta item={item} />
                          <h4 className="font-serif text-[1.15rem] md:text-[1.25rem] leading-[1.25] text-[var(--ink)] group-hover:text-[var(--gold-deep)] transition-colors line-clamp-2">
                            {item.title}
                          </h4>
                        </div>
                        <FiArrowUpRight
                          size={18}
                          className="ml-auto shrink-0 text-[var(--ink-faint)] group-hover:text-[var(--gold-deep)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300"
                        />
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-[var(--ink-faint)] rounded-[var(--radius-md)] border border-dashed border-[var(--line)] bg-[var(--cream)]">
              New writing is taking shape — back soon.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
      <div className="lg:col-span-7 animate-pulse">
        <div className="aspect-[16/10] rounded-[var(--radius-md)] bg-[var(--surface-graphite)]" />
        <div className="mt-7 flex flex-col gap-3">
          <div className="h-3 w-28 bg-[var(--surface-graphite)]" />
          <div className="h-7 w-3/4 bg-[var(--surface-graphite)]" />
          <div className="h-4 w-full bg-[var(--surface-graphite)]" />
        </div>
      </div>
      <div className="lg:col-span-5 flex flex-col">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-5 py-5 border-t border-[var(--line)] animate-pulse"
          >
            <div className="w-28 h-24 shrink-0 rounded-[var(--radius-sm)] bg-[var(--surface-graphite)]" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 w-24 bg-[var(--surface-graphite)]" />
              <div className="h-5 w-full bg-[var(--surface-graphite)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
