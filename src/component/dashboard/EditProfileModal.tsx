"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiArrowRight } from "react-icons/fi";
import { UserProfile } from "@/types/User";
import { useUpdateProfile } from "@/services/profile/ProfileQueries";
import { FormDisclaimer } from "@/component/sharable/FormDisclaimer";
import { formatUSPhoneInput, getUSPhoneDigits } from "@/helpers/phoneFormat";
import { AuthModal } from "@/component/ui/AuthModal";
import { AuthField } from "@/component/ui/AuthShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userData: UserProfile;
}

export const EditProfileModal = ({ isOpen, onClose, userData }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    mobile: "",
    address: "",
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useUpdateProfile();

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: formatUSPhoneInput(userData.phone || userData.mobile || ""),
        mobile: formatUSPhoneInput(userData.mobile || userData.phone || ""),
        address: userData.address || "",
      });
    }
  }, [userData, isOpen]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Full name is required";
    if (!consent) e.consent = "Please review and accept our disclaimer.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const next = name === "phone" ? formatUSPhoneInput(value) : value;
    setFormData((p) => {
      const ns = { ...p, [name]: next };
      if (name === "phone") ns.mobile = next;
      return ns;
    });
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const numeric = getUSPhoneDigits(formData.phone);
      const customerId = sessionStorage.getItem("customer_id") || "";
      await mutation.mutateAsync({
        ...formData,
        phone: formData.phone,
        mobile: formData.phone,
        contact_no: numeric ? parseInt(numeric, 10) : null,
        phone_number: formData.phone,
        address: formData.address,
        user_id: customerId,
        customer_id: customerId,
        id: customerId,
      });
      toast.success("Profile updated.");
      onClose();
      window.location.reload();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update profile";
      toast.error(msg);
      if (err?.response?.data?.errors) setErrors(err.response.data.errors);
    }
  };

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Account"
      title="Edit profile"
      description="Update your contact details so we can stay in touch."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <AuthField
          name="name"
          label="Full name"
          value={formData.name}
          onChange={onChange}
          placeholder="Your name"
          required
          error={errors.name}
        />
        <AuthField
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="you@email.com"
          readOnly
        />
        <AuthField
          name="phone"
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={onChange}
          placeholder="(555) 123-4567"
          error={errors.phone}
        />
        <AuthField
          name="address"
          label="Home address"
          value={formData.address}
          onChange={onChange}
          placeholder="Street, city, state, zip"
        />

        <FormDisclaimer
          checked={consent}
          onChange={(v) => {
            setConsent(v);
            if (errors.consent) setErrors((p) => ({ ...p, consent: "" }));
          }}
          error={errors.consent || ""}
        />

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-[12px] uppercase tracking-[0.18em] text-white/65 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-gold-new disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Saving" : (
              <>
                Save changes
                <FiArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </AuthModal>
  );
};
