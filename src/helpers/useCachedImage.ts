"use client";
import { useEffect, useState } from "react";

const KEY_PREFIX = "realtipro_img_";

const buildKey = (url: string) => `${KEY_PREFIX}${url}`;

const readCache = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeCache = (key: string, dataUrl: string) => {
  try {
    localStorage.setItem(key, dataUrl);
  } catch {
    /* quota exceeded — silently fall back to network on next visit */
  }
};

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

// Returns a stable image source for the given URL.
// First call per browser fetches the image once and stores its base64 dataURL
// in localStorage. Every subsequent call (across reloads, navigation, etc.)
// returns the cached dataURL synchronously — no network request.
// Falls back to the original URL if CORS blocks the fetch.
export const useCachedImage = (url: string | undefined): string | undefined => {
  const [src, setSrc] = useState<string | undefined>(() => {
    if (!url) return undefined;
    return readCache(buildKey(url)) ?? url;
  });

  useEffect(() => {
    if (!url) {
      setSrc(undefined);
      return;
    }
    const key = buildKey(url);
    const cached = readCache(key);
    // Show cached version immediately to avoid flicker
    if (cached) setSrc(cached);
    else setSrc(url);

    // Always re-fetch to keep cache fresh
    let cancelled = false;
    fetch(url, { mode: "cors" })
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        return res.blob();
      })
      .then(blobToDataUrl)
      .then((dataUrl) => {
        if (cancelled) return;
        writeCache(key, dataUrl);
        setSrc(dataUrl);
      })
      .catch(() => {
        // CORS or network error — keep whatever is already shown
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return src;
};
