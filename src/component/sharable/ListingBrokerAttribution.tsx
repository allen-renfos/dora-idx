"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { getListingBroker, type ListingBroker } from "@/helpers/listingBroker";

/**
 * NWMLS "Listing Broker firm | broker | phone | email" attribution
 * (MLS Grid IDX Rule 22), shown as plain text in two lines:
 *
 *   Listing Broker Firm | Broker
 *   (425) 555-1234 | broker@example.com
 *
 * Slightly emphasized but never dominant: a soft inset panel, values in
 * --ink and the "Listing Broker" label in quiet --ink-soft; no icons, links
 * or bold.
 * Never smaller than the nearby contact buttons (12–13px): the rule requires
 * at least that prominence.
 *
 * - `inline`  — soft inset panel for property cards.
 * - `compact` (prop) — smaller text for the map popup card, which
 *               has no contact buttons to match.
 * - `sidebar` — the same text in a standard sidebar card, placed directly
 *               below the agent contact card.
 *
 * Renders nothing when the listing has neither firm nor broker (including
 * older cached responses without the new keys).
 */
export function ListingBrokerAttribution({
  item,
  variant = "inline",
  compact = false,
  className = "",
}: {
  item: unknown;
  variant?: "inline" | "sidebar";
  /** Smaller text (11.5px → 11px) for the map popup card. */
  compact?: boolean;
  className?: string;
}) {
  const broker = getListingBroker(item);
  if (!broker) return null;

  return variant === "sidebar" ? (
    <section
      aria-label="Listing broker"
      className={`bg-[var(--surface-obsidian)] border border-[var(--line-soft)] rounded-[var(--radius-md)] px-6 py-5 ${className}`}
    >
      <BrokerText broker={broker} sizes={FIT_SIZES} />
    </section>
  ) : (
    // Soft inset panel so the block reads as its own unit on cards without
    // shouting: faint tint + hairline, no bold.
    <div
      className={`bg-[var(--ink)]/[0.035] border border-[var(--line-soft)] rounded-[var(--radius-sm)] ${
        compact ? "px-2.5 py-1.5" : "px-3.5 py-2.5"
      } ${className}`}
    >
      <BrokerText broker={broker} sizes={compact ? COMPACT_FIT_SIZES : FIT_SIZES} />
    </div>
  );
}

/**
 * A wrapping row of segments separated by a light bar. Each segment moves
 * to the next line whole; the bar is drawn as a leading pseudo-element that
 * the row's negative margin + overflow clip hides at the start of a line, so
 * a wrapped line never begins or ends with a dangling bar. The bar is also
 * in the text (sr-only) for screen readers and copy/paste.
 */
function Segments({ items }: { items: [string, ReactNode][] }) {
  return (
    <span className="block overflow-hidden">
      <span data-row className="flex flex-wrap -ml-4">
        {items.map(([key, value], i) => (
          <span
            key={key}
            className="relative min-w-0 max-w-full pl-4 before:absolute before:left-[5px] before:top-0 before:content-['|'] before:text-[var(--line-strong)]"
          >
            {i > 0 && <span className="sr-only"> | </span>}
            {value}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Font sizes tried in order; 12px is the floor (the contact buttons' size). */
const FIT_SIZES = [13, 12.5, 12];
/** Map popup card: no contact buttons there, so it can sit smaller. */
const COMPACT_FIT_SIZES = [11.5, 11];

const rowsFit = (el: HTMLElement) =>
  Array.from(el.querySelectorAll<HTMLElement>("[data-row]")).every((row) => {
    const items = Array.from(row.children) as HTMLElement[];
    return items.every((item) => item.offsetTop === items[0].offsetTop);
  });

/**
 * Keeps every row on one line: tries the largest size in FIT_SIZES that
 * fits; if even the floor can't hold "Listing Broker Firm | Broker", it
 * stacks the label on its own line and fits again. Re-runs on resize.
 */
function useFitRows(sizes: number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [stacked, setStacked] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let lastWidth = -1;
    // Width only: stacking changes the height, which must not re-trigger.
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === lastWidth) return;
      lastWidth = el.clientWidth;
      setWidth(lastWidth);
      setStacked(false);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !width) return;
    for (const size of sizes) {
      el.style.fontSize = `${size}px`;
      if (rowsFit(el)) return;
    }
    if (!stacked) setStacked(true);
  }, [width, stacked, sizes]);

  return { ref, stacked };
}

/**
 * "Listing Broker Firm | Broker" on the first line, "Phone | Email" on the
 * second. The label rides with the first segment so it never sits alone;
 * when that row can't fit, the label moves to a line of its own.
 */
function BrokerText({
  broker,
  sizes,
}: {
  broker: ListingBroker;
  sizes: number[];
}) {
  const { ref, stacked } = useFitRows(sizes);
  // The label stays quiet; the firm, broker and contact details read in ink.
  const label = <span className="text-[var(--ink-soft)]">Listing Broker </span>;
  const who: [string, ReactNode][] = [];
  if (broker.firm) who.push(["firm", broker.firm]);
  if (broker.broker) who.push(["broker", broker.broker]);
  if (!stacked) who[0] = [who[0][0], <>{label}{who[0][1]}</>];
  const contact: [string, string][] = [];
  if (broker.phone) contact.push(["phone", broker.phone]);
  if (broker.email) contact.push(["email", broker.email]);

  return (
    <div
      ref={ref}
      className="flex flex-col leading-[1.55] text-[var(--ink)] [overflow-wrap:anywhere]"
      style={{ fontSize: sizes[0] }}
    >
      {stacked && label}
      <Segments items={who} />
      {contact.length > 0 && (
        <>
          {" "}
          <span className="tabular-nums">
            <Segments items={contact} />
          </span>
        </>
      )}
      {broker.buyerOffice && (
        <>
          {" "}
          <span className="mt-1">
            <span className="text-[var(--ink-soft)]">Buyer&apos;s Brokerage </span>
            {broker.buyerOffice}
          </span>
        </>
      )}
    </div>
  );
}
