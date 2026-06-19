"use client";

import Image from "next/image";
import { Reveal } from "@/component/ui/Reveal";

export default function HomePhilosophy() {
  return (
    <section className="relative bg-[var(--pine)] text-[var(--on-pine)] overflow-hidden">
      {/* Soft gold top hairline marking the dark band */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--gold)]/45 to-transparent" />

      <div className="grid grid-cols-1 lg:grid-cols-12 lg:min-h-[680px]">
        {/* Image side */}
        <div className="relative lg:col-span-7 aspect-[5/4] lg:aspect-auto">
          <Image
            src="/images/sample-6.jpeg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
          {/* Pine wash blends image into the band */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--pine)]/40 via-transparent to-[var(--pine)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--pine)]/30 via-transparent to-[var(--pine)]/55" />

          {/* Caption */}
          <div className="absolute left-6 md:left-10 bottom-6 md:bottom-10 flex items-center gap-3 text-[var(--on-pine-soft)]">
            <span className="inline-block h-px w-10 bg-[var(--gold-300)]" />
            <span className="text-[11px] uppercase tracking-[0.3em] font-[family-name:var(--font-accent)]">
              An Editorial Eye
            </span>
          </div>
        </div>

        {/* Text side */}
        <div className="lg:col-span-5 relative flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-16 md:py-24 lg:py-32">
          {/* Decorative oversized mark */}
          <span
            aria-hidden
            className="absolute top-6 right-6 md:top-10 md:right-10 font-serif text-[200px] leading-none text-[var(--on-pine)]/[0.06] select-none pointer-events-none"
          >
            &mdash;
          </span>

          <Reveal y={32}>
            <div className="relative max-w-xl flex flex-col gap-8">
              <span className="eyebrow on-dark inline-flex items-center gap-4">
                <span className="inline-block h-px w-12 bg-[var(--gold-300)]" />
                Our Philosophy
              </span>

              <h2 className="font-serif text-[clamp(2.1rem,3vw+1rem,3.5rem)] leading-[1.14] text-[var(--on-pine)]">
                A fine house is{" "}
                <em className="italic text-[var(--gold-300)] font-normal">
                  built
                </em>
                .
                <br />
                A true home is{" "}
                <em className="italic text-[var(--gold-300)] font-normal">
                  found
                </em>
                .
              </h2>

              <p className="text-[15px] md:text-[16px] leading-[1.75] text-[var(--on-pine-soft)] max-w-md font-light">
                Every search opens with a question — not where, but how. How you
                wake. How you gather. How you come to rest. We listen first; the
                address has a way of following.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <span className="inline-block h-px w-12 bg-[var(--gold-300)]/70" />
                <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--on-pine-faint)] font-[family-name:var(--font-accent)]">
                  A Note from the Atelier
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
