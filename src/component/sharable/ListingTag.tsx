"use client";

import { memo } from "react";

/**
 * Listing status / marketing tags rendered as badges on property cards.
 *
 * The backend search API (`/v1/properties/search`, `/v1/properties`) returns a
 * ready-to-render, ordered, compliance-filtered `tags` array (max 2) on every
 * property. The frontend renders exactly what it receives — no re-deriving,
 * reordering, filtering, or hiding based on client status logic.
 *
 * To add or restyle a tone later, edit ONLY `TAG_TONES` / `TAG_TONE_MAP` below.
 * Adding a brand-new tag string is a one-line change in `TAG_TONE_MAP`; any
 * unknown value falls back to the neutral tone automatically (never throws).
 */

type Tone =
  | "highlight"
  | "firstLook"
  | "fresh"
  | "active"
  | "caution"
  | "progress"
  | "closed"
  | "reduced"
  | "neutral";

/**
 * Single source of truth for tone → styling. Each status gets its own
 * conventional color (green = active, amber = pending, …) as a solid pill
 * with white text — every background is a 700-weight shade so white text
 * meets WCAG AA at badge size — plus a faint white ring so it reads on any
 * listing photo.
 */
const TAG_TONES: Record<Tone, string> = {
  // OPEN HOUSE — event: violet, the most eye-catching.
  highlight: "bg-[#6d28d9] text-white ring-1 ring-white/20",
  // FIRST LOOK / COMING SOON (NWMLS pre-market preview): teal.
  firstLook: "bg-[#0f766e] text-white ring-1 ring-white/20",
  // NEW — just listed: blue.
  fresh: "bg-[#1d4ed8] text-white ring-1 ring-white/20",
  // ACTIVE — on the market: green.
  active: "bg-[#15803d] text-white ring-1 ring-white/20",
  // CONTINGENT — offer accepted with conditions: orange.
  caution: "bg-[#c2410c] text-white ring-1 ring-white/20",
  // PENDING family — under contract: amber.
  progress: "bg-[#a16207] text-white ring-1 ring-white/20",
  // SOLD / CLOSED — off the market: red.
  closed: "bg-[#b91c1c] text-white ring-1 ring-white/20",
  // PRICE REDUCED: pink.
  reduced: "bg-[#be185d] text-white ring-1 ring-white/20",
  // Fallback for unknown / new tag strings: slate.
  neutral: "bg-[#475569] text-white ring-1 ring-white/20",
};

/**
 * Tag string (as sent by the API, display-ready uppercase) → tone.
 * Add new known tags here. Anything not listed renders with the neutral tone.
 */
const TAG_TONE_MAP: Record<string, Tone> = {
  "OPEN HOUSE": "highlight",
  NEW: "fresh",
  ACTIVE: "active",
  "FIRST LOOK": "firstLook",
  "COMING SOON": "firstLook",
  CONTINGENT: "caution",
  PENDING: "progress",
  "PENDING FEASIBILITY": "progress",
  "PENDING INSPECTION": "progress",
  "PENDING SHORT SALE": "progress",
  "PENDING - BACKUP OFFER REQUESTED": "progress",
  SOLD: "closed",
  CLOSED: "closed",
  "PRICE REDUCED": "reduced",
  REDUCED: "reduced",
};

const toneFor = (tag: string): Tone =>
  TAG_TONE_MAP[tag?.trim()?.toUpperCase()] ?? "neutral";

/**
 * Tone classes for any tag/status string, for surfaces that render their own
 * pill shape (e.g. the property detail header) but must share card colors.
 */
export const tagToneClass = (tag: string): string => TAG_TONES[toneFor(tag)];

interface ListingTagProps {
  tag: string;
  className?: string;
}

/**
 * Pure presentational pill for a single tag: status dot + label. Real text
 * (screen-reader readable). Long labels truncate gracefully with the full text exposed via
 * `title`/`aria-label`.
 */
function ListingTagBase({ tag, className = "" }: ListingTagProps) {
  if (!tag) return null;
  const tone = TAG_TONES[toneFor(tag)];

  return (
    <span
      title={tag}
      aria-label={tag}
      className={`inline-flex max-w-[180px] items-center gap-1.5 whitespace-nowrap pl-2.5 pr-3 py-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.14em] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.35)] ${tone} ${className}`}
      style={{ borderRadius: "var(--radius-pill, 999px)" }}
    >
      {/* Status dot */}
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/90" />
      <span className="truncate">{tag}</span>
    </span>
  );
}

export const ListingTag = memo(ListingTagBase);

interface ListingTagsProps {
  tags?: string[] | null;
  className?: string;
}

/**
 * Renders a row of badges from an ordered `tags` array (already prioritized and
 * capped at 2 by the backend). Renders nothing — no empty container, no layout
 * shift — when `tags` is missing, null, or empty.
 */
function ListingTagsBase({ tags, className = "" }: ListingTagsProps) {
  if (!Array.isArray(tags) || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {tags.map((tag, index) => (
        <ListingTag key={`${tag}-${index}`} tag={tag} />
      ))}
    </div>
  );
}

export const ListingTags = memo(ListingTagsBase);
