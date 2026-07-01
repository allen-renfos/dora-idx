"use client";

// Single source of truth for customer auth persistence.
//
// - Access token + customer identity live in localStorage so the session survives tab
//   close and full browser restart, and is shared across tabs.
// - The refresh token is NOT here — it lives only in an HttpOnly cookie the browser
//   manages automatically.
// - `auth_hint` is a tiny non-sensitive flag used to decide whether to attempt a silent
//   refresh on app load (so we never call /refresh for visitors who never logged in).

const ACCESS_TOKEN = "access_token";
const CUSTOMER_ID = "customer_id";
const CUSTOMER_NAME = "customer_name";
const AUTH_HINT = "auth_hint";
const KEYS = [ACCESS_TOKEN, CUSTOMER_ID, CUSTOMER_NAME, AUTH_HINT];

const isBrowser = () => typeof window !== "undefined";

// Read localStorage first, then fall back to sessionStorage so anyone already logged in
// under the OLD flow is transparently migrated on their next visit.
const read = (key: string): string | null => {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

export const getAccessToken = () => read(ACCESS_TOKEN);
export const getCustomerId = () => read(CUSTOMER_ID);
export const getCustomerName = () => read(CUSTOMER_NAME);
export const isAuthenticated = () => !!getAccessToken();
export const hasAuthHint = () => read(AUTH_HINT) === "1";

export interface SessionPayload {
  access_token?: string | null;
  id?: string | number | null; // login returns `id` / `customer_id`
  customer_id?: string | number | null;
  name?: string | null;
}

// Persist a full login session.
export const setSession = (s: SessionPayload) => {
  if (!isBrowser() || !s.access_token) return;
  try {
    const id = s.customer_id ?? s.id;
    window.localStorage.setItem(ACCESS_TOKEN, s.access_token);
    if (id != null) window.localStorage.setItem(CUSTOMER_ID, String(id));
    if (s.name != null) window.localStorage.setItem(CUSTOMER_NAME, String(s.name));
    window.localStorage.setItem(AUTH_HINT, "1");
    // Clear any stale per-tab copies left by the old sessionStorage flow.
    KEYS.forEach((k) => window.sessionStorage.removeItem(k));
  } catch {
    /* storage full / blocked — auth will fall back to network on next call */
  }
};

// Update ONLY the access token after a silent refresh (keeps id/name/hint).
export const updateAccessToken = (token: string) => {
  if (!isBrowser() || !token) return;
  try {
    window.localStorage.setItem(ACCESS_TOKEN, token);
    window.localStorage.setItem(AUTH_HINT, "1");
  } catch {
    /* ignore */
  }
};

// Wipe everything (explicit logout, or refresh failed / session revoked).
export const clearSession = () => {
  if (!isBrowser()) return;
  try {
    KEYS.forEach((k) => {
      window.localStorage.removeItem(k);
      window.sessionStorage.removeItem(k);
    });
  } catch {
    /* ignore */
  }
};
