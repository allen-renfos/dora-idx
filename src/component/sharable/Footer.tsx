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
    <footer className="bg-[var(--bg-subtle)] text-[var(--ink-soft)] relative overflow-hidden border-t border-[var(--line)]">
      {/* Soft brass top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />

      <div className="container-wide pt-20 pb-12">
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
                <span className="font-serif text-3xl text-[var(--ink)]">{name || "RealtiPro"}</span>
              )}
            </Link>
            <p className="text-[15px] text-[var(--ink-soft)] max-w-md leading-relaxed">
              {shortDescription ||
                "A boutique real estate practice committed to guiding buyers, sellers, and investors with clarity, integrity, and uncompromising attention to detail."}
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
                    className="w-10 h-10 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--ink-soft)] hover:text-[var(--accent-text)] hover:border-[var(--accent)] transition-colors duration-300"
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
                <h4 className="eyebrow">{col.title}</h4>
                <ul className="flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link
                        href={l.href}
                        className="text-[15px] text-[var(--ink-soft)] hover:text-[var(--accent-text)] transition-colors"
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
      <div className="container-wide pb-4">
        <div className="flex items-center gap-2 text-[12px] text-[var(--ink-faint)]">
          <span>The three tree icon represents listings courtesy of NWMLS.</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/nwmls.png" alt="NWMLS" width={20} height={20} style={{ objectFit: "contain" }} />
        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t border-[var(--line)]">
        <div className="container-wide py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[var(--ink-faint)]">
          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
            <span>
              © {new Date().getFullYear()} {company_name || name || "RealtiPro"}. All rights reserved.
            </span>
            <span className="hidden md:inline text-[var(--line)]">/</span>
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
                    filter: "brightness(0)",
                    opacity: 0.7,
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
              className="hover:text-[var(--ink)] transition-colors"
            >
              Admin Log In
            </a>
            <span className="text-[var(--line)]">|</span>
            <Link href="/privacy-policy" className="hover:text-[var(--ink)] transition-colors">
              Privacy
            </Link>
            <span className="text-[var(--line)]">|</span>
            <Link href="/terms-of-service" className="hover:text-[var(--ink)] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
