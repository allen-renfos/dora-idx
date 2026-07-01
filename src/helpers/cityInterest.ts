"use client";

/**
 * Browser-level city personalization store ("Amazon-style").
 *
 * Learns which CITY (and typical price range) a visitor cares about from their
 * browsing and persists it per-browser in localStorage. It is deliberately:
 *
 *  - Login-agnostic: one shared store for anonymous AND logged-in users. Logging
 *    in does not reset it; logging out does not erase it.
 *  - Backend-free: no network calls, no DB, no PII. We store only validated city
 *    names, integer counters, aggregate price figures, ISO timestamps, and a
 *    random anonymous id.
 *  - Self-healing: any parse error / version mismatch resets to an empty store.
 *  - SSR-safe: every exported function is a no-op / empty read on the server.
 */

const STORE_KEY = "ah_city_interest_v1";
const ANON_KEY = "ah_anon_id";
const VERSION = 1;

const MAX_CITIES = 12; // cap stored cities; drop the lowest-scoring beyond this
const TTL_DAYS = 90; // entries older than this are ignored + pruned on read
const HALF_LIFE_DAYS = 14; // recency half-life for ranking
const DAY_MS = 24 * 60 * 60 * 1000;
const TTL_MS = TTL_DAYS * DAY_MS;

const PRICE_MIN_BOUND = 1;
const PRICE_MAX_BOUND = 1_000_000_000; // 1e9

export type CityEventType = "view" | "search" | "favorite";

const EVENT_WEIGHTS: Record<CityEventType, number> = {
  view: 1,
  search: 2,
  favorite: 3,
};

export interface CityEntry {
  score: number;
  views: number;
  searches: number;
  favorites: number;
  lastSeenAt: string; // ISO timestamp
  priceCount: number;
  priceSum: number;
  priceMin: number; // meaningful only when priceCount > 0
  priceMax: number; // meaningful only when priceCount > 0
}

export interface CityInterestStore {
  version: number;
  cityInterests: Record<string, CityEntry>;
  topCity: string | null;
  updatedAt: string;
}

export interface PriceRange {
  price_min: number;
  price_max: number;
}

const isBrowser = (): boolean => typeof window !== "undefined";

const nowIso = (): string => new Date().toISOString();

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/* ------------------------------------------------------------------ *
 *  Anonymous id
 * ------------------------------------------------------------------ */

/**
 * Stable per-browser anonymous id. Created once via crypto.randomUUID(), reused
 * thereafter, and re-minted if the stored value is missing/corrupt.
 */
export function getAnonymousId(): string | null {
  if (!isBrowser()) return null;
  try {
    const existing = window.localStorage.getItem(ANON_KEY);
    if (existing && UUID_RE.test(existing)) return existing;
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : fallbackUuid();
    window.localStorage.setItem(ANON_KEY, id);
    return id;
  } catch {
    return null;
  }
}

// Only used if the platform lacks crypto.randomUUID (very old browsers / jsdom).
function fallbackUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/* ------------------------------------------------------------------ *
 *  Normalizers / validators
 * ------------------------------------------------------------------ */

