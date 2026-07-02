import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getApiBaseUrl } from '@/helpers/apiBaseUrl';
import { getAccessToken } from '@/services/auth/authStorage';
import { refreshSession } from '@/services/auth/sessionManager';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // send the HttpOnly refresh cookie to /customer/* endpoints
});

// --- Request interceptor: attach the Bearer access token -------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? getAccessToken() : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor: silent refresh on 401 ---------------------------
type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(new Error('Network Error: Please check your internet connection.'));
    }

    const status = error.response.status;
    const original = error.config as RetriableConfig | undefined;
    const url = original?.url || '';

    // Only attempt refresh on a genuine auth failure, once per request, and never for the
    // auth endpoints themselves (avoids infinite loops).
    const isAuthEndpoint =
      url.includes('/customer/refresh') ||
      url.includes('/customer/login') ||
      url.includes('/customer/logout');

    if (status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      const newToken = await refreshSession(); // single-flight, shared across callers
      if (newToken) {
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(original); // replay the original request transparently
      }
      // Refresh failed. We deliberately do NOT clear the session or log the user
      // out here. A single 401 — from a not-yet-deployed / flaky /customer/refresh,
      // a network blip, or one endpoint that rejects the token — must never sign
      // the customer out, because that corrupts activity tracking. The stored token
      // is kept; this individual request just fails. The session is torn down ONLY
      // by an explicit logout (Header / Profile). See wasSessionRevoked() if you
      // later want to re-enable auto-logout once the refresh endpoint is trusted.
    }

    const message = (error.response.data as { message?: string })?.message || 'Unknown error';
    if (status >= 500) console.error('Server Error:', message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
