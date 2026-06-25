import type {
  PropertyAttribution,
  PropertyCompliance,
  PropertyDetails,
  PropertyMedia,
  PropertyOpenHouse,
  PropertySpecRow,
} from "@/types/Property";
import {
  formatList,
  formatLotSize,
  formatPrice,
  formatSqft,
  normalizeListValue,
  pickValue,
  toBool,
  toNumber,
} from "@/helpers/propertyNormalize";

type AnyRecord = Record<string, any>;

/** Keep only rows that have a displayable value. */
const presentRows = (rows: PropertySpecRow[]): PropertySpecRow[] =>
  rows.filter(
    (r) => r.value !== null && r.value !== undefined && r.value !== ""
  );

const boolToLabel = (value: boolean | null): string | null =>
  value === null ? null : value ? "Yes" : "No";

/**
 * Map a raw IDX/MLS property payload (the inner `data` object) into a clean,
 * type-safe model the UI can render directly.
 *
 * Strategy: prefer the new structured `data.sections.*` values, then fall back
 * to `data.summary`, `data.address`, `data.media`, and finally legacy
 * top-level / RESO PascalCase fields — never breaking existing listings.
 */
export function normalizePropertyDetails(raw: unknown): PropertyDetails {
  const data: AnyRecord = (raw && typeof raw === "object" ? raw : {}) as AnyRecord;

  const sections: AnyRecord = data.sections ?? {};
  const summary: AnyRecord = data.summary ?? {};
  const address: AnyRecord = data.address ?? {};
  const media: AnyRecord = data.media ?? {};

  const h: AnyRecord = sections.highlights ?? {};
  const i: AnyRecord = sections.interior ?? {};
  const e: AnyRecord = sections.exterior ?? {};
  const p: AnyRecord = sections.parking ?? {};
  const s: AnyRecord = sections.schools ?? {};
  const b: AnyRecord = sections.building ?? {};
  const f: AnyRecord = sections.financial ?? {};
  const u: AnyRecord = sections.utilities ?? {};

  /* ---------------- Header / summary ---------------- */
  const price = toNumber(pickValue(f.list_price, summary.price, data.price));
  const beds = toNumber(
    pickValue(i.bedrooms, summary.beds, data.beds, data.BedroomsTotal)
  );
  const baths = toNumber(
    pickValue(summary.baths, data.baths, data.BathroomsTotalInteger)
  );
  const livingAreaSqft = toNumber(
    pickValue(
      summary.living_area_sqft,
      b.sqft_finished,
      data.bua,
      data.LivingArea
    )
  );
  const daysOnSite = toNumber(
    pickValue(data.Days_On_Site, data.DaysOnSite, data.dom)
  );

  const addressFull =
    (pickValue<string>(address.full, data.title, data.address as string) ??
      null);

  const statusValue = pickValue<string>(
    data.status,
    data.property_status,
    data.mls_status,
    data.MlsStatus
  );

  // Exclude any tag that merely repeats the status (e.g. "Active") so the
  // header doesn't render a duplicate badge.
  const tags: string[] = Array.isArray(data.tags)
    ? data.tags.filter(
        (t: unknown): t is string =>
          typeof t === "string" &&
          t.trim().length > 0 &&
          t.trim().toLowerCase() !== (statusValue ?? "").trim().toLowerCase()
      )
    : [];

  /* ---------------- Highlights ---------------- */
  const highlights = presentRows([
    {
      label: "Property Type",
      value: pickValue<string>(
        h.property_type,
        summary.property_type,
        data.PropertySubType,
        data.property_type,
        data.category
      ),
    },
    {
      label: "Lot Size",
      value: formatLotSize(
        pickValue(h.lot_size_acres, summary.lot_size_acres, data.LotSizeAcres),
        pickValue(h.lot_size_sqft, summary.lot_size_sqft, data.LotSizeSquareFeet)
      ),
    },
    {
      label: "Year Built",
      value: numToStr(pickValue(h.year_built, summary.year_built, data.YearBuilt)),
    },
    { label: "County", value: pickValue<string>(h.county, address.county, data.county) },
    {
      label: "State",
      value: pickValue<string>(h.state, address.state, data.mls_state, data.state),
    },
    {
      label: "City",
      value: pickValue<string>(h.city, address.city, data.mls_city, data.city),
    },
    {
      label: "Neighborhood",
      value: pickValue<string>(
        h.neighborhood,
        address.neighborhood,
        data.SubdivisionName,
        data.location_id
      ),
    },
  ]);

  /* ---------------- Interior ---------------- */
  const interior = presentRows([
    {
      label: "Bedrooms",
      value: numToStr(pickValue(i.bedrooms, summary.beds, data.beds, data.BedroomsTotal)),
    },
    {
      label: "Bedrooms Possible",
      value: numToStr(pickValue(i.bedrooms_possible, data.BedroomsPossible)),
    },
    {
      label: "Bathrooms Full",
      value: numToStr(pickValue(i.bathrooms_full, summary.baths_full, data.BathroomsFull)),
    },
    {
      label: "Bathrooms Half",
      value: numToStr(pickValue(i.bathrooms_half, summary.baths_half, data.BathroomsHalf)),
    },
    {
      label: "Appliances",
      value: formatList(
        pickValue(i.appliances, data.NWM_AppliancesIncluded, data.Inclusions)
      ),
    },
    {
      label: "Interior Features",
      value: formatList(
        pickValue(i.interior_features, data.interior_features, data.InteriorFeatures)
      ),
    },
    { label: "Flooring", value: formatList(pickValue(i.flooring, data.Flooring)) },
    {
      label: "Fireplace",
      value: resolveFireplace(i.fireplace, data),
    },
    {
      label: "Furnishing",
      value: pickValue<string>(i.furnishing, data.furnishing, data.Furnished),
    },
  ]);

  /* ---------------- Exterior ---------------- */
  const waterfront =
    sections.exterior && "waterfront" in e
      ? toBool(e.waterfront)
      : data.WaterfrontYN !== undefined
        ? toBool(data.WaterfrontYN)
        : null;

  const exterior = presentRows([
    {
      label: "Exterior Features",
      value: formatList(pickValue(e.exterior_features, data.ExteriorFeatures)),
    },
    {
      label: "Lot Features",
      value: formatList(pickValue(e.lot_features, data.LotFeatures)),
    },
    {
      label: "Lot Size",
      value: formatLotSize(
        pickValue(e.lot_size_acres, h.lot_size_acres, summary.lot_size_acres, data.LotSizeAcres),
        pickValue(e.lot_size_sqft, h.lot_size_sqft, summary.lot_size_sqft, data.LotSizeSquareFeet)
      ),
    },
    {
      label: "View",
      value: formatList(pickValue(e.view, data.view, data.View, data.views)),
    },
    { label: "Waterfront", value: boolToLabel(waterfront) },
    {
      label: "Site Features",
      value: formatList(pickValue(e.site_features, data.NWM_SiteFeatures)),
    },
    {
      label: "Community Amenities",
      value: formatList(data.community_amenities),
    },
  ]);

  /* ---------------- Parking ---------------- */
  const garageFlag =
    "garage" in p
      ? toBool(p.garage)
      : data.GarageYN !== undefined
        ? toBool(data.GarageYN)
        : null;

  const parking = presentRows([
    { label: "Garage", value: boolToLabel(garageFlag) },
    {
      label: "Garage Spaces",
      value: numToStr(pickValue(p.garage_spaces, data.GarageSpaces)),
    },
    {
      label: "Covered Spaces",
      value: numToStr(pickValue(p.covered_spaces, data.CoveredSpaces)),
    },
    {
      label: "Parking Total",
      value: formatList(pickValue(p.parking_total, data.ParkingTotal, data.parking)),
    },
    {
      label: "Parking Features",
      value: formatList(pickValue(p.parking_features, data.ParkingFeatures)),
    },
  ]);

  /* ---------------- Schools ---------------- */
  const schools = presentRows([
    {
      label: "School District",
      value: pickValue<string>(s.school_district, data.HighSchoolDistrict),
    },
    {
      label: "Elementary",
      value: pickValue<string>(s.elementary, data.ElementarySchool),
    },
    {
      label: "Middle School",
      value: pickValue<string>(s.middle_school, data.MiddleOrJuniorSchool),
    },
    {
      label: "High School",
      value: pickValue<string>(s.high_school, data.HighSchool),
    },
  ]);

  /* ---------------- Building ---------------- */
  const building = presentRows([
    { label: "Style", value: formatList(pickValue(b.style, data.ArchitecturalStyle)) },
    {
      label: "Structure",
      value: formatList(pickValue(b.structure, data.StructureType)),
    },
    { label: "Levels", value: formatList(pickValue(b.levels, data.Levels)) },
    {
      label: "Year Built",
      value: numToStr(pickValue(b.year_built, summary.year_built, data.mls_YearBuilt, data.YearBuilt)),
    },
    {
      label: "Sq Ft Finished",
      value: formatSqft(
        pickValue(b.sqft_finished, summary.living_area_sqft, data.NWM_SquareFootageFinished)
      ),
    },
    { label: "Roof", value: formatList(pickValue(b.roof, data.Roof)) },
    {
      label: "Condition",
      value: formatList(pickValue(b.condition, data.PropertyCondition)),
    },
    {
      label: "Foundation",
      value: formatList(pickValue(b.foundation, data.FoundationDetails)),
    },
  ]);

  /* ---------------- Financial ---------------- */
  const taxAmount = toNumber(pickValue(f.annual_tax, data.TaxAnnualAmount));
  const taxYear = pickValue(f.tax_year, data.TaxYear);
  const hoaFee = toNumber(pickValue(f.hoa_fee, data.AssociationFee));
  const hoaFreq = pickValue<string>(f.hoa_fee_frequency, data.AssociationFeeFrequency);

  const financial = presentRows([
    {
      label: "List Price",
      value: formatPrice(pickValue(f.list_price, summary.price, data.price)),
    },
    {
      label: "Original Price",
      value: formatPrice(pickValue(f.original_price, data.OriginalListPrice)),
    },
    {
      label: "Annual Tax",
      value:
        taxAmount === null
          ? null
          : `$${taxAmount.toLocaleString("en-US")}${taxYear ? ` (${taxYear})` : ""}`,
    },
    {
      label: "HOA Fee",
      value:
        hoaFee === null
          ? null
          : `$${hoaFee.toLocaleString("en-US")}${hoaFreq ? ` / ${hoaFreq}` : ""}`,
    },
    {
      label: "Listing Terms",
      value: formatList(pickValue(f.listing_terms, data.ListingTerms)),
    },
    {
      label: "Possession",
      value: formatList(pickValue(f.possession, data.Possession)),
    },
    {
      label: "Special Conditions",
      value: formatList(pickValue(f.special_conditions, data.SpecialListingConditions)),
    },
  ]);

  /* ---------------- Utilities ---------------- */
  let cooling = formatList(pickValue(u.cooling, data.Cooling));
  if (!cooling && data.CoolingYN !== undefined) {
    const c = toBool(data.CoolingYN);
    cooling = c === null ? null : c ? "Yes" : null;
  }

  const utilities = presentRows([
    { label: "Sewer", value: formatList(pickValue(u.sewer, data.Sewer)) },
    {
      label: "Water Source",
      value: formatList(pickValue(u.water_source, data.WaterSource)),
    },
    { label: "Power", value: formatList(pickValue(u.power, data.PowerProductionType)) },
    { label: "Heating", value: formatList(pickValue(u.heating, data.Heating)) },
    { label: "Cooling", value: cooling },
  ]);

  /* ---------------- Attribution ---------------- */
  const mlsAttr: AnyRecord = data.mls_attribute ?? {};
  const legacyAttr: AnyRecord =
    data.listing_description && typeof data.listing_description === "object"
      ? data.listing_description
      : {};
  const listedWith = pickValue<string>(mlsAttr.listed_with, legacyAttr.listed_with);
  const fullName = pickValue<string>(mlsAttr.full_name);
  const attribution: PropertyAttribution = {
    logo: pickValue<string>(mlsAttr.logo, legacyAttr.logo),
    name: pickValue<string>(mlsAttr.name, legacyAttr.mls_name),
    fullName,
    listedWith,
    officeTag: pickValue<string>(
      mlsAttr.officetag,
      listedWith ? `Listed by ${listedWith}` : null
    ),
    mlsTag: pickValue<string>(
      mlsAttr.mlstag,
      fullName ? `Provided courtesy of ${fullName}` : null
    ),
  };

  /* ---------------- Listing details ---------------- */
  const agent: AnyRecord = data.agent ?? {};
  const listingDetails = presentRows([
    { label: "MLS Listing ID", value: pickValue<string>(data.mls_listingid, data.listing_id) },
    {
      label: "MLS Status",
      value: pickValue<string>(data.MlsStatus, data.mls_status, data.status, data.property_status),
    },
    { label: "Listed Date", value: pickValue<string>(data.ListingContractDate) },
    { label: "Days on Market", value: numToStr(daysOnSite) },
    {
      label: "MLS Source",
      value: pickValue<string>(data.listing_source, data.OriginatingSystemName, attribution.name),
    },
    { label: "Listing Office", value: pickValue<string>(data.ListOfficeName, attribution.listedWith) },
    { label: "Office Phone", value: pickValue<string>(data.ListOfficePhone) },
    {
      label: "Listing Agent",
      value: pickValue<string>(data.mls_list_agent, agent.name),
    },
    { label: "Parcel #", value: pickValue<string>(data.ParcelNumber) },
    { label: "MLS Area", value: pickValue<string>(data.MLSAreaMajor) },
  ]);

  /* ---------------- Media ---------------- */
  const coverPhoto = pickValue<string>(media.cover_photo, data.cover_photo);
  const rawImages: string[] = (
    (Array.isArray(media.images) && media.images) ||
    (Array.isArray(data.images) && data.images) ||
    (Array.isArray(data.photos) && data.photos) ||
    []
  ).filter((x: unknown): x is string => typeof x === "string" && x.length > 0);
  const images =
    coverPhoto && !rawImages.includes(coverPhoto)
      ? [coverPhoto, ...rawImages]
      : rawImages;
  const mediaModel: PropertyMedia = {
    coverPhoto: coverPhoto ?? null,
    images,
    virtualTourUrl: pickValue<string>(media.virtual_tour_url, data.VirtualTourURLUnbranded),
  };

  /* ---------------- Compliance ---------------- */
  const compliance = resolveCompliance(data);

  /* ---------------- Open houses ---------------- */
  const openHouses = normalizeOpenHouses(data.OpenHouse);

  /* ---------------- Geo / misc ---------------- */
  const latitude = toNumber(pickValue(address.latitude, data.latitude));
  const longitude = toNumber(pickValue(address.longitude, data.longitude));

  return {
    id: pickValue<string>(data.id),
    listingId: pickValue<string>(data.listing_id, data.mls_listingid),
    listingKey: pickValue<string>(data.listing_key, data.mls_listingkey),

    title: pickValue<string>(data.title, addressFull),
    address: addressFull,
    status: statusValue,
    daysOnSite,
    tags,

    price,
    beds,
    baths,
    livingAreaSqft,

    description: pickValue<string>(data.description, data.PublicRemarks),

    highlights,
    interior,
    exterior,
    parking,
    schools,
    building,
    financial,
    utilities,
    listingDetails,

    media: mediaModel,
    compliance,
    attribution,
    openHouses,

    latitude,
    longitude,
    taxAnnualAmount: taxAmount,

    raw: data,
  };
}

