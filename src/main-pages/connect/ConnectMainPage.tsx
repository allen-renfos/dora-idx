"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiArrowRight,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";

import { useNameContext } from "@/component/NameProvider";
import { postEnquiry } from "@/services/auth/AuthServices";
import { useProfile } from "@/services/profile/ProfileQueries";
import { FormDisclaimer } from "@/component/sharable/FormDisclaimer";
import { formatUSPhoneInput, getUSPhoneDigits } from "@/helpers/phoneFormat";
import { Reveal } from "@/component/ui/Reveal";
import HomeNewsletter from "@/main-pages/home/HomeNewsletter";

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  agreedToTerms: boolean;
};

const initialForm: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  message: "",
  agreedToTerms: false,
};

export default function ConnectMainPage() {
  const { name, shortDescription, address, email, socialUrls } = useNameContext();
  const { data: profileData } = useProfile();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  /* ---------- Auto-fill from profile ---------- */
  useEffect(() => {
    if (!profileData?.data) return;
    const parts = profileData.data.name ? profileData.data.name.split(" ") : [];
    setForm((prev) => ({
      ...prev,
      first_name: parts[0] || "",
      last_name: parts.slice(1).join(" ") || "",
      email: profileData.data.email || "",
      phone: formatUSPhoneInput(
        profileData.data.phone || profileData.data.mobile || prev.phone
      ),
    }));
  }, [profileData]);

  /* ---------- Address ---------- */
  const formattedAddress = (() => {
    const addr = address as unknown;
    if (typeof addr === "string") return addr;
    if (addr && typeof addr === "object") {
      const a = addr as Record<string, string | undefined>;
      return [a.address_1, a.address_2, a.city, a.state, a.zipcode, a.country]
        .filter(Boolean)
        .join(", ");
    }
    return "";
  })();

  const contactEmail = socialUrls.email || email || "";

  /* ---------- Mutation ---------- */
  const mutation = useMutation({
    mutationFn: (data: object) => postEnquiry(data),
    onSuccess: () => {
      setForm(initialForm);
      setErrors({});
      toast.success("Thank you. We'll be in touch shortly.", {
        autoClose: 5000,
      });
    },
    onError: (err: any) => {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        Object.values(err.response.data.errors).forEach((msg: any) =>
          toast.error(String(msg))
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  /* ---------- Validation ---------- */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.first_name.trim()) e.first_name = "First name is required";
    if (!form.last_name.trim()) e.last_name = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Please enter a valid email";
    const digits = getUSPhoneDigits(form.phone);
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (digits.length !== 10) e.phone = "Phone must be 10 digits";
    if (!form.message.trim()) e.message = "Message is required";
    if (!form.agreedToTerms)
      e.agreedToTerms = "Please review and accept the disclaimer.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    mutation.mutate({
      lagnt: process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID,
      name: form.first_name + " " + form.last_name,
      email: form.email,
      contact_no: parseInt(getUSPhoneDigits(form.phone), 10),
      description: form.message,
      type: "connect",
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setCaptchaText(Math.random().toString(36).slice(2, 8).toUpperCase());
    setCaptchaInput("");
    setCaptchaError("");
    setShowCaptcha(true);
  };

  const onCaptchaConfirm = () => {
    if (captchaInput.trim().toUpperCase() !== captchaText) {
      setCaptchaError("Captcha doesn't match. Try again.");
      return;
    }
    setShowCaptcha(false);
    setCaptchaError("");
    submit();
  };

  const refreshCaptcha = () => {
    setCaptchaText(Math.random().toString(36).slice(2, 8).toUpperCase());
    setCaptchaInput("");
    setCaptchaError("");
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name: fieldName, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    const next =
      fieldName === "phone" && typeof val === "string"
        ? formatUSPhoneInput(val)
        : val;
    setForm((p) => ({ ...p, [fieldName]: next }));
    if (errors[fieldName]) setErrors((p) => ({ ...p, [fieldName]: "" }));
  };

  const profileLocked = !!profileData?.data?.email;

  /* ---------- Render ---------- */
  const socials: { href?: string; Icon: React.ComponentType<{ size?: number }>; label: string }[] = [
    { href: socialUrls.instagram, Icon: FaInstagram, label: "Instagram" },
    { href: socialUrls.facebook, Icon: FaFacebookF, label: "Facebook" },
    { href: socialUrls.linkedin, Icon: FaLinkedinIn, label: "LinkedIn" },
    { href: socialUrls.twitter, Icon: FaTwitter, label: "X" },
    { href: socialUrls.youtube, Icon: FaYoutube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      {/* HERO */}
      <section className="relative isolate pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--surface-obsidian)] via-[var(--surface-ink)] to-[var(--surface-ink)]"
        />
        <div
          aria-hidden
          className="absolute -top-20 left-0 w-[460px] h-[460px] rounded-full opacity-[0.06] blur-[120px] bg-[var(--gold-500)]"
        />

        <div className="container-wide flex flex-col gap-5 max-w-3xl">
          <Reveal>
            <span className="eyebrow inline-flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-[var(--gold-500)]" />
              Connect
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-xl text-[var(--ink)]">
              Let&rsquo;s start with a{" "}
              <em className="not-italic italic text-[var(--gold-500)]">
                conversation
              </em>
              .
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="lede max-w-xl">
              Whether you&rsquo;re searching, selling, or simply exploring —
              share a few details below and {name || "we"} will respond
              personally, usually within the day.
            </p>
          </Reveal>
        </div>
      </section>

      {/* INFO TILES */}
      <section className="border-y border-[var(--line-soft)] bg-[var(--surface-obsidian)]">
        <div className="container-wide grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--line-soft)]">
          <InfoTile
            Icon={FiMail}
            label="Email"
            value={contactEmail || "—"}
            href={contactEmail ? `mailto:${contactEmail}` : undefined}
          />
          <InfoTile
            Icon={FiMapPin}
            label="Office"
            value={formattedAddress || "By appointment"}
          />
          <InfoTile
            Icon={FiPhone}
            label="Hours"
            value="Mon – Fri · 9 AM – 7 PM"
          />
        </div>
      </section>

      {/* FORM + ASIDE */}
      <section className="section-pad">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Aside */}
          <aside className="lg:col-span-4 flex flex-col gap-8">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-3 mb-4">
                <span className="inline-block h-px w-10 bg-[var(--gold-500)]" />
                Direct Line
              </span>
              <h2 className="display-md text-[var(--ink)] mb-5">
                A note from{" "}
                <em className="italic text-[var(--gold-500)]">
                  {name || "the advisor"}
                </em>
              </h2>
              <p className="lede mb-8">
                {shortDescription ||
                  "Every great move starts with a quiet conversation. Tell me what you're considering — I'll listen first, advise carefully, and only act when the moment is right."}
              </p>

              {socials.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
                    Follow along
                  </span>
                  <div className="flex items-center gap-3">
                    {socials.map(({ href, Icon, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="w-11 h-11 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--ink-soft)] hover:text-[var(--gold-500)] hover:border-[var(--gold-500)] transition-colors"
                      >
                        <Icon size={15} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Reveal>

            <Reveal delay={0.1}>
              <div className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] p-6">
                <p className="text-[12px] uppercase tracking-[0.22em] text-[var(--gold-500)] mb-3">
                  Replies in under 24 hours
                </p>
                <p className="text-[14px] text-[var(--ink-soft)] leading-relaxed">
                  Every inquiry is read personally. Expect a thoughtful reply,
                  not a templated one.
                </p>
              </div>
            </Reveal>
          </aside>

          {/* Form */}
          <div className="lg:col-span-8">
            <Reveal y={32}>
              <form
                onSubmit={onSubmit}
                className="bg-[var(--surface-obsidian)] border border-[var(--line-soft)] p-6 md:p-10 flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field
                    name="first_name"
                    label="First name"
                    value={form.first_name}
                    error={errors.first_name}
                    onChange={onChange}
                    readOnly={profileLocked}
                  />
                  <Field
                    name="last_name"
                    label="Last name"
                    value={form.last_name}
                    error={errors.last_name}
                    onChange={onChange}
                    readOnly={profileLocked}
                  />
                </div>
                <Field
                  type="email"
                  name="email"
                  label="Email"
                  value={form.email}
                  error={errors.email}
                  onChange={onChange}
                  readOnly={profileLocked}
                />
                <Field
                  type="tel"
                  name="phone"
                  label="Phone"
                  value={form.phone}
                  error={errors.phone}
                  onChange={onChange}
                  placeholder="(555) 123-4567"
                  readOnly={profileLocked}
                />

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="message"
                    className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    rows={5}
                    placeholder="Tell us a little about what you're looking for…"
                    className={`bg-[var(--surface-charcoal)] border px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none transition-colors resize-y min-h-[120px] ${
                      errors.message
                        ? "border-[#b3261e]/60"
                        : "border-[var(--line-soft)] focus:border-[var(--gold-500)]/60"
                    }`}
                  />
                  {errors.message && (
                    <span className="text-[12px] text-[#b3261e]">
                      {errors.message}
                    </span>
                  )}
                </div>

                <FormDisclaimer
                  checked={form.agreedToTerms}
                  onChange={(v) => {
                    setForm((p) => ({ ...p, agreedToTerms: v }));
                    if (errors.agreedToTerms)
                      setErrors((p) => ({ ...p, agreedToTerms: "" }));
                  }}
                  error={errors.agreedToTerms || ""}
                />

                <div className="flex items-center justify-end gap-3 pt-2">
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
                        Send Message
                        <FiArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Captcha modal */}
      <AnimatePresence>
        {showCaptcha && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-sm"
              onClick={() => setShowCaptcha(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-[92%] max-w-[440px] bg-[var(--surface-ink)] border border-[var(--line-soft)] p-6 md:p-7"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-xl text-[var(--ink)]">
                  Quick verification
                </h3>
                <button
                  onClick={() => setShowCaptcha(false)}
                  aria-label="Close"
                  className="w-9 h-9 flex items-center justify-center text-[var(--ink-soft)] hover:text-[var(--ink)]"
                >
                  <FiX size={20} />
                </button>
              </div>

              <p className="text-[14px] text-[var(--ink-soft)] mb-4 leading-relaxed">
                To prevent spam, please retype the characters below.
              </p>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 select-none bg-[var(--surface-charcoal)] border border-[var(--line-soft)] py-3 text-center font-serif text-2xl tracking-[0.4em] text-[var(--gold-500)]">
                  {captchaText}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  aria-label="Refresh captcha"
                  className="w-11 h-11 border border-[var(--line-soft)] text-[var(--ink-soft)] hover:text-[var(--gold-500)] hover:border-[var(--gold-500)] flex items-center justify-center transition-colors"
                >
                  <FiRefreshCw size={16} />
                </button>
              </div>

              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                placeholder="Enter the characters"
                className={`w-full bg-[var(--surface-charcoal)] border px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none transition-colors text-center tracking-[0.32em] font-serif text-lg ${
                  captchaError
                    ? "border-[#b3261e]/60"
                    : "border-[var(--line-soft)] focus:border-[var(--gold-500)]/60"
                }`}
              />
              {captchaError && (
                <span className="block mt-2 text-[12px] text-[#b3261e]">
                  {captchaError}
                </span>
              )}

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCaptcha(false)}
                  className="text-[12px] uppercase tracking-[0.18em] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onCaptchaConfirm}
                  className="btn-gold-new"
                >
                  Verify &amp; send
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Newsletter */}
      <HomeNewsletter />
    </>
  );
}

/* ---------- Sub-components ---------- */

function InfoTile({
  Icon,
  label,
  value,
  href,
}: {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="w-11 h-11 rounded-full bg-[var(--gold-500)]/10 border border-[var(--gold-500)]/30 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-[var(--gold-500)]" />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
          {label}
        </span>
        <span className="text-[15px] text-[var(--ink-soft)] break-words">{value}</span>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("mailto") ? undefined : "_blank"}
        rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
        className="flex items-start gap-4 px-6 md:px-8 py-7 hover:bg-[var(--surface-charcoal)] transition-colors"
      >
        {inner}
      </a>
    );
  }
  return (
    <div className="flex items-start gap-4 px-6 md:px-8 py-7">{inner}</div>
  );
}

function Field({
  name,
  label,
  value,
  error,
  onChange,
  type = "text",
  placeholder,
  readOnly,
}: {
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`bg-[var(--surface-charcoal)] border px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none transition-colors h-12 ${
          error
            ? "border-[#b3261e]/60"
            : "border-[var(--line-soft)] focus:border-[var(--gold-500)]/60"
        } ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
      />
      {error && <span className="text-[12px] text-[#b3261e]">{error}</span>}
    </div>
  );
}
