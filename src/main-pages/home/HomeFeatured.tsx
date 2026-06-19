"use client";

import Link from "next/link";
import { useNewListings } from "@/services/properties/PropertyQueries";
import { PropertyCard } from "@/component/properties/PropertyCard";
import { SectionHeading } from "@/component/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/component/ui/Reveal";

type Property = { id: string; [key: string]: any };

export default function HomeFeatured() {
  const { data, isLoading } = useNewListings();
  const properties: Property[] = (data?.data || []).slice(0, 6);

  return (
    <section className="relative bg-[var(--surface-obsidian)] text-[var(--ink)] section-pad overflow-hidden">
      {/* Decorative gradient */}
      <div
        aria-hidden
        className="absolute -top-40 right-0 w-[520px] h-[520px] rounded-full opacity-[0.05] blur-[120px] bg-[var(--gold-300)]"
      />

      <div className="container-wide relative">
        <SectionHeading
          eyebrow="New Listings"
          title={
            <>
              Fresh homes,<br /> just hit the{" "}
              <em className="not-italic italic text-[var(--gold-500)]">market</em>
            </>
          }
          description="The latest properties to hit the market — updated regularly so you never miss an opportunity."
          align="between"
          action={
            <Link href="/properties" className="btn-outline-new">
              View all listings
            </Link>
          }
        />

        <div className="mt-14">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col h-full bg-[var(--surface)] border border-[var(--line)] rounded-sm overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-[var(--surface-graphite)]" />
                  <div className="p-6 flex flex-col gap-3">
                    <div className="h-7 w-40 bg-[var(--surface-graphite)] rounded-sm" />
                    <div className="h-4 w-full bg-[var(--surface-graphite)] rounded-sm" />
                    <div className="h-4 w-3/4 bg-[var(--surface-graphite)] rounded-sm" />
                    <div className="h-px bg-[var(--line)] my-1" />
                    <div className="h-4 w-1/2 bg-[var(--surface-graphite)] rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length ? (
            <StaggerGroup
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              stagger={0.08}
            >
              {properties.map((item) => (
                <StaggerItem key={item.id}>
                  <PropertyCard
                    item={item}
                    handleModal={() => undefined}
                    hideWishlist={true}
                  />
                </StaggerItem>
              ))}
            </StaggerGroup>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-[var(--line)]">
      <div className="w-14 h-14 rounded-full bg-[var(--surface-graphite)] flex items-center justify-center mb-4">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
          <polyline points="9 21 9 13 15 13 15 21" />
        </svg>
      </div>
      <h3 className="font-serif text-2xl text-[var(--ink)]">No new listings right now</h3>
      <p className="text-[var(--ink-soft)] mt-2 max-w-md">
        Check back shortly, or{" "}
        <Link href="/properties" className="text-[var(--accent-text)] underline underline-offset-4">
          browse all properties
        </Link>
        .
      </p>
    </div>
  );
}
