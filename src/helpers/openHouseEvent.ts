/**
 * Bridges the domain `PropertyOpenHouse` model to a serializable
 * `CalendarEvent`. Kept separate from `calendar.ts` so the core link/ICS
 * utilities stay free of app-specific types and easy to unit-test.
 */

import type { CalendarEvent } from "./calendar";
import { isSafeHttpUrl } from "./calendar";
import type { PropertyOpenHouse } from "@/types/Property";

const ONE_HOUR_MS = 60 * 60 * 1000;

export interface OpenHouseEventContext {
  /** Listing display title (price/address headline). */
  propertyTitle?: string | null;
  /** Physical address used for the event location. */
  address?: string | null;
  /** Canonical listing URL. */
  listingUrl?: string | null;
  /** Optional listing contact / organizer. */
  organizer?: { name?: string; email?: string };
}

/** Parse a value into a valid Date, or return null. */
function parseDate(value: string | null | undefined): Date | null {
  if (!value || typeof value !== "string") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Convert a normalized open house + listing context into a `CalendarEvent`.
 * Returns `null` when there isn't enough information to build a valid event.
 */
export function buildOpenHouseEvent(
  openHouse: PropertyOpenHouse,
  ctx: OpenHouseEventContext = {}
): CalendarEvent | null {
  const start =
    parseDate(openHouse.startTime) ?? parseDate(openHouse.date);
  if (!start) return null;

  let end = parseDate(openHouse.endTime);
  if (!end || end.getTime() <= start.getTime()) {
    end = new Date(start.getTime() + ONE_HOUR_MS);
  }

  const cleanAddress = ctx.address
    ? String(ctx.address).replace(/±/g, "#").trim()
    : "";

  const titleBase = cleanAddress || ctx.propertyTitle?.trim() || "this home";
  const title = `Open House — ${titleBase}`;

  const descriptionParts: string[] = [
    `Open house for ${titleBase}.`,
  ];
  if (openHouse.refreshments) {
    descriptionParts.push(`Refreshments: ${openHouse.refreshments}`);
  }
  if (isSafeHttpUrl(openHouse.virtualOpenHouseUrl)) {
    descriptionParts.push(
      `Virtual open house: ${openHouse.virtualOpenHouseUrl}`
    );
  }

  return {
    title,
    start,
    end,
    description: descriptionParts.join("\n"),
    location: cleanAddress || undefined,
    url: isSafeHttpUrl(ctx.listingUrl) ? ctx.listingUrl : undefined,
    organizer: ctx.organizer,
    uid: openHouse.key ? `oh-${openHouse.key}@dorashibu` : undefined,
  };
}
