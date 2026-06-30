"use client";
import { useNameContext } from "@/component/NameProvider";

export const AboutUsBanner = () => {
  const { company_name } = useNameContext();

  return (
    <section className="relative isolate overflow-hidden bg-[var(--pine)] pt-16 pb-10 md:pt-20 md:pb-12">
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -bottom-16 right-[2vw] font-serif text-[clamp(7rem,20vw,18rem)] leading-none text-[var(--on-pine)]/[0.04]"
      >
        Story
      </span>

      <div className="container-wide relative">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6 md:gap-7">
          <span className="eyebrow on-dark inline-flex items-center gap-3">
            <span className="inline-block h-px w-10 bg-[var(--gold-300)]" />
            The Practice
            <span className="inline-block h-px w-10 bg-[var(--gold-300)]" />
          </span>

          <h1
            className="display-xl text-[var(--on-pine)]"
            style={{ fontSize: "clamp(1.75rem, 2.6vw + 0.5rem, 3.25rem)", lineHeight: 1.22 }}
          >
            The {company_name || "Dora"}{" "}
            <em className="text-[var(--gold-300)]">story</em>.
          </h1>

          <p
            className="lede max-w-xl text-[var(--on-pine-soft)]"
            style={{ fontSize: "clamp(0.9rem, 0.3vw + 0.85rem, 1rem)", lineHeight: 1.8 }}
          >
            Devoted to the craft, guided by results, and quietly committed to
            every step of your move.
          </p>
        </div>
      </div>
    </section>
  );
};
