"use client";

import { SinglePropertyDetails } from "@/component/properties/SinglePropertyDetails";
import { SinglePropertyImageSection } from "@/component/properties/SinglePropertyImageSection";
import { usePropertyById } from "@/services/properties/PropertyQueries";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { getApiBaseUrl } from "@/helpers/apiBaseUrl";
import { FiAlertCircle } from "react-icons/fi";
import Link from "next/link";

export const SinglePropertyPage = () => {
  const params = useParams<{ id: string }>();
  const listingKey = params?.id;

  const { data: property, isLoading, error } = usePropertyById(listingKey);

  useEffect(() => {
    if (property?.data?.id) {
      const customerId = sessionStorage.getItem("customer_id");
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
      const token = sessionStorage.getItem("access_token");
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
          <div className="aspect-[16/10] bg-[var(--surface-charcoal)] animate-pulse" />
          <div className="hidden lg:grid grid-rows-2 gap-2">
            <div className="bg-[var(--surface-charcoal)] animate-pulse" />
            <div className="bg-[var(--surface-charcoal)] animate-pulse" />
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
        <div className="w-16 h-16 rounded-full bg-[var(--gold-500)]/10 border border-[var(--gold-500)]/30 flex items-center justify-center mb-6">
          <FiAlertCircle size={24} className="text-[var(--gold-500)]" />
        </div>
        <h1 className="font-serif text-3xl mb-3">We couldn&rsquo;t load this listing</h1>
        <p className="text-[var(--ink-soft)] mb-8 leading-relaxed">
          The property may have been delisted or the link is out of date. Try
          browsing the current inventory.
        </p>
        <Link href="/properties" className="btn-gold-new">
          Browse listings
        </Link>
      </div>
    </div>
  );
}
