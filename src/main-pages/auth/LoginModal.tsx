"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth/AuthServices";
import { setSession } from "@/services/auth/authStorage";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";
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
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const mutation = useMutation({
    mutationFn: (user: LoginData) => login(user),
    onSuccess: (data) => {
      // 1) Persist the session FIRST so any route guard that reads storage
      //    (e.g. ProtectedRoute on /collection) sees the token synchronously.
      setSession({
        access_token: data?.access_token,
        refresh_token: data?.refresh_token,
        id: data?.id ?? data?.customer_id,
        name: data?.name,
      });

      // 2) Notify listeners (Header, ProtectedRoute) that auth is now available.
      window.dispatchEvent(new Event("auth:login"));

      // 3) Reset local state and dismiss the modal IMMEDIATELY — this clears the
      //    portal backdrop and the body scroll-lock before we navigate, so the
      //    protected page never renders underneath a leftover overlay.
      setError(null);
      setSuccess(null);
      setConsentError(null);
      setConsent(false);
      setFormData({ email: "", password: "" });
      onSuccess?.();

      // 4) Navigate last. Use a full-document navigation (same pattern as the
      //    header dashboard button) rather than router.push: a client-side
      //    transition into the protected /collection route can interleave with
      //    the modal teardown and the route guard's mount, leaving the modal
      //    backdrop/overlay painted on top until a second sign-in. A hard nav
      //    unloads every modal/backdrop/scroll-lock and reloads /collection
      //    fresh with the token already persisted, so the guard authenticates
      //    on first mount.
      if (isHeader) window.location.assign("/collection");
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
    // Guard against duplicate submissions while a login is already in flight.
    if (mutation.isPending) return;
    setError(null);
    setSuccess(null);

    if (!formData.email.trim() || !formData.password) {
      return setError("Please fill in all fields");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return setError("Please enter a valid email");
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
      description="Return to your saved homes, followed searches, and listings chosen for you."
      footer={
        <>
          New to Dora?{" "}
          <button
            type="button"
            onClick={() => onOpenRegistration?.()}
            className="text-[var(--sage-deep)] hover:text-[var(--ink)] transition-colors font-medium"
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
              className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)]"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => onOpenForgotPassword?.()}
              className="text-[10px] uppercase tracking-[0.2em] text-[var(--sage-deep)] hover:text-[var(--ink)] transition-colors"
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
              className="w-full bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-sm)] focus:border-[var(--sage-deep)] px-4 pr-11 h-12 text-[14.5px] text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--sage-deep)] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
            </button>
          </div>
        </div>

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
