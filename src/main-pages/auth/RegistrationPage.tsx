"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register } from "@/services/auth/AuthServices";
import { FormDisclaimer } from "@/component/sharable/FormDisclaimer";
import { AuthShell, AuthField, AuthAlert } from "@/component/ui/AuthShell";
import { FiArrowRight } from "react-icons/fi";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  uuid?: string;
}

export default function RegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (user: RegisterData) => register(user),
    onSuccess: () => {
      toast.success("Welcome aboard. Please sign in to continue.", {
        autoClose: 6000,
      });
      setSuccess("Account created. Redirecting to sign in…");
      setTimeout(() => router.push("/login"), 2200);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(msg, { autoClose: 4000 });
      setError(msg);
    },
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (error) setError(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.password_confirmation
    ) {
      return setError("Please fill in all fields");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return setError("Please enter a valid email address");
    }
    if (formData.password !== formData.password_confirmation) {
      return setError("Passwords don't match");
    }
    if (formData.password.length < 8) {
      return setError("Password must be at least 8 characters");
    }
    if (!consent) {
      return setConsentError("Please review and accept our disclaimer.");
    }

    mutation.mutate({
      ...formData,
      uuid: process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID,
    });
  };

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
      <AuthShell
        eyebrow="Create Account"
        title="Build your private dashboard."
        description="Save searches, favorites, and stay close to listings as they hit the market."
        footer={
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--accent-text)] hover:text-[var(--ink)] transition-colors font-semibold"
            >
              Sign in
            </Link>
          </>
        }
      >
        {error && <AuthAlert tone="error">{error}</AuthAlert>}
        {success && <AuthAlert tone="success">{success}</AuthAlert>}

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <AuthField
            name="name"
            label="Full name"
            value={formData.name}
            onChange={onChange}
            placeholder="Your name"
            autoFocus
            required
            autoComplete="name"
          />
          <AuthField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={onChange}
            placeholder="you@email.com"
            required
            autoComplete="email"
          />
          <AuthField
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={onChange}
            placeholder="At least 8 characters"
            required
            autoComplete="new-password"
          />
          <AuthField
            name="password_confirmation"
            label="Confirm password"
            type="password"
            value={formData.password_confirmation}
            onChange={onChange}
            placeholder="Repeat password"
            required
            autoComplete="new-password"
          />

          <FormDisclaimer
            checked={consent}
            onChange={(v) => {
              setConsent(v);
              setConsentError(null);
            }}
            error={consentError || ""}
          />

          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-gold-new w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                Creating account
              </>
            ) : (
              <>
                Create account
                <FiArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      </AuthShell>
    </>
  );
}
