import type { Metadata } from "next";

import { SinglePropertyPage } from "@/main-pages/single-property/SinglePropertyPage";
import {
  fetchListingRaw,
  getRequestOrigin,
} from "@/services/properties/propertyServer";
import { normalizePropertyDetails } from "@/services/properties/normalizePropertyDetails";
import { canDisplayListing } from "@/helpers/listingDisplay";

// Listing data changes; never statically cache this route or its metadata.
export const dynamic = "force-dynamic";

/**
 * Server-rendered Open Graph / Twitter metadata so a shared listing link
 * previews as the card (photo, address, price, beds & baths) in WhatsApp,
 * iMessage, Messenger, X and Facebook. Read by each platform's crawler — this
 * has nothing to do with the client render.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const origin = await getRequestOrigin();
  const canonicalUrl = `${origin}/properties/${id}`;
  const ogImageUrl = `${origin}/og/property/${id}`;

  const raw = await fetchListingRaw(id);

  // Not found, or not displayable (e.g. revoked NWMLS First Look consent):
  // generic preview only — never the listing's photo, address or price.
  if (!raw || !canDisplayListing(raw)) {
    // Fallback preview — still absolute URLs, no image.
    return {
      title: "Property · Dora",
      description: "Explore this listing on Dora.",
      openGraph: {
        title: "Property · Dora",
        description: "Explore this listing on Dora.",
        url: canonicalUrl,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Property · Dora",
        description: "Explore this listing on Dora.",
      },
    };
  }

  const details = normalizePropertyDetails(raw);

  const address =
    details.compliance.canShowAddress && details.address
      ? String(details.address).replace(/±/g, "#")
      : "Property";
  const priceLabel =
    details.price !== null
      ? `$${Number(details.price).toLocaleString()}`
      : "Price upon request";

  const specBits: string[] = [];
  if (details.beds !== null) specBits.push(`${details.beds} Beds`);
  if (details.baths !== null) specBits.push(`${details.baths} Baths`);
  if (details.livingAreaSqft !== null)
    specBits.push(`${Number(details.livingAreaSqft).toLocaleString()} SqFt`);

  const title = `${priceLabel} · ${address}`;
  const description = specBits.length
    ? `${specBits.join(" · ")} — ${address}`
    : address;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "Dora",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: address,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function SingleProperty() {
  return (
    <main className="bg-[var(--canvas)] text-[var(--ink)] min-h-screen">
      <SinglePropertyPage />
    </main>
  );
}
