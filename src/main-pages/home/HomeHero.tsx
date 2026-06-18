"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowDown } from "react-icons/fi";
import HomeSearch from "./HomeSearch";
import { useState } from "react";

const PILLARS = [
  { title: "Discreet", body: "Representation built on confidentiality." },
  { title: "Curated", body: "Only listings worth your attention." },
  { title: "Connected", body: "Access to off-market opportunities." },
  { title: "Devoted", body: "One client, one relationship at a time." },
];

export default function HomeHero() {
  const [keyword, setKeyword] = useState("");
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate min-h-[100svh] w-full flex flex-col text-white overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/sample-4.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center" }}
        />
        {/* Cinematic gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center">
        <div className="container-wide w-full pt-40 pb-28 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 lg:items-center">
            {/* Left: copy */}
            <div className="lg:col-span-6 flex flex-col gap-6 md:gap-8">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="eyebrow inline-flex items-center gap-3"
              >
                <span className="inline-block h-px w-10 bg-[var(--gold-500)]" />
                Curated Real Estate 
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="display-xl text-white"
              >
                Exceptional homes.
                <br />
                <span className="italic text-[var(--gold-500)] font-normal">
                  Extraordinary
                </span>{" "}
                service.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="lede max-w-xl"
              >
                Discover thoughtfully curated listings, explore standout
                neighborhoods, and work with a trusted global advisor who
                understands the weight of a generational purchase.
              </motion.p>
            </div>

            {/* Right: editorial search panel */}
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative"
            >
              {/* Offset gold frame — large screens only (overflows on narrow widths) */}
              <div
                aria-hidden
                className="hidden lg:block absolute -inset-2 border border-[var(--gold-500)]/35 translate-x-3 translate-y-3 pointer-events-none"
              />

              <div className="relative bg-[var(--surface-ink)]/72 backdrop-blur-xl border border-white/10">
                {/* Header */}
                <div className="px-5 md:px-9 pt-6 md:pt-10 pb-5 md:pb-6">
                  <span className="eyebrow inline-flex items-center gap-3">
                    <span className="inline-block h-px w-8 bg-[var(--gold-500)]" />
                    Property Search
                  </span>
                  <h2 className="font-serif text-[26px] md:text-[30px] text-white leading-[1.15] mt-4">
                    Begin your search
                  </h2>
                  <p className="text-[13px] text-white/55 mt-2 leading-relaxed">
                    City, neighborhood, address, or zip — start anywhere.
                  </p>
                </div>

                <div className="border-t border-white/10 px-5 md:px-9 py-6 md:py-7">
                  <HomeSearch keyword={keyword} setKeyword={setKeyword} />
                </div>

                {/* Sought-after markets — editorial list */}
                <div className="border-t border-white/10 px-5 md:px-9 py-5">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-white/50">
                      Sought-after Markets
                    </span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                  <ul>
                    {["Lynnwood", "Everett", "Bothell", "Edmonds"].map(
                      (n, i) => (
                        <li
                          key={n}
                          className={`${
                            i === 0 ? "" : "border-t border-white/5"
                          }`}
                        >
                          <Link
                            href={`/properties?keyword=${encodeURIComponent(n)}`}
                            className="group flex items-center justify-between py-3"
                          >
                            <span className="font-serif text-[15px] text-white/80 group-hover:text-white transition-colors">
                              {n}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.24em] text-white/35 group-hover:text-[var(--gold-500)] transition-colors">
                              Browse
                            </span>
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="border-t border-white/10 bg-[var(--surface-ink)]/55 backdrop-blur-md"
      >
        <div className="container-wide py-6 md:py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col gap-2 md:border-l md:first:border-l-0 md:border-white/10 md:pl-6"
            >
              <span className="eyebrow inline-flex items-center gap-2 text-white/70">
                <span className="inline-block h-px w-5 bg-[var(--gold-500)]" />
                {pillar.title}
              </span>
              <span className="font-serif text-[15px] md:text-[16px] leading-snug text-white/85">
                {pillar.body}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5, delay: 1.4 }}
        className="hidden lg:flex absolute bottom-[148px] left-12 flex-col items-center gap-3 text-white/70"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl] rotate-180">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiArrowDown size={14} />
        </motion.span>
      </motion.div>
    </section>
  );
}

