"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/main-pages/auth/LoginModal";
import RegistrationModal from "@/main-pages/auth/RegistrationModal";
import ForgotPasswordModal from "@/main-pages/auth/ForgotPasswordModal";

type ActiveModal = "login" | "register" | "forgot";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>("login");
  const didAuthRef = useRef(false);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
    }
    setChecked(true);
  }, []);

  // Fire after React has committed the auth state so the Header listener receives it reliably
  useEffect(() => {
    if (isAuthenticated) {
      window.dispatchEvent(new Event("auth:login"));
    }
  }, [isAuthenticated]);

  if (!checked) return null;
  if (isAuthenticated) return <>{children}</>;

  const handleSuccess = () => {
    didAuthRef.current = true;
    setIsAuthenticated(true);
  };

  const handleClose = () => {
    if (!didAuthRef.current) {
      router.push("/home");
    }
  };

  return (
    <>
      {/* Full-screen dark backdrop so the page behind doesn't show */}
      <div className="fixed inset-0 z-[9990] bg-[var(--surface-ink)]" />
      <LoginModal
        isOpen={activeModal === "login"}
        isHeader={false}
        onClose={handleClose}
        onSuccess={handleSuccess}
        onOpenRegistration={() => setActiveModal("register")}
        onOpenForgotPassword={() => setActiveModal("forgot")}
      />
      <RegistrationModal
        isOpen={activeModal === "register"}
        onClose={handleClose}
        onSuccess={handleSuccess}
        onOpenLogin={() => setActiveModal("login")}
      />
      <ForgotPasswordModal
        isOpen={activeModal === "forgot"}
        onClose={handleClose}
        onOpenLogin={() => setActiveModal("login")}
      />
    </>
  );
}
