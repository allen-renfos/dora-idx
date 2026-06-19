"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FiSearch, FiSmartphone, FiArrowRight } from "react-icons/fi";
import { formatUSPhoneInput } from "@/helpers/phoneFormat";
import { DashboardLayout } from "@/component/ui/DashboardLayout";

const MarketReportPage = () => {
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <DashboardLayout
      active="Market Report"
      eyebrow="Insights"
      title="Market reports"
      description="Track local market momentum, run a quick comparison, and have insights texted directly to your phone."
    >
      {/* Build a report */}
      <section className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] grid grid-cols-1 lg:grid-cols-[1fr_360px] overflow-hidden">
        <div className="p-8 md:p-10 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="eyebrow inline-flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-[var(--gold-500)]" />
              Build a report
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--ink)] leading-tight">
              Create your first market report
            </h2>
            <p className="text-[14px] text-[var(--ink-soft)] leading-relaxed max-w-md">
              Enter a city, neighborhood, or zip and we&rsquo;ll surface trends,
              comparable homes, and recent activity.
            </p>
          </div>

          <div className="flex items-center bg-[var(--surface-charcoal)] border border-[var(--line-soft)] focus-within:border-[var(--gold-500)]/60 transition-colors">
            <span className="pl-4 text-[var(--gold-500)]">
              {isSearching ? (
                <svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                </svg>
              ) : (
                <FiSearch size={16} />
              )}
            </span>
            <input
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (e.target.value.trim()) {
                  setIsSearching(true);
                  if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
                  searchTimerRef.current = setTimeout(() => setIsSearching(false), 400);
                } else {
                  setIsSearching(false);
                }
              }}
              type="text"
              placeholder="Search by location"
              className="flex-1 px-3 h-12 bg-transparent outline-none text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-faint)] font-serif"
            />
            <button className="h-12 px-5 text-[12px] font-bold tracking-[0.18em] uppercase bg-[var(--ink)] text-white hover:bg-[var(--accent-text)] transition-colors">
              Generate
            </button>
          </div>
        </div>

        <div className="hidden lg:block relative bg-[var(--surface-charcoal)] min-h-[280px]">
          <Image
            src="/images/market-report-sale.png"
            alt="Market report visual"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[var(--surface-obsidian)]/55" />
        </div>
      </section>

      {/* App banner */}
      <section className="mt-6 bg-[var(--surface-obsidian)] border border-[var(--line-soft)] p-8 md:p-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--gold-500)]/10 border border-[var(--gold-500)]/30 flex items-center justify-center text-[var(--gold-500)] shrink-0">
            <FiSmartphone size={22} />
          </div>
          <div className="max-w-xs">
            <h3 className="font-serif text-xl text-[var(--ink)]">
              Get the RealtiPro app
            </h3>
            <p className="text-[13px] text-[var(--ink-soft)] mt-1.5 leading-relaxed">
              Notifications, listings, and direct lines to your advisor — all in
              one place.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch gap-3 md:justify-end">
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(formatUSPhoneInput(e.target.value))}
            maxLength={14}
            placeholder="(555) 123-4567"
            className="bg-[var(--surface-charcoal)] border border-[var(--line-soft)] focus:border-[var(--gold-500)]/60 px-4 h-12 text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none transition-colors w-full md:max-w-[240px]"
          />
          <button className="btn-gold-new shrink-0 justify-center">
            Text me the app
            <FiArrowRight size={14} />
          </button>
        </div>
      </section>

      <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-faint)] text-center md:text-right">
        Standard messaging rates apply.
      </p>
    </DashboardLayout>
  );
};

export default MarketReportPage;
