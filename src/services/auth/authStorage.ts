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
const REFRESH_TOKEN = "refresh_token";
const CUSTOMER_ID = "customer_id";
const CUSTOMER_NAME = "customer_name";
const AUTH_HINT = "auth_hint";
const KEYS = [ACCESS_TOKEN, REFRESH_TOKEN, CUSTOMER_ID, CUSTOMER_NAME, AUTH_HINT];

const isBrowser = () => typeof window !== "undefined";

// Non-HttpOnly hint cookie the backend sets alongside the HttpOnly access-token
// cookie. Our backend keeps the access token in an HttpOnly cookie (sent
// automatically via `withCredentials`) and returns only identity fields in the
// login body — so there is no bearer token to mirror into localStorage. This
// cookie lets JS know a cookie session is active even when localStorage is empty.
const SESSION_COOKIE = "rp_session_active";

const hasSessionCookie = (): boolean => {
  if (!isBrowser()) return false;
  try {
    return document.cookie
      .split(";")
      .some((c) => c.trim().startsWith(`${SESSION_COOKIE}=`));
  } catch {
    return false;
  }
};

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
export const getRefreshToken = () => read(REFRESH_TOKEN);
export const getCustomerId = () => read(CUSTOMER_ID);
export const getCustomerName = () => read(CUSTOMER_NAME);
// A prior session exists if we persisted the hint on login OR the backend's
// session cookie is still present (e.g. localStorage was cleared but the cookie
// is valid).
export const hasAuthHint = () => read(AUTH_HINT) === "1" || hasSessionCookie();
// Authenticated when we hold a bearer token (legacy/body-token backends) OR a
// live cookie session (this backend). Never require a body access token that the
// cookie-based backend never returns.
export const isAuthenticated = () => !!getAccessToken() || hasAuthHint();

export interface SessionPayload {
  access_token?: string | null;
  refresh_token?: string | null; // stored so /customer/refresh can be called explicitly
  id?: string | number | null; // login returns `id` / `customer_id`
  customer_id?: string | number | null;
  name?: string | null;
}

// Persist a full login session.
export const setSession = (s: SessionPayload) => {
  // Our backend returns identity + `expires_in` in the body and delivers the
  // access token as an HttpOnly cookie — so `access_token` is usually absent.
  // Persist the session on any successful login: store whatever we got and set
  // the hint so the app recognizes the (cookie-backed) session. Only bail when
  // there is no browser to write to.
  if (!isBrowser()) return;
  try {
    const id = s.customer_id ?? s.id;
    if (s.access_token)
      window.localStorage.setItem(ACCESS_TOKEN, s.access_token);
    if (s.refresh_token != null)
      window.localStorage.setItem(REFRESH_TOKEN, String(s.refresh_token));
    if (id != null) window.localStorage.setItem(CUSTOMER_ID, String(id));
    if (s.name != null) window.localStorage.setItem(CUSTOMER_NAME, String(s.name));
    window.localStorage.setItem(AUTH_HINT, "1");
    // Clear any stale per-tab copies left by the old sessionStorage flow.
    KEYS.forEach((k) => window.sessionStorage.removeItem(k));
  } catch {
    /* storage full / blocked — auth will fall back to network on next call */
  }
};

// Update the access token (and rotated refresh token, if the server returned one)
// after a silent refresh. Keeps id/name/hint.
export const updateAccessToken = (token: string, refreshToken?: string | null) => {
  if (!isBrowser() || !token) return;
  try {
    window.localStorage.setItem(ACCESS_TOKEN, token);
    if (refreshToken != null && refreshToken !== "")
      window.localStorage.setItem(REFRESH_TOKEN, String(refreshToken));
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
    // Best-effort clear of the JS-readable session hint so isAuthenticated()
    // reflects logout immediately, even before the backend response lands.
    document.cookie = `${SESSION_COOKIE}=; Max-Age=0; path=/`;
  } catch {
    /* ignore */
  }
};
