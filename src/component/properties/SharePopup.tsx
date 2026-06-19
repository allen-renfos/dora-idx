"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiCopy, FiCheck, FiShare2, FiX, FiMail } from "react-icons/fi";
import { FaWhatsapp, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { MdOutlineTextsms } from "react-icons/md";

interface Props {
  property?: any;
}

export const SharePopup = ({ property }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = property?.address
    ? `Check out this property at ${String(property.address).replace(/±/g, "#")}`
    : "Check out this property";
  const sharePrice = property?.price
    ? `$${Number(property.price).toLocaleString()}`
    : "";
  const shareText = `${shareTitle}${sharePrice ? ` – ${sharePrice}` : ""}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard", {
        style: {
          background: "#ffffff",
          color: "#1a1a1a",
          border: "1px solid #c2a878",
          borderRadius: 0,
        },
        iconTheme: { primary: "#c2a878", secondary: "#ffffff" },
      });
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const options: {
    label: string;
    Icon: React.ComponentType<{ size?: number }>;
    onClick: () => void;
    accent?: boolean;
  }[] = [
    {
      label: copied ? "Copied" : "Copy link",
      Icon: copied ? FiCheck : FiCopy,
      onClick: handleCopy,
      accent: true,
    },
    {
      label: "WhatsApp",
      Icon: FaWhatsapp,
      onClick: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`,
          "_blank"
        ),
    },
    {
      label: "SMS",
      Icon: MdOutlineTextsms,
      onClick: () =>
        window.open(
          `sms:?body=${encodeURIComponent(shareText + " " + shareUrl)}`
        ),
    },
    {
      label: "Facebook",
      Icon: FaFacebookF,
      onClick: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank",
          "width=600,height=400"
        ),
    },
    {
      label: "X",
      Icon: FaXTwitter,
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText
          )}&url=${encodeURIComponent(shareUrl)}`,
          "_blank",
          "width=600,height=400"
        ),
    },
    {
      label: "Email",
      Icon: FiMail,
      onClick: () =>
        window.open(
          `mailto:?subject=${encodeURIComponent(
            shareTitle
          )}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`
        ),
    },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2.5 h-11 border border-[var(--line-medium)] rounded-[var(--radius-pill)] hover:border-[var(--sage-deep)] text-[var(--ink-soft)] hover:text-[var(--sage-deep)] transition-colors text-[12px] tracking-[0.18em] uppercase font-[family-name:var(--font-accent)]"
      >
        <FiShare2 size={14} />
        Share
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
              <div className="bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] relative overflow-hidden">
                <div
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/55 to-transparent"
                />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--line)]">
                  <div className="flex items-center gap-3">
                    <FiShare2 size={16} className="text-[var(--sage-deep)]" />
                    <h3 className="font-serif text-lg text-[var(--ink)]">
                      Share this listing
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close"
                    className="w-9 h-9 flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* URL preview */}
                  <div className="flex items-stretch border border-[var(--line)] bg-[var(--canvas)] rounded-[var(--radius-sm)] mb-5">
                    <input
                      readOnly
                      value={shareUrl}
                      className="flex-1 px-3 py-3 text-[12px] text-[var(--ink-soft)] bg-transparent outline-none truncate"
                    />
                    <button
                      onClick={handleCopy}
                      className="px-4 inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-[var(--sage-deep)] hover:text-[var(--ink)] border-l border-[var(--line)] transition-colors font-[family-name:var(--font-accent)]"
                    >
                      {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* Options grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {options.map(({ label, Icon, onClick, accent }) => (
                      <button
                        key={label}
                        onClick={onClick}
                        className={`flex flex-col items-center justify-center gap-2.5 py-5 border rounded-[var(--radius-sm)] transition-colors group ${
                          accent
                            ? "bg-[var(--sage)]/12 border-[var(--sage)]/40 text-[var(--sage-deep)] hover:border-[var(--sage-deep)]/60"
                            : "bg-[var(--canvas)] border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--sage-deep)]/50 hover:text-[var(--sage-deep)]"
                        }`}
                      >
                        <Icon size={20} />
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
