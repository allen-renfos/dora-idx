"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowDownRight } from "react-icons/fi";
import HomeSearch from "./HomeSearch";
import { useState } from "react";

const MARKETS = ["Lynnwood", "Everett", "Bothell", "Edmonds", "Mukilteo", "Kirkland"];

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

  const HEADLINE = ["Homes with a quiet", "sense of arrival —"];

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
        {/* Warm pine wash instead of flat black */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)] via-[var(--pine)]/45 to-[var(--pine)]/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--pine)]/70 via-transparent to-transparent" />
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
            <h1 className="display-lg text-[var(--on-pine)]">
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
              className="lede mt-6 max-w-xl text-[var(--on-pine-soft)]"
            >
              A boutique practice that pairs distinctive homes with the people who
              belong in them — guiding every move with patience, taste, and an
              insider&rsquo;s feel for place.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Bottom marquee — full-bleed market ribbon */}
      <div className="border-t border-[var(--on-pine-faint)]/20 bg-[var(--pine)]/60 backdrop-blur-md overflow-hidden marquee-mask">
        <div className="marquee-track py-3.5">
          {[...MARKETS, ...MARKETS, ...MARKETS, ...MARKETS].map((m, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-4 px-7 text-[12px] uppercase tracking-[0.3em] text-[var(--on-pine-soft)] font-[family-name:var(--font-accent)]"
            >
              {m}
              <span className="inline-block h-1 w-1 rounded-full bg-[var(--gold-300)]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
