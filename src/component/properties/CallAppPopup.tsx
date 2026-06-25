"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPhone, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";

interface Props {
  /** Phone number (may contain spaces/symbols; sanitized for dialing). */
  phone: string;
}

export const CallAppPopup = ({ phone }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  // Strip everything except digits and a leading +, for dial/WhatsApp URIs.
  const dial = phone.replace(/[^\d+]/g, "");
  const waNumber = dial.replace(/\D/g, "");

  const options: {
    label: string;
    Icon: React.ComponentType<{ size?: number }>;
    onClick: () => void;
  }[] = [
    {
      label: "Phone",
      Icon: FiPhone,
      onClick: () => {
        window.location.href = `tel:${dial}`;
      },
    },
    {
      label: "WhatsApp",
      Icon: FaWhatsapp,
      onClick: () =>
        window.open(`https://wa.me/${waNumber}`, "_blank", "noopener,noreferrer"),
    },
  ];

  const handleSelect = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 h-11 w-full border border-[var(--line-soft)] rounded-[var(--radius-sm)] text-[var(--ink-soft)] text-[12px] tracking-[0.14em] uppercase font-semibold hover:border-[var(--gold-500)] hover:text-[var(--gold-500)] transition-colors"
      >
        <FiPhone size={14} />
        Call
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
                    <FiPhone size={16} className="text-[var(--gold-500)]" />
                    <h3 className="font-serif text-lg text-[var(--ink)]">
                      Choose how to call
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
                    Number: <span className="text-[var(--ink-soft)]">{phone}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {options.map(({ label, Icon, onClick }) => (
                      <button
                        key={label}
                        onClick={() => handleSelect(onClick)}
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