const CITY_RE = /^[A-Za-z][A-Za-z .'-]{0,59}$/;

/**
 * Trim, collapse internal whitespace, Title-Case, and strictly validate a city
 * name. Returns null for junk (ZIPs, numbers, markup, empty).
 */
export function normalizeCity(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const collapsed = raw.trim().replace(/\s+/g, " ");
  if (!collapsed || !CITY_RE.test(collapsed)) return null;
  // Title-case at every word boundary (spaces, hyphens, apostrophes, periods).
  return collapsed
    .toLowerCase()
    .replace(/(^|[\s.'-])([a-z])/g, (_m, sep, ch) => sep + ch.toUpperCase());
}

/**
 * Coerce a raw price into a positive, in-bounds integer. Strips `$` and commas.
 * Returns null for junk / out-of-bounds.
 */
export function normalizePrice(raw: unknown): number | null {
  let n: number;
  if (typeof raw === "number") {
    n = raw;
  } else if (typeof raw === "string") {
    const cleaned = raw.replace(/[$,\s]/g, "");
    if (!cleaned || !/^\d+(\.\d+)?$/.test(cleaned)) return null;
    n = Number(cleaned);
  } else {
    return null;
  }
  if (!Number.isFinite(n)) return null;
  n = Math.round(n);
  if (n < PRICE_MIN_BOUND || n > PRICE_MAX_BOUND) return null;
  return n;
}

/* ------------------------------------------------------------------ *
 *  Store persistence
 * ------------------------------------------------------------------ */

function emptyStore(): CityInterestStore {
  return { version: VERSION, cityInterests: {}, topCity: null, updatedAt: nowIso() };
}

function isValidEntry(e: unknown): e is CityEntry {
  if (!e || typeof e !== "object") return false;
  const x = e as Record<string, unknown>;
  return (
    typeof x.score === "number" &&
    typeof x.views === "number" &&
    typeof x.searches === "number" &&
    typeof x.favorites === "number" &&
    typeof x.lastSeenAt === "string" &&
    typeof x.priceCount === "number" &&
    typeof x.priceSum === "number" &&
    typeof x.priceMin === "number" &&
    typeof x.priceMax === "number"
  );
}

function writeStore(store: CityInterestStore): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    /* quota / blocked — personalization is best-effort */
  }
}

/**
 * Read + parse the store. Fully guarded: any parse error, version mismatch, or
 * structurally invalid payload resets to (and persists) an empty store.
 */
export function safeRead(): CityInterestStore {
  if (!isBrowser()) return emptyStore();
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as unknown;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      (parsed as CityInterestStore).version !== VERSION ||
      typeof (parsed as CityInterestStore).cityInterests !== "object" ||
      (parsed as CityInterestStore).cityInterests === null
    ) {
      const fresh = emptyStore();
      writeStore(fresh);
      return fresh;
    }
    // Drop any structurally invalid entries rather than trusting them.
    const clean: Record<string, CityEntry> = {};
    for (const [city, entry] of Object.entries(
      (parsed as CityInterestStore).cityInterests
    )) {
      if (isValidEntry(entry)) clean[city] = entry;
    }
    return {
      version: VERSION,
      cityInterests: clean,
      topCity:
        typeof (parsed as CityInterestStore).topCity === "string"
          ? (parsed as CityInterestStore).topCity
          : null,
      updatedAt:
        typeof (parsed as CityInterestStore).updatedAt === "string"
          ? (parsed as CityInterestStore).updatedAt
          : nowIso(),
    };
  } catch {
    const fresh = emptyStore();
    writeStore(fresh);
    return fresh;
  }
}

/* ------------------------------------------------------------------ *
 *  Ranking helpers
 * ------------------------------------------------------------------ */

function recencyScore(entry: CityEntry, nowMs: number): number {
  const seen = Date.parse(entry.lastSeenAt);
  if (!Number.isFinite(seen)) return 0;
  const days = Math.max(0, (nowMs - seen) / DAY_MS);
  return entry.score * Math.pow(0.5, days / HALF_LIFE_DAYS);
}

function computeTopCity(store: CityInterestStore, nowMs: number): string | null {
  let best: string | null = null;
  let bestScore = -1;
  for (const [city, entry] of Object.entries(store.cityInterests)) {
    const s = recencyScore(entry, nowMs);
    if (s > bestScore) {
      bestScore = s;
      best = city;
    }
  }
  return best;
}

/** Remove entries past the TTL. Returns true if anything was pruned. */
function pruneExpired(store: CityInterestStore, nowMs: number): boolean {
  let changed = false;
  for (const [city, entry] of Object.entries(store.cityInterests)) {
    const seen = Date.parse(entry.lastSeenAt);
    if (!Number.isFinite(seen) || nowMs - seen > TTL_MS) {
      delete store.cityInterests[city];
      changed = true;
    }
  }
  return changed;
}

