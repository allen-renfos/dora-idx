"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useNameContext } from "@/component/NameProvider";
import { EnquiryModal } from "@/component/home/EnquiryModal";
import { Reveal } from "@/component/ui/Reveal";

const PILLARS = [
  {
    n: "01",
    title: "Quiet Representation",
    body: "Private, unhurried counsel held in confidence — from the first private viewing to the keys in hand.",
  },
  {
    n: "02",
    title: "A Reading of the Market",
    body: "Pricing shaped by instinct and evidence, drawn from two decades of moves made well.",
  },
  {
    n: "03",
    title: "An Attended Close",
    body: "Inspectors, stylists, and counsel — chosen by hand and held together, end to end.",
  },
];

const DEFAULT_NAME = "Dora Shibu";

export default function HomeAdvisor() {
  const { name, shortDescription, profile_image } = useNameContext();
  const reduce = useReducedMotion();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [active, setActive] = useState(0);

  const portrait = profile_image || "/images/dora_img.png";

  return (
    <section className="bg-[var(--canvas)] text-[var(--ink)] relative overflow-hidden section-pad">
      {/* oversized quiet brand mark */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -top-10 -left-4 font-serif text-[clamp(8rem,20vw,18rem)] leading-none text-[var(--ink)]/[0.035]"
      >
        {name || "Dora"}
      </span>

      {/* faint horizon rule running behind the composition */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-[var(--line)]/70"
      />

      <div className="container-wide relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-20 items-center">
          {/* ───────────── Portrait ───────────── */}
          <div className="lg:col-span-5 relative lg:order-2">
            <Reveal className="relative" y={40}>
              <div className="relative aspect-[4/5] w-full max-w-[520px] mx-auto">
                {/* rotated spine label on the left edge */}
                <span
                  aria-hidden
                  className="hidden md:block absolute -right-10 top-1/2 -translate-y-1/2 origin-center [writing-mode:vertical-rl] font-[family-name:var(--font-accent)] text-[11px] tracking-[0.45em] uppercase text-[var(--ink-faint)]"
                >
                  Real Estate Counsel
                </span>

                {/* Gold hairline frame, offset */}
                <div
                  aria-hidden
                  className="absolute -inset-3 border border-[var(--gold)]/55 translate-x-4 translate-y-4 rounded-[var(--radius-md)]"
                />

                <div className="absolute inset-0 bg-[var(--canvas-2)] overflow-hidden rounded-[var(--radius-md)]">
                  {!imgLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--canvas-2)] to-[var(--surface-graphite)] animate-pulse" />
                  )}
                  <Image
                    src={portrait}
                    alt={name || DEFAULT_NAME}
                    fill
                    sizes="(max-width: 1024px) 80vw, 40vw"
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgLoaded(true)}
                    style={{
                      objectFit: "cover",
                      opacity: imgLoaded ? 1 : 0,
                      transition: "opacity 0.6s ease",
                    }}
                  />
                  {/* Subtle pine veil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)]/35 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating signature plate overlapping bottom-right */}
                <motion.div
                  initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                  className="absolute -bottom-7 -right-2 sm:-right-7 bg-[var(--pine)] text-[var(--on-pine)] rounded-[var(--radius-md)] shadow-[var(--shadow-lift)] px-8 py-6"
                >
                  <div className="text-[10px] tracking-[0.32em] uppercase text-[var(--on-pine-soft)]">
                    Your Advisor
                  </div>
                  <div className="mt-2 font-serif italic text-[1.7rem] leading-none text-[var(--gold-300)]">
                    {name || DEFAULT_NAME}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <span aria-hidden className="h-px w-8 bg-[var(--gold)]/70" />
                    <span className="text-[10px] tracking-[0.24em] uppercase text-[var(--on-pine-soft)]">
                      Realtor &amp; Counsel
                    </span>
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>

          {/* ───────────── Content ───────────── */}
          <div className="lg:col-span-7 lg:order-1">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-4 mb-7">
                <span className="inline-block h-px w-12 bg-[var(--gold)]" />
                The Advisor
              </span>
              <h2 className="display-lg text-[var(--ink)] max-w-2xl">
                Generational moves, made with{" "}
                <em className="italic text-[var(--gold-deep)]">
                  calm &amp; conviction
                </em>
                .
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="lede mt-8 max-w-xl">
                {shortDescription ||
                  "For nearly two decades I've stood beside buyers and sellers in the markets that ask the most of you — joining a careful read of the numbers with the instinct earned only over hundreds of homes well placed."}
              </p>
            </Reveal>

            {/* ── Interactive pillar index ── */}
            <div className="mt-12 mb-14 border-t border-[var(--line)]">
              {PILLARS.map((p, i) => {
                const isActive = i === active;
                return (
                  <div
                    key={p.n}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isActive}
                    className="group relative border-b border-[var(--line)] outline-none cursor-default"
                  >
                    {/* animated gold indicator bar */}
                    <motion.span
                      aria-hidden
                      className="absolute left-0 top-0 w-[2px] bg-[var(--gold)]"
                      initial={false}
                      animate={{ height: isActive ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />

                    <div className="flex items-baseline gap-5 sm:gap-7 py-5 pl-5 sm:pl-7 transition-colors duration-500">
                      <span
                        className={`font-[family-name:var(--font-accent)] text-[13px] tracking-[0.3em] transition-colors duration-500 ${
                          isActive ? "text-[var(--gold-deep)]" : "text-[var(--ink-faint)]"
                        }`}
                      >
                        {p.n}
                      </span>

                      <div className="flex-1">
                        <h3
                          className={`font-serif text-[1.4rem] leading-tight transition-colors duration-500 ${
                            isActive ? "text-[var(--ink)]" : "text-[var(--ink-soft)]"
                          }`}
                        >
                          {p.title}
                        </h3>

                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.p
                              key="body"
                              initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                              animate={
                                reduce
                                  ? { opacity: 1 }
                                  : { opacity: 1, height: "auto", marginTop: 12 }
                              }
                              exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden text-[14px] text-[var(--ink-soft)] leading-relaxed max-w-md"
                            >
                              {p.body}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Reveal delay={0.2}>
              <div className="flex flex-wrap items-center gap-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-gold-new"
                >
                  Begin a Conversation
                </button>
                <a href="/about-us" className="link-underline">
                  Read the full story
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
