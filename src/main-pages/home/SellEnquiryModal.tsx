"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiArrowRight } from "react-icons/fi";
import { postEnquiry } from "@/services/auth/AuthServices";
import { useProfile } from "@/services/profile/ProfileQueries";
import { formatUSPhoneInput, getUSPhoneDigits } from "@/helpers/phoneFormat";
import { FormDisclaimer } from "@/component/sharable/FormDisclaimer";
import { AuthModal } from "@/component/ui/AuthModal";
import { AuthField } from "@/component/ui/AuthShell";

interface Props {
  handleOpenModal: () => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  sellTime: string;
}

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  sellTime: "",
};

const SELL_WINDOWS = [
  { value: "now", label: "Now" },
  { value: "0-3", label: "0–3 months" },
  { value: "3-6", label: "3–6 months" },
  { value: "6+", label: "6+ months" },
];

export default function SellModal({ handleOpenModal }: Props) {
  const { data: profileData } = useProfile();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileData?.data) return;
    const parts = profileData.data.name ? profileData.data.name.split(" ") : [];
    setForm((p) => ({
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
    onSuccess: (response) => {
      const text =
        response?.data?.message ||
        "Thank you. We'll be in touch with a private valuation.";
      toast.success(text);
      setForm(initialForm);
      setConsent(false);
      setConsentError(null);
      setTimeout(handleOpenModal, 1500);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to send. Please try again."
      );
    },
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const next = name === "phone" ? formatUSPhoneInput(value) : value;
    setForm((p) => ({ ...p, [name]: next }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Please enter a valid email";
    const digits = getUSPhoneDigits(form.phone);
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (digits.length !== 10) e.phone = "Phone must be 10 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsentError(null);
    if (!validate()) return;
    if (!consent) {
      return setConsentError("Please review and accept our disclaimer.");
    }
    mutation.mutate({
      lagnt: process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID,
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      contact_no: parseInt(getUSPhoneDigits(form.phone), 10),
      type: "sell",
      state: form.state,
      city: form.city,
      zip: form.zipCode,
      address: form.address,
      schedule: form.sellTime,
    });
  };

  return (
    <AuthModal
      isOpen={true}
      onClose={handleOpenModal}
      eyebrow="Sell"
      title="Let's position your home with intention"
      description="Share a few details and we'll prepare a complimentary valuation for you."
      size="lg"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-5">
          <AuthField
            name="firstName"
            label="First name"
            value={form.firstName}
            onChange={onChange}
            placeholder="First name"
            required
            error={errors.firstName}
          />
          <AuthField
            name="lastName"
            label="Last name"
            value={form.lastName}
            onChange={onChange}
            placeholder="Last name"
            required
            error={errors.lastName}
          />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <AuthField
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@email.com"
            required
            error={errors.email}
            autoComplete="email"
          />
          <AuthField
            name="phone"
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            placeholder="(555) 123-4567"
            required
            error={errors.phone}
          />
        </div>

        <AuthField
          name="address"
          label="Property address"
          value={form.address}
          onChange={onChange}
          placeholder="Street address"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <AuthField
            name="city"
            label="City"
            value={form.city}
            onChange={onChange}
            placeholder="City"
          />
          <AuthField
            name="state"
            label="State"
            value={form.state}
            onChange={onChange}
            placeholder="State"
          />
          <AuthField
            name="zipCode"
            label="ZIP"
            value={form.zipCode}
            onChange={onChange}
            placeholder="ZIP"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
            Timing
          </label>
          <div className="flex flex-wrap gap-2">
            {SELL_WINDOWS.map((w) => {
              const active = form.sellTime === w.value;
              return (
                <button
                  key={w.value}
                  type="button"
                  onClick={() =>
                    setForm((p) => ({ ...p, sellTime: w.value }))
                  }
                  className={`h-10 px-4 text-[12px] uppercase tracking-[0.18em] border rounded-[var(--radius-sm)] transition-colors ${
                    active
                      ? "bg-[var(--gold-500)]/15 border-[var(--gold-500)] text-[var(--accent-text)]"
                      : "bg-[var(--surface-charcoal)] border-[var(--line-soft)] text-[var(--ink-soft)] hover:border-[var(--gold-500)]/50"
                  }`}
                >
                  {w.label}
                </button>
              );
            })}
          </div>
        </div>

        <FormDisclaimer
          checked={consent}
          onChange={(v) => {
            setConsent(v);
            setConsentError(null);
          }}
          error={consentError || ""}
        />

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={handleOpenModal}
            className="text-[12px] uppercase tracking-[0.18em] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
          >
            Cancel
          </button>
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
                Sending
              </>
            ) : (
              <>
                Request valuation
                <FiArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </AuthModal>
  );
}
