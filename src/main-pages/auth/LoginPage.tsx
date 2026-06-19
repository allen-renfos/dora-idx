"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth/AuthServices";
import { FormDisclaimer } from "@/component/sharable/FormDisclaimer";
import { AuthShell, AuthField, AuthAlert } from "@/component/ui/AuthShell";
import { FiArrowRight } from "react-icons/fi";

interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (user: LoginData) => login(user),
    onSuccess: (data) => {
      sessionStorage.setItem("access_token", data?.access_token);
      setSuccess("Welcome back. Redirecting…");
      setTimeout(() => router.push("/collection"), 1200);
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
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

    if (!formData.email.trim() || !formData.password) {
      return setError("Please fill in all fields");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return setError("Please enter a valid email address");
    }
    if (!consent) {
      return setConsentError("Please review and accept our disclaimer.");
    }
    mutation.mutate(formData);
  };

  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Sign in to your account"
      description="Access saved searches, favorites, and tailored listings."
      footer={
        <>
          New here?{" "}
          <Link
            href="/register"
            className="text-[var(--accent-text)] hover:text-[var(--ink)] transition-colors font-semibold"
          >
            Create an account
          </Link>
        </>
      }
    >
      {error && <AuthAlert tone="error">{error}</AuthAlert>}
      {success && <AuthAlert tone="success">{success}</AuthAlert>}

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <AuthField
          name="email"
          label="Email address"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="you@email.com"
          autoFocus
          required
          autoComplete="email"
        />
        <AuthField
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={onChange}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          rightAction={
            <Link
              href="/forgot-password"
              className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent-text)] hover:text-[var(--ink)] transition-colors"
            >
              Forgot?
            </Link>
          }
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
              Signing in
            </>
          ) : (
            <>
              Sign in
              <FiArrowRight size={14} />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
