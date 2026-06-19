"use client";
import { useNameContext } from "@/component/NameProvider";

export const AboutUsBanner = () => {
  const { company_name } = useNameContext();

  return (
    <section className="relative isolate overflow-hidden bg-[var(--pine)] pt-36 pb-20 md:pt-44 md:pb-24">
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -bottom-16 right-[2vw] font-serif text-[clamp(7rem,20vw,18rem)] leading-none text-[var(--on-pine)]/[0.04]"
      >
        Story
      </span>

      <div className="container-wide relative">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <span className="eyebrow on-dark inline-flex items-center gap-3">
            <span className="inline-block h-px w-10 bg-[var(--gold-300)]" />
            The Practice
            <span className="inline-block h-px w-10 bg-[var(--gold-300)]" />
          </span>

          <h1 className="display-xl text-[var(--on-pine)]">
            The {company_name || "Dora"}{" "}
            <em className="text-[var(--gold-300)]">story</em>.
          </h1>

          <p className="lede max-w-xl text-[var(--on-pine-soft)]">
            Devoted to the craft, guided by results, and quietly committed to
            every step of your move.
          </p>
        </div>
      </div>
    </section>
  );
};
