"use client";
import { PropertyCard } from "@/component/properties/PropertyCard"
import Providers from "@/provider/QueryClientProvider";
import { useFeaturedPropertyList, useMlsPropertyList } from "@/services/properties/PropertyQueries";
import { useEffect, useState } from "react";
type Property = {
    id: string;
    // add other fields as needed, e.g. title: string;
    [key: string]: string;
};

interface FeaturedPropertiesProps {
    maxRows?: number; // Number of rows to display (4 properties per row)
}

const FeaturedProperties = ({ maxRows }: FeaturedPropertiesProps) => {
    const [properties, setProperties] = useState<Property[]>([]);
  
    const { data: propertyListDatas, isLoading, error } =
        useFeaturedPropertyList();
    useEffect(() => {
        if (propertyListDatas && !isLoading && !error) {
            setProperties(propertyListDatas.data || []);
        }
    }, [propertyListDatas, isLoading, error]);
   
    // Calculate properties to display based on maxRows
    const displayProperties = maxRows 
        ? properties.slice(0, maxRows * 4) // 4 properties per row
        : properties;

    const shimmerCount = maxRows ? maxRows * 4 : 4;

    return (
        <Providers>
            <div className="properties-grid-home marginTop6">
                {isLoading ? (
                    Array.from({ length: shimmerCount }).map((_, index) => (
                        <div key={`property-skeleton-${index}`} className="property-card">
                            <div className="property-image skeleton" style={{ height: "250px" }} />
                            <div className="mls-property-info" style={{ padding: "22px" }}>
                                <div className="skeleton skeleton-text" style={{ width: "120px", height: "22px", marginBottom: "16px" }} />
                                <div className="skeleton skeleton-text" style={{ width: "85%", height: "16px", marginBottom: "10px" }} />
                                <div className="skeleton skeleton-text" style={{ width: "70%", height: "16px", marginBottom: "18px" }} />
                                <div className="skeleton skeleton-text" style={{ width: "140px", height: "14px" }} />
                            </div>
                        </div>
                    ))
                ) : displayProperties.length ? (
                    <>
                        {displayProperties.map((item, index) => (
                            <div
                                key={item.id}
                                className="stagger-item"
                                style={{ animationDelay: `${index * 0.12}s` }}
                            >
                                <PropertyCard
                                    item={item}
                                    handleModal={() => console.log("property card")}
                                    hideWishlist={true}
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="text-[var(--ink-faint)]">No listings just yet.</div>
                )}
            </div>
            {/* <div className="section-cta">
                <button className="btn-secondary"
                    onClick={handleClick}>See All Listings</button>
            </div> */}
        </Providers>
    )
}
export default FeaturedProperties