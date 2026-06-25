"use client";

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiArrowDownRight } from "react-icons/fi";
import HomeSearch from "./HomeSearch";
import { useEffect, useState } from "react";

const MARKETS = ["Lynnwood", "Everett", "Bothell", "Edmonds", "Mukilteo", "Kirkland"];

// The advisor's three promises, cycling in the hero footer band.
const PROMISES = [
  { title: "Quiet Representation", note: "Private, unhurried counsel, held in confidence." },
  { title: "A Reading of the Market", note: "Pricing shaped by instinct and evidence." },
  { title: "An Attended Close", note: "Inspectors, stylists, and counsel — held end to end." },
];

// staggered line-by-line reveal for the display headline
const lineVariants = {
  hidden: { y: "115%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 1.05, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function HomeHero() {
  const [keyword, setKeyword] = useState("");
  const reduce = useReducedMotion();
  const [promise, setPromise] = useState(0);
  const [paused, setPaused] = useState(false);

  const HEADLINE = ["Homes with a quiet", "sense of arrival —"];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setPromise((p) => (p + 1) % PROMISES.length),
      4500
    );
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="relative isolate min-h-[100svh] w-full flex flex-col overflow-hidden bg-[var(--pine)]">
      {/* Full-bleed background video with slow Ken-Burns */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className={`absolute inset-0 ${reduce ? "" : "anim-kenburns"}`}>
          <video
            src="/images/vid-1.mp4"
            poster="/images/sample-4.jpg"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center" }}
          />
        </div>
        {/* Gentle bottom wash (full width, light) — right side stays clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)]/45 via-transparent to-transparent" />
        {/* Left-only scrim — seats the headline + lede, fully clear by mid-frame */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(32,48,42,0.92),rgba(32,48,42,0.5)_26%,transparent_56%)]" />
      </div>

      {/* Main content — search dock on top, headline beneath */}
      <div className="flex-1 flex items-center">
        <div className="container-wide w-full pt-32 pb-14 md:pt-40 md:pb-20">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow on-dark inline-flex items-center gap-4"
          >
            <span className="inline-block h-px w-12 bg-[var(--gold-300)]" />
            Dora · Curated Living
          </motion.span>

          {/* Search dock — elevated to the top of the hero */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-[58rem]"
          >
            <div className="bg-[var(--cream)]/95 backdrop-blur-xl border border-[var(--line)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lift)] overflow-hidden">
              <div className="px-5 md:px-9 py-7 md:py-8">
                <span className="eyebrow inline-flex items-center gap-3">
                  <span className="inline-block h-px w-8 bg-[var(--gold)]" />
                  Begin the search
                </span>
                <div className="mt-5">
                  <HomeSearch keyword={keyword} setKeyword={setKeyword} />
                </div>
              </div>

              {/* Markets rail */}
              <div className="border-t border-[var(--line)] px-5 md:px-9 py-4 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-[11px] uppercase tracking-[0.28em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)] mr-2">
                  Sought-after
                </span>
                {MARKETS.map((n, i) => (
                  <span key={n} className="inline-flex items-center">
                    {i > 0 && (
                      <span className="mx-2 inline-block h-1 w-1 rounded-full bg-[var(--gold)]/50" />
                    )}
                    <Link
                      href={`/properties?keyword=${encodeURIComponent(n)}`}
                      className="group inline-flex items-center gap-1 font-serif text-[15px] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                    >
                      {n}
                      <FiArrowDownRight
                        size={13}
                        className="text-[var(--ink-faint)] group-hover:text-[var(--gold-deep)] group-hover:translate-x-0.5 transition-all duration-300"
                      />
                    </Link>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Headline + lede beneath the search */}
          <div className="mt-10 md:mt-12 max-w-[64rem]">
            <h1 className="display-lg text-[var(--on-pine)] [text-shadow:0_2px_30px_rgba(15,22,18,0.55)]">
              {HEADLINE.map((line, i) => (
                <span key={i} className="line-wrap">
                  <motion.span
                    custom={i}
                    variants={lineVariants}
                    initial={reduce ? "visible" : "hidden"}
                    animate="visible"
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
              <span className="line-wrap">
                <motion.span
                  custom={HEADLINE.length}
                  variants={lineVariants}
                  initial={reduce ? "visible" : "hidden"}
                  animate="visible"
                  className="italic text-[var(--gold-300)]"
                >
                  found, never settled for.
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lede mt-6 max-w-xl [text-shadow:0_1px_18px_rgba(15,22,18,0.65)]"
            style={{ color: "var(--on-pine)", fontWeight: 400 }}
            >
              A boutique practice that pairs distinctive homes with the people who
              belong in them — guiding every move with patience, taste, and an
              insider&rsquo;s feel for place.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Bottom band — the advisor's promises, cycling */}
      <div
        className="relative bg-[var(--pine)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* gold hairline marking the band */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/55 to-transparent" />

        <div className="container-wide py-6 md:py-7 flex items-center justify-between gap-6">
          <div className="flex items-center gap-5 md:gap-7 min-w-0">
            {/* index counter */}
            <span className="shrink-0 font-[family-name:var(--font-accent)] text-[12px] tracking-[0.3em] text-[var(--gold-300)]">
              0{promise + 1}
              <span className="text-[var(--on-pine-faint)]"> / 0{PROMISES.length}</span>
            </span>
            <span aria-hidden className="hidden sm:block h-px w-10 bg-[var(--gold-300)]/50 shrink-0" />

            {/* rotating promise */}
            <div className="relative min-w-0 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={promise}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-x-4 gap-y-0.5 min-w-0"
                  aria-live="polite"
                >
                  <span className="font-serif text-[clamp(1.15rem,1.4vw,1.6rem)] text-[var(--on-pine)] leading-tight whitespace-nowrap">
                    {PROMISES[promise].title}
                  </span>
                  <span className="text-[13px] md:text-[14px] text-[var(--on-pine-soft)] truncate">
                    {PROMISES[promise].note}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* progress controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {PROMISES.map((p, i) => (
              <button
                key={p.title}
                onClick={() => setPromise(i)}
                aria-label={`Show ${p.title}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === promise
                    ? "w-7 bg-[var(--gold-300)]"
                    : "w-1.5 bg-[var(--on-pine-faint)]/40 hover:bg-[var(--on-pine-faint)]/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
