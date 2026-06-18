"use client";

import Link from "next/link";
import React from "react";
import { FiCheck, FiAlertCircle } from "react-icons/fi";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export const FormDisclaimer: React.FC<Props> = ({
  checked,
  onChange,
  error,
}) => {
  return (
    <div className="flex flex-col gap-2 mt-1">
      <label
        htmlFor="form-consent-checkbox"
        className="flex items-start gap-3 cursor-pointer select-none group"
      >
        <input
          type="checkbox"
          id="form-consent-checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span
          aria-hidden
          className={`relative shrink-0 w-5 h-5 mt-[2px] border transition-all duration-200 ${
            checked
              ? "bg-[var(--gold-500)] border-[var(--gold-500)]"
              : error
                ? "border-red-500/60 bg-transparent group-hover:border-red-400"
                : "border-[var(--line-medium)] bg-transparent group-hover:border-[var(--gold-500)]/60"
          }`}
        >
          {checked && (
            <FiCheck
              size={14}
              strokeWidth={3}
              className="absolute inset-0 m-auto text-[var(--surface-ink)]"
            />
          )}
        </span>
        <span className="text-[12px] leading-[1.6] text-white/55">
          By submitting your phone number, you provide your express written
          consent to receive calls and text messages, including marketing
          communications, at the number you entered. Your consent is not a
          condition of purchasing any goods or services. Message and data rates
          may apply depending on your mobile carrier. You may opt out at any
          time by replying STOP to any text message.
          <br />
          This site is protected by reCAPTCHA and the Google{" "}
          <Link
            href="/privacy-policy"
            className="text-[var(--gold-500)] underline underline-offset-2 hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/terms-of-service"
            className="text-[var(--gold-500)] underline underline-offset-2 hover:text-white transition-colors"
          >
            Terms of Service
          </Link>{" "}
          apply.
        </span>
      </label>
      {error && (
        <p className="ml-8 text-[12px] text-red-400 inline-flex items-center gap-1.5">
          <FiAlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};
