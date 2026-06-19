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
    <section className="relative bg-[var(--canvas-2)] text-[var(--ink)] section-pad overflow-hidden">
      {/* Soft sage halo */}
      <div
        aria-hidden
        className="absolute -top-40 right-0 w-[560px] h-[560px] rounded-full opacity-[0.08] blur-[130px] bg-[var(--sage)]"
      />

      <div className="container-wide relative">
        <SectionHeading
          eyebrow="Newly Listed"
          title={
            <>
              Homes fresh<br /> to the{" "}
              <em className="not-italic italic text-[var(--gold-deep)]">market</em>
            </>
          }
          description="The latest additions to our collection — kept current, so the right home never slips past you."
          align="between"
          action={
            <Link href="/properties" className="btn-outline-new">
              See every listing
            </Link>
          }
        />

        <div className="mt-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col h-full bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] overflow-hidden animate-pulse"
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
    <div className="flex flex-col items-center justify-center text-center py-24 rounded-[var(--radius-md)] border border-dashed border-[var(--line)] bg-[var(--cream)]">
      <div className="w-14 h-14 rounded-full bg-[var(--canvas-2)] flex items-center justify-center mb-5">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--gold-deep)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
          <polyline points="9 21 9 13 15 13 15 21" />
        </svg>
      </div>
      <h3 className="font-serif text-2xl text-[var(--ink)]">Nothing new at this moment</h3>
      <p className="text-[var(--ink-soft)] mt-3 max-w-md">
        New homes arrive often — look in again soon, or{" "}
        <Link href="/properties" className="text-[var(--gold-deep)] underline underline-offset-4">
          wander the full collection
        </Link>
        .
      </p>
    </div>
  );
}
