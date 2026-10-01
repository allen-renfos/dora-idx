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

/**
 * Consumer-facing label for a status. NWMLS First Look listings are filtered
 * and stored as "Coming Soon" (the API value stays untouched so queries keep
 * working), but MLS rules require them to read simply "First Look".
 */
export function displayStatusLabel(status: string | null | undefined): string {
  const slug = toSlug(status);
  // Also catches compound labels such as "Coming Soon - First Look".
  return slug.includes("coming_soon") || slug.includes(FIRST_LOOK)
    ? "First Look"
    : (status ?? "");
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

/**
 * True when the payload carries an explicit, parseable `canDisplayListing`.
 * Rows without one (e.g. wishlist projections) can't be trusted for listings
 * whose display depends on seller consent.
 */
export function hasDisplayFlag(listing: unknown): boolean {
  if (!listing || typeof listing !== "object") return false;
  return readCanDisplayFlag(listing as AnyRecord) !== null;
}

/**
 * Consent-dependent listings (First Look / Coming Soon) — their display can
 * change at any time, so a row without a fresh display flag must be verified.
 */
export function isConsentDependentListing(listing: unknown): boolean {
  if (isFirstLookListing(listing)) return true;
  if (!listing || typeof listing !== "object") return false;
  const l = listing as AnyRecord;
  return [l.mls_status, l.MlsStatus, l.status, l.property_status, l.StandardStatus].some(
    (s) => toSlug(s) === "coming_soon"
  );
}

/**
 * May a raw list/card payload show its primary (cover) photo? Explicit
 * `compliance.canShowPrimaryPhoto` wins; otherwise the legacy NWMLS
 * must-remove-photos flag. Unknown → allowed (legacy behavior).
 */
export function canShowPrimaryPhoto(listing: unknown): boolean {
  if (!canDisplayListing(listing)) return false;
  const l = listing as AnyRecord;
  const c = l.compliance && typeof l.compliance === "object" ? l.compliance : null;
  const flag = toFlag(c?.canShowPrimaryPhoto);
  if (flag !== null) return flag;
  return toFlag(l.NWM_IDXMustRemovePhotosYN) !== true;
}

interface PhotoSource {
  compliance: {
    canDisplayListing: boolean;
    canShowPrimaryPhoto: boolean;
    canShowExtraPhotos: boolean;
  };
  media: { coverPhoto: string | null; images: string[] };
}

/**
 * The exact photo set a detail view may show. The primary photo is the cover
 * (or the first image when no cover is set); every other image is "extra".
 * Primary and extra permissions are independent — one never unlocks the other.
 */
export function getDisplayablePhotos({ compliance, media }: PhotoSource): string[] {
  if (!compliance.canDisplayListing) return [];
  const images = Array.isArray(media.images) ? media.images : [];
  if (images.length === 0) return [];

  const primary = media.coverPhoto && images.includes(media.coverPhoto)
    ? media.coverPhoto
    : images[0];
  const extras = images.filter((img) => img !== primary);

  return [
    ...(compliance.canShowPrimaryPhoto ? [primary] : []),
    ...(compliance.canShowExtraPhotos ? extras : []),
  ];
}
