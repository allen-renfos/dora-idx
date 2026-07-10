"use client";

import { useCallback, useMemo, useState } from "react";
import LoginModal from "@/main-pages/auth/LoginModal";
import RegistrationModal from "@/main-pages/auth/RegistrationModal";

/**
 * Reusable login-prompt for card grids. Favoriting requires auth: a card calls
 * `handleModal` when a signed-out user taps the heart. Sections that want that
 * behaviour render `{loginModal}` and pass `handleModal` to each card.
 *
 * Extracted from the ad-hoc state that PropertyList used to inline, so homepage
 * rails can prompt sign-in without each duplicating modal plumbing.
 */
export function useLoginPrompt() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const handleModal = useCallback(() => setIsLoginModalOpen(true), []);

  const handleOpenRegistration = useCallback(() => {
    setIsLoginModalOpen(false);
    setIsRegistrationModalOpen(true);
  }, []);

  const loginModal = useMemo(
    () => (
      <>
        <RegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          onOpenLogin={handleModal}
        />
        <LoginModal
          isHeader={false}
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={() => setIsLoginModalOpen(false)}
          onOpenRegistration={handleOpenRegistration}
        />
      </>
    ),
    [isLoginModalOpen, isRegistrationModalOpen, handleModal, handleOpenRegistration]
  );

  return { handleModal, loginModal };
}
