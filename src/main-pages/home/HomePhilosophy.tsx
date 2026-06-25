"use client";

import Image from "next/image";
import { Reveal, StaggerGroup, StaggerItem } from "@/component/ui/Reveal";

const CREDO = [
  { n: "i", line: "How you wake." },
  { n: "ii", line: "How you gather." },
  { n: "iii", line: "How you come to rest." },
];

export default function HomePhilosophy() {
  return (
    <section className="relative bg-[var(--pine)] text-[var(--on-pine)] overflow-hidden">
      {/* Soft gold top hairline marking the dark band */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--gold)]/45 to-transparent" />

      <div className="grid grid-cols-1 lg:grid-cols-12 lg:min-h-[700px]">
        {/* ───────────── Image side ───────────── */}
        <div className="relative lg:col-span-6 aspect-[5/4] lg:aspect-auto">
          <Image
            src="/images/sample-6.jpeg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover anim-kenburns"
          />
          {/* Pine wash blends image into the band */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--pine)]/30 via-transparent to-[var(--pine)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--pine)]/25 via-transparent to-[var(--pine)]/55" />

          {/* Inset gold hairline frame */}
          <div
            aria-hidden
            className="hidden lg:block absolute inset-8 border border-[var(--gold-300)]/25 pointer-events-none rounded-[var(--radius-sm)]"
          />

          {/* Caption */}
          <div className="absolute left-6 md:left-10 bottom-6 md:bottom-10 flex items-center gap-3 text-[var(--on-pine-soft)]">
            <span className="inline-block h-px w-10 bg-[var(--gold-300)]" />
            <span className="text-[11px] uppercase tracking-[0.3em] font-[family-name:var(--font-accent)]">
              An Editorial Eye
            </span>
          </div>
        </div>

        {/* ───────────── Text side ───────────── */}
        <div className="lg:col-span-6 relative flex items-center px-6 md:px-12 lg:px-16 xl:px-24 py-16 md:py-24 lg:py-28">
          {/* Oversized quotation flourish */}
          <span
            aria-hidden
            className="absolute -top-2 right-6 md:right-12 lg:right-16 font-serif italic text-[clamp(9rem,16vw,16rem)] leading-none text-[var(--gold-300)]/[0.08] select-none pointer-events-none"
          >
            &rdquo;
          </span>

          <div className="relative max-w-xl w-full flex flex-col">
            <Reveal y={32}>
              <span className="eyebrow on-dark inline-flex items-center gap-4">
                <span className="inline-block h-px w-12 bg-[var(--gold-300)]" />
                Our Philosophy
              </span>

              <h2 className="mt-7 font-serif text-[clamp(2.1rem,3vw+1rem,3.5rem)] leading-[1.14] text-[var(--on-pine)]">
                A fine house is{" "}
                <em className="italic text-[var(--gold-300)] font-normal">built</em>.
                <br />
                A true home is{" "}
                <em className="italic text-[var(--gold-300)] font-normal">found</em>.
              </h2>

              <p className="mt-8 text-[15px] md:text-[16px] leading-[1.75] text-[var(--on-pine-soft)] max-w-md font-light">
                Every search opens with a question — not where, but how.
              </p>
            </Reveal>

            {/* Credo — the cadence, re-typeset as a manifesto */}
            <StaggerGroup className="mt-10 flex flex-col" stagger={0.12}>
              {CREDO.map((c) => (
                <StaggerItem key={c.n}>
                  <div className="group flex items-baseline gap-5 sm:gap-7 border-t border-[var(--on-pine)]/12 py-4">
                    <span className="font-[family-name:var(--font-accent)] text-[var(--gold-300)] text-[13px] tracking-[0.32em] w-8 shrink-0">
                      {c.n}
                    </span>
                    <span className="font-serif text-[clamp(1.3rem,1vw+1rem,1.7rem)] text-[var(--on-pine)] leading-tight">
                      {c.line}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <Reveal delay={0.15} y={20}>
              <p className="mt-10 font-serif italic text-[clamp(1.05rem,0.8vw+0.9rem,1.35rem)] leading-relaxed text-[var(--on-pine-soft)] max-w-md">
                We listen first; the address has a way of following.
              </p>

              <div className="flex items-center gap-4 pt-9">
                <span className="inline-block h-px w-12 bg-[var(--gold-300)]/70" />
                <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--on-pine-faint)] font-[family-name:var(--font-accent)]">
                  A Note from the Atelier
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
