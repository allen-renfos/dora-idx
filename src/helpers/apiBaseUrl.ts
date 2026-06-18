const API_PROXY_BASE = '/api';

const isMixedContentRisk = (url: string): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.location.protocol === 'https:' && url.startsWith('http://');
};

export const getSafeApiBaseUrl = (url?: string): string => {
  if (!url) {
    return API_PROXY_BASE;
  }

  return isMixedContentRisk(url) ? API_PROXY_BASE : url;
};

export const getApiBaseUrl = (): string => {
  return getSafeApiBaseUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_API_BASE_URL,
  );
};

export const getSocialApiBaseUrl = (): string => {
  return getSafeApiBaseUrl(
    process.env.NEXT_PUBLIC_SOCIAL_API_BASE_URL || process.env.NEXT_API_BASE_URL,
  );
};
