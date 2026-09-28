import axiosInstance from "../Api";
import { getCustomerId } from "@/services/auth/authStorage";
import { splitStatuses } from "@/component/mlsSearchMenu/filterDefaults";

export const fetchPropertyList = async (data: { pageLimit?: number; search?: string }) => {
    const pageLimit = data?.pageLimit || 1;
    const search = data?.search || '';
    const response = await axiosInstance.get(`/v1/properties?search[title]=${search}&page=${pageLimit}`);
    return response.data;
}
export const fetchFeaturedPropertyList = async () => {
    const response = await axiosInstance.get(`/v1/properties/featured-properties?lagnt=${process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID}`);
    return response.data;
}
export const fetchNewListings = async () => {
    const response = await axiosInstance.get(`/v1/properties/featured-properties?lagnt=${process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID}`);
    return response.data;
}
/**
 * Multi-select keys kept pipe-joined in UI state, URLs and saved searches but
 * sent comma-joined to the API (a pipe is a literal there and matches nothing).
 * `property_status` is excluded: it is fanned out one value per request.
 */
const COMMA_MULTI_KEYS = new Set([
    "property_type", "category_type", "structure_type", "community_amenities",
    "property_view", "interior_features", "mls_site_features", "mls_lot_feature",
]);

/** "A|B| |A" -> "A,B": split on pipe, trim, drop empties, de-duplicate. */
const toCommaList = (value: string): string =>
    Array.from(new Set(value.split("|").map((v) => v.trim()).filter(Boolean))).join(",");

export const fetchMlsSearchPropertyList = async (
    data: {
        pageLimit?: number; keyword?: string; property_status: string; property_type: string;
        property_for?: string; category_type?: string; price_min?: number; price_max?: number;
        bed_min?: number; bed_max?: number; bath_min?: number; bath_max?: number;
        garage_min?: number; garage_max?: number; square_footage_min?: number;
        square_footage_max?: number; lot_size_min?: number; lot_size_max?: number;
        year_built_min?: number; year_built_max?: number; max_annual_tax?: number;
        stories?: number; premium?: boolean; exclusive?: boolean; price_on_request?: boolean;
        construction_status?: string; furnishing?: string; available_from?: string;
        rented?: boolean; mls_city?: string; mls_state?: string; zip?: string; mls_county?: string;
        mls_basement?: string; mls_sewer?: string; mls_school_district?: string;
        mls_builder_name?: string; mls_list_agent?: string; mls_site_features?: string;
        mls_lot_feature?: string; page?: number; community_amenities?: string; property_view?: string;
        interior_features?: string; structure_type?: string;

    },
    signal?: AbortSignal
): Promise<any> => {
    // The search API accepts ONE status per request (pipe/comma/array forms
    // return nothing). Fan a multi-status filter out into one request per
    // status and merge, so e.g. "Active|Coming Soon" returns both.
    const statuses = splitStatuses(data?.property_status);
    if (statuses.length > 1) {
        const pages = await Promise.all(
            statuses.map((status) =>
                fetchMlsSearchPropertyList({ ...data, property_status: status }, signal)
            )
        );
        return mergeSearchPages(pages, data?.pageLimit || 20);
    }

    // Build the query incrementally so EMPTY/zero filters are omitted entirely
    // (never `search[price_min]=`). This keeps requests lean and prevents the
    // backend from interpreting blank predicates.
    const parts: string[] = [
        `lagnt=${process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID}`,
        // Ranked server-side; never request a COUNT(*).
        `sort_by=featured`,
        `with_count=0`,
        `pageLimit=${data?.pageLimit || 20}`,
        `page=${data?.page || 1}`,
    ];

    // search[*] string/number predicates — appended only when meaningfully set.
    const search: Record<string, string | number | undefined> = {
        keyword: data?.keyword,
        property_status: data?.property_status,
        property_type: data?.property_type,
        structure_type: data?.structure_type,
        property_for: data?.property_for,
        category_type: data?.category_type,
        price_min: data?.price_min,
        price_max: data?.price_max,
        bed_min: data?.bed_min,
        bed_max: data?.bed_max,
        bath_min: data?.bath_min,
        bath_max: data?.bath_max,
        garage_min: data?.garage_min,
        garage_max: data?.garage_max,
        square_footage_min: data?.square_footage_min,
        square_footage_max: data?.square_footage_max,
        lot_size_min: data?.lot_size_min,
        lot_size_max: data?.lot_size_max,
        year_built_min: data?.year_built_min,
        year_built_max: data?.year_built_max,
        max_annual_tax: data?.max_annual_tax,
        stories: data?.stories,
        construction_status: data?.construction_status,
        furnishing: data?.furnishing,
        available_from: data?.available_from,
        mls_city: data?.mls_city,
        mls_state: data?.mls_state,
        zip: data?.zip,
        county: data?.mls_county,
        mls_basement: data?.mls_basement,
        mls_sewer: data?.mls_sewer,
        mls_school_district: data?.mls_school_district,
        mls_builder_name: data?.mls_builder_name,
        mls_list_agent: data?.mls_list_agent,
        mls_site_features: data?.mls_site_features,
        mls_lot_feature: data?.mls_lot_feature,
        community_amenities: data?.community_amenities,
        property_view: data?.property_view,
        interior_features: data?.interior_features,
    };
    for (const [key, value] of Object.entries(search)) {
        if (value === undefined || value === null) continue;
        let out = String(value);
        if (typeof value === "number") {
            if (!value) continue; // skip 0 (no filter)
        } else {
            // UI/URL/saved-search state is pipe-joined; the API expects commas.
            if (COMMA_MULTI_KEYS.has(key)) out = toCommaList(out);
            if (!out.trim()) continue; // skip empty string
        }
        parts.push(`search[${key}]=${encodeURIComponent(out)}`);
    }

    // Boolean flags — sent only when explicitly true.
    const boolFlags: Record<string, boolean | undefined> = {
        premium: data?.premium,
        exclusive: data?.exclusive,
        price_on_request: data?.price_on_request,
        rented: data?.rented,
    };
    for (const [key, value] of Object.entries(boolFlags)) {
        if (value === true) parts.push(`search[${key}]=1`);
    }

    const response = await axiosInstance.get(
        `/v1/properties/search?${parts.join("&")}`,
        { signal },
    );
    return response.data;
}
/** Does one search response have more pages? (Mirrors the infinite query.) */
const searchPageHasMore = (page: any, pageLimit: number): boolean => {
    const meta = page?.meta ?? page;
    if (meta?.has_more !== undefined) return Boolean(meta.has_more);
    const current = Number(meta?.current_page);
    const last = Number(meta?.last_page);
    if (current > 0 && last > 0) return current < last;
    return (page?.data?.length ?? 0) >= pageLimit;
};