/* ─────────────── internal helpers ─────────────── */

function numToStr(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return String(value);
  return String(value);
}

function resolveFireplace(sectionValue: unknown, data: AnyRecord): string | null {
  const fromSection = formatList(sectionValue);
  if (fromSection) return fromSection;
  const fromLegacy = formatList(data.FireplaceFeatures);
  if (fromLegacy) return fromLegacy;
  const yn = toBool(data.FireplaceYN);
  if (yn === true) return "Yes";
  return null;
}

function resolveCompliance(data: AnyRecord): PropertyCompliance {
  const c: AnyRecord | undefined =
    data.compliance && typeof data.compliance === "object" ? data.compliance : undefined;

  const legacyAddress =
    data.InternetAddressDisplayYN === 1 ||
    data.InternetAddressDisplayYN === "1" ||
    data.InternetAddressDisplayYN === undefined;

  const legacyValuation =
    data.InternetAutomatedValuationDisplayYN !== false &&
    data.InternetAutomatedValuationDisplayYN !== "false" &&
    data.InternetAutomatedValuationDisplayYN !== 0 &&
    data.InternetAutomatedValuationDisplayYN !== "0";

  const legacyMap = toBool(data.NWM_ShowMapLink) !== false;

  const mustRemovePhotos =
    data.NWM_IDXMustRemovePhotosYN === true ||
    data.NWM_IDXMustRemovePhotosYN === "true";

  const mustRemoveTour =
    data.NWM_IDXMustRemoveVirtualTourYN === true ||
    data.NWM_IDXMustRemoveVirtualTourYN === "true";

  return {
    canDisplayListing: c?.canDisplayListing ?? true,
    canShowAddress: c?.canShowAddress ?? legacyAddress,
    canShowValuation: c?.canShowValuation ?? legacyValuation,
    canShowMap: c?.canShowMap ?? legacyMap,
    canShowPrimaryPhoto: c?.canShowPrimaryPhoto ?? !mustRemovePhotos,
    canShowExtraPhotos: c?.canShowExtraPhotos ?? !mustRemovePhotos,
    canShowVirtualTour: c?.canShowVirtualTour ?? !mustRemoveTour,
  };
}

