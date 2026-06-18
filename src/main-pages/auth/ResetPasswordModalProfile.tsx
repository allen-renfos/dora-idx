"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/services/auth/AuthServices";
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
          background: "#14171d",
          color: "#fff",
          border: "1px solid #edb75e",
        },
        iconTheme: { primary: "#edb75e", secondary: "#0b0c0f" },
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
      email: userEmail || sessionStorage.getItem("customer_name") || "",
      password: newPassword,
      password_confirmation: confirmPassword,
      token: sessionStorage.getItem("access_token") || "",
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
          <label className="block text-[11px] uppercase tracking-[0.18em] text-white/55 mb-2">
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
              className="w-full px-4 py-3 bg-[var(--surface-obsidian)] border border-[var(--line-soft)] text-white placeholder:text-white/35 outline-none focus:border-[var(--gold-500)] transition-colors rounded-sm"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 text-white/55 hover:text-white transition-colors"
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
          <label className="block text-[11px] uppercase tracking-[0.18em] text-white/55 mb-2">
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
              className="w-full px-4 py-3 bg-[var(--surface-obsidian)] border border-[var(--line-soft)] text-white placeholder:text-white/35 outline-none focus:border-[var(--gold-500)] transition-colors rounded-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 text-white/55 hover:text-white transition-colors"
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
