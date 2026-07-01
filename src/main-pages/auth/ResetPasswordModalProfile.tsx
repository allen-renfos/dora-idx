"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/services/auth/AuthServices";
import { getAccessToken, getCustomerName } from "@/services/auth/authStorage";
import { FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { AuthModal } from "@/component/ui/AuthModal";
import { AuthField, AuthAlert } from "@/component/ui/AuthShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export default function ResetPasswordModalProfile({
  isOpen,
  onClose,
  userEmail = "",
}: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: object) => changePassword(data),
    onSuccess: () => {
      setSuccess("Password updated successfully!");
      toast.success("Password changed successfully", {
        style: {
          background: "#ffffff",
          color: "#1a1a1a",
          border: "1px solid #c2a878",
        },
        iconTheme: { primary: "#c2a878", secondary: "#ffffff" },
      });
      setTimeout(() => {
        handleClose();
      }, 1200);
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.message ||
        "Couldn't update password. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newPassword) return setError("Please enter a new password");
    if (!confirmPassword)
      return setError("Please confirm your new password");

    if (newPassword.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    if (newPassword !== confirmPassword) {
      return setError("New passwords don't match");
    }

    mutation.mutate({
      email: userEmail || getCustomerName() || "",
      password: newPassword,
      password_confirmation: confirmPassword,
      token: getAccessToken() || "",
    });
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={handleClose}
      eyebrow="Security"
      title="Change password"
      description="Update your password to keep your account secure."
    >
      {error && <AuthAlert tone="error">{error}</AuthAlert>}
      {success && <AuthAlert tone="success">{success}</AuthAlert>}

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* New Password */}
        <div className="relative">
          <label className="block text-[11px] uppercase tracking-[0.18em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)] mb-2">
            New password
          </label>
          <div className="relative flex items-center">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              className="w-full px-4 py-3 bg-[var(--cream)] border border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none focus:border-[var(--sage-deep)] transition-colors rounded-[var(--radius-sm)]"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 text-[var(--ink-faint)] hover:text-[var(--sage-deep)] transition-colors"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? (
                <FiEyeOff size={16} />
              ) : (
                <FiEye size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="relative">
          <label className="block text-[11px] uppercase tracking-[0.18em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)] mb-2">
            Confirm new password
          </label>
          <div className="relative flex items-center">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              className="w-full px-4 py-3 bg-[var(--cream)] border border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none focus:border-[var(--sage-deep)] transition-colors rounded-[var(--radius-sm)]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 text-[var(--ink-faint)] hover:text-[var(--sage-deep)] transition-colors"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <FiEyeOff size={16} />
              ) : (
                <FiEye size={16} />
              )}
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
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
              Updating…
            </>
          ) : (
            <>
              Update Password
              <FiArrowRight size={14} />
            </>
          )}
        </button>
      </form>
    </AuthModal>
  );
}
