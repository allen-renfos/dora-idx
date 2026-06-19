"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgetPassword } from "@/services/auth/AuthServices";
import { FiArrowRight } from "react-icons/fi";
import { AuthModal } from "@/component/ui/AuthModal";
import { AuthField, AuthAlert } from "@/component/ui/AuthShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  onOpenLogin,
}: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: object) => forgetPassword(data),
    onSuccess: () => {
      setSuccess("Reset link sent. Please check your inbox.");
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message ||
          "We couldn't send the reset email. Try again."
      );
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) return setError("Please enter your email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError("Please enter a valid email");
    }
    mutation.mutate({ email });
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    setEmail("");
    onClose();
  };

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={handleClose}
      eyebrow="Recovery"
      title="Reset your password"
      description="We'll email you a secure link to set a new password."
      footer={
        <>
          Remembered it?{" "}
          <button
            type="button"
            onClick={() => onOpenLogin?.()}
            className="text-[var(--sage-deep)] hover:text-[var(--ink)] transition-colors font-medium"
          >
            Back to sign in
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          autoFocus
          required
          autoComplete="email"
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
              Sending
            </>
          ) : (
            <>
              Send reset link
              <FiArrowRight size={14} />
            </>
          )}
        </button>
      </form>
    </AuthModal>
  );
}
