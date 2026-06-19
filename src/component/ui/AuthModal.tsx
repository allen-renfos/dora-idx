"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "lg";
}

const SIZE_CLASS: Record<NonNullable<Props["size"]>, string> = {
  sm: "max-w-[500px]",
  lg: "max-w-[1300px]",
};

export function AuthModal({
  isOpen,
  onClose,
  eyebrow,
  title,
  description,
  children,
  footer,
  size = "sm",
}: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998] bg-black/65 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Centering wrapper — plain div so framer-motion can't interfere */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full ${SIZE_CLASS[size]} flex flex-col pointer-events-auto`}
              style={{ maxHeight: "80vh" }}
            >
              {/* Close button — always visible, above scroll area */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
              >
                <FiX size={20} />
              </button>

              {/* Scrollable content */}
              <div className="overflow-y-scroll custom-scrollbar min-h-0">
                <div className="bg-[var(--surface)] border border-[var(--line)] p-7 md:p-9 relative">
                  <div
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-500)]/55 to-transparent"
                  />

                  <div className="flex flex-col gap-3 mb-7 mt-2">
                    {eyebrow && (
                      <span className="eyebrow inline-flex items-center gap-3">
                        <span className="inline-block h-px w-8 bg-[var(--gold-500)]" />
                        {eyebrow}
                      </span>
                    )}
                    <h2 className="font-serif text-2xl md:text-3xl text-[var(--ink)] leading-tight tracking-[-0.01em]">
                      {title}
                    </h2>
                    {description && (
                      <p className="text-[14px] text-[var(--ink-soft)] leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>

                  {children}

                  {footer && (
                    <div className="text-center mt-6 text-[14px] text-[var(--ink-faint)]">
                      {footer}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
