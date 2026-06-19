"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
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

export default function HomeAdvisor() {
  const { name, shortDescription, profile_image } = useNameContext();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const portrait = profile_image || "/images/ashu_flipped.png";

  return (
    <section className="bg-[var(--canvas)] text-[var(--ink)] relative overflow-hidden section-pad">
      {/* oversized quiet brand mark */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -top-10 -left-4 font-serif text-[clamp(8rem,20vw,18rem)] leading-none text-[var(--ink)]/[0.035]"
      >
        {name || "Dora"}
      </span>

      <div className="container-wide relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Portrait */}
          <div className="lg:col-span-5 relative">
            <Reveal className="relative" y={40}>
              <div className="relative aspect-[4/5] w-full max-w-[520px] mx-auto">
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
                    alt={name || "Advisor"}
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
              </div>
            </Reveal>
          </div>

          {/* Content */}
          <div className="lg:col-span-7">
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

            {/* Pillars */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 mb-14"
            >
              {PILLARS.map((p) => (
                <motion.div
                  key={p.n}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="flex flex-col gap-3 border-t border-[var(--line)] pt-6"
                >
                  <span className="font-[family-name:var(--font-accent)] text-[var(--gold-deep)] text-[13px] tracking-[0.3em]">{p.n}</span>
                  <h3 className="font-serif text-[1.4rem] text-[var(--ink)] leading-tight">{p.title}</h3>
                  <p className="text-[14px] text-[var(--ink-soft)] leading-relaxed">{p.body}</p>
                </motion.div>
              ))}
            </motion.div>

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
