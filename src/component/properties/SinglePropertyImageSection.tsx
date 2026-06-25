"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ImageGalleryModal } from "./ImageGalleryModal";
import { FiChevronLeft, FiChevronRight, FiMaximize2 } from "react-icons/fi";
import { normalizePropertyDetails } from "@/services/properties/normalizePropertyDetails";
import type { PropertyDetails } from "@/types/Property";

interface Props {
  property?: any;
}


export const SinglePropertyImageSection = ({ property: prop }: Props) => {
  const property = prop;
  const details: PropertyDetails = useMemo(
    () => normalizePropertyDetails(property),
    [property]
  );

  const canShowPhotos =
    details.compliance.canShowPrimaryPhoto ||
    details.compliance.canShowExtraPhotos;
  const images: string[] = canShowPhotos ? details.media.images : [];
  // Extra (sidebar) photos may be independently restricted.
  const canShowExtraPhotos = details.compliance.canShowExtraPhotos;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainImgError, setMainImgError] = useState(false);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((p) => (p + 1) % images.length);
  };
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((p) => (p - 1 + images.length) % images.length);
  };

  const open = (i: number) => {
    setCurrentIndex(i);
    setIsModalOpen(true);
  };

  // 3 sidebar images starting from currentIndex + 1
  const sidebar =
    images.length > 1
      ? Array.from({ length: Math.min(3, images.length - 1) }).map(
          (_, i) => images[(currentIndex + 1 + i) % images.length]
        )
      : [];

  const mustRemovePhotos = !canShowExtraPhotos;
  const attribution = details.attribution;
  const hasAttribution =
    Boolean(attribution.officeTag) ||
    Boolean(attribution.mlsTag) ||
    Boolean(attribution.fullName) ||
    Boolean(attribution.name) ||
    Boolean(attribution.logo);

  return (
    <>
      <section className="bg-[var(--canvas)]">
        <div className="container-wide pt-4 pb-6">
          {images.length === 0 ? (
            <EmptyGallery />
          ) : (
            <div className={`grid grid-cols-1 ${!mustRemovePhotos && sidebar.length > 0 ? "lg:grid-cols-[minmax(0,72%)_minmax(0,28%)]" : ""} gap-1.5 h-[55vh] min-h-[360px] max-h-[560px]`}>
              {/* Main image */}
              <button
                type="button"
                onClick={() => open(currentIndex)}
                className="relative overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface-charcoal)] group w-full h-full"
              >
                {images[currentIndex] && !mainImgError ? (
                  <Image
                    src={images[currentIndex]}
                    alt={`${details.address || "Property"} photo ${currentIndex + 1}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 72vw"
                    onError={() => setMainImgError(true)}
                    className="object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <EmptyGalleryInner />
                )}

                {/* Counter */}
                <span className="absolute top-4 left-4 px-3 py-1.5 text-[11px] font-bold tracking-[0.16em] uppercase bg-black/55 backdrop-blur-md text-white border border-white/15 rounded-[var(--radius-pill)]">
                  {currentIndex + 1} / {images.length}
                </span>

                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      aria-label="Previous photo"
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white hover:bg-[var(--gold-500)] hover:text-[var(--surface-ink)] hover:border-[var(--gold-500)] transition-colors flex items-center justify-center"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next photo"
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white hover:bg-[var(--gold-500)] hover:text-[var(--surface-ink)] hover:border-[var(--gold-500)] transition-colors flex items-center justify-center"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* View all */}
                {images.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsModalOpen(true);
                    }}
                    className="absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 bg-black/65 backdrop-blur-md border border-white/15 rounded-[var(--radius-sm)] text-white text-[12px] font-semibold tracking-[0.14em] uppercase hover:bg-[var(--gold-500)] hover:text-[var(--surface-ink)] hover:border-[var(--gold-500)] transition-colors"
                  >
                    <FiMaximize2 size={14} />
                    View all {images.length}
                  </button>
                )}
              </button>

              {/* Sidebar stack — hidden on mobile, hidden when photos must be removed */}
              {!mustRemovePhotos && sidebar.length > 0 && (
                <div className="hidden lg:grid grid-rows-[minmax(0,55%)_minmax(0,45%)] gap-1.5">
                  {/* Top large thumb */}
                  <button
                    type="button"
                    onClick={() => open((currentIndex + 1) % images.length)}
                    className="relative overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface-charcoal)] group"
                  >
                    <Image
                      src={sidebar[0]}
                      alt="Property thumbnail"
                      fill
                      sizes="28vw"
                      className="object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </button>

                  {/* Bottom 2 thumbs */}
                  {sidebar.length > 1 && (
                    <div
                      className={`grid ${sidebar.length > 2 ? "grid-cols-2" : "grid-cols-1"} gap-1.5`}
                    >
                      {sidebar.slice(1).map((img, idx) => {
                        const imgIdx = (currentIndex + 2 + idx) % images.length;
                        const isLast = idx === sidebar.length - 2;
                        const remaining = images.length - 4;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (isLast && remaining > 0) setIsModalOpen(true);
                              else open(imgIdx);
                            }}
                            className="relative overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface-charcoal)] group"
                          >
                            <Image
                              src={img}
                              alt={`Property thumbnail ${idx + 2}`}
                              fill
                              sizes="14vw"
                              className="object-contain"
                              referrerPolicy="no-referrer"
                            />
                            {isLast && remaining > 0 && (
                              <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                                <span className="text-white font-serif text-lg md:text-xl">
                                  +{remaining} more
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Listing attribution (MLS-compliant) */}
          {hasAttribution && (
            <div className="mt-4 flex flex-col gap-1">
              {attribution.officeTag && (
                <span className="text-[13px] font-semibold text-[var(--ink-soft)]">
                  {attribution.officeTag}
                </span>
              )}
              {(attribution.mlsTag || attribution.fullName || attribution.name || attribution.logo) && (
                <div className="flex items-center gap-2">
                  {(attribution.mlsTag ||
                    attribution.fullName ||
                    attribution.name) && (
                    <span className="text-[12px] text-[var(--ink-faint)]">
                      {attribution.mlsTag ||
                        `Provided courtesy of ${attribution.fullName || attribution.name}`}
                    </span>
                  )}
                  {attribution.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={attribution.logo}
                      alt={attribution.fullName || attribution.name || "MLS"}
                      className="h-4 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <ImageGalleryModal
        images={images}
        isOpen={isModalOpen}
        initialIndex={currentIndex}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

function EmptyGallery() {
  return (
    <div className="relative w-full h-[50vh] min-h-[320px] max-h-[520px] bg-gradient-to-br from-[var(--surface-graphite)] to-[var(--surface-charcoal)] flex flex-col items-center justify-center gap-4">
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--gold-500)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <polyline points="9 21 9 13 15 13 15 21" />
      </svg>
      <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
        No images available
      </span>
    </div>
  );
}

function EmptyGalleryInner() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-graphite)] to-[var(--surface-charcoal)] flex flex-col items-center justify-center gap-3">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--gold-500)"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <polyline points="9 21 9 13 15 13 15 21" />
      </svg>
      <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
        No image
      </span>
    </div>
  );
}
