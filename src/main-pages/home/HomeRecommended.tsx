"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMlsPropertyList } from "@/services/properties/PropertyQueries";
import { PropertyCard } from "@/component/properties/PropertyCard";
import { Reveal } from "@/component/ui/Reveal";
import { getTopCity, getTopCityPriceRange, type PriceRange } from "@/helpers/cityInterest";

type Property = { id: string; [key: string]: any };

/**
 * "Homes you may like in {city}" — an Amazon-style personalized rail driven by
 * the visitor's browsing history (see helpers/cityInterest). Renders nothing
 * until we know a top city, and nothing if that city yields no listings, so it
 * is invisible for brand-new visitors and never shows a broken empty block.
 */
export default function HomeRecommended() {
  // Read the store AFTER mount only — localStorage is unavailable during SSR,
  // and reading it in render would cause a hydration mismatch.
  const [city, setCity] = useState<string | null>(null);
  const [range, setRange] = useState<PriceRange | null>(null);

  useEffect(() => {
    setCity(getTopCity());
    setRange(getTopCityPriceRange());
  }, []);

  if (!city) return null;
  return <RecommendedRail city={city} range={range} />;
}

function RecommendedRail({ city, range }: { city: string; range: PriceRange | null }) {
  // Existing list hook — already scopes by agent id (lagnt) inside the service,
  // so there is no cross-agent leakage.
  const { data, isLoading, error } = useMlsPropertyList({
    mls_city: city,
    pageLimit: 6,
    property_status: "",
    property_type: "",
    ...(range && { price_min: range.price_min, price_max: range.price_max }),
  });

  const properties: Property[] = (data?.data || []).slice(0, 6);

  if (isLoading) return <RecommendedSkeleton city={city} />;
  // Graceful: a failed fetch or an empty result set simply renders nothing.
  if (error || properties.length === 0) return null;

  const description = range
    ? `Handpicked from your browsing — around $${range.price_min.toLocaleString()}–$${range.price_max.toLocaleString()} in ${city}.`
    : `Handpicked for you based on where you've been looking in ${city}.`;

  return (
    <section className="relative bg-[var(--canvas)] text-[var(--ink)] section-pad overflow-hidden">
      <div className="container-wide relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal className="flex flex-col gap-5 max-w-2xl">
            <span className="eyebrow inline-flex items-center gap-4">
              <span className="inline-block h-px w-10 bg-[var(--gold)]" />
              For You
            </span>
            <h2 className="display-lg text-[var(--ink)]">
              Homes you may like in{" "}
              <em className="italic text-[var(--gold-deep)]">{city}</em>
            </h2>
            <p className="lede text-[var(--ink-soft)] max-w-xl">{description}</p>
          </Reveal>

          <Reveal delay={0.08} className="shrink-0">
            <Link
              href={`/properties?keyword=${encodeURIComponent(city)}`}
              className="btn-outline-new"
            >
              See more in {city}
            </Link>
          </Reveal>
        </div>

        <div className="mt-14">
          <Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((item) => (
                <PropertyCard
                  key={item.id}
                  item={item}
                  handleModal={() => undefined}
                  hideWishlist={true}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function RecommendedSkeleton({ city }: { city: string }) {
  return (
    <section className="relative bg-[var(--canvas)] text-[var(--ink)] section-pad overflow-hidden">
      <div className="container-wide relative">
        <div className="flex flex-col gap-5 max-w-2xl">
          <span className="eyebrow inline-flex items-center gap-4">
            <span className="inline-block h-px w-10 bg-[var(--gold)]" />
            For You
          </span>
          <h2 className="display-lg text-[var(--ink)]">
            Homes you may like in{" "}
            <em className="italic text-[var(--gold-deep)]">{city}</em>
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-[var(--surface-graphite)]" />
              <div className="p-6 flex flex-col gap-3">
                <div className="h-7 w-40 bg-[var(--surface-graphite)] rounded-sm" />
                <div className="h-4 w-full bg-[var(--surface-graphite)] rounded-sm" />
                <div className="h-px bg-[var(--line)] my-1" />
                <div className="h-4 w-1/2 bg-[var(--surface-graphite)] rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
