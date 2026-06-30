/**
 * Virtual tour / video URLs come from many sources (YouTube, Vimeo, Matterport,
 * Google Drive, etc.). Most of these provide a *page* URL that cannot be played
 * directly inside an <iframe> — either it is not an embed endpoint or the host
 * sends X-Frame-Options / frame-ancestors headers that block framing.
 *
 * This normalizes a raw tour URL into the provider's embeddable form so a single
 * <iframe src> works for every property. If the provider is unknown the URL is
 * returned unchanged (many 3D-tour hosts, e.g. Matterport, are already
 * embeddable as-is).
 */

const YOUTUBE_HOSTS = ["youtube.com", "www.youtube.com", "m.youtube.com"];

function getVideoId(url: URL): string | null {
  // youtu.be/<id>
  if (url.hostname === "youtu.be") {
    return url.pathname.slice(1).split("/")[0] || null;
  }
  // youtube.com/watch?v=<id>
  if (url.searchParams.has("v")) {
    return url.searchParams.get("v");
  }
  // youtube.com/embed/<id> | /shorts/<id> | /live/<id> | /v/<id>
  const m = url.pathname.match(/\/(embed|shorts|live|v)\/([^/?#]+)/);
  if (m) return m[2];
  return null;
}

/**
 * Convert a virtual-tour / video URL into a URL safe to use as an <iframe src>.
 * Returns null for empty/invalid input.
 */
export function toEmbedUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;

  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    // Not an absolute URL — nothing safe we can do, bail out.
    return null;
  }

  const host = url.hostname.toLowerCase();

  // --- YouTube ---------------------------------------------------------------
  if (host === "youtu.be" || YOUTUBE_HOSTS.includes(host)) {
    const id = getVideoId(url);
    if (id) {
      const start = url.searchParams.get("t") ?? url.searchParams.get("start");
      const embed = new URL(`https://www.youtube.com/embed/${id}`);
      if (start) embed.searchParams.set("start", start.replace(/[^0-9]/g, ""));
      return embed.toString();
    }
    return trimmed;
  }

  // --- Vimeo -----------------------------------------------------------------
  if (host === "vimeo.com" || host === "www.vimeo.com") {
    // vimeo.com/<id> -> player.vimeo.com/video/<id>
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (id && /^\d+$/.test(id)) {
      return `https://player.vimeo.com/video/${id}`;
    }
    return trimmed;
  }
  if (host === "player.vimeo.com") {
    return trimmed; // already an embed URL
  }

  // --- Google Drive ----------------------------------------------------------
  if (host === "drive.google.com") {
    // drive.google.com/file/d/<id>/view -> /file/d/<id>/preview
    const m = url.pathname.match(/\/file\/d\/([^/]+)/);
    if (m) {
      return `https://drive.google.com/file/d/${m[1]}/preview`;
    }
    return trimmed;
  }

  // --- Unknown provider ------------------------------------------------------
  // Many 3D-tour providers (Matterport, Kuula, iGuide, etc.) are framable as-is.
  return trimmed;
}
