"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiArrowRight, FiCalendar, FiClock } from "react-icons/fi";
import { postEnquiry } from "@/services/auth/AuthServices";
import { useProfile } from "@/services/profile/ProfileQueries";
import { formatUSPhoneInput, getUSPhoneDigits } from "@/helpers/phoneFormat";
import { FormDisclaimer } from "@/component/sharable/FormDisclaimer";
import { AuthModal } from "@/component/ui/AuthModal";
import { AuthField } from "@/component/ui/AuthShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  property?: any;
}

const TABS = [
  { key: "tour", label: "Schedule Tour" },
  { key: "enquire", label: "Send Inquiry" },
] as const;

const TIME_OPTIONS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

const SELL_WINDOWS = [
  { value: "now", label: "Now" },
  { value: "0-6", label: "0–6 months" },
  { value: "6+", label: "6+ months" },
];

// ─── Shared types ────────────────────────────────────────────────────────────

interface SharedFormProps {
  property?: any;
  profileData?: any;
  onClose: () => void;
}

// ─── Schedule Tour Form ───────────────────────────────────────────────────────

function ScheduleTourForm({ property, profileData, onClose }: SharedFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    tourDate: "",
    tourTime: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileData?.data) return;
    const parts = profileData.data.name ? profileData.data.name.split(" ") : [];
    setFormData((p) => ({
      ...p,
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
      email: profileData.data.email || "",
      phone: formatUSPhoneInput(
        profileData.data.phone || profileData.data.mobile || p.phone
      ),
    }));
  }, [profileData]);

  const mutation = useMutation({
    mutationFn: (data: object) => postEnquiry(data),
    onSuccess: () => {
      toast.success("Showing requested. We'll confirm shortly.");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "", tourDate: "", tourTime: "" , });
      setErrors({});
      setConsent(false);
      setConsentError(null);
      onClose();
    },
    onError: (err: any) => {
      if (err?.response?.data?.errors) {
        setErrors(err.response.data.errors);
        Object.values(err.response.data.errors).forEach((m: any) =>
          toast.error(String(m))
        );
      } else {
        toast.error("Failed to submit. Please try again.");
      }
    },
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const next = name === "phone" ? formatUSPhoneInput(value) : value;
    setFormData((p) => ({ ...p, [name]: next }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Please enter a valid email";
    const digits = getUSPhoneDigits(formData.phone);
    if (!formData.phone.trim()) e.phone = "Phone is required";
    else if (digits.length !== 10) e.phone = "Phone must be 10 digits";
    if (!formData.tourDate) e.tourDate = "Please pick a preferred date";
    if (!formData.tourTime) e.tourTime = "Please pick a preferred time";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsentError(null);
    if (!validate()) return;
    if (!consent) {
      setConsentError("Please review and accept our disclaimer.");
      return;
    }
    mutation.mutate({
      lagnt: process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID || "",
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      contact_no: parseInt(getUSPhoneDigits(formData.phone), 10),
      description: formData.message || "",
      property_id: property?.id || property?.idd || property?.ListingId || property?.ref || "",
      type: "listing_tour",
      tour_date: formData.tourDate,
      tour_time: formData.tourTime,
      schedule: `${formData.tourDate} ${formData.tourTime}`,
    });
  };

  const todayISO = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AuthField name="firstName" label="First name" value={formData.firstName} onChange={onChange} placeholder="Your first name" required error={errors.firstName} />
        <AuthField name="lastName" label="Last name" value={formData.lastName} onChange={onChange} placeholder="Last name" required error={errors.lastName} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AuthField name="email" label="Email" type="email" value={formData.email} onChange={onChange} placeholder="you@email.com" required error={errors.email} autoComplete="email" />
        <AuthField name="phone" label="Phone" type="tel" value={formData.phone} onChange={onChange} placeholder="(555) 123-4567" required error={errors.phone} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DateTimeField
          icon={<FiCalendar size={14} className="text-[var(--gold-500)]" />}
          label="Preferred date"
          error={errors.tourDate}
        >
          <input
            type="date"
            name="tourDate"
            value={formData.tourDate}
            onChange={onChange}
            min={todayISO}
            className="bg-transparent text-white text-[14px] outline-none w-full"
          />
        </DateTimeField>
        <DateTimeField
          icon={<FiClock size={14} className="text-[var(--gold-500)]" />}
          label="Preferred time"
          error={errors.tourTime}
        >
          <select
            name="tourTime"
            value={formData.tourTime}
            onChange={onChange}
            className="bg-transparent text-white text-[14px] outline-none w-full"
          >
              <option value="" style={{ color: "#111111", backgroundColor: "#ffffff" }}>
                Select a time
              </option>
            {TIME_OPTIONS.map((t) => (
                <option
                  key={t}
                  value={t}
                  style={{ color: "#111111", backgroundColor: "#ffffff" }}
                >
                  {t}
                </option>
            ))}
          </select>
        </DateTimeField>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="tour-message" className="text-[10px] uppercase tracking-[0.22em] text-white/55">
          Message <span className="text-white/35 normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          id="tour-message"
          name="message"
          value={formData.message}
          onChange={onChange}
          rows={3}
          placeholder="Anything we should know?"
          className="bg-[var(--surface-charcoal)] border border-[var(--line-soft)] focus:border-[var(--gold-500)]/60 px-4 py-3 text-[14px] text-white placeholder:text-white/40 outline-none transition-colors resize-y min-h-[90px]"
        />
      </div>

      <FormDisclaimer
        checked={consent}
        onChange={(v) => { setConsent(v); setConsentError(null); }}
        error={consentError || ""}
      />

      <div className="flex items-center justify-end gap-3 pt-1">
        <button type="button" onClick={onClose} className="text-[12px] uppercase tracking-[0.18em] text-white/65 hover:text-white transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={mutation.isPending} className="btn-gold-new disabled:opacity-50 disabled:cursor-not-allowed">
          {mutation.isPending ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
              Sending
            </>
          ) : (
            <>Request showing <FiArrowRight size={14} /></>
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Send Inquiry Form ────────────────────────────────────────────────────────

function SendInquiryForm({ property, profileData, onClose }: SharedFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    whenToSell: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileData?.data) return;
    const parts = profileData.data.name ? profileData.data.name.split(" ") : [];
    setFormData((p) => ({
      ...p,
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
      email: profileData.data.email || "",
      phone: formatUSPhoneInput(
        profileData.data.phone || profileData.data.mobile || p.phone
      ),
    }));
  }, [profileData]);

  const mutation = useMutation({
    mutationFn: (data: object) => postEnquiry(data),
    onSuccess: () => {
      toast.success("Inquiry sent. We'll be in touch.");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "", whenToSell: "" });
      setErrors({});
      setConsent(false);
      setConsentError(null);
      onClose();
    },
    onError: (err: any) => {
      if (err?.response?.data?.errors) {
        setErrors(err.response.data.errors);
        Object.values(err.response.data.errors).forEach((m: any) =>
          toast.error(String(m))
        );
      } else {
        toast.error("Failed to submit. Please try again.");
      }
    },
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const next = name === "phone" ? formatUSPhoneInput(value) : value;
    setFormData((p) => ({ ...p, [name]: next }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Please enter a valid email";
    const digits = getUSPhoneDigits(formData.phone);
    if (!formData.phone.trim()) e.phone = "Phone is required";
    else if (digits.length !== 10) e.phone = "Phone must be 10 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsentError(null);
    if (!validate()) return;
    if (!consent) {
      setConsentError("Please review and accept our disclaimer.");
      return;
    }

    const scheduleMap: Record<string, string> = {
      now: "Now",
      "0-6": "0-6 months",
      "6+": "6+ months",
    };

    mutation.mutate({
      lagnt: process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID || "",
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      contact_no: parseInt(getUSPhoneDigits(formData.phone), 10),
      description: formData.message || "",
      schedule: scheduleMap[formData.whenToSell] || formData.whenToSell || "",
      property_id: property?.id || property?.idd || property?.ListingId || property?.ref || "",
      type: "listing_enquire",
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AuthField name="firstName" label="First name" value={formData.firstName} onChange={onChange} placeholder="Your first name" required error={errors.firstName} />
        <AuthField name="lastName" label="Last name" value={formData.lastName} onChange={onChange} placeholder="Last name" required error={errors.lastName} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AuthField name="email" label="Email" type="email" value={formData.email} onChange={onChange} placeholder="you@email.com" required error={errors.email} autoComplete="email" />
        <AuthField name="phone" label="Phone" type="tel" value={formData.phone} onChange={onChange} placeholder="(555) 123-4567" required error={errors.phone} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-[0.22em] text-white/55">Timing</label>
        <div className="flex flex-wrap gap-2">
          {SELL_WINDOWS.map((w) => {
            const active = formData.whenToSell === w.value;
            return (
              <button
                key={w.value}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, whenToSell: w.value }))}
                className={`h-10 px-4 text-[12px] uppercase tracking-[0.18em] border transition-colors ${
                  active
                    ? "bg-[var(--gold-500)]/15 border-[var(--gold-500)] text-[var(--gold-500)]"
                    : "bg-[var(--surface-charcoal)] border-[var(--line-soft)] text-white/75 hover:border-[var(--gold-500)]/50"
                }`}
              >
                {w.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="enquiry-message" className="text-[10px] uppercase tracking-[0.22em] text-white/55">
          Message <span className="text-white/35 normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          value={formData.message}
          onChange={onChange}
          rows={3}
          placeholder="Anything we should know?"
          className="bg-[var(--surface-charcoal)] border border-[var(--line-soft)] focus:border-[var(--gold-500)]/60 px-4 py-3 text-[14px] text-white placeholder:text-white/40 outline-none transition-colors resize-y min-h-[90px]"
        />
      </div>

      <FormDisclaimer
        checked={consent}
        onChange={(v) => { setConsent(v); setConsentError(null); }}
        error={consentError || ""}
      />

      <div className="flex items-center justify-end gap-3 pt-1">
        <button type="button" onClick={onClose} className="text-[12px] uppercase tracking-[0.18em] text-white/65 hover:text-white transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={mutation.isPending} className="btn-gold-new disabled:opacity-50 disabled:cursor-not-allowed">
          {mutation.isPending ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
              Sending
            </>
          ) : (
            <>Send inquiry <FiArrowRight size={14} /></>
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────

export const PropertyEnquiryModal = ({ isOpen, onClose, property }: Props) => {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("tour");
  const { data: profileData } = useProfile();

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow={activeTab === "tour" ? "Showings" : "Inquiry"}
      title={
        activeTab === "tour" ? "Schedule a private showing" : "Send a private inquiry"
      }
      description={
        property?.address
          ? `For ${String(property.address).replace(/±/g, "#")}.`
          : "We'll route your message to your advisor."
      }
      size="lg"
    >
      {/* Tabs */}
      <div className="relative flex items-center gap-1 mb-6 border-b border-[var(--line-soft)]">
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-3 text-[12px] font-bold tracking-[0.18em] uppercase transition-colors ${
                active ? "text-[var(--gold-500)]" : "text-white/55 hover:text-white"
              }`}
            >
              {tab.label}
              {active && (
                <motion.span
                  layoutId="enquiry-tab-indicator"
                  className="absolute left-3 right-3 -bottom-px h-px bg-[var(--gold-500)]"
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "tour" ? (
        <ScheduleTourForm property={property} profileData={profileData} onClose={onClose} />
      ) : (
        <SendInquiryForm property={property} profileData={profileData} onClose={onClose} />
      )}
    </AuthModal>
  );
};

// ─── DateTimeField helper ─────────────────────────────────────────────────────

function DateTimeField({
  icon,
  label,
  error,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] uppercase tracking-[0.22em] text-white/55">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 bg-[var(--surface-charcoal)] border h-12 px-4 transition-colors focus-within:border-[var(--gold-500)]/60 ${
          error ? "border-red-500/60" : "border-[var(--line-soft)]"
        }`}
      >
        {icon}
        {children}
      </div>
      {error && <span className="text-[12px] text-red-400">{error}</span>}
    </div>
  );
}
