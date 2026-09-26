/**
 * Client-side MLS display gates (defense-in-depth).
 *
 * The backend is the primary enforcer: a listing that may not be shown is
 * 404'd on the detail endpoint and dropped from list/search responses. These
 * helpers are the backstop for everything the backend can't protect once a
 * payload has left it — a future API regression, a stale react-query / CDN
 * copy fetched before a seller revoked NWMLS "First Look" consent, a wishlist
 * row that outlived its listing, a server-rendered link preview.
 *
 * Rules:
 *  - `compliance.canDisplayListing` explicitly false → never display.
 *  - A First Look listing is display-by-exception (seller opt-in within a
 *    window), so it is shown ONLY when `canDisplayListing` is explicitly true.
 *    Missing / malformed compliance fails closed for First Look.
 *  - Any other listing without a compliance block keeps legacy behavior
 *    (displayable) so older payloads don't disappear.
 */

type AnyRecord = Record<string, any>;

const TRUE_STRINGS = new Set(["true", "1", "yes", "y"]);
const FALSE_STRINGS = new Set(["false", "0", "no", "n"]);

/** Strict tri-state flag parse: true / false / null (unknown). */
const toFlag = (value: unknown): boolean | null => {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (TRUE_STRINGS.has(v)) return true;
    if (FALSE_STRINGS.has(v)) return false;
  }
  return null;
};

/** "First Look" / "first_look" / "FIRST-LOOK" → "first_look". */
const toSlug = (value: unknown): string =>
  typeof value === "string"
    ? value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
    : "";

const FIRST_LOOK = "first_look";

/**
 * True when the listing is an NWMLS First Look listing. The API is not
 * consistent about the slug (list DTO sends `mls_status: "First Look"`, the
 * detail DTO sends `"first_look"`), so every status field and the tags are
 * normalized before comparing.
 */
export function isFirstLookListing(listing: unknown): boolean {
  if (!listing || typeof listing !== "object") return false;
  const l = listing as AnyRecord;

  const statuses = [l.mls_status, l.MlsStatus, l.status, l.property_status];
  if (statuses.some((s) => toSlug(s) === FIRST_LOOK)) return true;

  return Array.isArray(l.tags) && l.tags.some((t: unknown) => toSlug(t) === FIRST_LOOK);
}

/** Raw `canDisplayListing` flag from the payload (tri-state). */
const readCanDisplayFlag = (l: AnyRecord): boolean | null => {
  const c = l.compliance && typeof l.compliance === "object" ? l.compliance : null;
  return toFlag(c?.canDisplayListing ?? c?.can_display_listing);
};

/**
 * May this listing be rendered at all? Accepts a raw API listing (list item,
 * detail `data`, or wishlist row). Treat `false` identically to "not found".
 */
export function canDisplayListing(listing: unknown): boolean {
  if (!listing || typeof listing !== "object") return false;
  const l = listing as AnyRecord;

  const flag = readCanDisplayFlag(l);
  if (flag === false) return false;
  if (flag !== true && isFirstLookListing(l)) return false;
  return true;
}

/** Filter a raw list of listings down to the ones that may be displayed. */
export function filterDisplayableListings<T>(listings: T[] | null | undefined): T[] {
  return Array.isArray(listings) ? listings.filter((l) => canDisplayListing(l)) : [];
}
