// Default advanced-filter selections applied automatically on the /properties page.
// Centralized so the search-bar can recognize (and suppress the indication of)
// the default selections, while the Advanced Search modal still displays them.
//
// "Coming Soon" is how NWMLS First Look listings are filtered; the API only
// returns the ones the seller opted into. Multi-status values are pipe-joined
// and fanned out per status by `fetchMlsSearchPropertyList`.
export const DEFAULT_PROPERTY_STATUS = "Active|Coming Soon";

// What saved searches store for the default status. The saved-search backend
// (alerts) only understands a single status, so the default is saved as the
// pre-First-Look default rather than a pipe-joined value.
export const SAVED_SEARCH_DEFAULT_STATUS = "Active";

/** Split a pipe-joined status filter into distinct, trimmed values. */
export const splitStatuses = (value?: string | null): string[] =>
  Array.from(
    new Set(
      String(value ?? "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );

/** Order-insensitive check for the automatic default status selection. */
export const isDefaultPropertyStatus = (value?: string | null): boolean => {
  const a = splitStatuses(value);
  const b = splitStatuses(DEFAULT_PROPERTY_STATUS);
  return a.length === b.length && b.every((s) => a.includes(s));
};

// Message shown when Advanced Search is locked (no city/ZIP entered yet).
export const ADVANCED_DISABLED_MESSAGE =
  "Enter a city, ZIP code, or neighbourhood to unlock advanced filters.";

// 5-digit ZIP, optionally ZIP+4 (e.g. 98052 or 98052-1234).
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;

/**
 * Advanced Search is gated behind a valid AREA search: a city or a ZIP code.
 *  - ZIP: a 5-digit (or ZIP+4) numeric value.
 *  - City: any non-empty text that is not purely numeric.
 * Empty / whitespace-only / non-ZIP numeric strings do NOT qualify.
 */
export const isValidAreaSearch = (value?: string | number | null): boolean => {
  if (value === null || value === undefined) return false;
  const trimmed = String(value).trim();
  if (!trimmed) return false;
  if (ZIP_REGEX.test(trimmed)) return true; // ZIP / ZIP+4
  if (/^\d+$/.test(trimmed)) return false; // numeric but not a valid ZIP
  return true; // non-numeric text => treat as city
};

