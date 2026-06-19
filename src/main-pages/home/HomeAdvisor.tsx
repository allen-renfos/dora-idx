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
    title: "Discreet Representation",
    body: "Private client service with white-glove confidentiality from first showing to final walkthrough.",
  },
  {
    n: "02",
    title: "Market Fluency",
    body: "Data-backed pricing strategy rooted in two decades of local and global transactions.",
  },
  {
    n: "03",
    title: "Concierge Close",
    body: "Hand-selected inspectors, stagers, and attorneys — coordinated end-to-end.",
  },
];

export default function HomeAdvisor() {
  const { name, shortDescription, profile_image } = useNameContext();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const portrait = profile_image || "/images/ashu_flipped.png";

  return (
    <section className="bg-[var(--surface-ink)] text-[var(--ink)] relative overflow-hidden section-pad">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Portrait */}
          <div className="lg:col-span-5 relative">
            <Reveal className="relative" y={40}>
              <div className="relative aspect-[4/5] w-full max-w-[520px] mx-auto">
                {/* Gold frame offset */}
                <div
                  aria-hidden
                  className="absolute -inset-3 border border-[var(--gold-500)]/40 translate-x-4 translate-y-4"
                />
                <div className="absolute inset-0 bg-[var(--surface-graphite)] overflow-hidden">
                  {!imgLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f2efea] to-[#e7e4de] animate-pulse" />
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
                  {/* Subtle veil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Content */}
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-3 mb-6">
                <span className="inline-block h-px w-10 bg-[var(--gold-500)]" />
                Trusted Global Advisor
              </span>
              <h2 className="display-lg text-[var(--ink)] max-w-xl">
                Guiding generational moves with{" "}
                <span className="italic text-[var(--gold-500)]">
                  clarity &amp; conviction
                </span>
                .
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="lede mt-7 max-w-xl">
                {shortDescription ||
                  "For nearly two decades, I have represented buyers and sellers across the nation's most distinguished markets — balancing analytical discipline with the instinct that only comes from hundreds of successful closings."}
              </p>
            </Reveal>

            {/* Pillars */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12"
            >
              {PILLARS.map((p) => (
                <motion.div
                  key={p.n}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="flex flex-col gap-3 border-t border-[var(--line)] pt-5"
                >
                  <span className="font-serif text-[var(--accent)] text-lg">{p.n}</span>
                  <h3 className="font-serif text-xl text-[var(--ink)] leading-tight">{p.title}</h3>
                  <p className="text-[14px] text-[var(--ink-soft)] leading-relaxed">{p.body}</p>
                </motion.div>
              ))}
            </motion.div>

            <Reveal delay={0.2}>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-gold-new"
                >
                  Send Inquiry
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
