"use client";

import { MLSAdvanceSearchProps } from "@/types/Property";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiLock, FiSliders, FiX } from "react-icons/fi";
import { useSearchMetadata } from "@/services/search/SearchMetadataQueries";
import type { MetadataOption } from "@/services/search/SearchMetadataServices";

/**
 * Numeric RANGE options are intrinsic numeric buckets (not MLS enumerations),
 * so they stay client-side. Every ENUMERATED option (types, statuses, views,
 * features, basement, sewer …) is driven by `/v1/properties/search-metadata`
 * — we render only what the backend returns and submit the canonical value.
 */
const GARAGE_OPTS = ["1", "2", "3", "4", "5", "6+"].map(v => ({ value: v, label: v }));
const LOT_SIZE_OPTS = [
  { value: "2000", label: "2,000 sq ft" }, { value: "4500", label: "4,500 sq ft" },
  { value: "6500", label: "6,500 sq ft" }, { value: "8000", label: "8,000 sq ft" },
  { value: "9500", label: "9,500 sq ft" }, { value: "10890", label: ".25 acres" },
  { value: "21780", label: ".5 acres" }, { value: "43560", label: "1 acre" },
  { value: "87120", label: "2 acres" }, { value: "130680", label: "3 acres" },
  { value: "174240", label: "4 acres" }, { value: "217800", label: "5 acres" },
  { value: "435600", label: "10 acres" }, { value: "871200", label: "20 acres" },
  { value: "1742400", label: "40 acres" }, { value: "4356000", label: "100 acres" },
];
const SQ_FT_OPTS = [
  { value: "750", label: "750" }, { value: "1000", label: "1,000" },
  { value: "1100", label: "1,100" }, { value: "1200", label: "1,200" },
  { value: "1300", label: "1,300" }, { value: "1400", label: "1,400" },
  { value: "1500", label: "1,500" }, { value: "1600", label: "1,600" },
  { value: "1700", label: "1,700" }, { value: "1800", label: "1,800" },
  { value: "1900", label: "1,900" }, { value: "2000", label: "2,000" },
  { value: "2250", label: "2,250" }, { value: "2500", label: "2,500" },
  { value: "2750", label: "2,750" }, { value: "3000", label: "3,000" },
  { value: "4000", label: "4,000" }, { value: "5000", label: "5,000" },
  { value: "7500", label: "7,500" }, { value: "10000", label: "10,000" },
];
const YEAR_OPTS = [
  "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017",
  "2016", "2015", "2010", "2005", "2000", "1990", "1980", "1970", "1960", "1950", "1940", "1920", "1900",
].map(y => ({ value: y, label: y }));
const STORIES_OPTS = ["1", "2", "3", "4", "5+"].map(v => ({ value: v, label: v }));

const ADVANCED_DISABLED_MESSAGE =
  "Enter a city, ZIP code, or neighbourhood to unlock advanced filters.";

function filterMaxOpts(opts: { value: string; label: string }[], minVal: string) {
  if (!minVal) return opts;
  const minNum = Number(minVal);
  return opts.filter(o => isNaN(Number(o.value)) || Number(o.value) >= minNum);
}
function splitPipe(s: string | number): string[] {
  if (!s) return [];
  return String(s).split("|").filter(Boolean);
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-bold tracking-[0.22em] uppercase text-[var(--gold-500)] mb-4 inline-flex items-center gap-3">
      <span className="inline-block h-px w-8 bg-[var(--gold-500)]" />
      {children}
    </h3>
  );
}

function Divider() {
  return <div className="my-7 h-px bg-[var(--line)]" />;
}

function Select({
  value,
  onChange,
  disabled,
  children,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="h-10 px-3 bg-[var(--surface-charcoal)] border border-[var(--line-soft)] rounded-[var(--radius-sm)] text-[13px] text-[var(--ink)] focus:outline-none focus:border-[var(--gold-500)]/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </select>
  );
}

