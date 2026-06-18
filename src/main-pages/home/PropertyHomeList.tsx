"use client";
import { PropertyCard } from "@/component/properties/PropertyCard"
import Providers from "@/provider/QueryClientProvider";
import { useMlsPropertyList, usePropertyList } from "@/services/properties/PropertyQueries";
import { useEffect, useState } from "react";
type Property = {
    id: string;
    [key: string]: string;
};
interface PropertyHomeListProps {
    keyword: string;
}

const PropertyHomeList = ({ keyword }: PropertyHomeListProps) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedType, setSelectedType] = useState<string>(''); // '' means All
    const handleFilterChange = (type: string) => {
        setSelectedType(type);
        setSearchFilters((prev) => ({
            ...prev,
            category_type: type === '' ? '' : type,
        }));
    };
    const [searchFilters, setSearchFilters] = useState(() => {
        const type = typeof window !== "undefined" ? sessionStorage.getItem("prop_type") ?? "" : "";
        const loc = typeof window !== "undefined" ? sessionStorage.getItem("prop_location") ?? "" : "";
        const maxPrice = typeof window !== "undefined" ? sessionStorage.getItem("prop_max_price") ?? "" : "";

        return {
            keyword: keyword || '',
            pageLimit: 20,
            page: 1,
            property_status: '',
            property_type: type,
            property_for: '',
            category_type: '',
            price_min: 0,
            price_max: maxPrice ? Number(maxPrice) : 0,
            bed_min: 0,
            bed_max: 0,
            bath_min: 0,
            bath_max: 0,
            garage_min: 0,
            garage_max: 0,
            square_footage_min: 0,
            square_footage_max: 0,
            community_amenities: '',
            property_view: '',
            lot_size_min: 0,
            lot_size_max: 0,
            year_built_min: 0,
            year_built_max: 0,
            max_annual_tax: 0,
            stories: 0,
            premium: false,
            exclusive: false,
            price_on_request: false,
            construction_status: '',
            furnishing: '',
            available_from: '',
            rented: false,
            mls_city: loc,
            mls_state: '',
            zip: '',
            mls_basement: '',
            mls_sewer: '',
            mls_school_district: '',
            mls_builder_name: '',
            mls_list_agent: '',
            mls_site_features: '',
            mls_lot_feature: '',
            interior_features: ''
        };
    });
    useEffect(() => {
        setSearchFilters((prev) => ({ ...prev, keyword: keyword || '' }));
    }, [keyword]);

    const { data: propertyListDatas, isLoading, error } =
        useMlsPropertyList(searchFilters);
    useEffect(() => {
        if (propertyListDatas && !isLoading && !error) {
            setProperties(propertyListDatas.data || []);
        }
    }, [propertyListDatas, isLoading, error]);
    const handleClick = () => {
        window.location.href = '/properties';

    }
    return (
        <Providers>
            <div className="property-filters">
                <button
                    className={`filter-btn ${selectedType === '' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('')}
                >All</button>
                <button
                    className={`filter-btn ${selectedType === 'Residential' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('Residential')}
                >Residential</button>
                <button
                    className={`filter-btn ${selectedType === 'Commercial' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('Commercial')}
                >Commercial</button>
                <button
                    className={`filter-btn ${selectedType === 'Apartment' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('Apartment')}
                >Apartment</button>
            </div>

            <div className="properties-grid-home">
                {properties.length ? (
                    <>
                        {properties.slice(0, 3).map((item) => (

                            <PropertyCard 
                            key={item.id} 
                            item={item} handleModal={() => console.log("property card")}
                            hideWishlist={true} />
                        ))}
                    </>
                ) : (
                    <div>No listings found.</div>
                )}
            </div>
            <div className="section-cta">
                <button className="btn-secondary"
                    onClick={handleClick}>See All Listings</button>
            </div>
        </Providers>
    )
}
export default PropertyHomeList