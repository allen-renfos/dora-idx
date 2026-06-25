import axiosInstance from "../Api";

/**
 * Search metadata drives EVERY filter dropdown on the public IDX search.
 *
 * The backend (`GET /v1/properties/search-metadata`) is the single source of
 * truth for allowed filter values: statuses, property types, counties, cities,
 * states, school districts, basement, sewer, lot/site/community features, views
 * and interior features. The frontend must render ONLY what this endpoint
 * returns and must submit the canonical `value` (never a display label), or the
 * backend returns zero results even when matching listings exist.
 *
 * Response is cached by the server (`Cache-Control: max-age=300`); we mirror
 * that with React Query `staleTime` so the endpoint is fetched once per session
 * window.
 */

/** A single, normalized option ready to render + submit. */
export interface MetadataOption {
  /** Canonical value submitted to the search endpoint. */
  value: string;
  /** Human-readable label rendered in the UI. */
  label: string;
}

/** Normalized metadata consumed by the filter UI. Keys mirror the API exactly. */
export interface SearchMetadata {
  statuses: MetadataOption[];
  property_types: MetadataOption[];
  states: MetadataOption[];
  counties: MetadataOption[];
  cities: MetadataOption[];
  school_districts: MetadataOption[];
  basement_options: MetadataOption[];
  sewer_options: MetadataOption[];
  site_features: MetadataOption[];
  lot_features: MetadataOption[];
  community_amenities: MetadataOption[];
  property_views: MetadataOption[];
  interior_features: MetadataOption[];
}

const EMPTY_METADATA: SearchMetadata = {
  statuses: [],
  property_types: [],
  states: [],
  counties: [],
  cities: [],
  school_districts: [],
  basement_options: [],
  sewer_options: [],
  site_features: [],
  lot_features: [],
  community_amenities: [],
  property_views: [],
  interior_features: [],
};

/**
 * Coerce a single raw entry into `{ value, label }`.
 * Tolerates strings, `{ value, label }`, `{ value }`, `{ id, name }`, `{ name }`.
 */
const toOption = (raw: unknown): MetadataOption | null => {
  if (raw == null) return null;
  if (typeof raw === "string" || typeof raw === "number") {
    const s = String(raw).trim();
    return s ? { value: s, label: s } : null;
  }
  if (typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const value =
      obj.value ?? obj.id ?? obj.key ?? obj.code ?? obj.name ?? obj.label;
    const label = obj.label ?? obj.name ?? obj.title ?? obj.value ?? value;
    if (value == null) return null;
    const v = String(value).trim();
    if (!v) return null;
    return { value: v, label: String(label ?? v).trim() || v };
  }
  return null;
};

/**
 * Normalize an arbitrary metadata group (array of strings/objects, or a
 * `{ value: label }` map) into a de-duplicated `MetadataOption[]`.
 */
export const normalizeMetadataOptions = (raw: unknown): MetadataOption[] => {
  let list: unknown[] = [];
  if (Array.isArray(raw)) {
    list = raw;
  } else if (raw && typeof raw === "object") {
    list = Object.entries(raw as Record<string, unknown>).map(([k, v]) =>
      typeof v === "string" || typeof v === "number"
        ? { value: k, label: String(v) }
        : v,
    );
  }
  const seen = new Set<string>();
  const out: MetadataOption[] = [];
  for (const item of list) {
    const opt = toOption(item);
    if (!opt) continue;
    const dedupeKey = opt.value.toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    out.push(opt);
  }
  return out;
};

/** Pick the first present key from a raw payload (tolerant of naming drift). */
const pick = (src: Record<string, unknown>, ...keys: string[]): unknown => {
  for (const k of keys) {
    if (src[k] != null) return src[k];
  }
  return undefined;
};

/** Map the raw API payload onto the normalized `SearchMetadata` shape. */
export const normalizeSearchMetadata = (payload: unknown): SearchMetadata => {
  if (!payload || typeof payload !== "object") return EMPTY_METADATA;
  // Endpoints commonly wrap the body in `data`; unwrap when present.
  const root = payload as Record<string, unknown>;
  const src = (root.data && typeof root.data === "object"
    ? (root.data as Record<string, unknown>)
    : root) as Record<string, unknown>;

  return {
    statuses: normalizeMetadataOptions(
      pick(src, "statuses", "standard_status", "property_status"),
    ),
    property_types: normalizeMetadataOptions(
      pick(src, "property_types", "propertyTypes", "property_type"),
    ),
    states: normalizeMetadataOptions(pick(src, "states", "state")),
    counties: normalizeMetadataOptions(pick(src, "counties", "county")),
    cities: normalizeMetadataOptions(pick(src, "cities", "city")),
    school_districts: normalizeMetadataOptions(
      pick(src, "school_districts", "schoolDistricts", "school_district"),
    ),
    basement_options: normalizeMetadataOptions(
      pick(src, "basement_options", "basement", "basements"),
    ),
    sewer_options: normalizeMetadataOptions(
      pick(src, "sewer_options", "sewer", "sewers"),
    ),
    site_features: normalizeMetadataOptions(
      pick(src, "site_features", "siteFeatures", "exterior_features"),
    ),
    lot_features: normalizeMetadataOptions(
      pick(src, "lot_features", "lotFeatures", "lot_feature"),
    ),
    community_amenities: normalizeMetadataOptions(
      pick(src, "community_amenities", "community_features", "communityFeatures"),
    ),
    property_views: normalizeMetadataOptions(
      pick(src, "property_views", "views", "view", "property_view"),
    ),
    interior_features: normalizeMetadataOptions(
      pick(src, "interior_features", "interiorFeatures"),
    ),
  };
};

/**
 * Fetch + normalize search metadata. Resolves to empty groups (never throws)
 * so the filter UI degrades gracefully if the endpoint is unavailable.
 */
export const fetchSearchMetadata = async (
  signal?: AbortSignal,
): Promise<SearchMetadata> => {
  const lagnt = process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID;
  try {
    const response = await axiosInstance.get("/v1/properties/search-metadata", {
      params: lagnt ? { lagnt } : undefined,
      signal,
    });
    return normalizeSearchMetadata(response.data);
  } catch {
    return EMPTY_METADATA;
  }
};
