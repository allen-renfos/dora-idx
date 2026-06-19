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
    <section className="relative text-[var(--ink)] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/sample8.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-[var(--surface-ink)]/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-ink)] via-transparent to-[var(--surface-ink)]" />
      </div>

      <div className="container-page section-pad">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <span className="eyebrow inline-flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-[var(--gold-500)]" />
              Stay close
              <span className="inline-block h-px w-10 bg-[var(--gold-500)]" />
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="display-lg mt-6">
              Receive the{" "}
              <em className="italic text-[var(--gold-500)]">quiet</em> newsletter.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="lede mt-5 max-w-lg mx-auto">
              New listings, market perspective, and the occasional private
              preview — thoughtful dispatches, never noise.
            </p>
          </Reveal>

          <motion.form
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-6"
          >
            <div className="flex items-stretch border-b border-[var(--line-medium)] focus-within:border-[var(--accent)] transition-colors">
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
                className="flex-1 bg-transparent border-0 outline-none text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-4 text-[15px]"
              />
              <div className="flex items-center pr-3 text-[var(--ink-faint)]">
                {touched && email && (
                  isValid ? (
                    <FiCheckCircle className="text-[#2e7d32]" size={18} />
                  ) : (
                    <FiAlertCircle className="text-[#b3261e]" size={18} />
                  )
                )}
              </div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="pl-5 pr-2 flex items-center gap-2 text-[12px] font-bold tracking-[0.22em] uppercase text-[var(--accent-text)] hover:text-[var(--ink)] transition-colors disabled:opacity-50"
              >
                {mutation.isPending ? "Sending" : "Subscribe"}
                <FiArrowRight size={14} />
              </button>
            </div>

            <div className="text-left">
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
    </section>
  );
}
