"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { useNameContext } from "../NameProvider";
import { useCachedImage } from "@/helpers/useCachedImage";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: Props) {
  const { company_logo, company_name, name } = useNameContext();
  const cachedLogo = useCachedImage(company_logo);

  return (
    <main className="min-h-screen w-full bg-[var(--canvas)] text-[var(--ink)] lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* ============ LEFT · full-bleed photo with pine wash ============ */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[var(--pine)]">
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 anim-kenburns">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/sample-4.jpg"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)] via-[var(--pine)]/55 to-[var(--pine)]/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--pine)]/70 via-transparent to-[var(--pine)]/30" />
        </div>

        <div className="relative z-10 p-10 xl:p-14">
          <Link
            href="/home"
            className="inline-flex items-center gap-3"
            aria-label="Home"
          >
            {cachedLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={cachedLogo}
                alt={company_name || name || "Logo"}
                style={{ objectFit: "contain", height: 48, width: "auto" }}
              />
            ) : (
              <span className="font-serif text-3xl text-[var(--on-pine)]">
                {name || "Dora"}
              </span>
            )}
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="relative z-10 p-10 xl:p-14 max-w-[34rem]"
        >
          <span className="eyebrow on-dark inline-flex items-center gap-4">
            <span className="inline-block h-px w-12 bg-[var(--gold-300)]" />
            Dora · Curated Living
          </span>
          <p className="display-md text-[var(--on-pine)] mt-6">
            A private vantage on the homes{" "}
            <em className="text-[var(--gold-300)]">worth waiting for.</em>
          </p>
          <p className="lede mt-5 text-[var(--on-pine-soft)] max-w-md">
            Sign in to keep your favorites close, follow saved searches, and
            move with quiet confidence when the right home appears.
          </p>
        </motion.div>
      </aside>

      {/* ============ RIGHT · form panel ============ */}
      <section className="relative flex flex-col min-h-screen">
        {/* Mobile/top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-7">
          <Link
            href="/home"
            className="inline-flex items-center gap-3 lg:hidden"
            aria-label="Home"
          >
            {cachedLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={cachedLogo}
                alt={company_name || name || "Logo"}
                style={{ objectFit: "contain", height: 40, width: "auto" }}
              />
            ) : (
              <span className="font-serif text-2xl text-[var(--ink)]">
                {name || "Dora"}
              </span>
            )}
          </Link>
          <span className="hidden lg:block" />
          <Link href="/home" className="link-underline">
            <FiArrowLeft size={14} />
            Back home
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="w-full max-w-[440px]"
          >
            <div className="flex flex-col gap-3 mb-9">
              {eyebrow && (
                <span className="eyebrow inline-flex items-center gap-3">
                  <span className="inline-block h-px w-8 bg-[var(--gold)]" />
                  {eyebrow}
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-[2.6rem] leading-[1.05] tracking-[-0.015em] text-[var(--ink)]">
                {title}
              </h1>
              {description && (
                <p className="text-[14.5px] text-[var(--ink-soft)] leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {children}

            {footer && (
              <div className="mt-8 pt-6 border-t border-[var(--line)] text-center text-[14px] text-[var(--ink-faint)]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}

interface FieldProps {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoFocus?: boolean;
  required?: boolean;
  error?: string;
  rightAction?: React.ReactNode;
  autoComplete?: string;
  readOnly?: boolean;
}

export function AuthField({
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoFocus,
  required,
  error,
  rightAction,
  autoComplete,
  readOnly,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)]"
        >
          {label}
        </label>
        {rightAction}
      </div>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        required={required}
        readOnly={readOnly}
        className={`bg-[var(--cream)] border rounded-[var(--radius-sm)] px-4 h-12 text-[14.5px] outline-none transition-colors ${
          readOnly
            ? "border-[var(--line)] text-[var(--ink-faint)] cursor-not-allowed select-none"
            : error
              ? "border-[#b3261e] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:border-[#b3261e]"
              : "border-[var(--line)] focus:border-[var(--sage-deep)] text-[var(--ink)] placeholder:text-[var(--ink-faint)]"
        }`}
      />
      {error && <span className="text-[12px] text-[#b3261e]">{error}</span>}
    </div>
  );
}

export function AuthAlert({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: React.ReactNode;
}) {
  const styles =
    tone === "error"
      ? "bg-[#fbeceb] border-[#b3261e]/25 text-[#8f2018]"
      : "bg-[var(--cream)] border-[var(--sage-deep)]/35 text-[var(--sage-deep)]";
  return (
    <div
      className={`mb-5 px-4 py-3 border rounded-[var(--radius-sm)] text-[13px] leading-relaxed ${styles}`}
    >
      {children}
    </div>
  );
}
