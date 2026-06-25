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
import { MailAppPopup } from "./MailAppPopup";
import { CallAppPopup } from "./CallAppPopup";
import { AddToCalendar } from "./AddToCalendar";
import { buildOpenHouseEvent } from "@/helpers/openHouseEvent";
import LoginModal from "@/main-pages/auth/LoginModal";
import { normalizePropertyDetails } from "@/services/properties/normalizePropertyDetails";
import type { PropertyDetails, PropertyOpenHouse } from "@/types/Property";

const LocalInformation = dynamic(() => import("./LocalInformation"), {
  ssr: false,
});

interface Props {
  property?: any;
}

export const SinglePropertyDetails = ({ property: prop }: Props) => {
  const property = prop;
  const details: PropertyDetails = useMemo(
    () => normalizePropertyDetails(property),
    [property]
  );
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
        setWishlistItemId(matched.wishlist_id ? String(matched.wishlist_id) : null);
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
      if (data?.data?.wishlist_id) setWishlistItemId(String(data.data.wishlist_id));
      toast.success("Saved to favorites", {
        style: {
          background: "#ffffff",
          color: "#1a1a1a",
          border: "1px solid #c2a878",
        },
        iconTheme: { primary: "#c2a878", secondary: "#ffffff" },
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
          background: "#ffffff",
          color: "#1a1a1a",
          border: "1px solid #c2a878",
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
    if (details.price) setMortgageHomePrice(Number(details.price));
  }, [details.price]);

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
    const monthlyTax = details.taxAnnualAmount
      ? Number(details.taxAnnualAmount) / 12
      : 0;
    const total = pi + monthlyTax;
    return { downAmt, loan, pi, monthlyTax, total };
  }, [
    mortgageHomePrice,
    mortgageDownPct,
    mortgageRate,
    mortgageLoanYears,
    details.taxAnnualAmount,
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

  const showMortgageCalculator = details.compliance.canShowValuation;

  const showPropertyMap =
    details.compliance.canShowMap &&
    details.latitude !== null &&
    details.longitude !== null;

  const showVirtualTour =
    details.compliance.canShowVirtualTour && Boolean(details.media.virtualTourUrl);

  const showAddress = details.compliance.canShowAddress;

  if (!property) return null;

  /* -------- Spec card data (normalized) -------- */
  const {
    highlights,
    interior,
    exterior,
    parking: garage,
    schools,
    building,
    financial,
    utilities,
    listingDetails,
  } = details;

  return (
    <>
      <section className="container-wide pb-20 pt-2">
        {/* ---- Header ---- */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-8">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--gold-500)] bg-[var(--gold-500)]/10 border border-[var(--gold-500)]/30 rounded-[var(--radius-pill)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-500)] animate-pulse" />
                {details.status || "Active"}
              </span>
              {details.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--ink-soft)] bg-[var(--ink)]/5 border border-[var(--line-medium)] rounded-[var(--radius-pill)]"
                >
                  {tag}
                </span>
              ))}
              {details.daysOnSite !== null && (
                <span className="inline-flex items-center gap-2 text-[12px] text-[var(--ink-faint)]">
                  <FiClock size={12} />
                  {details.daysOnSite} days on market
                </span>
              )}
            </div>

            <h1 className="font-sans font-bold text-[clamp(2.6rem,3.5vw+1rem,4.1rem)] leading-[1.05] tracking-[-0.025em] text-[var(--gold-500)]">
              {details.price !== null
                ? `$${Number(details.price).toLocaleString()}`
                : "Price upon request"}
            </h1>

            {showAddress && details.address && (
              <p className="flex items-start gap-2 text-[22px] text-[var(--ink-soft)] font-sans font-semibold">
                <FiMapPin
                  size={22}
                  className="mt-1 text-[var(--gold-500)] shrink-0"
                />
                {String(details.address).replace(/±/g, "#")}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-stretch divide-x divide-[var(--line-soft)] border border-[var(--line-soft)] bg-[var(--surface-obsidian)] rounded-[var(--radius-md)]">
            <Stat value={details.beds ?? "0"} label="Beds" />
            <Stat value={details.baths ?? "0"} label="Baths" />
            <Stat
              value={
                details.livingAreaSqft !== null
                  ? Number(details.livingAreaSqft).toLocaleString()
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
                <p className="text-[15px] leading-[1.75] text-[var(--ink-soft)] whitespace-pre-line">
                  {details.description ||
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

            {details.openHouses.length > 0 && (
              <OpenHouseSection
                openHouses={details.openHouses}
                propertyTitle={details.title}
                address={showAddress ? details.address : null}
              />
            )}

            {/* Inline CTA */}
            <div className="bg-gradient-to-br from-[var(--gold-500)]/10 to-transparent border border-[var(--gold-500)]/25 rounded-[var(--radius-md)] px-6 md:px-8 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl text-[var(--ink)]">
                  Interested in this home?
                </h3>
                <p className="text-[14px] text-[var(--ink-soft)] mt-1.5 max-w-md">
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
                <div className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] rounded-[var(--radius-md)] p-6 md:p-8">
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
                          stroke="var(--ink-faint)"
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
                          fill="var(--ink-faint)"
                          fontSize="11"
                          letterSpacing="2"
                        >
                          PER MONTH
                        </text>
                      </svg>
                    </div>

                    {/* Breakdown */}
                    <div className="flex-1 min-w-[200px] flex flex-col gap-4">
                      <div className="flex justify-between items-center pb-3 border-b border-[var(--line-soft)]">
                        <span className="flex items-center gap-3 text-[14px] text-[var(--ink-soft)]">
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
                          <span className="flex items-center gap-3 text-[14px] text-[var(--ink-soft)]">
                            <span className="w-3 h-3 rounded-full bg-[var(--ink-faint)]" />
                            Taxes
                          </span>
                          <span className="text-[var(--ink)] font-medium">
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
                          className="bg-transparent border-0 outline-none text-[var(--ink)] text-[16px] font-medium w-full"
                        />
                      ) : (
                        <span className="text-[var(--ink)] text-[16px] font-medium">
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
                        <span className="text-[var(--ink)] text-[16px] font-medium">
                          {mortgageLoanYears} yrs
                          <span className="text-[var(--ink-faint)] mx-2">|</span>
                          {mortgageRate}%
                        </span>
                      </CalcField>
                      {loanDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-charcoal)] border border-[var(--gold-500)]/40 rounded-[var(--radius-md)] p-5 z-30 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.18)]">
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)] mb-1.5">
                            Interest Rate
                          </label>
                          <div className="flex items-center bg-[var(--surface-ink)] border border-[var(--line-soft)] rounded-[var(--radius-sm)] px-3 py-2.5 mb-4">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="30"
                              value={tempRate}
                              onChange={(e) =>
                                setTempRate(Number(e.target.value))
                              }
                              className="bg-transparent border-0 outline-none text-[var(--ink)] text-[14px] w-full"
                            />
                            <span className="text-[var(--ink-faint)] ml-1">%</span>
                          </div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)] mb-1.5">
                            Loan Type
                          </label>
                          <select
                            value={tempYears}
                            onChange={(e) =>
                              setTempYears(Number(e.target.value))
                            }
                            className="w-full bg-[var(--surface-ink)] border border-[var(--line-soft)] rounded-[var(--radius-sm)] px-3 py-2.5 text-[var(--ink)] text-[14px] mb-5 outline-none focus:border-[var(--gold-500)]/60"
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
                      <div className="flex items-center gap-2 text-[var(--ink)] text-[16px] font-medium">
                        {editingField === "downPct" ? (
                          <input
                            type="number"
                            value={mortgageDownPct}
                            onChange={(e) =>
                              setMortgageDownPct(Number(e.target.value))
                            }
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="bg-transparent border-0 outline-none text-[var(--ink)] text-[16px] font-medium w-12"
                          />
                        ) : (
                          <span>{mortgageDownPct}%</span>
                        )}
                        <span className="text-[var(--ink-faint)]">|</span>
                        <span>${mortgage.downAmt.toLocaleString()}</span>
                      </div>
                    </CalcField>
                  </div>
                </div>
              </div>
            )}

            {/* Mortgage calculator disclaimer */}
            {showMortgageCalculator && (
              <div className="p-5 bg-[var(--surface-obsidian)] border border-[var(--line-soft)] rounded-[var(--radius-md)] text-[12px] text-[var(--ink-faint)] leading-relaxed flex flex-col gap-2">
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
                <div className="relative w-full aspect-video bg-[var(--surface-obsidian)] border border-[var(--line-soft)] rounded-[var(--radius-md)] overflow-hidden">
                  <iframe
                    src={details.media.virtualTourUrl ?? undefined}
                    title="Virtual Tour"
                    allowFullScreen
                    allow="xr-spatial-tracking"
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
                <p className="mt-3 text-[12px] text-[var(--ink-faint)]">
                  Interactive 3D walkthrough — explore from anywhere.
                </p>
              </div>
            )}

            {/* Local information */}
            {showPropertyMap && details.latitude !== null && details.longitude !== null && (
              <div>
                <SectionHeader title="Location & Neighborhood" />
                <div className="border border-[var(--line-soft)] bg-[var(--surface-obsidian)] rounded-[var(--radius-md)] overflow-hidden">
                  <LocalInformation
                    coordinates={{
                      lat: Number(details.latitude),
                      lng: Number(details.longitude),
                    }}
                  />
                </div>
              </div>
            )}

            {/* MLS disclaimer */}
            <div className="mt-4 p-6 md:p-8 bg-[var(--surface-obsidian)] border border-[var(--line-soft)] rounded-[var(--radius-md)] flex flex-col gap-3 text-[12px] text-[var(--ink-soft)] leading-relaxed">
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
                    © {new Date().getFullYear()}{" "}
                    {details.attribution.fullName ||
                      "Northwest Multiple Listing Service"}
                  </span>
                </div>
                <div className="relative w-[80px] h-[40px]">
                  {details.attribution.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={details.attribution.logo}
                      alt={
                        details.attribution.fullName ||
                        details.attribution.name ||
                        "MLS"
                      }
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Image
                      src="/images/nwmls.png"
                      alt="Northwest Multiple Listing Service"
                      fill
                      className="object-contain"
                    />
                  )}
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
              className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] rounded-[var(--radius-md)] p-6"
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
                  <span className="font-serif text-xl text-[var(--ink)] leading-tight">
                    {name || "Your Advisor"}
                  </span>
                  <Link
                    href="/about-us"
                    className="text-[12px] uppercase tracking-[0.18em] text-[var(--gold-500)] hover:text-[var(--ink)] transition-colors inline-flex items-center gap-1.5"
                  >
                    View profile
                    <FiArrowRight size={12} />
                  </Link>
                </div>
              </div>

              {(hasEmail || hasPhone) && (
                <div className={`grid gap-3 mt-5 ${hasEmail && hasPhone ? "grid-cols-2" : "grid-cols-1"}`}>
                  {hasEmail && (
                    <MailAppPopup
                      email={String(email)}
                      subject={
                        details?.address
                          ? `Inquiry about ${String(details.address).replace(/±/g, "#")}`
                          : "Property inquiry"
                      }
                    />
                  )}
                  {hasPhone && <CallAppPopup phone={String(formattedPhone)} />}
                </div>
              )}

              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-gold-new w-full mt-3 justify-center"
              >
                Request a Showing
              </button>
            </motion.div>

            <div className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] rounded-[var(--radius-md)] p-6 flex flex-col gap-3">
              <button
                onClick={handleToggleFavorites}
                disabled={isAddingToFavorites}
                className={`inline-flex items-center justify-center gap-2.5 h-11 border rounded-[var(--radius-sm)] transition-all duration-300 text-[12px] font-bold tracking-[0.18em] uppercase ${
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

function formatOpenHouseDate(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatOpenHouseTime(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function OpenHouseSection({
  openHouses,
  propertyTitle,
  address,
}: {
  openHouses: PropertyOpenHouse[];
  propertyTitle: string | null;
  address: string | null;
}) {
  const listingUrl =
    typeof window !== "undefined" ? window.location.href : null;

  return (
    <div>
      <SectionHeader title="Open House" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {openHouses.map((oh, idx) => {
          const dateLabel = formatOpenHouseDate(oh.date || oh.startTime);
          const start = formatOpenHouseTime(oh.startTime);
          const end = formatOpenHouseTime(oh.endTime);
          const d = new Date(oh.date || oh.startTime || "");
          const dayNum = Number.isNaN(d.getTime())
            ? null
            : d.toLocaleDateString("en-US", { day: "numeric" });
          const monthShort = Number.isNaN(d.getTime())
            ? null
            : d.toLocaleDateString("en-US", { month: "short" });
          const weekday = Number.isNaN(d.getTime())
            ? null
            : d.toLocaleDateString("en-US", { weekday: "long" });
          const calendarEvent = buildOpenHouseEvent(oh, {
            propertyTitle,
            address,
            listingUrl,
          });
          return (
            <div
              key={oh.key || idx}
              className="group relative flex flex-col gap-4 bg-[var(--surface-obsidian)] border border-[var(--line-soft)] rounded-xl p-5 transition-colors duration-300 hover:border-[var(--gold-500)]/40"
            >
              <div className="flex items-center gap-5">
                {/* Calendar tile */}
                <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-[var(--gold-500)]/10 border border-[var(--gold-500)]/25">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--gold-500)]">
                    {monthShort || "—"}
                  </span>
                  <span className="font-serif text-2xl leading-none text-[var(--ink)]">
                    {dayNum || "—"}
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1.5 min-w-0">
                  <span className="font-serif text-lg text-[var(--ink)] truncate">
                    {weekday || dateLabel || "Date to be announced"}
                  </span>
                  {(start || end) && (
                    <span className="inline-flex items-center gap-2 text-[13px] text-[var(--ink-soft)]">
                      <FiClock size={13} className="text-[var(--gold-500)]" />
                      {start}
                      {start && end ? " – " : ""}
                      {end}
                    </span>
                  )}
                  {oh.type && (
                    <span className="mt-0.5 self-start px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--gold-500)] bg-[var(--gold-500)]/10 border border-[var(--gold-500)]/30 rounded">
                      {oh.type}
                    </span>
                  )}
                </div>
              </div>

              {calendarEvent && (
                <AddToCalendar
                  event={calendarEvent}
                  label="Add to calendar"
                  className="pt-1"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: any; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 md:px-7 py-4 min-w-[88px]">
      <span className="font-serif text-[28px] leading-none text-[var(--ink)]">
        {value}
      </span>
      <span className="text-[10px] mt-1.5 uppercase tracking-[0.22em] text-[var(--ink-faint)]">
        {label}
      </span>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="inline-block h-px w-8 bg-[var(--gold-500)]" />
      <h2 className="font-serif text-2xl text-[var(--ink)]">{title}</h2>
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
    <div className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] rounded-[var(--radius-md)] hover:border-[var(--line-medium)] transition-colors p-6 md:p-7">
      <h3 className="flex items-center gap-3 mb-5 font-serif text-lg text-[var(--ink)]">
        <span className="inline-block w-1 h-5 bg-[var(--gold-500)]" />
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}

function SpecList({ rows }: { rows: SpecRow[] }) {
  if (!rows.length) {
    return (
      <p className="text-[13px] text-[var(--ink-faint)] italic">
        No information available.
      </p>
    );
  }
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
            className="flex items-start justify-between gap-4 py-2.5 border-b border-[var(--line-soft)] last:border-0 text-[14px]"
          >
            <dt className="text-[var(--ink-faint)] shrink-0">{row.label}</dt>
            <dd className="text-[var(--ink)] text-right">{display}</dd>
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
      className={`bg-[var(--surface-charcoal)] border rounded-[var(--radius-sm)] px-4 py-3.5 transition-colors ${
        active
          ? "border-[var(--gold-500)]/60"
          : "border-[var(--line-soft)] hover:border-[var(--line-medium)]"
      }`}
    >
      <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)] mb-1.5">
        {label}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0 flex items-center">{children}</div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-[var(--ink-faint)] hover:text-[var(--gold-500)] transition-colors p-0.5"
            aria-label="Edit"
          >
            <FiEdit2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
