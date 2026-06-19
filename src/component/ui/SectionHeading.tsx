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
  // "dark" tone = ink text for sand/cream sections;
  // "light" tone = on-pine text for sections over the deep forest band or photography.
  const isLight = tone === "light";
  const textColor = isLight ? "text-[var(--on-pine)]" : "text-[var(--ink)]";
  const mutedColor = isLight
    ? "text-[var(--on-pine-soft)]"
    : "text-[var(--ink-soft)]";
  const eyebrowClass = isLight ? "eyebrow on-dark" : "eyebrow";
  const ruleColor = isLight ? "bg-[var(--gold-300)]" : "bg-[var(--gold)]";

  const containerAlign =
    align === "center"
      ? "items-center text-center"
      : align === "between"
      ? "md:flex-row md:items-end md:justify-between md:text-left"
      : "items-start text-left";

  return (
    <div
      className={`flex flex-col gap-8 ${containerAlign} ${className ?? ""}`}
    >
      <Reveal className="flex flex-col gap-5 max-w-3xl">
        {eyebrow ? (
          <span className={`${eyebrowClass} inline-flex items-center gap-4`}>
            <span className={`inline-block h-px w-10 ${ruleColor}`} />
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
