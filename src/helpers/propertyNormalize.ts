/**
 * Shared normalization + formatting helpers for property detail data.
 *
 * The IDX/MLS API returns list-type attributes (appliances, flooring, roof,
 * heating, etc.) in several inconsistent shapes:
 *   - clean arrays:                ["Attached Garage"]
 *   - JSON-encoded strings:        "[\"Composition\"]"
 *   - partially-split JSON arrays:  ["[\"Dishwasher\"", "\"Disposal\"", "\"Stove(s)/Range(s)\"]"]
 *   - null / undefined / empty
 *
 * `normalizeListValue` collapses all of these into a clean `string[]`.
 */

/** Strip stray brackets / surrounding quotes from a single token. */
function cleanToken(value: string): string {
  return value
    .replace(/^\s*\[/, "")
    .replace(/\]\s*$/, "")
    .replace(/^"+/, "")
    .replace(/"+$/, "")
    .trim();
}

/** Attempt to parse a string as a JSON array of primitives. */
function tryParseJsonArray(value: string): string[] | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[")) return null;
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed
        .map((x) => String(x).trim())
        .filter((x) => x.length > 0);
    }
  } catch {
    /* not valid JSON — fall through */
  }
  return null;
}

/**
 * Normalize any of the supported list shapes into a clean string array.
 * Always returns an array (empty when there is nothing displayable).
 */
export function normalizeListValue(input: unknown): string[] {
  if (input === null || input === undefined) return [];

  if (Array.isArray(input)) {
    if (input.length === 0) return [];
    // Partially-split JSON arrays re-join into a single valid JSON string.
    const joined = input.map((x) => String(x)).join(",");
    const parsed = tryParseJsonArray(joined);
    if (parsed && parsed.length) return parsed;
    // Otherwise treat as an already-clean array and tidy each element.
    return input.flatMap((x) => {
      const token = cleanToken(String(x));
      return token ? [token] : [];
    });
  }

  if (typeof input === "string") {
    const parsed = tryParseJsonArray(input);
    if (parsed && parsed.length) return parsed;
    const token = cleanToken(input);
    return token ? [token] : [];
  }

  if (typeof input === "number" || typeof input === "boolean") {
    return [String(input)];
  }

  return [];
}

/** Normalize a list value and join into a display string, or null when empty. */
export function formatList(input: unknown): string | null {
  const list = normalizeListValue(input);
  return list.length ? list.join(", ") : null;
}

/** Coerce a value into a finite number, or null. */
export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Format a currency value, e.g. `$669,995`. Returns null when not numeric. */
export function formatPrice(value: unknown): string | null {
  const n = toNumber(value);
  return n === null ? null : `$${n.toLocaleString("en-US")}`;
}

/** Format a square-footage value, e.g. `2,335 sq ft`. */
export function formatSqft(value: unknown): string | null {
  const n = toNumber(value);
  return n === null ? null : `${n.toLocaleString("en-US")} sq ft`;
}

/** Format lot size from acres and/or square feet. */
export function formatLotSize(acres: unknown, sqft: unknown): string | null {
  const a = toNumber(acres);
  const s = toNumber(sqft);
  if (a !== null && s !== null) {
    return `${a} ac · ${s.toLocaleString("en-US")} sq ft`;
  }
  if (a !== null) return `${a} acres`;
  if (s !== null) return `${s.toLocaleString("en-US")} sq ft`;
  return null;
}

/** Return the first value that is not null/undefined/empty-string. */
export function pickValue<T>(...values: (T | null | undefined)[]): T | null {
  for (const v of values) {
    if (v !== null && v !== undefined && v !== "") return v;
  }
  return null;
}

/** Interpret a loosely-typed boolean flag (true / "1" / "true" / 1). */
export function toBool(value: unknown): boolean | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const n = value.trim().toLowerCase();
    if (n === "false" || n === "0" || n === "no") return false;
    return true;
  }
  return Boolean(value);
}
