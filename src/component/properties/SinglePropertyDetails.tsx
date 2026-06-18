"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiPhone,
  FiMail,
  FiMapPin,
  FiEdit2,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

import { useNameContext } from "../NameProvider";
import {
  postUserPropertyWishlist,
  removeWishlistItem,
} from "@/services/profile/ProfileServices";
import { useUserWishlist } from "@/services/profile/ProfileQueries";
import { PropertyEnquiryModal } from "./PropertyEnquiryModal";
import { SharePopup } from "./SharePopup";
import LoginModal from "@/main-pages/auth/LoginModal";

const LocalInformation = dynamic(() => import("./LocalInformation"), {
  ssr: false,
});

const canPinOnMap = (value: unknown): boolean => {
  if (value === false || value === 0) return false;
  if (typeof value === "string") {
    const n = value.trim().toLowerCase();
    return n !== "false" && n !== "0";
  }
  return true;
};

interface Props {
  property?: any;
}

const parseJsonArray = (val: any): string => {
  if (val === null || val === undefined || val === "") return "—";
  let base = "";
  if (Array.isArray(val)) base = val.join(", ");
  else if (typeof val === "string") {
    try {
      const p = JSON.parse(val);
      if (Array.isArray(p)) base = p.join(", ");
      else base = val;
    } catch {
      base = val;
    }
  } else base = String(val);
  return base.replace(/,([^\s\n])/g, ", $1");
};

