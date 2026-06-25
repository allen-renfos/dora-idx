export type SearchFilters = {
    keyword: string;
    pageLimit: number;
    page: number;
    property_status: string;
    property_type: string;
    property_for: string;
    category_type: string;
    price_min: number;
    price_max: number;
    bed_min: number;
    bed_max: number;
    bath_min: number;
    bath_max: number;
    garage_min: number;
    garage_max: number;
    square_footage_min: number;
    square_footage_max: number;
    lot_size_min: number;
    lot_size_max: number;
    year_built_min: number;
    year_built_max: number;
    max_annual_tax: number;
    stories: number;
    premium: boolean;
    exclusive: boolean;
    price_on_request: boolean;
    construction_status?: string;
    furnishing: string;
    available_from: string;
    rented: boolean;
    mls_city: string;
    mls_state: string;
    zip: string;
    mls_county?: string;
    mls_basement: string;
    mls_sewer: string;
    mls_school_district: string;
    mls_builder_name: string;
    mls_list_agent: string;
    mls_site_features: string;
    mls_lot_feature: string;
    community_amenities: string;
    property_view: string;
    interior_features: string;
};
export interface FilterTopProps {
    handleSearch: (value: string, key: keyof SearchFilters) => void;
    searchFilters: SearchFilters;
    handleSaveSearch?: () => void; // Optional prop for save search functionality
    handleClearFilters?: () => void; // Optional prop for clearing filters
    isSavingSearch?: boolean; // Loading state for save search button
}
export interface MLSAdvanceSearchProps {
    open: boolean;
    onClose: () => void;
    onApply: (checked: boolean) => void;
    handleSearch: (value: string, key: keyof SearchFilters) => void;
    searchFilters: SearchFilters;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Property Details — normalized frontend model
 *
 * The raw IDX/MLS API response is intentionally kept as `any` (its shape mixes
 * the new structured `data.sections.*` layout with legacy RESO PascalCase and
 * lowercase top-level fields). The components below consume only this clean,
 * normalized model produced by `normalizePropertyDetails`.
 * ────────────────────────────────────────────────────────────────────────── */

/** A single label/value pair rendered inside a spec card. */
export interface PropertySpecRow {
    label: string;
    value: string | null;
}

/** Resolved media (photos + virtual tour) for the listing. */
export interface PropertyMedia {
    coverPhoto: string | null;
    images: string[];
    virtualTourUrl: string | null;
}

/** IDX compliance flags governing what may be displayed. */
export interface PropertyCompliance {
    canDisplayListing: boolean;
    canShowAddress: boolean;
    canShowValuation: boolean;
    canShowMap: boolean;
    canShowPrimaryPhoto: boolean;
    canShowExtraPhotos: boolean;
    canShowVirtualTour: boolean;
}

/** MLS attribution sourced from `mls_attribute` (with legacy fallback). */
export interface PropertyAttribution {
    logo: string | null;
    name: string | null;
    fullName: string | null;
    listedWith: string | null;
    /** Ready-made "Listed by …" line, e.g. `Listed by eXp Realty`. */
    officeTag: string | null;
    /** Ready-made "Provided courtesy of …" line. */
    mlsTag: string | null;
}

/** A normalized open-house record. */
export interface PropertyOpenHouse {
    key: string | null;
    type: string | null;
    status: string | null;
    date: string | null;
    startTime: string | null;
    endTime: string | null;
    remarks: string | null;
    refreshments: string | null;
    virtualOpenHouseUrl: string | null;
    virtualTourUrl: string | null;
}

/** The clean model the Property Details UI renders from. */
export interface PropertyDetails {
    id: string | null;
    listingId: string | null;
    listingKey: string | null;

    title: string | null;
    address: string | null;
    status: string | null;
    daysOnSite: number | null;
    tags: string[];

    price: number | null;
    beds: number | null;
    baths: number | null;
    livingAreaSqft: number | null;

    description: string | null;

    highlights: PropertySpecRow[];
    interior: PropertySpecRow[];
    exterior: PropertySpecRow[];
    parking: PropertySpecRow[];
    schools: PropertySpecRow[];
    building: PropertySpecRow[];
    financial: PropertySpecRow[];
    utilities: PropertySpecRow[];
    listingDetails: PropertySpecRow[];

    media: PropertyMedia;
    compliance: PropertyCompliance;
    attribution: PropertyAttribution;
    openHouses: PropertyOpenHouse[];

    latitude: number | null;
    longitude: number | null;
    taxAnnualAmount: number | null;

    /** Original raw payload, retained for legacy needs (wishlist, share, etc.). */
    raw: Record<string, unknown>;
}