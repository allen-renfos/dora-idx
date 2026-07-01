import axiosInstance from "../Api";
import { getCustomerId } from "@/services/auth/authStorage";

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
        interior_features?: string;

    },
    signal?: AbortSignal
) => {
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
        if (typeof value === "number") {
            if (!value) continue; // skip 0 (no filter)
        } else {
            const trimmed = String(value).trim();
            if (!trimmed) continue; // skip empty string
        }
        parts.push(`search[${key}]=${encodeURIComponent(String(value))}`);
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


