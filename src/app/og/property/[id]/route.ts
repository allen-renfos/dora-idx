import { NextResponse } from "next/server";
import sharp from "sharp";

import { fetchListingRaw } from "@/services/properties/propertyServer";
import { normalizePropertyDetails } from "@/services/properties/normalizePropertyDetails";

// Must run on Node (sharp is a native binary, unavailable on the edge runtime).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Generate a small, mobile-friendly Open Graph image for a listing.
 *
 * WhatsApp SILENTLY DROPS OG preview images over ~300 KB, and mobile is
 * stricter than desktop — the classic "preview works on my computer but not on
 * my phone." The raw MLS cover photos are full-size JPEGs (~500 KB) and the CDN
 * ignores resize query params, so we downscale here to ~100–150 KB at the exact
 * 1200×630 the scrapers expect.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const raw = await fetchListingRaw(id);
  const coverUrl = raw
    ? normalizePropertyDetails(raw).media.coverPhoto
    : null;

  if (!coverUrl) {
    return new NextResponse("No cover photo", { status: 404 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const photoRes = await fetch(coverUrl, {
      signal: controller.signal,
      cache: "no-store",
      headers: { accept: "image/*" },
      // MLS CDNs sometimes 403 on a referer; mirror the client's no-referrer.
      referrerPolicy: "no-referrer",
    });
    clearTimeout(timeout);

    if (!photoRes.ok) {
      console.error(`[og] cover fetch ${coverUrl} -> HTTP ${photoRes.status}`);
      return NextResponse.redirect(coverUrl, 302);
    }

    const buf = Buffer.from(await photoRes.arrayBuffer());
    const out = await sharp(buf)
      .resize(1200, 630, { fit: "cover", position: "attention" })
      .jpeg({ quality: 72, mozjpeg: true })
      .toBuffer();

    return new NextResponse(out, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": String(out.length),
        // Long cache — the resized derivative is stable per listing photo.
        "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
      },
    });
  } catch (err) {
    console.error(`[og] resize failed for ${coverUrl} -> ${String(err)}`);
    // Fall back to the original so the preview isn't completely empty.
    return NextResponse.redirect(coverUrl, 302);
  }
}
