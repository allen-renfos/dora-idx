"use client";

import { useEffect, useState } from "react";
import { lastSyncSlot } from "@/helpers/mlsRefresh";

/**
 * MLS Grid disclaimer (approved wording supplied by MLS Grid).
 *
 * The date/time is the real last MLS data refresh when the API reports it
 * (`refreshedAt`, from list `meta.data_refreshed_at`). Otherwise it is the
 * latest 15-minute sync slot before the visit (see helpers/mlsRefresh).
 * Always shown in Pacific time (PST/PDT), the MLS's own zone, whatever the
 * visitor's zone is.
 * It is resolved client-side only so server and browser never disagree.
 */
function useRefreshLabel(refreshedAt?: string | null): string | null {
  const [slot, setSlot] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () =>
      setSlot((prev) => {
        const next = lastSyncSlot();
        return prev && prev.getTime() === next.getTime() ? prev : next;
      });
    tick();
    const id = window.setInterval(tick, 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  const apiDate = refreshedAt ? new Date(refreshedAt) : null;
  const date = apiDate && !Number.isNaN(apiDate.getTime()) ? apiDate : slot;
  if (!date) return null;
  return `${date.toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "long",
    day: "numeric",
    year: "numeric",
  })} at ${date.toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  })}`;
}

/** The two approved paragraphs, unstyled, so any page can place them. */
export function MlsGridDisclaimerText({ refreshedAt }: { refreshedAt?: string | null }) {
  const label = useRefreshLabel(refreshedAt);
  return (
    <>
      <p>
        Listing information is provided by and copyrighted by NWMLS. Listings
        displaying the three-tree icon are courtesy of NWMLS. IDX information
        is for consumers’ personal, noncommercial use only to identify
        prospective properties they may be interested in purchasing.
        Information is deemed reliable but not guaranteed and should be
        independently verified. Properties are subject to prior sale, change,
        or withdrawal; map locations are approximate.
      </p>
      <p>
        Data is obtained from various sources and may not have been verified by
        the broker or MLS GRID. Open house information is subject to change
        without notice. Properties may or may not be listed by the office/agent
        presenting the information. Data provided by NWMLS through MLS GRID.
        Last updated:{" "}
        <strong className="font-semibold text-[var(--ink)]">{label ?? "—"}</strong>.
      </p>
    </>
  );
}

/** Search-results disclaimer block. */
export function MlsSearchDisclaimer({ refreshedAt }: { refreshedAt?: string | null }) {
  return (
    <section
      aria-label="Disclaimer"
      className="mt-12 pt-6 border-t border-[var(--line)] flex flex-col gap-3 text-[12px] leading-[1.7] text-[var(--ink-soft)] max-w-4xl"
    >
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--ink-faint)]">
        Disclaimer
      </h2>
      <MlsGridDisclaimerText refreshedAt={refreshedAt} />
    </section>
  );
}