function normalizeOpenHouses(input: unknown): PropertyOpenHouse[] {
  if (!Array.isArray(input) || input.length === 0) return [];
  const now = Date.now();

  return input
    .map((o: AnyRecord): PropertyOpenHouse => {
      const refreshments =
        typeof o.refreshments === "string" &&
        o.refreshments.trim() &&
        o.refreshments.trim().toLowerCase() !== "none"
          ? o.refreshments.trim()
          : null;
      return {
        key: pickValue<string>(o.open_house_key),
        type: pickValue<string>(o.type),
        status: pickValue<string>(o.status),
        date: pickValue<string>(o.date),
        startTime: pickValue<string>(o.start_time),
        endTime: pickValue<string>(o.end_time),
        remarks: pickValue<string>(o.remarks),
        refreshments,
        virtualOpenHouseUrl: pickValue<string>(o.virtual_open_house_url),
        virtualTourUrl: pickValue<string>(o.virtual_tour_url),
      };
    })
    .filter((o) => o.date || o.startTime || o.endTime)
    .filter((o) => {
      const end = o.endTime || o.startTime || o.date;
      if (!end) return true;
      const t = new Date(end).getTime();
      return Number.isNaN(t) ? true : t >= now;
    })
    .sort((a, b) => {
      const ta = new Date(a.startTime || a.date || 0).getTime();
      const tb = new Date(b.startTime || b.date || 0).getTime();
      return (Number.isNaN(ta) ? 0 : ta) - (Number.isNaN(tb) ? 0 : tb);
    });
}

// Referenced to keep the public list-normalizer importable from one module.
export { normalizeListValue };
