"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

interface ImageGalleryModalProps {
  images: string[];
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export const ImageGalleryModal = ({
  images,
  isOpen,
  initialIndex = 0,
  onClose,
}: ImageGalleryModalProps) => {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (!isOpen) return;
    setCurrent(initialIndex);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        setCurrent((p) => (p - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setCurrent((p) => (p + 1) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, initialIndex, onClose, images.length]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const prev = () =>
    setCurrent((p) => (p - 1 + images.length) % images.length);
  const next = () => setCurrent((p) => (p + 1) % images.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 md:px-8 h-14 border-b border-white/8 shrink-0">
            <span className="text-[12px] uppercase tracking-[0.2em] text-white/55">
              <span className="text-[var(--gold-500)] font-semibold">
                {String(current + 1).padStart(2, "0")}
              </span>
              <span className="mx-2 text-white/25">/</span>
              {String(images.length).padStart(2, "0")} photos
            </span>
            <button
              onClick={onClose}
              aria-label="Close gallery"
              className="w-10 h-10 flex items-center justify-center text-white/75 hover:text-white transition-colors"
            >
              <FiX size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 flex gap-1 p-1 min-h-0 overflow-hidden">
            {/* Main image */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[current]}
                    alt={`Property image ${current + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 70vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white hover:bg-[var(--gold-500)] hover:text-[var(--surface-ink)] hover:border-[var(--gold-500)] transition-colors flex items-center justify-center z-10"
                  >
                    <FiChevronLeft size={22} />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next image"
                    className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white hover:bg-[var(--gold-500)] hover:text-[var(--surface-ink)] hover:border-[var(--gold-500)] transition-colors flex items-center justify-center z-10"
                  >
                    <FiChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="hidden md:flex flex-col gap-1 w-[220px] overflow-y-auto custom-scrollbar shrink-0">
                {images.map((img, idx) => {
                  const active = idx === current;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={`relative w-full h-[120px] shrink-0 overflow-hidden border-2 transition-colors ${
                        active
                          ? "border-[var(--gold-500)]"
                          : "border-transparent hover:border-white/30"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="220px"
                        className={`object-cover ${active ? "" : "opacity-70 hover:opacity-100"} transition-opacity`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
