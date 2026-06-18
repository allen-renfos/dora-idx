"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth/AuthServices";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";
import { FormDisclaimer } from "@/component/sharable/FormDisclaimer";
import { AuthModal } from "@/component/ui/AuthModal";
import { AuthField, AuthAlert } from "@/component/ui/AuthShell";

interface LoginModalProps {
  isOpen: boolean;
  isHeader: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onOpenRegistration?: () => void;
  onOpenForgotPassword?: () => void;
}

interface LoginData {
  email: string;
  password: string;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  onOpenRegistration,
  onOpenForgotPassword,
  isHeader,
}: LoginModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const mutation = useMutation({
    mutationFn: (user: LoginData) => login(user),
    onSuccess: async (data) => {
      sessionStorage.setItem("access_token", data?.access_token);
      sessionStorage.setItem("customer_id", data?.id);
      sessionStorage.setItem("customer_name", data?.name);

      if (isHeader) router.push("/collection");
      setSuccess("Welcome back.");
      onSuccess?.();
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 1200);
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
      return setError("Please enter a valid email");
    }
    if (!consent) {
      return setConsentError("Please review and accept our disclaimer.");
    }
    mutation.mutate(formData);
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    setFormData({ email: "", password: "" });
    onClose();
  };

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={handleClose}
      eyebrow="Welcome Back"
      title="Sign in"
      description="Access saved searches, favorites, and tailored listings."
      footer={
        <>
          New here?{" "}
          <button
            type="button"
            onClick={() => onOpenRegistration?.()}
            className="text-[var(--gold-500)] hover:text-white transition-colors font-semibold"
          >
            Create an account
          </button>
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
          value={formData.email}
          onChange={onChange}
          placeholder="you@email.com"
          autoFocus
          required
          autoComplete="email"
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="modal-password"
              className="text-[10px] uppercase tracking-[0.22em] text-white/55"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => onOpenForgotPassword?.()}
              className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold-500)] hover:text-white transition-colors"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <input
              id="modal-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={onChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full bg-[var(--surface-charcoal)] border border-[var(--line-soft)] focus:border-[var(--gold-500)]/60 px-4 pr-11 h-12 text-[14px] text-white placeholder:text-white/40 outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/55 hover:text-[var(--gold-500)] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
            </button>
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
    </AuthModal>
  );
}
