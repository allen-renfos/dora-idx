"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMail, FiX } from "react-icons/fi";
import { SiGmail, SiMaildotru } from "react-icons/si";
import { FaYahoo } from "react-icons/fa6";
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";

interface Props {
  /** Recipient email address. */
  email: string;
  /** Optional pre-filled subject line. */
  subject?: string;
  /** Optional pre-filled body. */
  body?: string;
}

export const MailAppPopup = ({ email, subject = "", body = "" }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const to = encodeURIComponent(email);
  const su = encodeURIComponent(subject);
  const bo = encodeURIComponent(body);

  const options: {
    label: string;
    Icon: React.ComponentType<{ size?: number }>;
    href: string;
    /** Web apps open in a new tab; the default mail app uses the same tab. */
    newTab: boolean;
  }[] = [
    {
      label: "Gmail",
      Icon: SiGmail,
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${bo}`,
      newTab: true,
    },
    {
      label: "Outlook",
      Icon: PiMicrosoftOutlookLogoFill,
      href: `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}&body=${bo}`,
      newTab: true,
    },
    {
      label: "Yahoo",
      Icon: FaYahoo,
      href: `https://compose.mail.yahoo.com/?to=${to}&subject=${su}&body=${bo}`,
      newTab: true,
    },
    {
      label: "Default mail",
      Icon: SiMaildotru,
      href: `mailto:${email}?subject=${su}&body=${bo}`,
      newTab: false,
    },
  ];

  const handleSelect = (href: string, newTab: boolean) => {
    if (newTab) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = href;
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 h-11 w-full border border-[var(--line-soft)] rounded-[var(--radius-sm)] text-[var(--ink-soft)] text-[12px] tracking-[0.14em] uppercase font-semibold hover:border-[var(--gold-500)] hover:text-[var(--gold-500)] transition-colors"
      >
        <FiMail size={14} />
        Email
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[9998] bg-black/65 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[92%] max-w-[460px]"
            >
              <div className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] rounded-[var(--radius-md)] relative">
                <div
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-500)]/55 to-transparent"
                />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--line-soft)]">
                  <div className="flex items-center gap-3">
                    <FiMail size={16} className="text-[var(--gold-500)]" />
                    <h3 className="font-serif text-lg text-[var(--ink)]">
                      Choose a mail app
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close"
                    className="w-9 h-9 flex items-center justify-center text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6">
                  <p className="text-[12px] text-[var(--ink-faint)] mb-5 truncate">
                    To: <span className="text-[var(--ink-soft)]">{email}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {options.map(({ label, Icon, href, newTab }) => (
                      <button
                        key={label}
                        onClick={() => handleSelect(href, newTab)}
                        className="flex flex-col items-center justify-center gap-2.5 py-5 border bg-[var(--surface-charcoal)] border-[var(--line-soft)] rounded-[var(--radius-sm)] text-[var(--ink-soft)] hover:border-[var(--gold-500)]/50 hover:text-[var(--gold-500)] transition-colors"
                      >
                        <Icon size={22} />
                        <span className="text-[11px] uppercase tracking-[0.16em] font-medium">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
