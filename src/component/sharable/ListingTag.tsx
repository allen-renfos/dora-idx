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

type Tone = "highlight" | "fresh" | "active" | "caution" | "progress" | "neutral";

/**
 * Single source of truth for tone → styling. Colors are solid pills with
 * AA-contrast text that read well overlaid on listing photos in both light and
 * dark themes (the site uses a dark-mode class strategy; `dark:` variants are
 * included for safety).
 */
// Retoned into the "Verdant Atelier" palette (sand / sage / champagne gold /
// pine). Solid, AA-contrast pills with a faint hairline so they read on any
// listing photo while staying calm against the muted surfaces.
const TAG_TONES: Record<Tone, string> = {
  // OPEN HOUSE — most prominent: champagne gold pill on dark ink text.
  highlight:
    "bg-[var(--gold)] text-[var(--pine)] ring-1 ring-black/10",
  // NEW — positive / fresh: deep forest pine.
  fresh: "bg-[var(--pine)] text-[var(--on-pine)] ring-1 ring-white/10",
  // ACTIVE — neutral-positive: AA-safe sage.
  active: "bg-[var(--sage-deep)] text-white ring-1 ring-white/15",
  // CONTINGENT — caution: muted clay/ochre.
  caution: "bg-[#a06b3c] text-white ring-1 ring-white/15",
  // PENDING family — in-progress: pewter silver.
  progress: "bg-[var(--silver-deep)] text-white ring-1 ring-white/15",
  // Fallback for unknown / new tag strings: soft ink.
  neutral: "bg-[var(--ink-soft)] text-white ring-1 ring-white/15",
};

/**
 * Tag string (as sent by the API, display-ready uppercase) → tone.
 * Add new known tags here. Anything not listed renders with the neutral tone.
 */
const TAG_TONE_MAP: Record<string, Tone> = {
  "OPEN HOUSE": "highlight",
  NEW: "fresh",
  ACTIVE: "active",
  CONTINGENT: "caution",
  PENDING: "progress",
  "PENDING FEASIBILITY": "progress",
  "PENDING INSPECTION": "progress",
  "PENDING SHORT SALE": "progress",
  "PENDING - BACKUP OFFER REQUESTED": "progress",
};

const toneFor = (tag: string): Tone =>
  TAG_TONE_MAP[tag?.trim()?.toUpperCase()] ?? "neutral";

interface ListingTagProps {
  tag: string;
  className?: string;
}

/**
 * Pure presentational pill for a single tag. Real text (screen-reader
 * readable). Long labels truncate gracefully with the full text exposed via
 * `title`/`aria-label`.
 */
function ListingTagBase({ tag, className = "" }: ListingTagProps) {
  if (!tag) return null;
  const tone = TAG_TONES[toneFor(tag)];

  return (
    <span
      title={tag}
      aria-label={tag}
      className={`inline-flex max-w-[160px] items-center truncate whitespace-nowrap px-3 py-1.5 text-[10px] font-semibold uppercase leading-none tracking-[0.16em] shadow-sm ${tone} ${className}`}
      style={{ borderRadius: "var(--radius-pill, 999px)" }}
    >
      {tag}
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
