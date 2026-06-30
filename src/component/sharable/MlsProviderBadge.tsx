"use client";

/**
 * MLS attribution badge shown on every property card.
 *
 * The API returns provider info under `mls_provider`:
 *   { code, name, full_name, logo, officetag }
 * where `officetag` is the ready-to-display credit line
 * (e.g. "Listed with Coldwell Banker Bain").
 *
 * Older payloads expose flat `listed_with` / `logo` fields, so we fall back
 * to those to stay backward compatible.
 */
interface MlsProvider {
  code?: string;
  name?: string;
  full_name?: string;
  logo?: string;
  officetag?: string;
}

export function MlsProviderBadge({
  item,
  className = "",
}: {
  item: any;
  className?: string;
}) {
  const provider: MlsProvider = item?.mls_provider ?? {};

  const logo: string | undefined = provider.logo || item?.logo || undefined;
  const officeTag: string | undefined =
    provider.officetag ||
    (item?.listed_with ? `Listed with ${item.listed_with}` : undefined);

  if (!logo && !officeTag) return null;

  const alt = provider.name || provider.full_name || "MLS";

  return (
    <div className={`flex items-center gap-2 pt-3 mt-auto ${className}`}>
      {logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={alt}
          width={18}
          height={18}
          className="rounded-full object-cover shrink-0"
          style={{ width: 18, height: 18 }}
          referrerPolicy="no-referrer"
        />
      )}
      {officeTag && (
        <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[var(--ink-faint)]">
          {officeTag}
        </span>
      )}
    </div>
  );
}
