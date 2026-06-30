"use client";

import { useState } from "react";
import HomeNewsletter from "@/main-pages/home/HomeNewsletter";
import BlogList from "@/main-pages/blog/BlogList";
import FeaturedNewsList from "@/main-pages/blog/FeaturedNewsList";
import FeaturedArticleList from "@/main-pages/blog/FeaturedArticleList";
import { Reveal } from "@/component/ui/Reveal";
import { FiSearch, FiX } from "react-icons/fi";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <main className="bg-[var(--canvas)] text-[var(--ink)]">
        {/* Hero — pine band */}
        <section className="relative isolate overflow-hidden bg-[var(--pine)] pt-24 pb-16 md:pt-32 md:pb-24">
          <span
            aria-hidden
            className="pointer-events-none select-none absolute -bottom-16 left-[2vw] font-serif text-[clamp(7rem,20vw,18rem)] leading-none text-[var(--on-pine)]/[0.04]"
          >
            Journal
          </span>

          <div className="container-wide flex flex-col gap-7 max-w-3xl relative">
            <Reveal>
              <span className="eyebrow on-dark inline-flex items-center gap-4">
                <span className="inline-block h-px w-12 bg-[var(--gold-300)]" />
                The Journal
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="display-xl text-[var(--on-pine)]">
                Notes from a{" "}
                <em className="text-[var(--gold-300)]">living</em> market.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="lede max-w-xl text-[var(--on-pine-soft)]">
                Considered writing on architecture, the rhythm of the market,
                and what genuinely matters when you choose where to set down
                roots.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="relative max-w-xl mt-2">
                <div className="flex items-center h-14 bg-[var(--cream)] rounded-[var(--radius-pill)] border border-[var(--line)] focus-within:border-[var(--gold-deep)]/60 transition-colors shadow-[var(--shadow-soft)]">
                  <span className="pl-5 text-[var(--gold-deep)]">
                    <FiSearch size={16} />
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, authors, categories"
                    className="flex-1 px-4 bg-transparent outline-none text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-faint)] font-serif"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="pr-5 text-[var(--ink-faint)] hover:text-[var(--ink)]"
                      aria-label="Clear search"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Body grid */}
        <section className="container-wide section-pad">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-12">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="eyebrow inline-flex items-center gap-3">
                  <span className="inline-block h-px w-10 bg-[var(--gold)]" />
                  Latest writing
                </span>
              </div>
              <BlogList searchQuery={searchQuery} />
            </div>

            <aside className="flex flex-col gap-12">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="eyebrow inline-flex items-center gap-3">
                    <span className="inline-block h-px w-8 bg-[var(--gold)]" />
                    In the headlines
                  </span>
                </div>
                <FeaturedNewsList />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="eyebrow inline-flex items-center gap-3">
                    <span className="inline-block h-px w-8 bg-[var(--gold)]" />
                    Editor&rsquo;s picks
                  </span>
                </div>
                <FeaturedArticleList />
              </div>
            </aside>
          </div>
        </section>
      </main>

      <HomeNewsletter />
    </>
  );
}
