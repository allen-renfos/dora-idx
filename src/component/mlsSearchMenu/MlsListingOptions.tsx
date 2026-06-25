"use client";

import { SearchFilters } from "@/types/Property";
import { FiGrid, FiMap, FiColumns } from "react-icons/fi";

interface MlsListingOptionsProps {
  handleOpenMapPropertyGrid: () => void;
  handleOpenMapGrid?: () => void;
  handleOpenPropertyGrid?: () => void;
  openMapPropertyGrid?: boolean;
  openMapGrid?: boolean;
  openPropertyGrid?: boolean;
  canShowMapViews?: boolean;
  handleSearch: (value: any, key: keyof SearchFilters) => void;
  searchFilters: SearchFilters;
  showMap: boolean;
  handleShowmapDongle: () => void;
}

type ViewKey = "grid" | "split" | "map";

export const MlsListingOptions = ({
  handleOpenMapPropertyGrid,
  handleOpenMapGrid,
  handleOpenPropertyGrid,
  openMapPropertyGrid,
  openMapGrid,
  openPropertyGrid,
  canShowMapViews = true,
}: MlsListingOptionsProps) => {
  const current: ViewKey = openMapPropertyGrid
    ? "split"
    : openMapGrid
    ? "map"
    : "grid";

  const views: {
    key: ViewKey;
    label: string;
    Icon: React.ComponentType<{ size?: number }>;
    onClick?: () => void;
    hidden?: boolean;
  }[] = [
    { key: "grid", label: "Grid", Icon: FiGrid, onClick: handleOpenPropertyGrid },
    {
      key: "split",
      label: "Split",
      Icon: FiColumns,
      onClick: handleOpenMapPropertyGrid,
      hidden: !canShowMapViews,
    },
    {
      key: "map",
      label: "Map",
      Icon: FiMap,
      onClick: handleOpenMapGrid,
      hidden: !canShowMapViews,
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="View mode"
      className="inline-flex items-center bg-[var(--surface-charcoal)] border border-[var(--line-soft)] p-1"
    >
      {views
        .filter((v) => !v.hidden)
        .map(({ key, label, Icon, onClick }) => {
          const active = current === key;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={active}
              onClick={onClick}
              className={`h-9 px-3 inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.08em] uppercase transition-colors ${
                active
                  ? "bg-[var(--gold-500)] text-[var(--surface-ink)]"
                  : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
    </div>
  );
};
