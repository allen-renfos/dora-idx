"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/auth/AuthServices";
import { FormDisclaimer } from "@/component/sharable/FormDisclaimer";
import { AuthShell, AuthField, AuthAlert } from "@/component/ui/AuthShell";
import { FiArrowRight } from "react-icons/fi";

interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  useEffect(() => {
    const e = searchParams.get("email");
    const t = searchParams.get("token");
    if (e) setEmail(e);
    if (t) setToken(t);
    if (!e || !t)
      setError("This reset link is invalid. Please request a new one.");
  }, [searchParams]);

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordData) => resetPassword(data),
    onSuccess: () => {
      setSuccess("Password updated. Redirecting to sign in…");
      setTimeout(() => router.push("/login"), 1800);
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message ||
          "Couldn't reset password. Please try again."
      );
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !token) {
      return setError("This reset link is invalid. Please request a new one.");
    }
    if (!password || !confirmPassword) {
      return setError("Please fill in both password fields");
    }
    if (password !== confirmPassword) {
      return setError("Passwords don't match");
    }
    if (password.length < 8) {
      return setError("Password must be at least 8 characters");
    }
    if (!consent) {
      return setConsentError("Please review and accept our disclaimer.");
    }

    mutation.mutate({
      email,
      token,
      password,
      password_confirmation: confirmPassword,
    });
  };

  return (
    <AuthShell
      eyebrow="Recovery"
      title="Set a new password"
      description="Choose something memorable. Eight characters minimum."
      footer={
        <>
          Remembered it?{" "}
          <Link
            href="/login"
            className="text-[var(--gold-500)] hover:text-white transition-colors font-semibold"
          >
            Back to sign in
          </Link>
        </>
      }
    >
      {error && <AuthAlert tone="error">{error}</AuthAlert>}
      {success && <AuthAlert tone="success">{success}</AuthAlert>}

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <AuthField
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
        />
        <AuthField
          name="password"
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          autoFocus
          required
          autoComplete="new-password"
        />
        <AuthField
          name="password_confirmation"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          disabled={mutation.isPending || !email || !token}
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
              Updating
            </>
          ) : (
            <>
              Update password
              <FiArrowRight size={14} />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
