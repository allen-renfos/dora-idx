"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAutocomplete,
  AutocompleteSuggestion,
  AUTOCOMPLETE_MIN_CHARS,
} from "./AutocompleteServices";

export type { AutocompleteSuggestion };

const MIN_CHARS = AUTOCOMPLETE_MIN_CHARS;
const DEBOUNCE_MS = 120;

export const useAutocomplete = (keyword: string, debounceMs = DEBOUNCE_MS) => {
  const [debounced, setDebounced] = useState(keyword);

  useEffect(() => {
    if (debounceMs <= 0) {
      setDebounced(keyword);
      return;
    }
    const id = setTimeout(() => setDebounced(keyword), debounceMs);
    return () => clearTimeout(id);
  }, [keyword, debounceMs]);

  const normalized = debounced.trim().toLowerCase();

  return useQuery({
    queryKey: ["autocomplete", normalized],
    queryFn: ({ signal }) => fetchAutocomplete(normalized, signal),
    enabled: normalized.length >= MIN_CHARS,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    retry: false,
    // Short window: dedupe rapid keystrokes / Strict-Mode remounts while keeping
    // MLS-derived suggestions fresh (inventory changes through the day).
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
};
