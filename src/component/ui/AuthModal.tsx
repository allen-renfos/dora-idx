"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  // SSR-safe mount guard: createPortal needs document.body, which doesn't
  // exist during server render. Only portal after the component has mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

  if (!mounted) return null;

  return createPortal(
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
                className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--canvas-2)] transition-colors"
              >
                <FiX size={20} />
              </button>

              {/* Scrollable content */}
              <div className="overflow-y-scroll custom-scrollbar min-h-0 rounded-[var(--radius-md)]">
                <div className="bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] shadow-[var(--shadow-lift)] p-7 md:p-10 relative">
                  <div
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/60 to-transparent rounded-t-[var(--radius-md)]"
                  />

                  <div className="flex flex-col gap-3 mb-7 mt-2">
                    {eyebrow && (
                      <span className="eyebrow inline-flex items-center gap-3">
                        <span className="inline-block h-px w-8 bg-[var(--gold)]" />
                        {eyebrow}
                      </span>
                    )}
                    <h2 className="font-serif text-[1.7rem] md:text-[2.1rem] text-[var(--ink)] leading-[1.08] tracking-[-0.015em]">
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
                    <div className="text-center mt-7 pt-6 border-t border-[var(--line)] text-[14px] text-[var(--ink-faint)]">
                      {footer}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
