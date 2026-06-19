"use client";

import Image from "next/image";
import { Reveal } from "@/component/ui/Reveal";

export default function HomePhilosophy() {
  return (
    <section className="relative bg-[var(--surface-ink)] text-[var(--ink)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:min-h-[640px]">
        {/* Image side */}
        <div className="relative lg:col-span-7 aspect-[5/4] lg:aspect-auto">
          <Image
            src="/images/sample-6.jpeg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
          {/* Cinematic gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-[var(--surface-ink)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" />

          {/* Caption */}
          <div className="absolute left-6 md:left-10 bottom-6 md:bottom-10 flex items-center gap-3 text-white/75">
            <span className="inline-block h-px w-8 bg-[var(--gold-500)]" />
            <span className="text-[10px] uppercase tracking-[0.28em]">
              An Editorial Approach
            </span>
          </div>
        </div>

        {/* Text side */}
        <div className="lg:col-span-5 relative flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-16 md:py-24 lg:py-32">
          {/* Decorative oversized mark */}
          <span
            aria-hidden
            className="absolute top-6 right-6 md:top-10 md:right-10 font-serif text-[180px] leading-none text-black/[0.05] select-none pointer-events-none"
          >
            &mdash;
          </span>

          <Reveal y={32}>
            <div className="relative max-w-xl flex flex-col gap-7">
              <span className="eyebrow inline-flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-[var(--accent)]" />
                Our Philosophy
              </span>

              <h2 className="font-serif text-[clamp(2rem,3vw+1rem,3.25rem)] leading-[1.15] text-[var(--ink)]">
                A great house is{" "}
                <span className="italic text-[var(--gold-500)] font-normal">
                  built
                </span>
                .
                <br />
                A great home is{" "}
                <span className="italic text-[var(--gold-500)] font-normal">
                  found
                </span>
                .
              </h2>

              <p className="text-[15px] md:text-[16px] leading-[1.7] text-[var(--ink-soft)] max-w-md">
                Every search begins with a question — not where, but how. How
                you live. How you host. How you rest. We listen first, and the
                address follows.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <span className="inline-block h-px w-12 bg-[var(--accent)]/60" />
                <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--ink-faint)]">
                  The Curator&rsquo;s Note
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