export const SinglePropertyDetails = ({ property: prop }: Props) => {
  const property = prop;
  const queryClient = useQueryClient();
  const { name, profile_image, phone, email } = useNameContext();
  const { data: wishlistData } = useUserWishlist();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);
  const [disclaimerUpdatedAt, setDisclaimerUpdatedAt] = useState<Date>(
    () => new Date()
  );

  // Mortgage calculator
  const [mortgageHomePrice, setMortgageHomePrice] = useState<number>(0);
  const [mortgageLoanYears, setMortgageLoanYears] = useState<number>(30);
  const [mortgageRate, setMortgageRate] = useState<number>(5.91);
  const [mortgageDownPct, setMortgageDownPct] = useState<number>(20);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [loanDropdownOpen, setLoanDropdownOpen] = useState(false);
  const [tempRate, setTempRate] = useState<number>(5.91);
  const [tempYears, setTempYears] = useState<number>(30);

  /* -------- Wishlist sync -------- */
  useEffect(() => {
    if (property && wishlistData?.data) {
      const items = wishlistData.data || [];
      const matched = items.find(
        (w: any) =>
          (w.listing_key &&
            (w.listing_key === property.mls_listingkey ||
              w.listing_key === property.id)) ||
          (w.listing_id &&
            (w.listing_id === property.mls_listingid ||
              w.listing_id === property.lid))
      );
      if (matched) {
        setIsFavorited(true);
        setWishlistItemId(matched.id ? String(matched.id) : null);
      } else {
        setIsFavorited(false);
        setWishlistItemId(null);
      }
    } else if (property?.is_wishlisted) {
      setIsFavorited(true);
    }
  }, [property, wishlistData]);

  const postWishlistMutation = useMutation({
    mutationFn: (data: any) => postUserPropertyWishlist(data),
    onSuccess: (data: any) => {
      setIsFavorited(true);
      setIsAddingToFavorites(false);
      if (data?.data?.id) setWishlistItemId(String(data.data.id));
      toast.success("Saved to favorites", {
        style: {
          background: "#14171d",
          color: "#fff",
          border: "1px solid #edb75e",
        },
        iconTheme: { primary: "#edb75e", secondary: "#0b0c0f" },
      });
      queryClient.invalidateQueries({ queryKey: ["userWishlistInfo"] });
      queryClient.invalidateQueries({ queryKey: ["mlsProperties"] });
    },
    onError: () => {
      setIsAddingToFavorites(false);
      toast.error("Failed to save");
    },
  });

  const removeWishlistMutation = useMutation({
    mutationFn: (id: string) => removeWishlistItem(id),
    onSuccess: () => {
      setIsFavorited(false);
      setIsAddingToFavorites(false);
      setWishlistItemId(null);
      toast.success("Removed from favorites", {
        style: {
          background: "#14171d",
          color: "#fff",
          border: "1px solid #edb75e",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["userWishlistInfo"] });
      queryClient.invalidateQueries({ queryKey: ["mlsProperties"] });
    },
    onError: () => {
      setIsAddingToFavorites(false);
      toast.error("Failed to remove");
    },
  });

  const handleToggleFavorites = () => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return setIsLoginModalOpen(true);
    if (isAddingToFavorites) return;

    if (isFavorited && wishlistItemId) {
      setIsAddingToFavorites(true);
      removeWishlistMutation.mutate(wishlistItemId);
      return;
    }

    setIsAddingToFavorites(true);
    postWishlistMutation.mutate({
      listing_id: property?.mls_listingid || property?.lid,
      listing_key: property?.mls_listingkey || property?.id,
      agent_id: 12,
      user_id: sessionStorage.getItem("customer_id"),
      uuid: process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID,
    });
  };

  /* -------- Initial mortgage seed + disclaimer tick -------- */
  useEffect(() => {
    if (property?.price) setMortgageHomePrice(Number(property.price));
  }, [property?.price]);

  useEffect(() => {
    const id = window.setInterval(
      () => setDisclaimerUpdatedAt(new Date()),
      30 * 60 * 1000
    );
    return () => window.clearInterval(id);
  }, []);

  /* -------- Mortgage math -------- */
  const mortgage = useMemo(() => {
    const downAmt = Math.round(mortgageHomePrice * (mortgageDownPct / 100));
    const loan = mortgageHomePrice - downAmt;
    const monthlyRate = mortgageRate / 100 / 12;
    const n = mortgageLoanYears * 12;
    const pi =
      monthlyRate === 0
        ? loan / n
        : (loan * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
          (Math.pow(1 + monthlyRate, n) - 1);
    const monthlyTax = property?.TaxAnnualAmount
      ? Number(property.TaxAnnualAmount) / 12
      : 0;
    const total = pi + monthlyTax;
    return { downAmt, loan, pi, monthlyTax, total };
  }, [
    mortgageHomePrice,
    mortgageDownPct,
    mortgageRate,
    mortgageLoanYears,
    property?.TaxAnnualAmount,
  ]);

  const donutR = 80;
  const circumference = 2 * Math.PI * donutR;
  const taxFraction = mortgage.total > 0 ? mortgage.monthlyTax / mortgage.total : 0;
  const taxDash = taxFraction * circumference;
  const piDash = circumference - taxDash;

  /* -------- Helpers -------- */
  const formattedPhone = phone
    ? typeof phone === "string"
      ? phone
      : typeof phone === "object" && phone !== null
        ? `${(phone as any).code || ""}${(phone as any).number || ""}`
        : null
    : null;
  const hasEmail = typeof email === "string" ? email.trim().length > 0 : Boolean(email);
  const hasPhone =
    typeof formattedPhone === "string"
      ? formattedPhone.trim().length > 0
      : Boolean(formattedPhone);

  const formattedMlsUpdated = `Data last updated ${disclaimerUpdatedAt.toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" }
  )} at ${disclaimerUpdatedAt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;

  const showMortgageCalculator =
    property?.InternetAutomatedValuationDisplayYN !== false &&
    property?.InternetAutomatedValuationDisplayYN !== "false" &&
    property?.InternetAutomatedValuationDisplayYN !== 0 &&
    property?.InternetAutomatedValuationDisplayYN !== "0";

  const showPropertyMap = canPinOnMap(property?.NWM_ShowMapLink);

  const showVirtualTour =
    property?.VirtualTourURLUnbranded &&
    property?.NWM_IDXMustRemoveVirtualTourYN !== false &&
    property?.NWM_IDXMustRemoveVirtualTourYN !== "false" &&
    property?.NWM_IDXMustRemoveVirtualTourYN !== 0 &&
    property?.NWM_IDXMustRemoveVirtualTourYN !== "0";

  const showAddress =
    property?.InternetAddressDisplayYN === 1 ||
    property?.InternetAddressDisplayYN === "1" ||
    property?.InternetAddressDisplayYN === undefined;

  if (!property) return null;

  /* -------- Spec card data -------- */
  const interior: SpecRow[] = [
    { label: "Bedrooms", value: property.beds || property.BedroomsTotal },
    {
      label: "Bedrooms Possible",
      value: property.BedroomsPossible || property.beds,
    },
    {
      label: "Bathrooms Full",
      value: property.BathroomsFull || property.baths,
    },
    { label: "Bathrooms Half", value: property.BathroomsHalf || "0" },
    {
      label: "Appliances",
      value: parseJsonArray(
        property.NWM_AppliancesIncluded || property.Inclusions
      ),
    },
    {
      label: "Interior Features",
      value: parseJsonArray(property.InteriorFeatures),
    },
    { label: "Flooring", value: parseJsonArray(property.Flooring) },
    {
      label: "Fireplace",
      value:
        property.FireplaceYN === "1"
          ? parseJsonArray(property.FireplaceFeatures)
          : "None",
    },
    { label: "Furnishing", value: property.furnishing || property.Furnished },
  ];

  const exterior: SpecRow[] = [
    {
      label: "Exterior Features",
      value: parseJsonArray(property.ExteriorFeatures),
    },
    { label: "Lot Features", value: parseJsonArray(property.LotFeatures) },
    {
      label: "Lot Size",
      value: property.LotSizeAcres
        ? `${property.LotSizeAcres} ac · ${Number(
            property.LotSizeSquareFeet || 0
          ).toLocaleString()} sq ft`
        : null,
    },
    { label: "View", value: parseJsonArray(property.View || property.views) },
    {
      label: "Waterfront",
      value: property.WaterfrontYN === "1" ? "Yes" : "No",
    },
    {
      label: "Site Features",
      value: parseJsonArray(property.NWM_SiteFeatures),
    },
  ];

  const garage: SpecRow[] = [
    { label: "Garage", value: property.GarageYN === "1" ? "Yes" : "No" },
    { label: "Garage Spaces", value: property.GarageSpaces },
    { label: "Covered Spaces", value: property.CoveredSpaces },
    { label: "Parking Total", value: property.ParkingTotal || property.parking },
    {
      label: "Parking Features",
      value: parseJsonArray(property.ParkingFeatures),
    },
  ];

  const schools: SpecRow[] = [
    { label: "School District", value: property.HighSchoolDistrict },
    { label: "Elementary", value: property.ElementarySchool },
    { label: "Middle School", value: property.MiddleOrJuniorSchool },
    { label: "High School", value: property.HighSchool },
  ];

  const building: SpecRow[] = [
    { label: "Style", value: parseJsonArray(property.ArchitecturalStyle) },
    { label: "Structure", value: parseJsonArray(property.StructureType) },
    { label: "Levels", value: parseJsonArray(property.Levels) },
    { label: "Year Built", value: property.mls_YearBuilt },
    {
      label: "Sq Ft Finished",
      value: property.NWM_SquareFootageFinished
        ? `${Number(property.NWM_SquareFootageFinished).toLocaleString()} sq ft`
        : null,
    },
    { label: "Roof", value: parseJsonArray(property.Roof) },
    { label: "Condition", value: parseJsonArray(property.PropertyCondition) },
    {
      label: "Foundation",
      value: parseJsonArray(property.FoundationDetails),
    },
  ];

  const financial: SpecRow[] = [
    {
      label: "List Price",
      value: property.price ? `$${Number(property.price).toLocaleString()}` : null,
    },
    {
      label: "Original Price",
      value: property.OriginalListPrice
        ? `$${Number(property.OriginalListPrice).toLocaleString()}`
        : null,
    },
    {
      label: "Annual Tax",
      value: property.TaxAnnualAmount
        ? `$${Number(property.TaxAnnualAmount).toLocaleString()}${property.TaxYear ? ` (${property.TaxYear})` : ""}`
        : null,
    },
    {
      label: "HOA Fee",
      value: property.AssociationFee
        ? `$${Number(property.AssociationFee).toLocaleString()} / ${property.AssociationFeeFrequency || "period"}`
        : "None",
    },
    { label: "Listing Terms", value: parseJsonArray(property.ListingTerms) },
    { label: "Possession", value: parseJsonArray(property.Possession) },
    {
      label: "Special Conditions",
      value: parseJsonArray(property.SpecialListingConditions),
    },
  ];

  const utilities: SpecRow[] = [
    { label: "Sewer", value: parseJsonArray(property.Sewer) },
    { label: "Water Source", value: parseJsonArray(property.WaterSource) },
    { label: "Power", value: parseJsonArray(property.PowerProductionType) },
    { label: "Heating", value: parseJsonArray(property.Heating) },
    {
      label: "Cooling",
      value:
        property.CoolingYN === "1"
          ? "Yes"
          : parseJsonArray(property.Cooling) || null,
    },
  ];

  const listingDetails: SpecRow[] = [
    { label: "MLS Listing ID", value: property.mls_listingid },
    { label: "MLS Status", value: property.MlsStatus || property.status },
    { label: "Listed Date", value: property.ListingContractDate },
    {
      label: "Days on Market",
      value: property.DaysOnSite
        ? String(property.DaysOnSite)
        : null,
    },
    {
      label: "MLS Source",
      value: property.listing_source || property.OriginatingSystemName,
    },
    { label: "Listing Office", value: property.ListOfficeName },
    { label: "Office Phone", value: property.ListOfficePhone },
    { label: "Listing Agent", value: property.mls_list_agent },
    { label: "Parcel #", value: property.ParcelNumber },
    { label: "MLS Area", value: property.MLSAreaMajor },
  ];

  const highlights: SpecRow[] = [
    {
      label: "Property Type",
      value:
        property.PropertySubType ||
        property.property_type ||
        property.category,
    },
    {
      label: "Lot Size",
      value: property.LotSizeAcres
        ? `${property.LotSizeAcres} acres`
        : property.LotSizeSquareFeet
          ? `${Number(property.LotSizeSquareFeet).toLocaleString()} sq ft`
          : null,
    },
    { label: "Year Built", value: property.YearBuilt },
    { label: "County", value: property.county  },
    { label: "State", value: property.mls_state || property.state },
    { label: "City", value: property.mls_city || property.city },
    {
      label: "Neighborhood",
      value: property.SubdivisionName || property.location_id,
    },
    // {
    //   label: "Listing ID",
    //   value: property.ListingId
    //     ? String(property.ListingId)
    //     : property.idd
    //       ? String(property.idd)
    //       : property.ref,
    // },
  ];

  return (
    <>
      <section className="container-wide pb-20 pt-2">
        {/* ---- Header ---- */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-8">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--gold-500)] bg-[var(--gold-500)]/10 border border-[var(--gold-500)]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-500)] animate-pulse" />
                {property.status || property.MlsStatus || "Active"}
              </span>
              {(property.DaysOnSite|| property.dom) && (
                <span className="inline-flex items-center gap-2 text-[12px] text-white/55">
                  <FiClock size={12} />
                  {property.DaysOnSite || property.dom} days on
                  market
                </span>
              )}
            </div>

            <h1 className="font-sans font-bold text-[clamp(2.6rem,3.5vw+1rem,4.1rem)] leading-[1.05] tracking-[-0.025em] text-[var(--gold-500)]">
              {property.price
                ? `$${Number(property.price).toLocaleString()}`
                : "Price upon request"}
            </h1>

            {showAddress && property.address && (
              <p className="flex items-start gap-2 text-[22px] text-white/72 font-sans font-semibold">
                <FiMapPin
                  size={22}
                  className="mt-1 text-[var(--gold-500)] shrink-0"
                />
                {String(property.address).replace(/±/g, "#")}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-stretch divide-x divide-[var(--line-soft)] border border-[var(--line-soft)] bg-[var(--surface-obsidian)]">
            <Stat
              value={property.beds || property.BedroomsTotal || "0"}
              label="Beds"
            />
            <Stat
              value={property.baths || property.BathroomsTotalInteger || "0"}
              label="Baths"
            />
            <Stat
              value={
                property.bua
                  ? Number(property.bua).toLocaleString()
                  : property.LivingArea
                    ? Number(property.LivingArea).toLocaleString()
                    : "0"
              }
              label="Sqft"
            />
          </div>
        </div>

        {/* ---- Body grid ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-10">
          {/* Main column */}
          <div className="flex flex-col gap-8 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Description">
                <p className="text-[15px] leading-[1.75] text-white/72 whitespace-pre-line">
                  {property.description ||
                    property.PublicRemarks ||
                    "No description available for this property."}
                </p>
              </Card>
              <Card title="Highlights">
                <SpecList rows={highlights} />
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Interior">
                <SpecList rows={interior} />
              </Card>
              <Card title="Exterior">
                <SpecList rows={exterior} />
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Garage & Parking">
                <SpecList rows={garage} />
              </Card>
              <Card title="Schools">
                <SpecList rows={schools} />
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Building Info">
                <SpecList rows={building} />
              </Card>
              <Card title="Financial">
                <SpecList rows={financial} />
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Utilities">
                <SpecList rows={utilities} />
              </Card>
              <Card title="Listing Details">
                <SpecList rows={listingDetails} />
              </Card>
            </div>

            {/* Inline CTA */}
            <div className="bg-gradient-to-br from-[var(--gold-500)]/10 to-transparent border border-[var(--gold-500)]/25 px-6 md:px-8 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl text-white">
                  Interested in this home?
                </h3>
                <p className="text-[14px] text-white/65 mt-1.5 max-w-md">
                  Schedule a private viewing or request more information from a
                  trusted advisor.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-gold-new shrink-0"
              >
                Request a Showing
              </button>
            </div>

            {/* Mortgage calculator */}
            {showMortgageCalculator && (
              <div>
                <SectionHeader title="Mortgage Calculator" />
                <div className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10 mb-8">
                    {/* Donut */}
                    <div className="shrink-0 mx-auto md:mx-0">
                      <svg
                        width="200"
                        height="200"
                        viewBox="0 0 200 200"
                        aria-label="Monthly cost breakdown"
                      >
                        <circle
                          cx="100"
                          cy="100"
                          r={donutR}
                          fill="none"
                          stroke="var(--surface-charcoal)"
                          strokeWidth="22"
                        />
                        <circle
                          cx="100"
                          cy="100"
                          r={donutR}
                          fill="none"
                          stroke="var(--gold-500)"
                          strokeWidth="22"
                          strokeDasharray={`${piDash} ${circumference}`}
                          transform="rotate(-90 100 100)"
                          style={{ transition: "stroke-dasharray 0.5s ease" }}
                        />
                        <circle
                          cx="100"
                          cy="100"
                          r={donutR}
                          fill="none"
                          stroke="rgba(255,255,255,0.32)"
                          strokeWidth="22"
                          strokeDasharray={`${taxDash} ${circumference}`}
                          strokeDashoffset={-piDash}
                          transform="rotate(-90 100 100)"
                          style={{ transition: "stroke-dasharray 0.5s ease" }}
                        />
                        <text
                          x="100"
                          y="94"
                          textAnchor="middle"
                          fill="var(--gold-500)"
                          fontSize="20"
                          fontFamily="var(--font-playfair), serif"
                          fontWeight="400"
                        >
                          ${mortgage.total.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </text>
                        <text
                          x="100"
                          y="114"
                          textAnchor="middle"
                          fill="rgba(255,255,255,0.55)"
                          fontSize="11"
                          letterSpacing="2"
                        >
                          PER MONTH
                        </text>
                      </svg>
                    </div>

                    {/* Breakdown */}
                    <div className="flex-1 min-w-[200px] flex flex-col gap-4">
                      <div className="flex justify-between items-center pb-3 border-b border-white/8">
                        <span className="flex items-center gap-3 text-[14px] text-white/72">
                          <span className="w-3 h-3 rounded-full bg-[var(--gold-500)]" />
                          Principal &amp; Interest
                        </span>
                        <span className="text-[var(--gold-500)] font-medium">
                          $
                          {mortgage.pi.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      {mortgage.monthlyTax > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-3 text-[14px] text-white/72">
                            <span className="w-3 h-3 rounded-full bg-white/35" />
                            Taxes
                          </span>
                          <span className="text-white font-medium">
                            $
                            {mortgage.monthlyTax.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CalcField
                      label="Home Price"
                      onEdit={() => setEditingField("homePrice")}
                    >
                      {editingField === "homePrice" ? (
                        <input
                          type="number"
                          value={mortgageHomePrice}
                          onChange={(e) =>
                            setMortgageHomePrice(Number(e.target.value))
                          }
                          onBlur={() => setEditingField(null)}
                          autoFocus
                          className="bg-transparent border-0 outline-none text-white text-[16px] font-medium w-full"
                        />
                      ) : (
                        <span className="text-white text-[16px] font-medium">
                          ${mortgageHomePrice.toLocaleString()}
                        </span>
                      )}
                    </CalcField>

                    <div className="relative">
                      <CalcField
                        label="Loan Details"
                        active={loanDropdownOpen}
                        onEdit={() => {
                          setTempRate(mortgageRate);
                          setTempYears(mortgageLoanYears);
                          setLoanDropdownOpen((o) => !o);
                        }}
                      >
                        <span className="text-white text-[16px] font-medium">
                          {mortgageLoanYears} yrs
                          <span className="text-white/30 mx-2">|</span>
                          {mortgageRate}%
                        </span>
                      </CalcField>
                      {loanDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-charcoal)] border border-[var(--gold-500)]/40 p-5 z-30 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)]">
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-white/55 mb-1.5">
                            Interest Rate
                          </label>
                          <div className="flex items-center bg-[var(--surface-ink)] border border-[var(--line-soft)] px-3 py-2.5 mb-4">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="30"
                              value={tempRate}
                              onChange={(e) =>
                                setTempRate(Number(e.target.value))
                              }
                              className="bg-transparent border-0 outline-none text-white text-[14px] w-full"
                            />
                            <span className="text-white/55 ml-1">%</span>
                          </div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-white/55 mb-1.5">
                            Loan Type
                          </label>
                          <select
                            value={tempYears}
                            onChange={(e) =>
                              setTempYears(Number(e.target.value))
                            }
                            className="w-full bg-[var(--surface-ink)] border border-[var(--line-soft)] px-3 py-2.5 text-white text-[14px] mb-5 outline-none focus:border-[var(--gold-500)]/60"
                          >
                            <option value={10}>10 years</option>
                            <option value={15}>15 years</option>
                            <option value={20}>20 years</option>
                            <option value={25}>25 years</option>
                            <option value={30}>30 years</option>
                          </select>
                          <button
                            onClick={() => {
                              setMortgageRate(tempRate);
                              setMortgageLoanYears(tempYears);
                              setLoanDropdownOpen(false);
                            }}
                            className="btn-gold-new w-full justify-center"
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>

                    <CalcField
                      label="Down Payment"
                      onEdit={() => setEditingField("downPct")}
                    >
                      <div className="flex items-center gap-2 text-white text-[16px] font-medium">
                        {editingField === "downPct" ? (
                          <input
                            type="number"
                            value={mortgageDownPct}
                            onChange={(e) =>
                              setMortgageDownPct(Number(e.target.value))
                            }
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="bg-transparent border-0 outline-none text-white text-[16px] font-medium w-12"
                          />
                        ) : (
                          <span>{mortgageDownPct}%</span>
                        )}
                        <span className="text-white/30">|</span>
                        <span>${mortgage.downAmt.toLocaleString()}</span>
                      </div>
                    </CalcField>
                  </div>
                </div>
              </div>
            )}

            {/* Mortgage calculator disclaimer */}
            {showMortgageCalculator && (
              <div className="p-5 bg-[var(--surface-obsidian)] border border-[var(--line-soft)] text-[12px] text-white/45 leading-relaxed flex flex-col gap-2">
                <p>
                  All calculations are estimates and today&rsquo;s rates are provided by Realtipro for informational purposes only.
                </p>
                <p>
                  These tools are made available as self-help resources for your independent use and are not intended to constitute investment, financial, or tax advice. We cannot guarantee their applicability or accuracy with respect to your individual circumstances. All examples are hypothetical and purely illustrative. We strongly encourage you to seek guidance from qualified professionals regarding your personal financial decisions.
                </p>
              </div>
            )}

            {/* Virtual tour */}
            {showVirtualTour && (
              <div>
                <SectionHeader title="Virtual Tour" />
                <div className="relative w-full aspect-video bg-[var(--surface-obsidian)] border border-[var(--line-soft)] overflow-hidden">
                  <iframe
                    src={property.VirtualTourURLUnbranded}
                    title="Virtual Tour"
                    allowFullScreen
                    allow="xr-spatial-tracking"
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
                <p className="mt-3 text-[12px] text-white/45">
                  Interactive 3D walkthrough — explore from anywhere.
                </p>
              </div>
            )}

            {/* Local information */}
            {showPropertyMap && property.latitude && property.longitude && (
              <div>
                <SectionHeader title="Location & Neighborhood" />
                <div className="border border-[var(--line-soft)] bg-[var(--surface-obsidian)] overflow-hidden">
                  <LocalInformation
                    coordinates={{
                      lat: Number(property.latitude),
                      lng: Number(property.longitude),
                    }}
                  />
                </div>
              </div>
            )}

            {/* MLS disclaimer */}
            <div className="mt-4 p-6 md:p-8 bg-[var(--surface-obsidian)] border border-[var(--line-soft)] flex flex-col gap-3 text-[12px] text-white/55 leading-relaxed">
              <p>
                Estimated payment, market insight calculations, school and
                neighborhood information provided by Realtipro.
              </p>
              <p>
                The database information herein is provided from and copyrighted
                by the Northwest Multiple Listing Service (NWMLS). NWMLS data
                may not be reproduced or redistributed and is only for people
                viewing this site. All information provided is deemed reliable
                but is not guaranteed and should be independently verified. All
                properties are subject to prior sale or withdrawal. All rights
                are reserved by copyright. Property locations as displayed on
                any map are best approximations only and exact locations should
                be independently verified. The three-tree icon represents
                listings courtesy of NWMLS.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[var(--line-soft)] mt-1">
                <div className="flex flex-col gap-1">
                  <span>{formattedMlsUpdated}</span>
                  <span>
                    © {new Date().getFullYear()} Northwest Multiple Listing
                    Service
                  </span>
                </div>
                <div className="relative w-[80px] h-[40px]">
                  <Image
                    src="/images/nwmls.png"
                    alt="Northwest Multiple Listing Service"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-[100px] flex flex-col gap-4 self-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] p-6"
            >
              <div className="flex items-center gap-4 pb-5 border-b border-[var(--line-soft)]">
                <div className="relative w-16 h-16 overflow-hidden rounded-full border border-[var(--gold-500)]/40">
                  <Image
                    src={profile_image || "/images/agent-1.png"}
                    alt={name || "Advisor"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-serif text-xl text-white leading-tight">
                    {name || "Your Advisor"}
                  </span>
                  <Link
                    href="/about-us"
                    className="text-[12px] uppercase tracking-[0.18em] text-[var(--gold-500)] hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    View profile
                    <FiArrowRight size={12} />
                  </Link>
                </div>
              </div>

              {(hasEmail || hasPhone) && (
                <div className={`grid gap-3 mt-5 ${hasEmail && hasPhone ? "grid-cols-2" : "grid-cols-1"}`}>
                  {hasEmail && (
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center justify-center gap-2 h-11 border border-[var(--line-soft)] text-white/85 text-[12px] tracking-[0.14em] uppercase font-semibold hover:border-[var(--gold-500)] hover:text-[var(--gold-500)] transition-colors"
                    >
                      <FiMail size={14} />
                      Email
                    </a>
                  )}
                  {hasPhone && (
                    <a
                      href={`tel:${formattedPhone}`}
                      className="inline-flex items-center justify-center gap-2 h-11 border border-[var(--line-soft)] text-white/85 text-[12px] tracking-[0.14em] uppercase font-semibold hover:border-[var(--gold-500)] hover:text-[var(--gold-500)] transition-colors"
                    >
                      <FiPhone size={14} />
                      Call
                    </a>
                  )}
                </div>
              )}

              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-gold-new w-full mt-3 justify-center"
              >
                Request a Showing
              </button>
            </motion.div>

            <div className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] p-6 flex flex-col gap-3">
              <button
                onClick={handleToggleFavorites}
                disabled={isAddingToFavorites}
                className={`inline-flex items-center justify-center gap-2.5 h-11 border transition-all duration-300 text-[12px] font-bold tracking-[0.18em] uppercase ${
                  isFavorited
                    ? "bg-[var(--gold-500)] border-[var(--gold-500)] text-[var(--surface-ink)]"
                    : "border-[var(--gold-500)] text-[var(--gold-500)] hover:bg-[var(--gold-500)]/10"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isAddingToFavorites ? (
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                  </svg>
                ) : isFavorited ? (
                  <FaHeart size={14} />
                ) : (
                  <FiHeart size={14} />
                )}
                {isFavorited ? "Saved" : "Save to favorites"}
              </button>

              <SharePopup property={property} />
            </div>
          </aside>
        </div>
      </section>

      <PropertyEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={property}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        isHeader={false}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

/* ─────────── Sub-components ─────────── */

type SpecRow = { label: string; value: any };

function Stat({ value, label }: { value: any; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 md:px-7 py-4 min-w-[88px]">
      <span className="font-serif text-[28px] leading-none text-white">
        {value}
      </span>
      <span className="text-[10px] mt-1.5 uppercase tracking-[0.22em] text-white/55">
        {label}
      </span>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="inline-block h-px w-8 bg-[var(--gold-500)]" />
      <h2 className="font-serif text-2xl text-white">{title}</h2>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] hover:border-[var(--line-medium)] transition-colors p-6 md:p-7">
      <h3 className="flex items-center gap-3 mb-5 font-serif text-lg text-white">
        <span className="inline-block w-1 h-5 bg-[var(--gold-500)]" />
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}

function SpecList({ rows }: { rows: SpecRow[] }) {
  return (
    <dl className="flex flex-col">
      {rows.map((row, i) => {
        const display =
          row.value === null ||
          row.value === undefined ||
          row.value === "" ||
          row.value === "—"
            ? "—"
            : row.value;
        return (
          <div
            key={i}
            className="flex items-start justify-between gap-4 py-2.5 border-b border-white/5 last:border-0 text-[14px]"
          >
            <dt className="text-white/55 shrink-0">{row.label}</dt>
            <dd className="text-white/85 text-right">{display}</dd>
          </div>
        );
      })}
    </dl>
  );
}

function CalcField({
  label,
  children,
  onEdit,
  active,
}: {
  label: string;
  children: React.ReactNode;
  onEdit?: () => void;
  active?: boolean;
}) {
  return (
    <div
      className={`bg-[var(--surface-charcoal)] border px-4 py-3.5 transition-colors ${
        active
          ? "border-[var(--gold-500)]/60"
          : "border-[var(--line-soft)] hover:border-[var(--line-medium)]"
      }`}
    >
      <div className="text-[10px] uppercase tracking-[0.22em] text-white/55 mb-1.5">
        {label}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0 flex items-center">{children}</div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-white/55 hover:text-[var(--gold-500)] transition-colors p-0.5"
            aria-label="Edit"
          >
            <FiEdit2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
