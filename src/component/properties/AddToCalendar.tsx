"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCalendar, FiChevronDown, FiDownload } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { SiApple } from "react-icons/si";
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import toast from "react-hot-toast";

import {
  type CalendarEvent,
  googleCalendarUrl,
  outlookCalendarUrl,
  downloadIcs,
} from "@/helpers/calendar";

interface Props {
  /** Fully-built calendar event. When null/invalid, the control is hidden. */
  event: CalendarEvent | null;
  /** Visible button label. */
  label?: string;
  className?: string;
}

type MenuItem = {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  onSelect?: () => void;
};

/**
 * Accessible "Add to calendar" control.
 *
 * - Opens a menu of Google / Outlook / Apple (iCal) options.
 * - Full keyboard support (Arrow keys, Home/End, Enter/Space, Esc, Tab).
 * - ARIA menu semantics + screen-reader-friendly labels.
 * - Closes on outside click, Escape, or selection, and restores focus.
 * - Responsive: full-width on mobile, anchored dropdown on larger screens.
 */
export function AddToCalendar({
  event,
  label = "Add Open House to your calendar",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>(
    []
  );

  const baseId = useId();
  const menuId = `${baseId}-menu`;
  const buttonId = `${baseId}-button`;

  // Build menu items only when we have a valid event.
  const items: MenuItem[] = event
    ? [
        {
          key: "google",
          label: "Google Calendar",
          description: "Opens Google Calendar in a new tab",
          icon: <FcGoogle aria-hidden size={18} />,
          href: safeUrl(() => googleCalendarUrl(event)),
        },
        {
          key: "outlook",
          label: "Outlook Calendar",
          description: "Opens Outlook in a new tab",
          icon: (
            <PiMicrosoftOutlookLogoFill
              aria-hidden
              size={18}
              className="text-[#0A6ED1]"
            />
          ),
          href: safeUrl(() => outlookCalendarUrl(event, "live")),
        },
        {
          key: "apple",
          label: "Apple Calendar / iCal",
          description: "Downloads an .ics file",
          icon: <SiApple aria-hidden size={16} className="text-[var(--ink)]" />,
          onSelect: () => {
            try {
              downloadIcs(event);
            } catch {
              toast.error("Couldn't generate the calendar file.");
            }
          },
        },
      ].filter((i) => Boolean(i.href) || Boolean(i.onSelect))
    : [];

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  const openMenu = useCallback(() => {
    setActiveIndex(0);
    setOpen(true);
  }, []);

  // Focus the active item whenever the menu opens or selection moves.
  useEffect(() => {
    if (open) itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const moveActive = useCallback(
    (delta: number) => {
      setActiveIndex((prev) => {
        const count = items.length;
        if (count === 0) return prev;
        return (prev + delta + count) % count;
      });
    },
    [items.length]
  );

  const onButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(items.length - 1);
      setOpen(true);
    }
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        // Allow focus to leave; just close the menu.
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSelect = (item: MenuItem) => {
    item.onSelect?.();
    close();
  };

  if (!event || items.length === 0) return null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={onButtonKeyDown}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[var(--gold-500)]/40 bg-[var(--gold-500)]/10 px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--gold-500)] transition-colors duration-300 hover:bg-[var(--gold-500)]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-500)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-obsidian)]"
      >
        <FiCalendar aria-hidden size={15} />
        <span>{label}</span>
        <FiChevronDown
          aria-hidden
          size={14}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={menuId}
            role="menu"
            aria-labelledby={buttonId}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={onMenuKeyDown}
            className="absolute left-0 right-0 sm:right-auto z-40 mt-2 min-w-full sm:min-w-[256px] overflow-hidden rounded-xl border border-[var(--gold-500)]/30 bg-[var(--surface-charcoal)] p-1.5 shadow-[0_24px_48px_-18px_rgba(0,0,0,0.7)]"
          >
            {items.map((item, idx) => {
              const common =
                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-200 focus:outline-none";
              const activeCls =
                idx === activeIndex
                  ? "bg-[var(--ink)]/[0.06]"
                  : "hover:bg-[var(--ink)]/[0.04]";

              const inner = (
                <>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--ink)]/5">
                    {item.icon}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[13px] font-medium text-[var(--ink)]">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-[var(--ink-faint)]">
                      {item.description}
                    </span>
                  </span>
                  {item.onSelect && (
                    <FiDownload
                      aria-hidden
                      size={14}
                      className="ml-auto text-[var(--ink-faint)] group-hover:text-[var(--gold-500)]"
                    />
                  )}
                </>
              );

              if (item.href) {
                return (
                  <li key={item.key} role="none">
                    <a
                      ref={(el) => {
                        itemRefs.current[idx] = el;
                      }}
                      role="menuitem"
                      tabIndex={idx === activeIndex ? 0 : -1}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => close(false)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`${common} ${activeCls}`}
                    >
                      {inner}
                    </a>
                  </li>
                );
              }

              return (
                <li key={item.key} role="none">
                  <button
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    role="menuitem"
                    type="button"
                    tabIndex={idx === activeIndex ? 0 : -1}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`${common} ${activeCls}`}
                  >
                    {inner}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Safely build a URL, returning "" if generation throws. */
function safeUrl(fn: () => string): string {
  try {
    return fn();
  } catch {
    return "";
  }
}
