"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/main-pages/auth/LoginModal";
import RegistrationModal from "@/main-pages/auth/RegistrationModal";
import ForgotPasswordModal from "@/main-pages/auth/ForgotPasswordModal";
import {
  isAuthenticated as checkAuthenticated,
  hasAuthHint,
} from "@/services/auth/authStorage";
import { refreshSession } from "@/services/auth/sessionManager";

type ActiveModal = "login" | "register" | "forgot";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>("login");
  const didAuthRef = useRef(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (checkAuthenticated()) {
        if (active) {
          setIsAuthenticated(true);
          setChecked(true);
        }
        return;
      }
      // No token in storage — try to silently restore from the refresh cookie.
      if (hasAuthHint()) {
        const token = await refreshSession();
        if (active && token) {
          setIsAuthenticated(true);
          setChecked(true);
          return;
        }
      }
      if (active) setChecked(true); // anonymous → show login modal
    })();
    return () => {
      active = false;
    };
  }, []);

  // Fire after React has committed the auth state so the Header listener receives it reliably
  useEffect(() => {
    if (isAuthenticated) {
      window.dispatchEvent(new Event("auth:login"));
    }
  }, [isAuthenticated]);

  // Stay in sync with auth that becomes available AFTER this route mounts — e.g.
  // when the header sign-in modal persists a session and navigates here. Without
  // this, a fresh-session login could commit a hair before the token is observed,
  // leaving this guard's own login modal + backdrop stuck on top of the page until
  // a second sign-in.
  useEffect(() => {
    const syncAuth = () => {
      if (checkAuthenticated()) {
        didAuthRef.current = true;
        setIsAuthenticated(true);
        setChecked(true);
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token" && e.newValue) syncAuth();
    };
    window.addEventListener("auth:login", syncAuth);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("auth:login", syncAuth);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

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
      {/* Full-screen backdrop so the page behind doesn't show */}
      <div className="fixed inset-0 z-[9990] bg-[var(--surface)]" />
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
