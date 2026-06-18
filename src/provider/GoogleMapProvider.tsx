// app/layout.tsx or a dedicated client component wrapper
"use client";
import { useJsApiLoader } from "@react-google-maps/api";
import React from "react";

// const libraries: ("places" | "maps")[] = ["places", "maps"];
const libraries: "places"[] = ["places"];

export default function GoogleMapsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-screen lg:h-[500px] bg-black">
        <div className="w-full max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <div
                className="skeleton"
                style={{ width: "100%", height: "420px", borderRadius: "20px" }}
              />
              <div className="flex items-center gap-3 mt-6">
                {/* <div
                  className="skeleton skeleton-circle"
                  style={{ width: "36px", height: "36px" }}
                /> */}
                <div
                  className="skeleton skeleton-text"
                  style={{ width: "220px", height: "16px" }}
                />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div
                className="skeleton"
                style={{ width: "100%", height: "420px", borderRadius: "20px" }}
              />
              <div className="flex items-center gap-3 mt-6">
                {/* <div
                  className="skeleton skeleton-circle"
                  style={{ width: "36px", height: "36px" }}
                /> */}
                <div
                  className="skeleton skeleton-text"
                  style={{ width: "180px", height: "16px" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return <>{children}</>;
}
