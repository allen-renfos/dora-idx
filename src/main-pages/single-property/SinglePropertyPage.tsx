"use client";

import { SinglePropertyDetails } from "@/component/properties/SinglePropertyDetails";
import { SinglePropertyImageSection } from "@/component/properties/SinglePropertyImageSection";
import { usePropertyById } from "@/services/properties/PropertyQueries";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { getApiBaseUrl } from "@/helpers/apiBaseUrl";
import { getAccessToken, getCustomerId } from "@/services/auth/authStorage";
import { useCityInterestTracker } from "@/helpers/useCityInterestTracker";
import { FiAlertCircle } from "react-icons/fi";
import Link from "next/link";

export const SinglePropertyPage = () => {
  const params = useParams<{ id: string }>();
  const listingKey = params?.id;

  const { data: property, isLoading, error } = usePropertyById(listingKey);

  // City personalization: learn which city (+ price) this visitor browses.
  // Runs unconditionally (before any early return); a no-op until data loads.
  // Price nests under sections.financial.list_price — NOT the top-level field.
  const detail = property?.data;
  const detailCity =
    detail?.address?.city ??
    detail?.mls_city ??
    detail?.city ??
    detail?.sections?.highlights?.city;
  const detailPrice =
    detail?.sections?.financial?.list_price ??
    detail?.summary?.price ??
    detail?.price;
  useCityInterestTracker(detailCity, "view", detailPrice);

  useEffect(() => {
    if (property?.data?.id) {
      const customerId = getCustomerId();
      if (customerId) trackPropertyVisit(property.data.id);
    }
  }, [property]);

  const trackPropertyVisit = async (id: number | string) => {
    try {
      let sessionId = sessionStorage.getItem("visitor_session_id");
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        sessionStorage.setItem("visitor_session_id", sessionId);
      }
      const token = getAccessToken();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const propertyId = String(id);
      if (!propertyId) return;

      const uuid = process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID;
      const visitApiUrl = `${getApiBaseUrl()}/v1/property/visit`;

      await fetch(visitApiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ property_id: propertyId, session_id: sessionId, uuid }),
        redirect: "manual",
      });
    } catch (err) {
      console.error("Failed to track property visit:", err);
    }
  };

  if (isLoading) return <DetailSkeleton />;
  if (error || !property) return <DetailError />;

  return (
    <div className="pt-[88px] lg:pt-[104px]">
      <SinglePropertyImageSection property={property.data} />
      <SinglePropertyDetails property={property.data} />
    </div>
  );
};

function DetailSkeleton() {
  return (
    <div className="pt-[88px] pb-16">
      <div className="container-wide space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-2">
          <div className="aspect-[16/10] bg-[var(--surface-graphite)] rounded-[var(--radius-md)] animate-pulse" />
          <div className="hidden lg:grid grid-rows-2 gap-2">
            <div className="bg-[var(--surface-graphite)] rounded-[var(--radius-md)] animate-pulse" />
            <div className="bg-[var(--surface-graphite)] rounded-[var(--radius-md)] animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col gap-3 animate-pulse">
          <div className="h-12 w-56 bg-[var(--surface-graphite)]" />
          <div className="h-5 w-80 bg-[var(--surface-graphite)]" />
          <div className="h-5 w-40 bg-[var(--surface-graphite)]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-32 w-full bg-[var(--surface-graphite)]" />
            <div className="h-64 w-full bg-[var(--surface-graphite)]" />
            <div className="h-64 w-full bg-[var(--surface-graphite)]" />
          </div>
          <div className="h-80 bg-[var(--surface-graphite)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function DetailError() {
  return (
    <div className="pt-[120px] pb-20 container-wide">
      <div className="max-w-md mx-auto text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-[var(--sage)]/12 border border-[var(--sage)]/40 flex items-center justify-center mb-6">
          <FiAlertCircle size={24} className="text-[var(--sage-deep)]" />
        </div>
        <span className="eyebrow mb-4">A quiet pause</span>
        <h1 className="font-serif text-[clamp(1.8rem,2.5vw+1rem,2.6rem)] text-[var(--ink)] mb-3">This listing has slipped away</h1>
        <p className="text-[var(--ink-soft)] mb-8 leading-relaxed">
          The residence may have found its keeper, or the link has aged. Step
          back into the current collection — something fitting may be waiting.
        </p>
        <Link href="/properties" className="btn-gold-new">
          Return to the collection
        </Link>
      </div>
    </div>
  );
}
