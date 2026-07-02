"use client";

import axios from "axios";
import { getApiBaseUrl } from "@/helpers/apiBaseUrl";
import {
  updateAccessToken,
  getAccessToken,
  getRefreshToken,
  hasAuthHint,
} from "./authStorage";

const REFRESH_URL = `${getApiBaseUrl()}/customer/refresh`;

// Module-level promise so concurrent callers share ONE in-flight refresh.
let inFlight: Promise<string | null> | null = null;

// Tracks WHY the most recent refresh failed. Only a 401/403 straight from the
// refresh endpoint means the session was genuinely revoked/expired server-side.
// A missing endpoint (404), a network error, or a 5xx means "we couldn't verify"
// — which must NOT log the user out, or a flaky/undeployed /refresh silently
// signs everyone out on reload.
let lastFailureWasRevocation = false;

/**
 * True only when the last refreshSession() failed because the refresh endpoint
 * explicitly rejected the session (HTTP 401/403). False for network errors,
 * a missing endpoint, 5xx, or success. The 401 interceptor uses this to decide
 * whether a failed refresh should actually tear the session down.
 */
export const wasSessionRevoked = (): boolean => lastFailureWasRevocation;

/**
 * Exchange the stored refresh token for a new access token.
 *
 * The refresh token is sent explicitly in the request body (our backend returns
 * it in the login response rather than as an HttpOnly cookie). `withCredentials`
 * stays on so a cookie-based backend keeps working too. If the server rotates the
 * refresh token (returns a new one), we persist that as well.
 *
 * NON-DESTRUCTIVE: this never clears the session on its own. A failed refresh
 * (endpoint missing, no refresh token, network error) simply returns null and
 * leaves any stored tokens untouched — the CALLER decides what a null means.
 * Only the 401 response interceptor, which knows a real authenticated request
 * just failed, is allowed to tear the session down.
 * Concurrent calls are de-duplicated into a single network request.
 */
export const refreshSession = (): Promise<string | null> => {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const refreshToken = getRefreshToken();
      // Send the stored refresh token in the body; keep withCredentials so a
      // cookie-based backend still works. Bare axios: no shared interceptors.
      const res = await axios.post(
        REFRESH_URL,
        refreshToken ? { refresh_token: refreshToken } : null,
        {
          withCredentials: true,
          headers: { "X-Refresh": "1" },
        }
      );
      const token: string | undefined = res.data?.access_token;
      const rotated: string | undefined = res.data?.refresh_token;
      lastFailureWasRevocation = false;
      if (!token) return null;
      updateAccessToken(token, rotated);
      return token;
    } catch (err) {
      // Report failure, but do NOT clear here. Distinguish a genuine revocation
      // (endpoint said 401/403) from "couldn't reach/verify" (404/network/5xx).
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      lastFailureWasRevocation = status === 401 || status === 403;
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
