"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";
import { useNameContext } from "../NameProvider";
import { useCachedImage } from "@/helpers/useCachedImage";

const FOOTER_COLS = [
  {
    title: "Discover",
    links: [
      { label: "Listings", href: "/properties" },
      { label: "Neighborhoods", href: "/neighborhoods" },
      { label: "Insights", href: "/blog" },
    ],
  },
  {
    title: "Practice",
    links: [
      { label: "About", href: "/about-us" },
      { label: "Connect", href: "/connect" },
      { label: "Saved Searches", href: "/saved-searches" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "DMCA", href: "/terms-of-service" },
    ],
  },
];

export const Footer = () => {
  const { name, company_logo, company_name, socialUrls, shortDescription } =
    useNameContext();
  const cachedLogo = useCachedImage(company_logo);

  const socials: { href?: string; Icon: React.ComponentType<{ size?: number }>; label: string }[] = [
    { href: socialUrls?.instagram, Icon: FaInstagram, label: "Instagram" },
    { href: socialUrls?.facebook, Icon: FaFacebookF, label: "Facebook" },
    { href: socialUrls?.linkedin || socialUrls?.linked_in, Icon: FaLinkedinIn, label: "LinkedIn" },
    { href: socialUrls?.twitter, Icon: FaXTwitter, label: "X" },
    { href: socialUrls?.youtube, Icon: FaYoutube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-[var(--pine)] text-[var(--on-pine-soft)] relative overflow-hidden">
      {/* Soft gold top hairline */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--gold)]/45 to-transparent" />

      {/* Oversized brand watermark */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -bottom-10 right-[2vw] font-serif text-[clamp(7rem,22vw,20rem)] leading-none text-[var(--on-pine)]/[0.04]"
      >
        {name || "Dora"}
      </span>

      <div className="container-wide pt-24 pb-14 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Link href="/home" className="inline-flex items-center gap-3">
              {cachedLogo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={cachedLogo}
                  alt={company_name || name || "Logo"}
                  style={{ objectFit: "contain", height: 80, width: "auto" }}
                />
              ) : (
                <span className="font-serif text-4xl text-[var(--on-pine)]">{name || "Dora"}</span>
              )}
            </Link>
            <p className="text-[15px] text-[var(--on-pine-soft)] max-w-md leading-relaxed font-light">
              {shortDescription ||
                "A boutique real estate practice pairing distinctive homes with the people who belong in them — guided by patience, taste, and quiet conviction."}
            </p>
            {socials.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {socials.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full border border-[rgba(241,237,227,0.2)] flex items-center justify-center text-[var(--on-pine-soft)] hover:text-[var(--pine)] hover:bg-[var(--gold-300)] hover:border-[var(--gold-300)] transition-colors duration-300"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {FOOTER_COLS.map((col) => (
              <div key={col.title} className="flex flex-col gap-5">
                <h4 className="eyebrow on-dark">{col.title}</h4>
                <ul className="flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link
                        href={l.href}
                        className="text-[15px] text-[var(--on-pine-soft)] hover:text-[var(--gold-300)] transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NWMLS notice */}
      <div className="container-wide pb-4 relative">
        <div className="flex items-center gap-2 text-[12px] text-[var(--on-pine-faint)]">
          <span>The three tree icon represents listings courtesy of NWMLS.</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/nwmls.png" alt="NWMLS" width={20} height={20} style={{ objectFit: "contain" }} />
        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t border-[rgba(241,237,227,0.14)] relative">
        <div className="container-wide py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[var(--on-pine-faint)]">
          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
            <span>
              © {new Date().getFullYear()} {company_name || name || "Dora"}. All rights reserved.
            </span>
            <span className="hidden md:inline text-[rgba(241,237,227,0.25)]">/</span>
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <a
                href="https://www.realtipro.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
                aria-label="RealtiPro"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/fordarkbg-logo.png"
                  alt="RealtiPro"
                  width={80}
                  height={20}
                  style={{
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                    opacity: 0.75,
                    transition: "opacity 0.3s ease",
                  }}
                />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://admin.realtipro.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--on-pine)] transition-colors"
            >
              Admin Log In
            </a>
            <span className="text-[rgba(241,237,227,0.25)]">|</span>
            <Link href="/privacy-policy" className="hover:text-[var(--on-pine)] transition-colors">
              Privacy
            </Link>
            <span className="text-[rgba(241,237,227,0.25)]">|</span>
            <Link href="/terms-of-service" className="hover:text-[var(--on-pine)] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
