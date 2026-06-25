/**
 * Calendar link & .ics generation utilities.
 *
 * Pure, framework-agnostic functions used by the "Add to calendar" feature.
 * Everything here is deterministic and side-effect free (except `downloadIcs`,
 * which touches the DOM) so it can be unit-tested in isolation.
 *
 * Design notes
 * ------------
 * - All event instants are normalized to **UTC** before being serialized.
 *   Google, Outlook and the ICS spec all accept UTC timestamps (suffixed with
 *   `Z`) and will convert them to the viewer's local timezone on display. This
 *   sidesteps the need to embed fragile VTIMEZONE blocks and keeps the times
 *   unambiguous across devices.
 * - Text fields are sanitized for the target format (URL-encoded for the web
 *   links, RFC 5545-escaped for the .ics payload) to prevent header/parameter
 *   injection and malformed output.
 * - User-supplied URLs are validated to be http(s) before use, preventing
 *   `javascript:` / `data:` and other unsafe-scheme injection.
 */

export interface CalendarEvent {
  /** Human-readable event title, e.g. "Open House — 123 Main St". */
  title: string;
  /** Event start instant. */
  start: Date;
  /** Event end instant. Must be after `start`. */
  end: Date;
  /** Optional free-text description. */
  description?: string;
  /** Optional physical location (address). */
  location?: string;
  /** Optional canonical URL for the listing. */
  url?: string;
  /** Optional organizer / listing contact. */
  organizer?: { name?: string; email?: string };
  /**
   * Optional IANA timezone label (e.g. "America/Los_Angeles"). Currently used
   * only for display/metadata; serialized timestamps are always UTC.
   */
  timeZone?: string;
  /** Stable unique id; auto-derived when omitted. */
  uid?: string;
}

const GOOGLE_BASE = "https://calendar.google.com/calendar/render";
const OUTLOOK_BASE =
  "https://outlook.live.com/calendar/0/deeplink/compose";
const OFFICE_BASE =
  "https://outlook.office.com/calendar/0/deeplink/compose";

/* ───────────────────────── validation ───────────────────────── */

/** Returns true only for well-formed absolute http(s) URLs. */
export function isSafeHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const u = new URL(value.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Basic, conservative email validation used before exposing an organizer. */
export function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const v = value.trim();
  // Single @, no spaces/control chars, a dot in the domain.
  return /^[^\s@,;:<>"']+@[^\s@,;:<>"']+\.[^\s@,;:<>"']+$/.test(v);
}

/**
 * Validate an event is internally consistent and serializable.
 * Throws a descriptive Error when invalid so callers can fail fast.
 */
export function assertValidEvent(event: CalendarEvent): void {
  if (!event || typeof event !== "object") {
    throw new Error("Calendar event is required.");
  }
  if (!event.title || !event.title.trim()) {
    throw new Error("Calendar event must have a title.");
  }
  if (!(event.start instanceof Date) || Number.isNaN(event.start.getTime())) {
    throw new Error("Calendar event has an invalid start date.");
  }
  if (!(event.end instanceof Date) || Number.isNaN(event.end.getTime())) {
    throw new Error("Calendar event has an invalid end date.");
  }
  if (event.end.getTime() <= event.start.getTime()) {
    throw new Error("Calendar event end must be after its start.");
  }
}

/* ───────────────────────── date helpers ───────────────────────── */

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Format a Date as a UTC "basic" timestamp: `YYYYMMDDTHHMMSSZ`.
 * Used by Google Calendar and the ICS spec.
 */
export function toBasicUtc(date: Date): string {
  return (
    `${date.getUTCFullYear()}` +
    `${pad(date.getUTCMonth() + 1)}` +
    `${pad(date.getUTCDate())}T` +
    `${pad(date.getUTCHours())}` +
    `${pad(date.getUTCMinutes())}` +
    `${pad(date.getUTCSeconds())}Z`
  );
}

