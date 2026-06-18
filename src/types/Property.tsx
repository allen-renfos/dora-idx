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
    construction_status: string;
    furnishing: string;
    available_from: string;
    rented: boolean;
    mls_city: string;
    mls_state: string;
    zip: string;
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