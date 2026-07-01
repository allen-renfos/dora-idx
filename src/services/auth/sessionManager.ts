"use client";

import axios from "axios";
import { getApiBaseUrl } from "@/helpers/apiBaseUrl";
import { updateAccessToken, getAccessToken, hasAuthHint } from "./authStorage";

const REFRESH_URL = `${getApiBaseUrl()}/customer/refresh`;

// Module-level promise so concurrent callers share ONE in-flight refresh.
let inFlight: Promise<string | null> | null = null;

/**
 * Exchange the HttpOnly refresh cookie for a new access token.
 * Returns the new token on success, or null if the refresh could not be honored.
 *
 * NON-DESTRUCTIVE: this never clears the session on its own. A failed refresh
 * (endpoint missing, no refresh cookie, network error) simply returns null and
 * leaves any stored access token untouched — the CALLER decides what a null
 * means. Only the 401 response interceptor, which knows a real authenticated
 * request just failed, is allowed to tear the session down.
 * Concurrent calls are de-duplicated into a single network request.
 */
export const refreshSession = (): Promise<string | null> => {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      // Bare axios: no shared interceptors, sends the cookie via withCredentials.
      const res = await axios.post(REFRESH_URL, null, {
        withCredentials: true,
        headers: { "X-Refresh": "1" },
      });
      const token: string | undefined = res.data?.access_token;
      if (!token) return null;
      updateAccessToken(token);
      return token;
    } catch {
      // 401 / network / revoked → report failure, but do NOT clear here.
      return null;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
};

/**
 * Run once on app load. The goal: a logged-in visitor stays logged in across
 * refreshes / new tabs / browser restarts, and is only logged out lazily (via a
 * 401) or explicitly.
 *
 *  1. If a stored access token exists, TRUST it — announce the session and stop.
 *     We do NOT refresh on load: a failing/absent refresh endpoint must never be
 *     able to wipe a perfectly good token. A stale token is caught lazily by the
 *     401 interceptor on the next authenticated request.
 *  2. Only when there is NO token but a prior-session hint do we attempt a silent
 *     refresh (covers a genuinely expired token whose cookie is still valid).
 *  3. Bootstrap NEVER dispatches auth:logout or clears anything — on first load
 *     there is no live session to tear down, so failure is simply "anonymous".
 *
 * Returns true if authenticated after the attempt.
 */
export const bootstrapSession = async (): Promise<boolean> => {
  const dispatchLogin = () => {
    if (typeof window !== "undefined") window.dispatchEvent(new Event("auth:login"));
  };

  // 1. Trust an existing token — no network call, no risk of wiping it.
  if (getAccessToken()) {
    dispatchLogin();
    return true;
  }

  // 2. No token but a prior session — try to silently revive it from the cookie.
  if (!hasAuthHint()) return false;
  const token = await refreshSession();
  if (token) {
    dispatchLogin();
    return true;
  }

  // 3. Nothing to revive → stay anonymous. Do not clear / dispatch logout.
  return false;
};