/** Format a Date as a UTC ISO 8601 string (Outlook accepts this). */
export function toIsoUtc(date: Date): string {
  // Trim milliseconds for cleaner URLs; both forms are valid.
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

/* ───────────────────────── text sanitization ───────────────────────── */

/**
 * Strip control characters (except tab/newline) that could corrupt output or
 * be used to inject extra ICS properties. Leaves normal text intact.
 */
export function stripControlChars(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

/**
 * Escape a value for inclusion in an ICS (RFC 5545) text field.
 * Order matters: backslash first, then the structural characters.
 */
export function escapeIcsText(value: string): string {
  return stripControlChars(value)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/**
 * Fold an ICS content line to <=75 octets per RFC 5545 (section 3.1),
 * continuing with CRLF + single space. Operates on UTF-8 byte length.
 */
export function foldIcsLine(line: string): string {
  const encoder =
    typeof TextEncoder !== "undefined" ? new TextEncoder() : null;
  const byteLen = (s: string) =>
    encoder ? encoder.encode(s).length : s.length;

  if (byteLen(line) <= 75) return line;

  const out: string[] = [];
  let current = "";
  for (const char of line) {
    // +1 accounts for the leading space added to continuation lines.
    const candidate = current + char;
    const limit = out.length === 0 ? 75 : 74;
    if (byteLen(candidate) > limit) {
      out.push(current);
      current = char;
    } else {
      current = candidate;
    }
  }
  if (current) out.push(current);
  return out.join("\r\n ");
}

/* ───────────────────────── link builders ───────────────────────── */

function buildDescription(event: CalendarEvent): string {
  const parts: string[] = [];
  if (event.description) parts.push(event.description);
  if (isSafeHttpUrl(event.url)) parts.push(event.url);
  return parts.join("\n\n");
}

/** Build a Google Calendar "add event" URL. */
export function googleCalendarUrl(event: CalendarEvent): string {
  assertValidEvent(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: stripControlChars(event.title),
    dates: `${toBasicUtc(event.start)}/${toBasicUtc(event.end)}`,
  });
  const details = buildDescription(event);
  if (details) params.set("details", stripControlChars(details));
  if (event.location) params.set("location", stripControlChars(event.location));
  return `${GOOGLE_BASE}?${params.toString()}`;
}

/**
 * Build an Outlook "compose" deeplink URL.
 * @param variant "live" for personal Outlook.com, "office" for Microsoft 365.
 */
export function outlookCalendarUrl(
  event: CalendarEvent,
  variant: "live" | "office" = "live"
): string {
  assertValidEvent(event);
  const base = variant === "office" ? OFFICE_BASE : OUTLOOK_BASE;
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: stripControlChars(event.title),
    startdt: toIsoUtc(event.start),
    enddt: toIsoUtc(event.end),
  });
  const body = buildDescription(event);
  if (body) params.set("body", stripControlChars(body));
  if (event.location) params.set("location", stripControlChars(event.location));
  return `${base}?${params.toString()}`;
}

/* ───────────────────────── ICS builder ───────────────────────── */

function deriveUid(event: CalendarEvent): string {
  if (event.uid && event.uid.trim()) return stripControlChars(event.uid.trim());
  const seed = `${toBasicUtc(event.start)}-${event.title}`;
  // Lightweight deterministic hash (djb2) — not for security, just stability.
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33) ^ seed.charCodeAt(i);
  }
  return `oh-${(hash >>> 0).toString(36)}@dorashibu`;
}

/**
 * Build a valid RFC 5545 VCALENDAR document for a single event.
 * Returns the raw `.ics` text (CRLF line endings, folded long lines).
 */
export function buildIcs(
  event: CalendarEvent,
  now: Date = new Date()
): string {
  assertValidEvent(event);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dora Shibu//Open House//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${deriveUid(event)}`,
    `DTSTAMP:${toBasicUtc(now)}`,
    `DTSTART:${toBasicUtc(event.start)}`,
    `DTEND:${toBasicUtc(event.end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
  ];

  const description = buildDescription(event);
  if (description) lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
  if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`);
  if (isSafeHttpUrl(event.url)) lines.push(`URL:${escapeIcsText(event.url)}`);

  if (event.organizer && isValidEmail(event.organizer.email)) {
    const cn = event.organizer.name
      ? `;CN=${escapeIcsText(event.organizer.name)}`
      : "";
    lines.push(`ORGANIZER${cn}:mailto:${event.organizer.email}`);
  }

  lines.push("STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR");

  return lines.map(foldIcsLine).join("\r\n");
}

/** Build a safe filename slug for the downloaded .ics file. */
export function icsFileName(event: CalendarEvent): string {
  const slug = stripControlChars(event.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${slug || "open-house"}.ics`;
}

/**
 * Trigger a client-side download of the event as an `.ics` file.
 * Uses an in-memory Blob + object URL (no network, no injection surface).
 * Safe to call only in the browser.
 */
export function downloadIcs(event: CalendarEvent): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("downloadIcs can only run in the browser.");
  }
  const ics = buildIcs(event);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = icsFileName(event);
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } finally {
    // Defer revoke so Safari has time to start the download.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
