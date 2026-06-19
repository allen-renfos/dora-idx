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
      <main className="bg-[var(--surface-ink)] text-[var(--ink)]">
        {/* Hero */}
        <section className="relative isolate pt-32 pb-14 md:pt-40 md:pb-16 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--surface-obsidian)] via-[var(--surface-ink)] to-[var(--surface-ink)]"
          />
          <div
            aria-hidden
            className="absolute -top-24 left-10 w-[460px] h-[460px] rounded-full opacity-[0.06] blur-[120px] bg-[var(--gold-500)]"
          />

          <div className="container-wide flex flex-col gap-6 max-w-3xl">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-[var(--gold-500)]" />
                Insights &amp; Journal
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="display-xl text-[var(--ink)]">
                Notes from the{" "}
                <em className="not-italic italic text-[var(--gold-500)]">market</em>
                .
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="lede max-w-xl">
                Considered essays on architecture, market momentum, and what
                actually matters when you&rsquo;re deciding where to plant
                roots.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="relative max-w-xl mt-2">
                <div className="flex items-center h-12 bg-[var(--surface-charcoal)] border border-[var(--line-soft)] focus-within:border-[var(--gold-500)]/60 transition-colors">
                  <span className="pl-4 text-[var(--gold-500)]">
                    <FiSearch size={16} />
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, authors, categories"
                    className="flex-1 px-3 bg-transparent outline-none text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-faint)] font-serif"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="pr-3 text-[var(--ink-faint)] hover:text-[var(--ink)]"
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
        <section className="container-wide pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-block h-px w-8 bg-[var(--gold-500)]" />
                <h2 className="font-serif text-2xl text-[var(--ink)]">
                  Latest articles
                </h2>
              </div>
              <BlogList searchQuery={searchQuery} />
            </div>

            <aside className="flex flex-col gap-12">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-block h-px w-8 bg-[var(--gold-500)]" />
                  <h2 className="font-serif text-xl text-[var(--ink)]">
                    Featured news
                  </h2>
                </div>
                <FeaturedNewsList />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-block h-px w-8 bg-[var(--gold-500)]" />
                  <h2 className="font-serif text-xl text-[var(--ink)]">
                    Featured articles
                  </h2>
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
