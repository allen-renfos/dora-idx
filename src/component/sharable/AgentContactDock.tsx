"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FiPhone, FiMail, FiMessageSquare, FiX } from "react-icons/fi";
import { useNameContext } from "../NameProvider";
import { useCachedImage } from "@/helpers/useCachedImage";
import {
  getAgentContact,
  getAvailability,
  type Availability,
} from "@/helpers/agentContact";

/**
 * Persistent "reach the agent right now" dock.
 *
 * Bottom-left on every page (bottom-right is taken by the mobile share FAB).
 * Collapsed it is a pill — agent portrait with a pulsing availability dot and
 * a one-tap "Call" — so a visitor who just wants to ring the agent never has to
 * hunt for a number. Expanded it shows the number, text and email, plus whether
 * the agent is at the desk or when they are next back.
 */
export const AgentContactDock = () => {
  const { name, profile_image, phone, email } = useNameContext();
  const photo = useCachedImage(profile_image);
  const { phoneDisplay, telHref, smsHref, emailAddress } = getAgentContact(
    phone,
    email,
  );

  const [open, setOpen] = useState(false);
  const [availability, setAvailability] = useState<Availability | null>(null);

  // Computed after mount so server and client markup match.
  useEffect(() => {
    const tick = () => setAvailability(getAvailability());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!telHref && !emailAddress) return null;

  const firstName = (name || "").split(" ")[0] || "your agent";
  const isOnline = availability?.online ?? false;
  const dot = isOnline ? "bg-emerald-500" : "bg-[var(--gold-500)]";

  const portrait = (size: string) =>
    photo ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={name || "Agent"}
        className={`${size} rounded-full object-cover`}
      />
    ) : (
      <span
        className={`${size} rounded-full bg-[var(--pine)] text-[var(--on-pine)] flex items-center justify-center font-serif text-lg`}
      >
        {firstName.charAt(0).toUpperCase()}
      </span>
    );

  const presence = (
    <span
      aria-hidden
      className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white"
    >
      <span className={`relative h-2.5 w-2.5 rounded-full ${dot}`}>
        {isOnline && (
          <span
            className={`absolute inset-0 rounded-full ${dot} opacity-70 animate-ping motion-reduce:hidden`}
          />
        )}
      </span>
    </span>
  );

  return (
    <div className="fixed bottom-4 left-4 z-40 print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`Contact ${name || "your agent"}`}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[calc(100%+12px)] left-0 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--cream)] shadow-[var(--shadow-lift)]"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--gold)]/70 to-transparent" />
            <div className="flex items-center gap-3.5 px-5 pt-5 pb-4">
              <span className="relative shrink-0">
                {portrait("h-14 w-14")}
                {presence}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-xl leading-tight text-[var(--ink)] truncate">
                  {name || "Your agent"}
                </p>
                <p className="mt-0.5 text-[12.5px] text-[var(--ink-soft)]">
                  {availability
                    ? availability.label
                    : "Reach out any time"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="-mr-2 -mt-2 self-start flex h-9 w-9 items-center justify-center text-[var(--ink-faint)] hover:text-[var(--ink)]"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 px-5 pb-5">
              {telHref ? (
                <>
                  <a
                    href={telHref}
                    className="btn-gold-new w-full !normal-case !tracking-[0.04em] !text-[17px] !py-3.5"
                  >
                    <FiPhone size={17} />
                    {phoneDisplay}
                  </a>
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={smsHref ?? telHref}
                      className="btn-outline-new !py-3 !px-3 !text-[12px]"
                    >
                      <FiMessageSquare size={14} />
                      Text
                    </a>
                    {emailAddress ? (
                      <a
                        href={`mailto:${emailAddress}`}
                        className="btn-outline-new !py-3 !px-3 !text-[12px]"
                      >
                        <FiMail size={14} />
                        Email
                      </a>
                    ) : (
                      <Link
                        href="/connect"
                        onClick={() => setOpen(false)}
                        className="btn-outline-new !py-3 !px-3 !text-[12px]"
                      >
                        <FiMail size={14} />
                        Message
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <a
                    href={`mailto:${emailAddress}`}
                    className="btn-gold-new w-full !normal-case !tracking-[0.02em] !text-[15px] !py-3.5 break-all"
                  >
                    <FiMail size={16} />
                    {emailAddress}
                  </a>
                  <Link
                    href="/connect"
                    onClick={() => setOpen(false)}
                    className="btn-outline-new !py-3 !text-[12px]"
                  >
                    Request a call back
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed pill. Tapping the portrait/label opens the card; the phone
          button dials straight away (one tap from any page). */}
      <div className="flex items-stretch rounded-full border border-[var(--line)] bg-white/95 backdrop-blur-md shadow-[var(--shadow-lift)]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={`Contact ${name || "your agent"}`}
          className="flex items-center gap-3 rounded-l-full py-1.5 pl-1.5 pr-3 text-left transition-colors hover:bg-[var(--gold-500)]/[0.08]"
        >
          <span className="relative shrink-0">
            {portrait("h-11 w-11")}
            {presence}
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              {isOnline ? "Available now" : "Talk to"}
            </span>
            <span className="text-[14px] font-medium text-[var(--ink)]">
              {firstName}
            </span>
          </span>
        </button>
        {telHref ? (
          <a
            href={telHref}
            aria-label={`Call ${name || "the agent"} ${phoneDisplay}`}
            className="flex items-center gap-2 rounded-r-full bg-[var(--pine)] pl-4 pr-5 text-[var(--on-pine)] transition-colors hover:bg-[var(--pine-soft)]"
          >
            <FiPhone size={16} />
            <span className="text-[12px] font-semibold uppercase tracking-[0.16em]">
              Call
            </span>
          </a>
        ) : (
          <a
            href={`mailto:${emailAddress}`}
            aria-label={`Email ${name || "the agent"}`}
            className="flex items-center gap-2 rounded-r-full bg-[var(--pine)] pl-4 pr-5 text-[var(--on-pine)] transition-colors hover:bg-[var(--pine-soft)]"
          >
            <FiMail size={16} />
            <span className="text-[12px] font-semibold uppercase tracking-[0.16em]">
              Email
            </span>
          </a>
        )}
      </div>
    </div>
  );
};