/** Enforce MAX_CITIES by dropping the lowest raw-score entries. */
function capCities(store: CityInterestStore): void {
  const entries = Object.entries(store.cityInterests);
  if (entries.length <= MAX_CITIES) return;
  entries.sort((a, b) => a[1].score - b[1].score); // ascending: lowest first
  for (let i = 0; i < entries.length - MAX_CITIES; i++) {
    delete store.cityInterests[entries[i][0]];
  }
}

/** Read, prune expired entries, persist if changed, and return the live store. */
function getLiveStore(): CityInterestStore {
  const store = safeRead();
  const nowMs = Date.now();
  if (pruneExpired(store, nowMs)) {
    store.topCity = computeTopCity(store, nowMs);
    store.updatedAt = nowIso();
    writeStore(store);
  }
  return store;
}

/* ------------------------------------------------------------------ *
 *  Public API
 * ------------------------------------------------------------------ */

/**
 * Record a single browsing event against a city. No-op on the server or for an
 * invalid city / event type. Bumps the weighted score + per-type counter,
 * refreshes recency, and folds any valid price into the aggregates.
 */
export function recordCityEvent(
  city: unknown,
  eventType: CityEventType,
  price?: unknown
): void {
  if (!isBrowser()) return;
  const weight = EVENT_WEIGHTS[eventType];
  if (!weight) return;
  const norm = normalizeCity(city);
  if (!norm) return;

  const store = safeRead();
  const now = nowIso();
  const entry: CityEntry =
    store.cityInterests[norm] ?? {
      score: 0,
      views: 0,
      searches: 0,
      favorites: 0,
      lastSeenAt: now,
      priceCount: 0,
      priceSum: 0,
      priceMin: 0,
      priceMax: 0,
    };

  entry.score += weight;
  if (eventType === "view") entry.views += 1;
  else if (eventType === "search") entry.searches += 1;
  else entry.favorites += 1;
  entry.lastSeenAt = now;

  const p = normalizePrice(price);
  if (p !== null) {
    if (entry.priceCount === 0) {
      entry.priceMin = p;
      entry.priceMax = p;
    } else {
      entry.priceMin = Math.min(entry.priceMin, p);
      entry.priceMax = Math.max(entry.priceMax, p);
    }
    entry.priceCount += 1;
    entry.priceSum += p;
  }

  store.cityInterests[norm] = entry;
  capCities(store);
  store.topCity = computeTopCity(store, Date.parse(now));
  store.updatedAt = now;
  writeStore(store);
}

/** Recency-weighted top city, or null when there is no live interest. */
export function getTopCity(): string | null {
  return computeTopCity(getLiveStore(), Date.now());
}

/**
 * Price band for the top city: avg viewed price ±25%, widened to cover the
 * observed min/max. Returns null when the top city has no priced events.
 */
export function getTopCityPriceRange(): PriceRange | null {
  const store = getLiveStore();
  const top = computeTopCity(store, Date.now());
  if (!top) return null;
  const entry = store.cityInterests[top];
  if (!entry || entry.priceCount === 0) return null;

  const avg = entry.priceSum / entry.priceCount;
  let min = Math.round(avg * 0.75);
  let max = Math.round(avg * 1.25);
  // Widen the band so it always covers the extremes we've actually seen.
  min = Math.min(min, entry.priceMin);
  max = Math.max(max, entry.priceMax);
  min = Math.max(PRICE_MIN_BOUND, min);
  return { price_min: min, price_max: max };
}

/** The live (pruned) per-city interest map. */
export function getCityInterests(): Record<string, CityEntry> {
  return getLiveStore().cityInterests;
}

/** Clear all recorded city interest. The anonymous id is intentionally kept. */
export function clearCityInterests(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORE_KEY);
  } catch {
    /* ignore */
  }
}
