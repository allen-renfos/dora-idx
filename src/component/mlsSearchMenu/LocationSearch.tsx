import React, { useRef, useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { HiOutlineLocationMarker } from "react-icons/hi";

const libraries: ("places")[] = ["places"];

const LocationSearchInput = <T extends string>({ handleSearch, searchKey }: {
  handleSearch: (value: string, key: T) => void;
  searchKey: T;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
      componentRestrictions: { country: "us" }, // optional
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      handleSearch(place.formatted_address ?? "", searchKey);
    });
  }, [isLoaded, handleSearch, searchKey]);

  return (
    <div className="relative flex flex-1 min-w-[200px]">
      <span className="absolute inset-y-0 left-0 flex items-center pr-2 pl-3 text-gray-400">
        {isSearching ? (
          <svg className="animate-spin" width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#a6824c" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        ) : (
          <HiOutlineLocationMarker size={"15px"} color={"#a6824c"} />
        )}
      </span>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search"
        className="border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#151515] focus:ring-opacity-20 w-full"
        onChange={(e) => {
          handleSearch(e.target.value, searchKey);
          if (e.target.value.trim()) {
            setIsSearching(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setIsSearching(false), 400);
          } else {
            setIsSearching(false);
          }
        }}
      />
    </div>
  );
};

export default LocationSearchInput;
