import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  normalizeCity,
  normalizePrice,
  recordCityEvent,
  getTopCity,
  getTopCityPriceRange,
  getCityInterests,
  getAnonymousId,
  clearCityInterests,
} from "./cityInterest";

const STORE_KEY = "ah_city_interest_v1";
const ANON_KEY = "ah_anon_id";

/* -------------------------------------------------------------------------- *
 *  Self-contained in-memory localStorage mock (no reliance on jsdom's).
 * -------------------------------------------------------------------------- */
class MemoryStorage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  clear() {
    this.map.clear();
  }
  getItem(key: string): string | null {
    return this.map.has(key) ? (this.map.get(key) as string) : null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, String(value));
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
  key(i: number): string | null {
    return Array.from(this.map.keys())[i] ?? null;
  }
}

const DAY = 24 * 60 * 60 * 1000;
const BASE = new Date("2026-01-01T00:00:00.000Z").getTime();

beforeEach(() => {
  const mem = new MemoryStorage();
  Object.defineProperty(window, "localStorage", { value: mem, configurable: true });
  vi.useFakeTimers();
  vi.setSystemTime(new Date(BASE));
});

afterEach(() => {
  vi.useRealTimers();
});

/** Advance the (fake) clock by N days. */
const advanceDays = (n: number) => vi.setSystemTime(new Date(BASE + n * DAY));

describe("normalizeCity", () => {
  it("trims, collapses whitespace, and Title-Cases", () => {
    expect(normalizeCity("  new   york  ")).toBe("New York");
    expect(normalizeCity("SEATTLE")).toBe("Seattle");
    expect(normalizeCity("st. louis")).toBe("St. Louis");
  });

  it("rejects junk (ZIPs, numbers, markup, empty)", () => {
    expect(normalizeCity("98101")).toBeNull();
    expect(normalizeCity("<script>alert(1)</script>")).toBeNull();
    expect(normalizeCity("123 Main")).toBeNull();
    expect(normalizeCity("   ")).toBeNull();
    expect(normalizeCity("")).toBeNull();
    expect(normalizeCity(42 as unknown)).toBeNull();
  });
});

describe("normalizePrice", () => {
  it("coerces valid prices, stripping $ and commas", () => {
    expect(normalizePrice("$1,250,000")).toBe(1250000);
    expect(normalizePrice(499999.6)).toBe(500000);
    expect(normalizePrice("750000")).toBe(750000);
  });

  it("rejects out-of-bounds and junk", () => {
    expect(normalizePrice(0)).toBeNull();
    expect(normalizePrice(-5)).toBeNull();
    expect(normalizePrice(2e9)).toBeNull();
    expect(normalizePrice("abc")).toBeNull();
    expect(normalizePrice("")).toBeNull();
    expect(normalizePrice(null)).toBeNull();
    expect(normalizePrice(undefined)).toBeNull();
  });
});

describe("top-city ranking", () => {
  it("ranks the most-frequently viewed city first", () => {
    recordCityEvent("Seattle", "view");
    recordCityEvent("Seattle", "view");
    recordCityEvent("Seattle", "view");
    recordCityEvent("Portland", "view");
    expect(getTopCity()).toBe("Seattle");
  });

  it("weights favorite (3) > search (2) > view (1)", () => {
    recordCityEvent("Denver", "view"); // score 1
    recordCityEvent("Austin", "favorite"); // score 3
    expect(getTopCity()).toBe("Austin");
  });

  it("lets a recent city beat an older but more-frequent one", () => {
    // Bellevue: strong (score 4) but old.
    recordCityEvent("Bellevue", "search");
    recordCityEvent("Bellevue", "search");
    // 30 days later, a single view of Tacoma.
    advanceDays(30);
    recordCityEvent("Tacoma", "view");
    expect(getTopCity()).toBe("Tacoma");
  });
});

describe("TTL expiry", () => {
  it("ignores and prunes entries older than 90 days", () => {
    recordCityEvent("Spokane", "view");
    advanceDays(91);
    expect(getTopCity()).toBeNull();
    expect(getCityInterests()["Spokane"]).toBeUndefined();
  });
});

describe("corruption + version handling", () => {
  it("resets to an empty store on unparseable JSON", () => {
    window.localStorage.setItem(STORE_KEY, "}{not json");
    expect(getCityInterests()).toEqual({});
    expect(getTopCity()).toBeNull();
  });

  it("resets on a version mismatch", () => {
    window.localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ version: 999, cityInterests: { Ghost: {} }, topCity: "Ghost" })
    );
    expect(getCityInterests()).toEqual({});
  });
});

describe("price band derivation", () => {
  it("derives avg ±25% and widens to observed extremes", () => {
    recordCityEvent("Miami", "view", 400000);
    recordCityEvent("Miami", "view", 400000);
    recordCityEvent("Miami", "view", 1000000);
    // avg = 600000 -> raw band [450000, 750000], widened to [400000, 1000000].
    expect(getTopCityPriceRange()).toEqual({ price_min: 400000, price_max: 1000000 });
  });

  it("returns a tighter band when no extreme lies outside ±25%", () => {
    recordCityEvent("Boise", "view", 500000);
    // avg = 500000 -> [375000, 625000]; observed min/max = 500000 (inside).
    expect(getTopCityPriceRange()).toEqual({ price_min: 375000, price_max: 625000 });
  });

  it("returns null when the top city has no priced events", () => {
    recordCityEvent("Reno", "view"); // no price
    expect(getTopCity()).toBe("Reno");
    expect(getTopCityPriceRange()).toBeNull();
  });
});

describe("anonymous id", () => {
  it("is stable across calls and persisted", () => {
    const a = getAnonymousId();
    const b = getAnonymousId();
    expect(a).toBeTruthy();
    expect(a).toBe(b);
    expect(window.localStorage.getItem(ANON_KEY)).toBe(a);
  });
});

describe("clearCityInterests", () => {
  it("wipes interest data but keeps the anonymous id", () => {
    const id = getAnonymousId();
    recordCityEvent("Chicago", "view", 350000);
    expect(getTopCity()).toBe("Chicago");

    clearCityInterests();
    expect(getCityInterests()).toEqual({});
    expect(getTopCity()).toBeNull();
    expect(getAnonymousId()).toBe(id); // anon id survives
  });
});

describe("city cap", () => {
  it("keeps at most 12 cities, dropping the lowest score", () => {
    // 12 strong cities, each scored 3 (favorite).
    for (let i = 0; i < 12; i++) recordCityEvent(`City${String.fromCharCode(65 + i)}`, "favorite");
    // A 13th, weakest (view = 1) — should be dropped.
    recordCityEvent("Weakling", "view");
    const cities = getCityInterests();
    expect(Object.keys(cities)).toHaveLength(12);
    expect(cities["Weakling"]).toBeUndefined();
  });
});
