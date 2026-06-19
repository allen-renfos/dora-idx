"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { postNewsLetter } from "@/services/auth/AuthServices";
import { useProfile } from "@/services/profile/ProfileQueries";
import { FormDisclaimer } from "@/component/sharable/FormDisclaimer";
import { Reveal } from "@/component/ui/Reveal";

export default function HomeNewsletter() {
  const { data: profileData } = useProfile();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  useEffect(() => {
    if (profileData?.data?.email) setEmail(profileData.data.email);
  }, [profileData]);

  useEffect(() => {
    if (!email.trim()) {
      setIsValid(false);
      return;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(re.test(email));
  }, [email]);

  const mutation = useMutation({
    mutationFn: (user: { email: string; lagnt: string | undefined }) =>
      postNewsLetter(user),
    onSuccess: () => {
      setEmail("");
      setTouched(false);
      setConsent(false);
      toast.success("You're subscribed. Watch your inbox.", {
        position: "top-right",
        autoClose: 5000,
      });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || "Subscription failed. Please try again.";
      toast.error(msg, { position: "top-right", autoClose: 5000 });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!consent) {
      setConsentError("Please review and accept the disclaimer.");
      toast.error("Please review and accept the disclaimer.");
      return;
    }
    mutation.mutate({
      email,
      lagnt: process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID,
    });
  };

  return (
    <section className="bg-[var(--canvas)] section-pad">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--pine)] text-[var(--on-pine)] shadow-[var(--shadow-lift)]">
          {/* Photography texture — contained inside the card's own stacking context */}
          <Image
            src="/images/sample8.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.14]"
            style={{ objectPosition: "center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--pine)] via-[var(--pine)]/92 to-[#18241f]" />
          {/* Gold hairline framing */}
          <div className="pointer-events-none absolute inset-4 md:inset-6 rounded-[calc(var(--radius-lg)-12px)] border border-[var(--gold-300)]/15" />

          <div className="relative grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center p-8 sm:p-12 lg:p-16">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <Reveal>
                <span className="eyebrow on-dark inline-flex items-center gap-4">
                  <span className="inline-block h-px w-10 bg-[var(--gold-300)]" />
                  Stay Close
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="display-lg mt-6 text-[var(--on-pine)]">
                  The <em className="italic text-[var(--gold-300)]">quiet</em>{" "}
                  dispatch.
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="lede mt-5 max-w-md mx-auto lg:mx-0 text-[var(--on-pine-soft)]">
                  New homes, a measured word on the market, and the rare private
                  preview — sent with care, never noise.
                </p>
              </Reveal>
            </div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setTouched(true);
                    }}
                    onBlur={() => setTouched(true)}
                    disabled={mutation.isPending}
                    readOnly={!!profileData?.data?.email}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-white/[0.07] border border-[var(--on-pine-faint)] focus:border-[var(--gold-300)] rounded-full pl-5 pr-11 py-3.5 text-[15px] text-[var(--on-pine)] placeholder:text-[var(--on-pine-faint)] outline-none transition-colors"
                  />
                  {touched && email && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                      {isValid ? (
                        <FiCheckCircle className="text-[#8fb98a]" size={18} />
                      ) : (
                        <FiAlertCircle className="text-[#e0a3a0]" size={18} />
                      )}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[12px] font-[family-name:var(--font-accent)] tracking-[0.22em] uppercase bg-[var(--gold-300)] text-[var(--pine)] hover:bg-[var(--on-pine)] transition-colors disabled:opacity-50"
                >
                  {mutation.isPending ? "Sending" : "Subscribe"}
                  <FiArrowRight size={14} />
                </button>
              </div>

              <div className="text-left rounded-[var(--radius-md)] bg-[var(--cream)] border border-[var(--line)] p-5">
                <FormDisclaimer
                  checked={consent}
                  onChange={(v) => {
                    setConsent(v);
                    setConsentError(null);
                  }}
                  error={consentError || ""}
                />
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}
