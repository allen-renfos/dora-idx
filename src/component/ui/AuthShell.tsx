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
    <main className="min-h-screen bg-[var(--surface-ink)] text-white relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--surface-obsidian)] via-[var(--surface-ink)] to-[var(--surface-ink)]"
      />
      <div
        aria-hidden
        className="absolute -top-40 right-[-160px] w-[560px] h-[560px] rounded-full opacity-[0.06] blur-[140px] bg-[var(--gold-500)]"
      />
      <div
        aria-hidden
        className="absolute bottom-[-220px] left-[-120px] w-[480px] h-[480px] rounded-full opacity-[0.05] blur-[140px] bg-[var(--gold-500)]"
      />

      <div className="container-page py-8 flex items-center justify-between">
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
              style={{ objectFit: "contain", height: 44, width: "auto" }}
            />
          ) : (
            <span className="font-serif text-2xl text-white">
              {name || "RealtiPro"}
            </span>
          )}
        </Link>
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-white/65 hover:text-[var(--gold-500)] transition-colors"
        >
          <FiArrowLeft size={14} />
          Back home
        </Link>
      </div>

      <div className="container-page pt-8 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[460px]"
        >
          <div className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] p-8 md:p-10 relative">
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-500)]/55 to-transparent"
            />

            <div className="flex flex-col gap-3 mb-8">
              {eyebrow && (
                <span className="eyebrow inline-flex items-center gap-3">
                  <span className="inline-block h-px w-8 bg-[var(--gold-500)]" />
                  {eyebrow}
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight tracking-[-0.01em]">
                {title}
              </h1>
              {description && (
                <p className="text-[14px] text-white/60 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {children}
          </div>

          {footer && (
            <div className="text-center mt-6 text-[14px] text-white/55">
              {footer}
            </div>
          )}
        </motion.div>
      </div>
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
          className="text-[10px] uppercase tracking-[0.22em] text-white/55"
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
        className={`bg-[var(--surface-charcoal)] border px-4 h-12 text-[14px] outline-none transition-colors ${
          readOnly
            ? "border-[var(--line-soft)] text-white/50 cursor-not-allowed select-none"
            : error
              ? "border-red-500/60 text-white placeholder:text-white/40"
              : "border-[var(--line-soft)] focus:border-[var(--gold-500)]/60 text-white placeholder:text-white/40"
        }`}
      />
      {error && <span className="text-[12px] text-red-400">{error}</span>}
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
      ? "bg-red-500/10 border-red-500/30 text-red-300"
      : "bg-[var(--gold-500)]/10 border-[var(--gold-500)]/40 text-[var(--gold-500)]";
  return (
    <div className={`mb-5 px-4 py-3 border text-[13px] ${styles}`}>
      {children}
    </div>
  );
}
