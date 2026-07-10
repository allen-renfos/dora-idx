import "server-only";

import { headers } from "next/headers";

/**
 * Server-side helpers shared by `generateMetadata` (Open Graph tags) and the
 * OG-image route. Kept in one `server-only` module so both read a listing the
 * exact same way — and so this code can never leak into a client bundle.
 */

// Last-resort backend, matching the proxy's own default (see
// src/app/api/[...path]/route.ts). Used only if every env-based base fails.
const FALLBACK_API_BASE = "https://stgadm.realtipro.com/api";

/**
 * Build the absolute origin of the current request from forwarded headers.
 * On a proxied deploy host `x-forwarded-host` / `x-forwarded-proto` reflect the
 * public URL; we fall back to `host` and https.
 */
export async function getRequestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const proto = h.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

/**
 * Candidate API bases, in priority order:
 *   1. The site's OWN `/api` proxy at the request origin — exactly what the
 *      working client uses, and always reachable from the deploy host.
 *   2. NEXT_API_PROXY_TARGET — the proxy's real backend target.
 *   3. NEXT_PUBLIC_API_BASE_URL / NEXT_API_BASE_URL.
 *   4. A hardcoded known-good backend as last resort.
 *
 * `NEXT_PUBLIC_API_BASE_URL` is typically UNSET in production (the client goes
 * through the proxy), so relying on it alone yields an empty preview.
 */
async function getApiBases(): Promise<string[]> {
  const origin = await getRequestOrigin();
  const bases = [
    origin ? `${origin}/api` : "",
    process.env.NEXT_API_PROXY_TARGET,
    process.env.NEXT_PUBLIC_API_BASE_URL,
    process.env.NEXT_API_BASE_URL,
    FALLBACK_API_BASE,
  ];
  // De-dupe while preserving order, dropping falsy entries.
  return Array.from(new Set(bases.filter((b): b is string => Boolean(b))));
}

/**
 * Fetch a single listing's raw payload server-side. Tries each API base in
 * order until one returns JSON with a `data` field. Returns `body.data` (the
 * inner raw IDX/MLS object the normalizer expects), or `null` on total failure.
 */
export async function fetchListingRaw(id: string): Promise<any | null> {
  if (!id) return null;

  const lagnt = process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID;
  const path = `/v1/property/listingkey/${encodeURIComponent(id)}${
    lagnt ? `?lagnt=${encodeURIComponent(lagnt)}` : ""
  }`;

  const bases = await getApiBases();

  for (const base of bases) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(`${base}${path}`, {
        signal: controller.signal,
        cache: "no-store",
        headers: { accept: "application/json" },
      });
      clearTimeout(timeout);
      if (!res.ok) {
        console.error(
          `[propertyServer] ${base}${path} -> HTTP ${res.status}`
        );
        continue;
      }
      const body = await res.json();
      const data = body?.data ?? null;
      if (data) return data;
      console.error(`[propertyServer] ${base}${path} -> empty data`);
    } catch (err) {
      clearTimeout(timeout);
      console.error(`[propertyServer] ${base}${path} -> ${String(err)}`);
    }
  }

  return null;
}
