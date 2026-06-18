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
      <main className="bg-[var(--surface-ink)] text-white min-h-screen">
        <section className="relative isolate pt-32 pb-12 md:pt-40 md:pb-14 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--surface-obsidian)] via-[var(--surface-ink)] to-[var(--surface-ink)]"
          />
          <div
            aria-hidden
            className="absolute -top-24 right-0 w-[420px] h-[420px] rounded-full opacity-[0.06] blur-[120px] bg-[var(--gold-500)]"
          />

          <div className="container-page max-w-4xl">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-[var(--gold-500)]" />
                {eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="display-lg text-white mt-5">{title}</h1>
            </Reveal>
          </div>
        </section>

        <section className="container-page max-w-4xl pb-20">
          <article className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] p-7 md:p-10 lg:p-14 legal-prose">
            {children}
          </article>
        </section>
      </main>

      <style jsx global>{`
        .legal-prose {
          color: rgba(255, 255, 255, 0.78);
          font-size: 16px;
          line-height: 1.8;
          font-family: var(--font-lato), sans-serif;
        }
        .legal-prose h2 {
          font-family: var(--font-playfair), Georgia, serif;
          color: #fff;
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
          background: var(--gold-500);
          flex: 0 0 auto;
        }
        .legal-prose p {
          margin-bottom: 1.2em;
        }
        .legal-prose a {
          color: var(--gold-500);
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-thickness: 1px;
          transition: color 0.2s ease;
        }
        .legal-prose a:hover {
          color: #fff;
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
          color: var(--gold-500);
        }
        .legal-prose strong {
          color: #fff;
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
