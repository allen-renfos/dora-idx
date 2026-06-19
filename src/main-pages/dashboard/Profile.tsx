"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useProfile } from "@/services/profile/ProfileQueries";
import { postUserLogout } from "@/services/profile/ProfileServices";
import { UserProfile } from "@/types/User";
import {
  FiEdit2,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiLock,
} from "react-icons/fi";
import { EditProfileModal } from "@/component/dashboard/EditProfileModal";
import ResetPasswordModalProfile from "@/main-pages/auth/ResetPasswordModalProfile";
import { DashboardLayout } from "@/component/ui/DashboardLayout";

const ProfilePage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    created_at: "",
    photo: "",
    photo_gallery: [],
    web: "",
    social_urls: "",
    mobile: "",
    id: 0,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const { data: profileData, isLoading, error } = useProfile();

  useEffect(() => {
    if (profileData && !isLoading && !error) {
      setUserData(profileData?.data || ({} as UserProfile));
    }
  }, [profileData, isLoading, error]);

  const logoutMutation = useMutation({
    mutationFn: () => postUserLogout(),
    onSuccess: () => {
      sessionStorage.clear();
      if (typeof window !== "undefined") window.location.href = "/home";
    },
    onError: () => {
      sessionStorage.clear();
      if (typeof window !== "undefined") window.location.href = "/home";
    },
  });

  const formatDate = (s: string) => {
    if (!s) return "—";
    try {
      return new Date(s).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const display = userData?.name || "Welcome";
  const email = userData?.email || "—";
  const phone = userData?.phone || userData?.mobile || "—";
  const address = userData?.address || "—";
  const memberSince = formatDate(userData?.created_at || "");

  return (
    <DashboardLayout
      active="Profile"
      eyebrow="Account"
      title="Your profile"
      description="Keep your details current so we can reach you the moment a home worth seeing arrives."
      actions={
        <button
          onClick={() => logoutMutation.mutate()}
          className="btn-outline-new"
          aria-label="Sign out"
        >
          <FiLogOut size={14} />
          Sign Out
        </button>
      }
    >
      {/* Identity row */}
      <div className="bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] p-6 md:p-8 mb-6 flex flex-col md:flex-row md:items-center gap-6 shadow-[var(--shadow-soft)]">
        <div className="w-20 h-20 shrink-0 rounded-full bg-[var(--pine)] flex items-center justify-center text-[var(--on-pine)] font-serif text-3xl">
          {display.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--ink)] leading-tight">
            {display}
          </h2>
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)] mt-2">
            Member since {memberSince}
          </p>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="btn-gold-new"
        >
          <FiEdit2 size={14} />
          Edit profile
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Contact" onEdit={() => setIsEditModalOpen(true)}>
          <Row Icon={FiUser} label="Full name" value={display} />
          <Row Icon={FiMail} label="Email" value={email} />
          <Row Icon={FiPhone} label="Phone" value={phone} />
        </Card>

        <Card title="Address" onEdit={() => setIsEditModalOpen(true)}>
          <Row Icon={FiMapPin} label="Home address" value={address} />
        </Card>
      </div>

      {/* Security Card */}
      <div className="bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] p-6 md:p-7 mt-6">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--line)]">
          <h3 className="flex items-center gap-3 font-serif text-xl text-[var(--ink)]">
            <span className="inline-block w-1 h-5 rounded-full bg-[var(--sage-deep)]" />
            Security
          </h3>
        </div>
        <p className="text-[13.5px] text-[var(--ink-soft)] mb-5 leading-relaxed">
          Refresh your password from time to time to keep your account secure.
        </p>
        <button
          onClick={() => setIsResetPasswordModalOpen(true)}
          className="btn-outline-new"
        >
          <FiLock size={14} />
          Change Password
        </button>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
      />

      <ResetPasswordModalProfile
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        userEmail={userData?.email || ""}
      />
    </DashboardLayout>
  );
};

function Card({
  title,
  onEdit,
  editLabel = "Edit",
  editIcon: EditIcon = FiEdit2,
  children,
}: {
  title: string;
  onEdit?: () => void;
  editLabel?: string;
  editIcon?: React.ComponentType<{ size?: number }>;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] p-6 md:p-7">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--line)]">
        <h3 className="flex items-center gap-3 font-serif text-xl text-[var(--ink)]">
          <span className="inline-block w-1 h-5 rounded-full bg-[var(--sage-deep)]" />
          {title}
        </h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-[family-name:var(--font-accent)] text-[var(--sage-deep)] hover:text-[var(--ink)] transition-colors"
          >
            <EditIcon size={12} />
            {editLabel}
          </button>
        )}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Row({
  Icon,
  label,
  value,
}: {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-[var(--canvas)] border border-[var(--line)] flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-[var(--sage-deep)]" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)]">
          {label}
        </span>
        <span className="text-[15px] text-[var(--ink-soft)] break-words">{value}</span>
      </div>
    </div>
  );
}

export default ProfilePage;
