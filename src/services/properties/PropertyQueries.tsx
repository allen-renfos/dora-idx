"use client"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMlsSearchPropertyList, fetchPropertyList, fetchMlsPropertyById, fetchSavedSearches, deleteSavedSearch, fetchFeaturedPropertyList, fetchNewListings } from "./PropertyServices";

export const usePropertyList = (data: { pageLimit?: number; search?: string }) => {
    return useQuery({ queryKey: ['propertylist', ], queryFn: () => 
       fetchPropertyList(data) });
  };
  export const useFeaturedPropertyList = () => {
    return useQuery({ queryKey: ['featuredPropertylist', ], queryFn: () =>
       fetchFeaturedPropertyList() });
  };
  export const useNewListings = () => {
    return useQuery({ queryKey: ['newListings'], queryFn: () => fetchNewListings() });
  };
export const useMlsPropertyList = (params: Parameters<typeof fetchMlsSearchPropertyList>[0]) => {
  return useQuery({
    queryKey: ['mlsPropertyList', params],
    queryFn: ({ signal }) => fetchMlsSearchPropertyList(params, signal),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });
};

export const useMlsPropertyListInfinite = (params: Omit<Parameters<typeof fetchMlsSearchPropertyList>[0], 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['mlsPropertyListInfinite', params],
    queryFn: ({ signal, pageParam }) =>
      fetchMlsSearchPropertyList({ ...params, page: pageParam as number }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const pagination = lastPage?.meta ?? lastPage;

      // Preferred signal: `meta.has_more` (count-free pagination — no COUNT(*)).
      if (pagination?.has_more !== undefined) {
        return pagination.has_more ? allPages.length + 1 : undefined;
      }

      // Supports meta-wrapped ({ data, meta: { current_page, last_page, per_page } })
      // and flat Laravel paginator ({ data, current_page, last_page, per_page }).
      const current = Number(pagination?.current_page);
      const last = Number(pagination?.last_page);
      if (current > 0 && last > 0) return current < last ? current + 1 : undefined;

      // Fallback when pagination meta is missing: stop when the last page returned
      // fewer rows than the page size (final page reached).
      const perPage = Number(pagination?.per_page) || (lastPage?.data?.length ?? 0);
      const lastLen = lastPage?.data?.length ?? 0;
      if (perPage > 0 && lastLen < perPage) return undefined;
      return allPages.length + 1;
    },
    staleTime: 1000 * 60, // dedupe identical searches within a 1-min window
    refetchOnWindowFocus: false,
  });
};

export const usePropertyById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchMlsPropertyById(id as string),
    enabled: !!id,
  });
};

export const useSavedSearches = () => {
  return useQuery({
    queryKey: ["savedSearches"],
    queryFn: () => fetchSavedSearches(),
  });
};

export const useDeleteSavedSearch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteSavedSearch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedSearches"] });
    },
  });
};