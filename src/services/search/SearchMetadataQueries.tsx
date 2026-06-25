"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchSearchMetadata,
  SearchMetadata,
} from "./SearchMetadataServices";

/** Backend sets `Cache-Control: max-age=300`; mirror it client-side. */
const METADATA_STALE_TIME = 1000 * 60 * 5; // 5 minutes

/**
 * Single, cached fetch of search metadata used to populate every filter
 * dropdown. Deduped across all consumers via a shared query key.
 */
export const useSearchMetadata = () => {
  return useQuery<SearchMetadata>({
    queryKey: ["searchMetadata"],
    queryFn: ({ signal }) => fetchSearchMetadata(signal),
    staleTime: METADATA_STALE_TIME,
    gcTime: METADATA_STALE_TIME * 2,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
