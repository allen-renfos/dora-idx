"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { postEnquiry } from "@/services/auth/AuthServices";
import { useProfile } from "@/services/profile/ProfileQueries";
import { formatUSPhoneInput, getUSPhoneDigits } from "@/helpers/phoneFormat";
import { FormDisclaimer } from "@/component/sharable/FormDisclaimer";
import { AuthModal } from "@/component/ui/AuthModal";
import { AuthField } from "@/component/ui/AuthShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EnquiryModal = ({ isOpen, onClose }: Props) => {
  const { data: profileData } = useProfile();
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    contact_no: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSuccess(null);
      setConsentError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!profileData?.data) return;
    const parts = profileData.data.name ? profileData.data.name.split(" ") : [];
    setFormData((p) => ({
      ...p,
      name: parts[0] || "",
      last_name: parts.slice(1).join(" ") || "",
      email: profileData.data.email || "",
      contact_no: formatUSPhoneInput(
        profileData.data.phone || profileData.data.mobile || p.contact_no
      ),
    }));
  }, [profileData]);

  const mutation = useMutation({
    mutationFn: (data: object) => postEnquiry(data),
    onSuccess: (response) => {
      const text =
        response?.data?.message ||
        "Thank you for your inquiry. We'll be in touch shortly.";
      setSuccess(text);
      toast.success(text, { autoClose: 5000 });
      setFormData({
        name: "",
        last_name: "",
        email: "",
        contact_no: "",
        description: "",
      });
      setErrors({});
      setConsent(false);
      setConsentError(null);
      setTimeout(onClose, 1200);
    },
    onError: (err: any) => {
      setSuccess(null);
      if (err?.response?.data?.errors) {
        setErrors(err.response.data.errors);
        Object.values(err.response.data.errors).forEach((m: any) =>
          toast.error(String(m))
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "First name is required";
    if (!formData.last_name.trim()) e.last_name = "Last name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      e.email = "Please enter a valid email";
    const digits = getUSPhoneDigits(formData.contact_no);
    if (!formData.contact_no.trim()) e.contact_no = "Phone is required";
    else if (digits.length !== 10) e.contact_no = "Phone must be 10 digits";
    if (!formData.description.trim())
      e.description = "Please tell us a little about your inquiry";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: name === "contact_no" ? formatUSPhoneInput(value) : value,
    }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsentError(null);
    if (!validate()) return;
    if (!consent) {
      return setConsentError("Please review and accept our disclaimer.");
    }
    mutation.mutate({
      lagnt: process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID || "",
      name: `${formData.name} ${formData.last_name}`,
      email: formData.email,
      contact_no: parseInt(getUSPhoneDigits(formData.contact_no), 10),
      description: formData.description,
      type: "connect",
    });
  };

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Inquiry"
      title="Send a private inquiry"
      description="Share a few details and we'll respond personally — usually within the day."
      size="lg"
    >
      {success && (
        <div className="mb-5 px-4 py-3 border bg-[var(--gold-500)]/10 border-[var(--gold-500)]/40 text-[var(--accent-text)] text-[13px] inline-flex items-center gap-2">
          <FiCheckCircle size={14} />
          {success}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AuthField
            name="name"
            label="First name"
            value={formData.name}
            onChange={onChange}
            placeholder="Your first name"
            required
            error={errors.name}
            autoFocus={!profileData?.data?.name}
          />
          <AuthField
            name="last_name"
            label="Last name"
            value={formData.last_name}
            onChange={onChange}
            placeholder="Last name"
            required
            error={errors.last_name}
          />
        </div>
        <AuthField
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="you@email.com"
          required
          error={errors.email}
          autoComplete="email"
        />
        <AuthField
          name="contact_no"
          label="Phone"
          type="tel"
          value={formData.contact_no}
          onChange={onChange}
          placeholder="(555) 123-4567"
          required
          error={errors.contact_no}
        />

        <div className="flex flex-col gap-2">
          <label
            htmlFor="enq-description"
            className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]"
          >
            Message
          </label>
          <textarea
            id="enq-description"
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={4}
            placeholder="What can we help you with?"
            className={`bg-[var(--surface-charcoal)] border px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none transition-colors resize-y min-h-[110px] ${
              errors.description
                ? "border-[#b3261e]/60"
                : "border-[var(--line-soft)] focus:border-[var(--gold-500)]/60"
            }`}
          />
          {errors.description && (
            <span className="text-[12px] text-[#b3261e]">
              {errors.description}
            </span>
          )}
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
            onClick={onClose}
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
                Send inquiry
                <FiArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </AuthModal>
  );
};
