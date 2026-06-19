"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiStar, FiArrowRight } from "react-icons/fi";
import {
  useUserTestimonial,
  usePostTestimonial,
} from "@/services/testimonial/TestmonialQueris";
import { useProfile } from "@/services/profile/ProfileQueries";
import { DashboardLayout } from "@/component/ui/DashboardLayout";

const TestimonialPage = () => {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { data: testimonialData, isLoading } = useUserTestimonial();
  const mutation = usePostTestimonial();
  const { data: profileData } = useProfile();

  useEffect(() => {
    if (profileData?.data?.name) setName(profileData.data.name);
  }, [profileData]);

  const raw = testimonialData?.data;
  const existing = Array.isArray(raw) ? raw[0] : raw;
  const has = !!existing;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!name.trim() || !details.trim()) {
      return setError("Please fill in your name and testimonial.");
    }
    mutation.mutate(
      { name: name.trim(), details: details.trim(), rating },

      {
        onSuccess: () => setSuccess("Thank you. Your testimonial was submitted."),
        onError: (err: any) => {
          setError(
            err?.response?.data?.message ||
              "Failed to submit. Please try again."
          );
        },
      }
    );
  };

  const formatDate = (s: string) => {
    if (!s) return "";
    try {
      return new Date(s).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <DashboardLayout
      active="Testimonial"
      eyebrow="Your Voice"
      title={has ? "Your testimonial" : "Share your experience"}
      description={
        has
          ? "Thank you for sharing. Your words help future clients move with confidence."
          : "If we made your move feel easier, we'd be honored to hear about it."
      }
    >
      {success && (
        <div className="mb-5 px-4 py-3 border rounded-[var(--radius-sm)] bg-[var(--cream)] border-[var(--sage-deep)]/35 text-[var(--sage-deep)] text-[13px] inline-flex items-center gap-2">
          <FiCheckCircle size={14} />
          {success}
        </div>
      )}
      {error && (
        <div className="mb-5 px-4 py-3 border rounded-[var(--radius-sm)] bg-[#fbeceb] border-[#b3261e]/25 text-[#8f2018] text-[13px] inline-flex items-center gap-2">
          <FiAlertCircle size={14} />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] p-10 text-center text-[var(--ink-soft)] text-[14px]">
          Loading…
        </div>
      ) : has ? (
        <article className="bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] p-8 md:p-10 max-w-3xl shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--line)]">
            <div className="flex items-center gap-2 text-[var(--gold)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                  key={i}
                  size={14}
                  className={i < (existing.rating ?? 5) ? "fill-[var(--gold)]" : "opacity-30"}
                />
              ))}
            </div>
            {existing.status && (
              <span className="text-[10px] uppercase tracking-[0.22em] font-[family-name:var(--font-accent)] text-[var(--sage-deep)] bg-[var(--canvas)] border border-[var(--line)] rounded-full px-3 py-1">
                {existing.status}
              </span>
            )}
          </div>
          <blockquote className="font-serif text-[clamp(1.25rem,1.4vw+1rem,1.75rem)] leading-[1.4] text-[var(--ink)]">
            &ldquo;{existing.details}&rdquo;
          </blockquote>
          <footer className="mt-7 pt-5 border-t border-[var(--line)] flex items-center gap-4">
            <div className="w-px h-9 bg-[var(--gold)]/60" />
            <div className="flex flex-col">
              <cite className="not-italic font-serif text-lg text-[var(--ink)]">
                {existing.name}
              </cite>
              {existing.created_at && (
                <span className="text-[12px] text-[var(--ink-faint)] mt-1">
                  Submitted {formatDate(existing.created_at)}
                </span>
              )}
            </div>
          </footer>
        </article>
      ) : (
        <form
          onSubmit={onSubmit}
          className="bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] p-8 md:p-10 flex flex-col gap-6 max-w-3xl shadow-[var(--shadow-soft)]"
        >
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)]">
              Rating
            </label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const val = i + 1;
                const filled = val <= (hovered || rating);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(val)}
                    onMouseEnter={() => setHovered(val)}
                    onMouseLeave={() => setHovered(0)}
                    className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
                    aria-label={`${val} star${val > 1 ? "s" : ""}`}
                  >
                    <FiStar
                      size={22}
                      className={filled ? "fill-[var(--gold)] text-[var(--gold)]" : "text-[var(--ink-faint)]"}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-[12px] text-[var(--ink-faint)]">{rating} / 5</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="t-name"
              className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)]"
            >
              Your name
            </label>
            <input
              id="t-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly={!!profileData?.data?.name}
              maxLength={100}
              placeholder="How you'd like to be quoted"
              className={`bg-[var(--canvas)] border border-[var(--line)] rounded-[var(--radius-sm)] focus:border-[var(--sage-deep)] px-4 h-12 text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none transition-colors ${
                profileData?.data?.name ? "opacity-70 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="t-details"
              className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)]"
            >
              Your testimonial
            </label>
            <textarea
              id="t-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
              maxLength={1000}
              placeholder="Tell us about your experience…"
              className="bg-[var(--canvas)] border border-[var(--line)] rounded-[var(--radius-sm)] focus:border-[var(--sage-deep)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none transition-colors resize-y min-h-[160px]"
            />
            <span className="text-[11px] text-[var(--ink-faint)] self-end">
              {details.length}/1000
            </span>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-gold-new disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <>
                  <svg
                    className="animate-spin"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                  </svg>
                  Submitting
                </>
              ) : (
                <>
                  Submit testimonial
                  <FiArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
};

export default TestimonialPage;
