"use client";

import { MLSAdvanceSearchProps } from "@/types/Property";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiSliders, FiX } from "react-icons/fi";

const PROPERTY_TYPES = [
  "Business Opportunity", "Commercial Sale", "Apartment", "Condo", "Villa",
  "Townhouse", "Penthouse", "Single Family", "Multi-Family", "Land", "Mobile Home", "Farm",
];
const PROPERTY_STATUSES = ["Active", "Contingent", "Pending"];
const CONSTRUCTION_STATUSES = ["Ready to Move", "Under Construction", "Pre-Launch", "Off Plan"];
const COMMUNITY_AMENITIES = [
  "Swimming Pool", "Gym / Fitness Center", "Clubhouse", "Gated Access / Security",
  "Children's Play Area / Park", "Tennis Courts", "Basketball Courts", "Golf Course",
  "Jogging/Walking Trails", "BBQ / Picnic Area", "Community Garden", "Business Center",
  "Elevator (in condos/apartments)", "Rooftop Deck", "Covered Parking / Guest Parking",
  "Pet Area / Dog Park", "Lake / Waterfront Access", "Marina / Boat Docks",
  "Sauna / Spa / Hot Tub", "On-site Maintenance or Management",
];
const PROPERTY_VIEWS = [
  "Ocean View", "Beach View", "Lake View", "Mountain View", "City View / Skyline View",
  "Golf Course View", "Park / Greenbelt View", "Water View (General)", "River / Canal View",
  "Desert View", "Pool View", "Courtyard View", "Garden View", "Hills View",
  "Panoramic View", "Bay View", "Harbor View", "Marina View", "Forest / Woods View",
  "Pasture View", "No View / None",
];
const INTERIOR_FEATURES = [
  "Hardwood Floors", "Carpet", "Tile Floors", "Marble Floors", "Granite Countertops",
  "Quartz Countertops", "Stainless Steel Appliances", "Built-in Appliances",
  "Walk-in Closet", "Master Suite", "En-suite Bathroom", "Jacuzzi Tub", "Walk-in Shower",
  "Double Vanity", "Kitchen Island", "Breakfast Nook", "Formal Dining Room",
  "Family Room", "Home Office", "Mudroom", "Laundry Room", "Pantry", "Wine Cellar",
  "Home Theater", "Game Room", "Exercise Room", "Library/Study", "Fireplace",
  "Ceiling Fans", "Recessed Lighting", "Crown Molding", "Bay Windows", "Skylights",
  "French Doors", "Sliding Glass Doors", "Central Air Conditioning", "Central Heating",
  "Smart Home Features", "Security System", "Elevator", "Loft", "Basement", "Attic", "Storage Space",
];
const SITE_FEATURES = [
  "Corner Lot", "Cul-de-Sac", "Waterfront", "Greenbelt", "Paved Road",
  "Private Driveway", "Fenced Yard", "Swimming Pool", "Outdoor Kitchen",
  "Deck / Patio", "Solar Panels", "Sprinkler System", "Fruit Trees", "Shed / Workshop", "Guest House / ADU",
];
const LOT_FEATURES = [
  "Flat / Level", "Sloped", "Wooded", "Open", "Cleared", "Flood Zone",
  "Easement", "Corner", "Irregular Shape", "Rectangular", "Oversized", "Pie-shaped",
];
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
const BASEMENT_OPTS = [
  { value: "None", label: "None" }, { value: "Partial", label: "Partial" },
  { value: "Full", label: "Full" }, { value: "Finished", label: "Finished" },
  { value: "Unfinished", label: "Unfinished" }, { value: "Walk-out", label: "Walk-out" },
];
const SEWER_OPTS = [
  { value: "Public Sewer", label: "Public Sewer" }, { value: "Septic Tank", label: "Septic Tank" },
  { value: "Cesspool", label: "Cesspool" }, { value: "None", label: "None" },
];

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
  children,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="h-10 px-3 bg-[var(--surface-charcoal)] border border-[var(--line-soft)] text-[13px] text-[var(--ink)] focus:outline-none focus:border-[var(--gold-500)]/60 transition-colors"
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
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => {
        const active = selected.includes(item);
        return (
          <button
            key={item}
            type="button"
            onClick={() => onToggle(item)}
            className={`inline-flex items-center gap-1.5 h-9 px-3.5 text-[12px] tracking-wide border transition-all duration-200 ${
              active
                ? "bg-[var(--gold-500)]/15 border-[var(--gold-500)] text-[var(--accent-text)]"
                : "bg-[var(--surface-charcoal)] border-[var(--line-soft)] text-[var(--ink-soft)] hover:border-[var(--gold-500)]/50 hover:text-[var(--ink)]"
            }`}
          >
            {active && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--gold-500)]" />}
            {item}
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
    <div className="border border-[var(--line-soft)] bg-[var(--surface-obsidian)] mb-3">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3.5 px-4 text-left hover:bg-black/[0.02] transition-colors"
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

const MLSAdvanceSearch = ({
  open,
  onClose,
  onApply,
  handleSearch,
  searchFilters,
}: MLSAdvanceSearchProps) => {
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
  const [constructionStatus, setConstructionStatus] = useState("");
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
      setConstructionStatus(searchFilters.construction_status || "");
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

  const handleClear = () => {
    setGarageMin(""); setGarageMax("");
    setSqftMin(""); setSqftMax("");
    setLotMin(""); setLotMax("");
    setYearMin(""); setYearMax("");
    setStories("");
    setPropTypes([]); setPropStatuses([]);
    setAmenities([]); setViews([]);
    setInteriorFeats([]); setSiteFeats([]); setLotFeats([]);
    setConstructionStatus("");
    setBasement(""); setSewer("");
    const keys: (keyof typeof searchFilters)[] = [
      "property_type", "property_status", "community_amenities", "property_view",
      "interior_features", "mls_site_features", "mls_lot_feature",
      "garage_min", "garage_max", "square_footage_min", "square_footage_max",
      "lot_size_min", "lot_size_max", "year_built_min", "year_built_max",
      "stories", "construction_status", "mls_basement", "mls_sewer",
    ];
    keys.forEach(k => handleSearch("", k));
  };

  const totalActive =
    propTypes.length + propStatuses.length + amenities.length +
    views.length + interiorFeats.length + siteFeats.length + lotFeats.length +
    (garageMin || garageMax ? 1 : 0) + (sqftMin || sqftMax ? 1 : 0) +
    (lotMin || lotMax ? 1 : 0) + (yearMin || yearMax ? 1 : 0) +
    (stories ? 1 : 0) + (constructionStatus ? 1 : 0) +
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
            className="relative w-full max-w-3xl max-h-full flex flex-col bg-[var(--surface-ink)] border border-[var(--line-soft)] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]"
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
              <SectionTitle>Property Type</SectionTitle>
              <TagGroup
                items={PROPERTY_TYPES}
                selected={propTypes}
                onToggle={item => {
                  const next = propTypes.includes(item)
                    ? propTypes.filter(i => i !== item)
                    : [...propTypes, item];
                  setPropTypes(next);
                  handleSearch(next.join("|"), "property_type");
                }}
              />

              <Divider />

              <SectionTitle>Property Status</SectionTitle>
              <TagGroup
                items={PROPERTY_STATUSES}
                selected={propStatuses}
                onToggle={item => {
                  const next = propStatuses.includes(item)
                    ? propStatuses.filter(i => i !== item)
                    : [...propStatuses, item];
                  setPropStatuses(next);
                  handleSearch(next.join("|"), "property_status");
                }}
              />

              <Divider />

              <SectionTitle>Construction</SectionTitle>
              <TagGroup
                items={CONSTRUCTION_STATUSES}
                selected={constructionStatus ? [constructionStatus] : []}
                onToggle={item => {
                  const val = constructionStatus === item ? "" : item;
                  setConstructionStatus(val);
                  handleSearch(val, "construction_status");
                }}
              />

              <Divider />

              <SectionTitle>Size &amp; Space</SectionTitle>
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
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">Basement</label>
                  <Select
                    value={basement}
                    onChange={e => { setBasement(e.target.value); handleSearch(e.target.value, "mls_basement"); }}
                  >
                    <option value="">Any</option>
                    {BASEMENT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">Sewer</label>
                  <Select
                    value={sewer}
                    onChange={e => { setSewer(e.target.value); handleSearch(e.target.value, "mls_sewer"); }}
                  >
                    <option value="">Any</option>
                    {SEWER_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </div>
              </div>

              <Divider />

              <SectionTitle>Features &amp; Amenities</SectionTitle>

              <Accordion
                label="Community Amenities"
                count={amenities.length}
                open={openAcc === "amenities"}
                onToggle={() => setOpenAcc(openAcc === "amenities" ? null : "amenities")}
              >
                <TagGroup
                  items={COMMUNITY_AMENITIES}
                  selected={amenities}
                  onToggle={item => {
                    const next = amenities.includes(item)
                      ? amenities.filter(i => i !== item)
                      : [...amenities, item];
                    setAmenities(next);
                    handleSearch(next.join("|"), "community_amenities");
                  }}
                />
              </Accordion>

              <Accordion
                label="Property View"
                count={views.length}
                open={openAcc === "views"}
                onToggle={() => setOpenAcc(openAcc === "views" ? null : "views")}
              >
                <TagGroup
                  items={PROPERTY_VIEWS}
                  selected={views}
                  onToggle={item => {
                    const next = views.includes(item)
                      ? views.filter(i => i !== item)
                      : [...views, item];
                    setViews(next);
                    handleSearch(next.join("|"), "property_view");
                  }}
                />
              </Accordion>

              <Accordion
                label="Interior Features"
                count={interiorFeats.length}
                open={openAcc === "interior"}
                onToggle={() => setOpenAcc(openAcc === "interior" ? null : "interior")}
              >
                <TagGroup
                  items={INTERIOR_FEATURES}
                  selected={interiorFeats}
                  onToggle={item => {
                    const next = interiorFeats.includes(item)
                      ? interiorFeats.filter(i => i !== item)
                      : [...interiorFeats, item];
                    setInteriorFeats(next);
                    handleSearch(next.join("|"), "interior_features");
                  }}
                />
              </Accordion>

              <Accordion
                label="Site Features"
                count={siteFeats.length}
                open={openAcc === "site"}
                onToggle={() => setOpenAcc(openAcc === "site" ? null : "site")}
              >
                <TagGroup
                  items={SITE_FEATURES}
                  selected={siteFeats}
                  onToggle={item => {
                    const next = siteFeats.includes(item)
                      ? siteFeats.filter(i => i !== item)
                      : [...siteFeats, item];
                    setSiteFeats(next);
                    handleSearch(next.join("|"), "mls_site_features");
                  }}
                />
              </Accordion>

              <Accordion
                label="Lot Features"
                count={lotFeats.length}
                open={openAcc === "lot"}
                onToggle={() => setOpenAcc(openAcc === "lot" ? null : "lot")}
              >
                <TagGroup
                  items={LOT_FEATURES}
                  selected={lotFeats}
                  onToggle={item => {
                    const next = lotFeats.includes(item)
                      ? lotFeats.filter(i => i !== item)
                      : [...lotFeats, item];
                    setLotFeats(next);
                    handleSearch(next.join("|"), "mls_lot_feature");
                  }}
                />
              </Accordion>
            </div>

            <div className="flex items-center justify-between gap-3 px-6 md:px-8 py-4 border-t border-[var(--line-soft)] bg-[var(--surface-obsidian)]">
              <button
                type="button"
                onClick={handleClear}
                className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--ink-soft)] hover:text-[var(--accent-text)] transition-colors"
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