function RangeSelect({
  label,
  minVal,
  maxVal,
  opts,
  onMinChange,
  onMaxChange,
}: {
  label: string;
  minVal: string;
  maxVal: string;
  opts: { value: string; label: string }[];
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
}) {
  const maxOpts = filterMaxOpts(opts, minVal);
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">{label}</label>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <Select value={minVal} onChange={e => onMinChange(e.target.value)}>
          <option value="">No Min</option>
          {opts.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
        <span className="text-[var(--ink-faint)] text-sm">—</span>
        <Select value={maxVal} onChange={e => onMaxChange(e.target.value)}>
          <option value="">No Max</option>
          {maxOpts.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>
    </div>
  );
}

function TagGroup({
  items,
  selected,
  onToggle,
}: {
  items: MetadataOption[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (!items.length) {
    return (
      <p className="text-[12px] text-[var(--ink-faint)] italic">No options available.</p>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => {
        const active = selected.includes(item.value);
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onToggle(item.value)}
            className={`inline-flex items-center gap-1.5 h-9 px-3.5 text-[12px] tracking-wide border rounded-[var(--radius-sm)] transition-all duration-200 ${
              active
                ? "bg-[var(--gold-500)]/15 border-[var(--gold-500)] text-[var(--gold-500)]"
                : "bg-[var(--surface-charcoal)] border-[var(--line-soft)] text-[var(--ink-soft)] hover:border-[var(--gold-500)]/50 hover:text-[var(--ink)]"
            }`}
          >
            {active && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--gold-500)]" />}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function Accordion({
  label,
  count,
  open,
  onToggle,
  children,
}: {
  label: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[var(--line-soft)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--surface-obsidian)] mb-3">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3.5 px-4 text-left hover:bg-[var(--ink)]/[0.02] transition-colors"
      >
        <span className="inline-flex items-center gap-3 text-[14px] font-medium text-[var(--ink)]">
          {label}
          {count > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[var(--gold-500)] text-[var(--surface-ink)] text-[10px] font-bold rounded-full">
              {count}
            </span>
          )}
        </span>
        {open ? <FiChevronUp size={16} className="text-[var(--ink-faint)]" /> : <FiChevronDown size={16} className="text-[var(--ink-faint)]" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Area gate. Advanced predicates (features/size/year/lot/interior) are
 * non-indexable on the MLS side; without a location anchor they scan millions
 * of rows and time out. When `locked`, children are hidden and replaced with a
 * disabled empty-state (the same copy is exposed as a tooltip on hover).
 */
function AdvancedGate({
  locked,
  children,
}: {
  locked: boolean;
  children: React.ReactNode;
}) {
  if (!locked) return <>{children}</>;
  return (
    <div className="group relative" title={ADVANCED_DISABLED_MESSAGE} aria-disabled="true">
      <div
        className="flex items-start gap-3 border border-dashed border-[var(--line-soft)] rounded-[var(--radius-md)] bg-[var(--surface-charcoal)]/40 px-5 py-6 text-[var(--ink-faint)]"
        role="note"
      >
        <FiLock size={16} className="mt-0.5 shrink-0 text-[var(--gold-500)]/70" />
        <p className="text-[13px] leading-snug">{ADVANCED_DISABLED_MESSAGE}</p>
      </div>
    </div>
  );
}

type Props = MLSAdvanceSearchProps & { areaSelected?: boolean };

const MLSAdvanceSearch = ({
  open,
  onClose,
  onApply,
  handleSearch,
  searchFilters,
  areaSelected = false,
}: Props) => {
  const { data: metadata } = useSearchMetadata();

  const propertyTypeOpts = metadata?.property_types ?? [];
  const statusOpts = metadata?.statuses ?? [];
  const communityOpts = metadata?.community_amenities ?? [];
  const viewOpts = metadata?.property_views ?? [];
  const interiorOpts = metadata?.interior_features ?? [];
  const siteOpts = metadata?.site_features ?? [];
  const lotFeatureOpts = metadata?.lot_features ?? [];
  const basementOpts = metadata?.basement_options ?? [];
  const sewerOpts = metadata?.sewer_options ?? [];

  // Whether the "Features & Amenities" umbrella has any populated group.
  const hasFeatureGroups =
    communityOpts.length > 0 ||
    viewOpts.length > 0 ||
    interiorOpts.length > 0 ||
    siteOpts.length > 0 ||
    lotFeatureOpts.length > 0;

  const locked = !areaSelected;

  const [garageMin, setGarageMin] = useState("");
  const [garageMax, setGarageMax] = useState("");
  const [sqftMin, setSqftMin] = useState("");
  const [sqftMax, setSqftMax] = useState("");
  const [lotMin, setLotMin] = useState("");
  const [lotMax, setLotMax] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [propTypes, setPropTypes] = useState<string[]>([]);
  const [propStatuses, setPropStatuses] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [views, setViews] = useState<string[]>([]);
  const [interiorFeats, setInteriorFeats] = useState<string[]>([]);
  const [siteFeats, setSiteFeats] = useState<string[]>([]);
  const [lotFeats, setLotFeats] = useState<string[]>([]);
  const [stories, setStories] = useState("");
  const [basement, setBasement] = useState("");
  const [sewer, setSewer] = useState("");
  const [openAcc, setOpenAcc] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setGarageMin(searchFilters.garage_min ? String(searchFilters.garage_min) : "");
      setGarageMax(searchFilters.garage_max ? String(searchFilters.garage_max) : "");
      setSqftMin(searchFilters.square_footage_min ? String(searchFilters.square_footage_min) : "");
      setSqftMax(searchFilters.square_footage_max ? String(searchFilters.square_footage_max) : "");
      setLotMin(searchFilters.lot_size_min ? String(searchFilters.lot_size_min) : "");
      setLotMax(searchFilters.lot_size_max ? String(searchFilters.lot_size_max) : "");
      setYearMin(searchFilters.year_built_min ? String(searchFilters.year_built_min) : "");
      setYearMax(searchFilters.year_built_max ? String(searchFilters.year_built_max) : "");
      setStories(searchFilters.stories ? String(searchFilters.stories) : "");
      setPropTypes(splitPipe(searchFilters.property_type));
      setPropStatuses(splitPipe(searchFilters.property_status));
      setAmenities(splitPipe(searchFilters.community_amenities));
      setViews(splitPipe(searchFilters.property_view));
      setInteriorFeats(splitPipe(searchFilters.interior_features));
      setSiteFeats(splitPipe(searchFilters.mls_site_features));
      setLotFeats(splitPipe(searchFilters.mls_lot_feature));
      setBasement(searchFilters.mls_basement || "");
      setSewer(searchFilters.mls_sewer || "");
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Helper: toggle one value within a pipe-joined multi-select field.
  const toggleMulti = (
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    key: keyof typeof searchFilters,
    value: string,
  ) => {
    const next = current.includes(value)
      ? current.filter(i => i !== value)
      : [...current, value];
    setter(next);
    handleSearch(next.join("|"), key);
  };

  const handleClear = () => {
    setGarageMin(""); setGarageMax("");
    setSqftMin(""); setSqftMax("");
    setLotMin(""); setLotMax("");
    setYearMin(""); setYearMax("");
    setStories("");
    setPropTypes([]); setPropStatuses([]);
    setAmenities([]); setViews([]);
    setInteriorFeats([]); setSiteFeats([]); setLotFeats([]);
    setBasement(""); setSewer("");
    const keys: (keyof typeof searchFilters)[] = [
      "property_type", "property_status", "community_amenities", "property_view",
      "interior_features", "mls_site_features", "mls_lot_feature",
      "garage_min", "garage_max", "square_footage_min", "square_footage_max",
      "lot_size_min", "lot_size_max", "year_built_min", "year_built_max",
      "stories", "mls_basement", "mls_sewer",
    ];
    keys.forEach(k => handleSearch("", k));
  };

  const totalActive =
    propTypes.length + propStatuses.length + amenities.length +
    views.length + interiorFeats.length + siteFeats.length + lotFeats.length +
    (garageMin || garageMax ? 1 : 0) + (sqftMin || sqftMax ? 1 : 0) +
    (lotMin || lotMax ? 1 : 0) + (yearMin || yearMax ? 1 : 0) +
    (stories ? 1 : 0) +
    (basement ? 1 : 0) + (sewer ? 1 : 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10 bg-black/75 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-full flex flex-col bg-[var(--surface-ink)] border border-[var(--line-soft)] rounded-[var(--radius-md)] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]"
          >
            <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-[var(--line-soft)] bg-[var(--surface-obsidian)]">
              <div className="flex items-center gap-3">
                <FiSliders size={18} className="text-[var(--gold-500)]" />
                <h2 className="font-serif text-xl text-[var(--ink)]">Advanced Filters</h2>
                {totalActive > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[22px] h-6 px-2 bg-[var(--gold-500)] text-[var(--surface-ink)] text-[11px] font-bold rounded-full">
                    {totalActive}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-8 py-7">
              {/* Property Type — rendered only when metadata supplies options. */}
              {propertyTypeOpts.length > 0 && (
                <>
                  <SectionTitle>Property Type</SectionTitle>
                  <TagGroup
                    items={propertyTypeOpts}
                    selected={propTypes}
                    onToggle={value =>
                      toggleMulti(propTypes, setPropTypes, "property_type", value)
                    }
                  />
                  <Divider />
                </>
              )}

              {/* Property Status — rendered only when metadata supplies options. */}
              {statusOpts.length > 0 && (
                <>
                  <SectionTitle>Property Status</SectionTitle>
                  <TagGroup
                    items={statusOpts}
                    selected={propStatuses}
                    onToggle={value =>
                      toggleMulti(propStatuses, setPropStatuses, "property_status", value)
                    }
                  />
                  <Divider />
                </>
              )}

              {/* Size & Space — numeric ranges are backend-supported (not metadata
                  enums); basement/sewer selects appear only when metadata has them. */}
              <SectionTitle>Size &amp; Space</SectionTitle>
              <AdvancedGate locked={locked}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <RangeSelect
                    label="Garage Spaces"
                    opts={GARAGE_OPTS}
                    minVal={garageMin}
                    maxVal={garageMax}
                    onMinChange={v => { setGarageMin(v); handleSearch(v, "garage_min"); }}
                    onMaxChange={v => { setGarageMax(v); handleSearch(v, "garage_max"); }}
                  />
                  <RangeSelect
                    label="Square Footage"
                    opts={SQ_FT_OPTS}
                    minVal={sqftMin}
                    maxVal={sqftMax}
                    onMinChange={v => { setSqftMin(v); handleSearch(v, "square_footage_min"); }}
                    onMaxChange={v => { setSqftMax(v); handleSearch(v, "square_footage_max"); }}
                  />
                  <RangeSelect
                    label="Lot Size"
                    opts={LOT_SIZE_OPTS}
                    minVal={lotMin}
                    maxVal={lotMax}
                    onMinChange={v => { setLotMin(v); handleSearch(v, "lot_size_min"); }}
                    onMaxChange={v => { setLotMax(v); handleSearch(v, "lot_size_max"); }}
                  />
                  <RangeSelect
                    label="Year Built"
                    opts={YEAR_OPTS}
                    minVal={yearMin}
                    maxVal={yearMax}
                    onMinChange={v => { setYearMin(v); handleSearch(v, "year_built_min"); }}
                    onMaxChange={v => { setYearMax(v); handleSearch(v, "year_built_max"); }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">Stories</label>
                    <Select
                      value={stories}
                      onChange={e => { setStories(e.target.value); handleSearch(e.target.value, "stories"); }}
                    >
                      <option value="">Any</option>
                      {STORIES_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </Select>
                  </div>
                  {basementOpts.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">Basement</label>
                      <Select
                        value={basement}
                        onChange={e => { setBasement(e.target.value); handleSearch(e.target.value, "mls_basement"); }}
                      >
                        <option value="">Any</option>
                        {basementOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </Select>
                    </div>
                  )}
                  {sewerOpts.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">Sewer</label>
                      <Select
                        value={sewer}
                        onChange={e => { setSewer(e.target.value); handleSearch(e.target.value, "mls_sewer"); }}
                      >
                        <option value="">Any</option>
                        {sewerOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </Select>
                    </div>
                  )}
                </div>
              </AdvancedGate>

              {/* Features & Amenities — entire section hidden if no group has options. */}
              {hasFeatureGroups && (
                <>
                  <Divider />
                  <SectionTitle>Features &amp; Amenities</SectionTitle>
                  <AdvancedGate locked={locked}>
                    {communityOpts.length > 0 && (
                      <Accordion
                        label="Community Amenities"
                        count={amenities.length}
                        open={openAcc === "amenities"}
                        onToggle={() => setOpenAcc(openAcc === "amenities" ? null : "amenities")}
                      >
                        <TagGroup
                          items={communityOpts}
                          selected={amenities}
                          onToggle={value =>
                            toggleMulti(amenities, setAmenities, "community_amenities", value)
                          }
                        />
                      </Accordion>
                    )}

                    {viewOpts.length > 0 && (
                      <Accordion
                        label="Property View"
                        count={views.length}
                        open={openAcc === "views"}
                        onToggle={() => setOpenAcc(openAcc === "views" ? null : "views")}
                      >
                        <TagGroup
                          items={viewOpts}
                          selected={views}
                          onToggle={value => toggleMulti(views, setViews, "property_view", value)}
                        />
                      </Accordion>
                    )}

                    {interiorOpts.length > 0 && (
                      <Accordion
                        label="Interior Features"
                        count={interiorFeats.length}
                        open={openAcc === "interior"}
                        onToggle={() => setOpenAcc(openAcc === "interior" ? null : "interior")}
                      >
                        <TagGroup
                          items={interiorOpts}
                          selected={interiorFeats}
                          onToggle={value =>
                            toggleMulti(interiorFeats, setInteriorFeats, "interior_features", value)
                          }
                        />
                      </Accordion>
                    )}

                    {siteOpts.length > 0 && (
                      <Accordion
                        label="Site / Exterior Features"
                        count={siteFeats.length}
                        open={openAcc === "site"}
                        onToggle={() => setOpenAcc(openAcc === "site" ? null : "site")}
                      >
                        <TagGroup
                          items={siteOpts}
                          selected={siteFeats}
                          onToggle={value =>
                            toggleMulti(siteFeats, setSiteFeats, "mls_site_features", value)
                          }
                        />
                      </Accordion>
                    )}

                    {lotFeatureOpts.length > 0 && (
                      <Accordion
                        label="Lot Features"
                        count={lotFeats.length}
                        open={openAcc === "lot"}
                        onToggle={() => setOpenAcc(openAcc === "lot" ? null : "lot")}
                      >
                        <TagGroup
                          items={lotFeatureOpts}
                          selected={lotFeats}
                          onToggle={value =>
                            toggleMulti(lotFeats, setLotFeats, "mls_lot_feature", value)
                          }
                        />
                      </Accordion>
                    )}
                  </AdvancedGate>
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 px-6 md:px-8 py-4 border-t border-[var(--line-soft)] bg-[var(--surface-obsidian)]">
              <button
                type="button"
                onClick={handleClear}
                className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--ink-soft)] hover:text-[var(--gold-500)] transition-colors"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => { onApply(false); onClose(); }}
                className="btn-gold-new"
              >
                View results
                {totalActive > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-5 px-1.5 bg-[var(--surface-ink)] text-[var(--gold-500)] text-[10px] font-bold rounded-full">
                    {totalActive}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MLSAdvanceSearch;
