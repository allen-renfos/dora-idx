"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/services/auth/AuthServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";
import { FormDisclaimer } from "@/component/sharable/FormDisclaimer";
import { AuthModal } from "@/component/ui/AuthModal";
import { AuthField, AuthAlert } from "@/component/ui/AuthShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onOpenLogin?: () => void;
  handleModal?: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  uuid?: string;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  onOpenLogin,
  handleModal,
}: Props) {
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (user: RegisterData) => register(user),
    onSuccess: () => {
      toast.success("Account created. Please sign in to continue.", {
        autoClose: 3000,
      });
      setTimeout(() => {
        onClose();
        handleModal?.();
        onOpenLogin?.();
      }, 600);
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

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.password_confirmation
    ) {
      return setError("Please fill in all fields");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return setError("Please enter a valid email");
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
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
      <AuthModal
        isOpen={isOpen}
        onClose={onClose}
        eyebrow="Create Account"
        title="Build your dashboard"
        description="Save searches, favorites, and stay close to listings."
        footer={
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onOpenLogin?.()}
              className="text-[var(--gold-500)] hover:text-white transition-colors font-semibold"
            >
              Sign in
            </button>
          </>
        }
      >
        {error && <AuthAlert tone="error">{error}</AuthAlert>}

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

          <PasswordField
            id="reg-password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={onChange}
            placeholder="At least 8 characters"
            visible={showPassword}
            onToggleVisible={() => setShowPassword((s) => !s)}
            autoComplete="new-password"
          />
          <PasswordField
            id="reg-confirm"
            name="password_confirmation"
            label="Confirm password"
            value={formData.password_confirmation}
            onChange={onChange}
            placeholder="Repeat password"
            visible={showConfirm}
            onToggleVisible={() => setShowConfirm((s) => !s)}
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
      </AuthModal>
    </>
  );
}

function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  visible,
  onToggleVisible,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  visible: boolean;
  onToggleVisible: () => void;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[10px] uppercase tracking-[0.22em] text-white/55"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          autoComplete={autoComplete}
          className="w-full bg-[var(--surface-charcoal)] border border-[var(--line-soft)] focus:border-[var(--gold-500)]/60 px-4 pr-11 h-12 text-[14px] text-white placeholder:text-white/40 outline-none transition-colors"
        />
        <button
          type="button"
          onClick={onToggleVisible}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/55 hover:text-[var(--gold-500)] transition-colors"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
        </button>
      </div>
    </div>
  );
}
