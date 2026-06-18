import { useQuery } from "@tanstack/react-query";
import { getSocialApiBaseUrl } from "@/helpers/apiBaseUrl";

export const SOCIAL_DATA_CACHE_KEY = "realtipro_social_data";
const SOCIAL_DATA_QUERY_KEY = ["social_data"] as const;

const readLocalStorageCache = (): Record<string, any> | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SOCIAL_DATA_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    try { localStorage.removeItem(SOCIAL_DATA_CACHE_KEY); } catch { /* noop */ }
    return null;
  }
};

const fetchSocialData = async (): Promise<Record<string, any>> => {
  const agentId = process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID;
  const base = getSocialApiBaseUrl();
  try {
    const res = await fetch(`${base}/social_urls?lagnt=${agentId}`);
    if (!res.ok) throw new Error(`social_urls request failed: ${res.status}`);
    const data = await res.json();
    try { localStorage.setItem(SOCIAL_DATA_CACHE_KEY, JSON.stringify(data)); } catch { /* quota */ }
    return data;
  } catch {
    const cached = readLocalStorageCache();
    if (cached) return cached;
    throw new Error("Failed to fetch social data and no cache available");
  }
};

// Always fetches fresh on mount and overwrites localStorage cache.
// initialData provides the cached value immediately to avoid flicker.
export const useSocialData = () =>
  useQuery<Record<string, any>>({
    queryKey: SOCIAL_DATA_QUERY_KEY,
    queryFn: fetchSocialData,
    staleTime: 0,
    gcTime: Infinity,
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: () => readLocalStorageCache() ?? undefined,
  });