/** Merge per-status responses into one page (deduped, has_more if any has). */
const mergeSearchPages = (pages: any[], pageLimit: number) => {
    const seen = new Set<string>();
    const data: any[] = [];
    for (const page of pages) {
        for (const item of Array.isArray(page?.data) ? page.data : []) {
            const key = String(item?.listing_key ?? item?.mls_listingkey ?? item?.id ?? "");
            if (key && seen.has(key)) continue;
            if (key) seen.add(key);
            data.push(item);
        }
    }
    const totals = pages.map((p) => Number(p?.meta?.total));
    return {
        data,
        meta: {
            has_more: pages.some((p) => searchPageHasMore(p, pageLimit)),
            ...(totals.every((t) => Number.isFinite(t))
                ? { total: totals.reduce((a, b) => a + b, 0) }
                : {}),
        },
    };
};

// Add single property fetcher
export const fetchMlsPropertyById = async (id: string) => {
    if (!id) throw new Error("Missing property id");
    const lagnt = process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID;
    const response = await axiosInstance.get(
        `/v1/property/listingkey/${id}${lagnt ? `?lagnt=${lagnt}` : ""}`
    );
    return response.data;
};
export const saveSearches = async (data: object) => {
    const response = await axiosInstance.post(`/v1/property/saved-search?lagnt=${process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID}`, data);
    return response.data;
}
export const fetchSavedSearches = async () => {
    const customer_id = typeof window !== 'undefined' ? getCustomerId() : null;
    const uuid = process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID;
    const response = await axiosInstance.get(`/v1/saved-search?uuid=${uuid}&customer_id=${customer_id}`);
    return response.data;
}

export const deleteSavedSearch = async (id: string | number) => {
    const response = await axiosInstance.delete(`/v1/saved-search/${id}`);
    return response.data;
}


