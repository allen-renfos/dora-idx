"use client";

import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Align = "start" | "center" | "between";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: Align;
  action?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  action,
  tone = "dark",
  className,
}: SectionHeadingProps) {
  // White-theme mapping: "dark" tone = ink text for default (white) sections;
  // "light" tone = white text for sections sitting over dark photography.
  const textColor = tone === "dark" ? "text-[var(--ink)]" : "text-white";
  const mutedColor =
    tone === "dark"
      ? "text-[var(--ink-soft)]"
      : "text-[rgba(255,255,255,0.72)]";

  const containerAlign =
    align === "center"
      ? "items-center text-center"
      : align === "between"
      ? "md:flex-row md:items-end md:justify-between md:text-left"
      : "items-start text-left";

  return (
    <div
      className={`flex flex-col gap-6 ${containerAlign} ${className ?? ""}`}
    >
      <Reveal className="flex flex-col gap-4 max-w-2xl">
        {eyebrow ? (
          <span className="eyebrow inline-flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-[var(--gold-500)]" />
            {eyebrow}
          </span>
        ) : null}
        <h2 className={`display-lg ${textColor}`}>{title}</h2>
        {description ? (
          <p className={`lede ${mutedColor} max-w-xl`}>{description}</p>
        ) : null}
      </Reveal>
      {action ? (
        <Reveal delay={0.08} className="shrink-0">
          {action}
        </Reveal>
      ) : null}
    </div>
  );
}
