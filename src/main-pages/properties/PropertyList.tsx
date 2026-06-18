"use client"
import { PropertyCard } from "@/component/properties/PropertyCard"
import { usePropertyList } from "@/services/properties/PropertyQueries";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import LoginModal from "../auth/LoginModal";
import RegistrationModal from "../auth/RegistrationModal";

type Property = {
    id: string ;
    [key: string]: string;
};

interface PropertyListProps {
    keyword?: string;
}

const PropertyList = ({ keyword = '' }: PropertyListProps) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchWord, setSearchWord] = useState(keyword);
    // Local input state for decoupled typing
    const [inputValue, setInputValue] = useState(keyword);

    // Update searchWord/inputValue if keyword prop changes
    useEffect(() => {
        setSearchWord(keyword);
        setInputValue(keyword);
    }, [keyword]);
    const queryClient = useQueryClient();
    const { data: propertyListDatas, isLoading, error } =
        usePropertyList({ pageLimit: currentPage, search: searchWord });
    useEffect(() => {
        if (propertyListDatas && !isLoading && !error) {
            setProperties(propertyListDatas.data || []);
            setCurrentPage(propertyListDatas.meta?.current_page || 1);
            setTotalPages(propertyListDatas.meta?.last_page || 1);
        }
    }, [propertyListDatas, isLoading, error]);
    // Keep inputValue in sync with searchWord (for in-page search)
    useEffect(() => {
        setInputValue(searchWord);
    }, [searchWord]);
    useEffect(() => {
        if (currentPage || searchWord) {
            queryClient.invalidateQueries({ queryKey: ['propertylist'] });

        }
    }, [currentPage, searchWord,queryClient]);
    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleModal = () => {
        setIsLoginModalOpen(true);
    }
    const handleLoginSuccess = () => {
        setIsLoginModalOpen(false);
    }
    const handleRegistrationSuccess = () => {
        console.log("User registered successfully!");
    };

    const handleOpenRegistration = () => {
        console.log("Opening registration modal...");
        setIsLoginModalOpen(false);
        setIsRegistrationModalOpen(true);
    };

    return (
        <>
            <RegistrationModal
                isOpen={isRegistrationModalOpen}
                onClose={() => setIsRegistrationModalOpen(false)}
                onSuccess={handleRegistrationSuccess}
                onOpenLogin={handleModal}
            />
            <LoginModal
                isHeader={false}
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSuccess={handleLoginSuccess}
                onOpenRegistration={handleOpenRegistration}
            />
            <section className="hero">
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <div>
                                <span className="menu-div yellow-text">Listings</span>

                            </div>
                            <span className="heading-text">Find your dream Property</span>
                            <p className="heading-sub-text">We’ve been representing buyers and sellers in Santa Barbara County for
                                over twenty years and we’re the top-producing independently owned real estate company in the
                                area.</p>
                        </div>

                        <div className="search-form property-search-field">
                            <div className="select-field flex items-center gap-2">
                                <input
                                    placeholder="Search "
                                    className="search-input"
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            setSearchWord(inputValue);
                                        }
                                    }}
                                />
                                <button
                                    className="search-btn bg-[#edb75e] hover:bg-[#e0a94d] text-white px-4 py-2 rounded"
                                    style={{ minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onClick={() => setSearchWord(inputValue)}
                                    aria-label="Search"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 36 35" fill="none">
                                        <path
                                            d="M16.2969 29.166C23.5456 29.166 29.4219 23.2898 29.4219 16.041C29.4219 8.79228 23.5456 2.91602 16.2969 2.91602C9.04814 2.91602 3.17188 8.79228 3.17188 16.041C3.17188 23.2898 9.04814 29.166 16.2969 29.166Z"
                                            stroke="#EDB75E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path
                                            d="M27.8612 30.1719C28.6341 32.5052 30.3987 32.7385 31.7549 30.6969C32.9945 28.8302 32.1778 27.2989 29.932 27.2989C28.2695 27.2844 27.3362 28.5823 27.8612 30.1719Z"
                                            stroke="#EDB75E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="prop-container">
                <div className="container">
                    <div className="properties-grid">
                        {properties.length ? (
                            <>
                                {properties.map((item) => (

                                    <PropertyCard key={item.id} item={item} handleModal={handleModal} />
                                ))}
                                <div className="pagination" style={{ display: 'none' }}>
                                    {/* Show arrows only if more than 10 pages */}
                                    {totalPages > 10 && (
                                        <a
                                            href="#"
                                            className="page"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageClick(currentPage - 1);
                                            }}
                                            style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto', opacity: currentPage === 1 ? 0.4 : 1 }}
                                        >
                                            &laquo;
                                        </a>
                                    )}

                                    {/* Show up to 10 page numbers, centered around currentPage if possible */}
                                    {(() => {
                                        let start = 1;
                                        let end = totalPages;
                                        if (totalPages > 10) {
                                            if (currentPage <= 6) {
                                                start = 1;
                                                end = 10;
                                            } else if (currentPage + 4 >= totalPages) {
                                                start = totalPages - 9;
                                                end = totalPages;
                                            } else {
                                                start = currentPage - 5;
                                                end = currentPage + 4;
                                            }
                                        }
                                        return Array.from({ length: end - start + 1 }).map((_, idx) => {
                                            const page = start + idx;
                                            return (
                                                <a
                                                    href="#"
                                                    key={page}
                                                    className={`page ${page === currentPage ? "active" : ""}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageClick(page);
                                                    }}
                                                >
                                                    {page}
                                                </a>
                                            );
                                        });
                                    })()}

                                    {totalPages > 10 && (
                                        <a
                                            href="#"
                                            className="page"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageClick(currentPage + 1);
                                            }}
                                            style={{ pointerEvents: currentPage === totalPages ? 'none' : 'auto', opacity: currentPage === totalPages ? 0.4 : 1 }}
                                        >
                                            &raquo;
                                        </a>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div>No listings found.</div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
export default PropertyList;