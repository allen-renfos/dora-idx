"use client";

import { ReactNode } from "react";
import { Reveal } from "@/component/ui/Reveal";

interface Props {
  active?: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}

export function LegalPage({ eyebrow, title, children }: Props) {
  return (
    <>
      <main className="bg-[var(--canvas)] text-[var(--ink)] min-h-screen">
        <section className="relative isolate overflow-hidden bg-[var(--pine)] pt-36 pb-14 md:pt-44 md:pb-20">
          <span
            aria-hidden
            className="pointer-events-none select-none absolute -bottom-14 right-[2vw] font-serif text-[clamp(6rem,18vw,15rem)] leading-none text-[var(--on-pine)]/[0.04]"
          >
            Legal
          </span>

          <div className="container-page max-w-4xl relative">
            <Reveal>
              <span className="eyebrow on-dark inline-flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-[var(--gold-300)]" />
                {eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="display-lg text-[var(--on-pine)] mt-5">{title}</h1>
            </Reveal>
          </div>
        </section>

        <section className="container-page max-w-4xl section-pad">
          <article className="bg-[var(--cream)] rounded-[var(--radius-lg)] border border-[var(--line)] shadow-[var(--shadow-soft)] p-7 md:p-10 lg:p-14 legal-prose">
            {children}
          </article>
        </section>
      </main>

      <style jsx global>{`
        .legal-prose {
          color: var(--ink-soft);
          font-size: 16px;
          line-height: 1.8;
          font-family: var(--font-lato), sans-serif;
        }
        .legal-prose h2 {
          font-family: var(--font-playfair), Georgia, serif;
          color: var(--ink);
          font-weight: 400;
          font-size: clamp(1.4rem, 1.2vw + 1rem, 1.85rem);
          line-height: 1.25;
          margin-top: 2.2em;
          margin-bottom: 0.65em;
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 0.85em;
        }
        .legal-prose h2:first-child {
          margin-top: 0;
        }
        .legal-prose h2::before {
          content: "";
          display: inline-block;
          width: 28px;
          height: 1px;
          background: var(--gold);
          flex: 0 0 auto;
        }
        .legal-prose p {
          margin-bottom: 1.2em;
        }
        .legal-prose a {
          color: var(--accent-text);
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-thickness: 1px;
          transition: color 0.2s ease;
        }
        .legal-prose a:hover {
          color: var(--ink);
        }
        .legal-prose ul,
        .legal-prose ol {
          padding-left: 1.5em;
          margin-bottom: 1.2em;
        }
        .legal-prose li {
          margin-bottom: 0.4em;
        }
        .legal-prose ul li::marker {
          color: var(--gold-deep);
        }
        .legal-prose strong {
          color: var(--ink);
          font-weight: 600;
        }
        .legal-prose hr {
          border: 0;
          border-top: 1px solid var(--line-soft);
          margin: 2em 0;
        }
      `}</style>
    </>
  );
}
