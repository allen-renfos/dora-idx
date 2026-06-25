// Default advanced-filter selections applied automatically on the /properties page.
// Centralized so the search-bar can recognize (and suppress the indication of)
// the default selections, while the Advanced Search modal still displays them.
export const DEFAULT_PROPERTY_STATUS = "Active";

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

