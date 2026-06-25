import { useNeighborhoodList } from "@/services/neighborhood/NeighborhoodQueries";
import { useAutocomplete, AutocompleteSuggestion } from "@/services/search/AutocompleteQueries";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import SellModal from "./SellEnquiryModal";
import Providers from "@/provider/QueryClientProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
type Neighborhood = {
  id: number;
  name: string;
};

interface SearchContainerProps {
  keyword: string;
  setKeyword: (k: string) => void;
  onSearch: () => void;
}

// Expose setKeyword as setSearchWord for homepage usage
const SearchContainer = ({
  keyword,
  setKeyword: setSearchWord,
  onSearch,
}: SearchContainerProps) => {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [neighborhood, setNeighborhood] = useState<Neighborhood[]>([]);
  const [activeTab, setActiveTab] = useState("buy");
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: autocompleteResults, isFetching } = useAutocomplete(keyword);
  const trimmedKeyword = keyword.trim();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isFetching) setIsSearching(false);
  }, [isFetching]);
  const canShowAutocompleteResults = trimmedKeyword.length >= 2;
  const visibleAutocompleteResults = canShowAutocompleteResults ? (autocompleteResults || []) : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: AutocompleteSuggestion) => {
    setSearchWord(suggestion.value);
    setShowDropdown(false);
    // Redirect immediately to properties page with the chosen suggestion
    window.location.href = `/properties?keyword=${encodeURIComponent(suggestion.value)}`;
  };

  const sortedGroupedEntries = useMemo(() => {
    const groupedSuggestions = visibleAutocompleteResults.reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      // Deduplicate within category
      const alreadyExists = acc[curr.category].some(
        (s: AutocompleteSuggestion) => s.label.toLowerCase() === curr.label.toLowerCase()
      );
      if (!alreadyExists) acc[curr.category].push(curr);
      return acc;
    }, {} as Record<string, AutocompleteSuggestion[]>) || {};

    // Sort categories: address > zip > county > city
    const categoryPriority: Record<string, number> = { address: 0, zip: 1, zipcode: 1, county: 2, city: 3 };
    return Object.entries(groupedSuggestions).sort(([a], [b]) => {
      const pa = categoryPriority[a.toLowerCase()] ?? 99;
      const pb = categoryPriority[b.toLowerCase()] ?? 99;
      return pa - pb;
    });
  }, [visibleAutocompleteResults]);

  const { data: neighborListDatas, isLoading, error } = useNeighborhoodList();
  useEffect(() => {
    if (neighborListDatas && !isLoading && !error) {
      setNeighborhood(neighborListDatas.data || []);
    }
  }, [neighborListDatas, isLoading, error]);
  useEffect(() => {
    const clearTempFilters = () => {
      sessionStorage.removeItem("prop_type");
      sessionStorage.removeItem("prop_location");
      sessionStorage.removeItem("prop_max_price");
    };

    // clear on unmount (navigation inside the SPA)
    return () => clearTempFilters();
  }, []);
  const handleClick = () => {
    sessionStorage.setItem("prop_location", location);
    sessionStorage.setItem("prop_type", propertyType);
    sessionStorage.setItem("prop_max_price", priceMax);
    window.location.href = "/properties";
  };
  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Providers>
      <ToastContainer />
      <>
        {/* Tabs */}
        <div className="search-tabs-wrapper">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab("buy")}
              style={{
                padding: "8px 22px",
                fontSize: "13px",
                fontWeight: "600",
                letterSpacing: "0.5px",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === "buy" ? "2px solid #fff" : "2px solid transparent",
                color: activeTab === "buy" ? "#fff" : "rgba(255,255,255,0.65)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textTransform: "uppercase",
              }}
            >
              Buy
            </button>
            <button
              onClick={() => setActiveTab("sell")}
              style={{
                padding: "8px 22px",
                fontSize: "13px",
                fontWeight: "600",
                letterSpacing: "0.5px",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === "sell" ? "2px solid #fff" : "2px solid transparent",
                color: activeTab === "sell" ? "#fff" : "rgba(255,255,255,0.65)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textTransform: "uppercase",
              }}
            >
              Sell
            </button>
          </div>
        </div>

        {/* Tab content — fixed height prevents layout jump when switching tabs */}
        <div style={{ position: "relative", minHeight: "70px", marginTop: "12px", display: "flex", alignItems: "center" }}>

          {/* Buy Tab: search section */}
          {activeTab === "buy" && (
            <div style={{ width: "100%", maxWidth: "820px" }}>
              <div className="relative" ref={dropdownRef}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#fff",
                    borderRadius: "var(--radius-md)",
                    overflow: "visible",
                    position: "relative",
                  }}
                >
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => {
                      setSearchWord(e.target.value);
                      setShowDropdown(true);
                      if (e.target.value.trim()) setIsSearching(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search by city, county, or zip"
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSearch();
                    }}
                    className="placeholder:text-[#999] placeholder:font-semibold"
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      padding: "18px 20px",
                      fontSize: "15px",
                      color: "#333",
                      background: "transparent",
                      fontFamily: "var(--font-lato), sans-serif",
                      letterSpacing: "-0.01em",
                    }}
                  />
                  <button
                    onClick={onSearch}
                    style={{
                      background: "transparent",
                      border: "none",
                      borderLeft: "1px solid #e0e0e0",
                      padding: "12px 18px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isSearching ? (
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c2a878" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Autocomplete dropdown */}
                {showDropdown && (
                  <div
                    className="absolute left-0 right-0 bg-white border border-[#d1d1d1] shadow-2xl z-[100] max-h-[350px] overflow-y-auto mt-0 rounded-sm text-left custom-scrollbar"
                    style={{ top: "100%" }}
                  >
                    {trimmedKeyword.length === 0 ? (
                      <div className="px-4 py-6 my-1 min-h-[76px] text-sm text-gray-700 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-3 shrink-0">
                          <HiOutlineLocationMarker className="text-[#c2a878]" size={16} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium">Type something to start searching</span>
                          <span className="text-[11px] text-gray-400">Try city, county, or zip</span>
                        </div>
                      </div>
                    ) : sortedGroupedEntries.length > 0 ? (
                      sortedGroupedEntries.map(([category, suggestions]) => (
                        <div key={category} className="border-b last:border-0 border-gray-100">
                          <div style={{marginLeft:"10px", marginTop:"10px"}} className="px-4 py-2 bg-gray-50/80 text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
                            <span>{category}</span>
                            <span className="h-[1px] flex-1 ml-4 bg-gray-200"></span>
                          </div>
                          <div className="py-1">
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex items-center transition-all duration-200"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-3 shrink-0">
                                  <HiOutlineLocationMarker className="text-[#c2a878]" size={16} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="truncate font-medium">{suggestion.label}</span>
                                  <span className="text-[11px] text-gray-400 capitalize">{category.toLowerCase()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 my-1 min-h-[76px] text-sm text-gray-700 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-3 shrink-0">
                          <HiOutlineLocationMarker className="text-[#c2a878]" size={16} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium">No suggestions found</span>
                          <span className="text-[11px] text-gray-400">Try a broader location keyword</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sell Tab */}
          {activeTab === "sell" && (
            <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
              <span
                style={{
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: "400",
                  fontFamily: "var(--font-playfair), serif",
                  letterSpacing: "-0.3px",
                  textShadow: "0 1px 6px rgba(0,0,0,0.35)",
                }}
              >
                Ready to sell? I am ready to help
              </span>
              <button
                onClick={() => setIsOpen(true)}
                style={{
                  background: "#c2a878",
                  color: "#fff",
                  border: "none",
                  padding: "11px 28px",
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  borderRadius: "var(--radius-sm)",
                  textTransform: "uppercase",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#957a4b")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#c2a878")}
              >
                Start The Process
              </button>
            </div>
          )}

        </div> {/* end fixed-height tab content wrapper */}
        {isOpen && <SellModal handleOpenModal={handleOpenModal} />}
      </>
    </Providers>
  );
};
export default SearchContainer;
