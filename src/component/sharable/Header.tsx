"use client";

import LoginModal from "@/main-pages/auth/LoginModal";
import RegistrationModal from "@/main-pages/auth/RegistrationModal";
import ForgotPasswordModal from "@/main-pages/auth/ForgotPasswordModal";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useNameContext } from "../NameProvider";
import { useCachedImage } from "@/helpers/useCachedImage";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX, FiUser } from "react-icons/fi";

type NavItem = { label: string; path: string; key: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/home", key: "home" },
  { label: "Listings", path: "/properties", key: "mls-search" },
  { label: "Neighborhoods", path: "/neighborhoods", key: "neighborhood" },
  { label: "Insights", path: "/blog", key: "blog" },
  { label: "About", path: "/about-us", key: "about-us" },
  { label: "Connect", path: "/connect", key: "connect" },
];

const PATH_TO_KEY: Array<{ test: (p: string) => boolean; key: string }> = [
  { test: (p) => p.startsWith("/home"), key: "home" },
  { test: (p) => p.startsWith("/properties") || p.startsWith("/propertiesold"), key: "mls-search" },
  { test: (p) => p.startsWith("/neighborhoods"), key: "neighborhood" },
  { test: (p) => p.startsWith("/blog"), key: "blog" },
  { test: (p) => p.startsWith("/about-us"), key: "about-us" },
  { test: (p) => p.startsWith("/connect"), key: "connect" },
];

const isDashboardPath = (p: string) =>
  p.startsWith("/profile") ||
  p.startsWith("/collection") ||
  p.startsWith("/saved-searches") ||
  p.startsWith("/testimonial") ||
  p.startsWith("/market-report");

interface HeaderProps {
  // Optional manual override; otherwise derived from the URL.
  activeHeader?: string;
}

export const Header = ({ activeHeader }: HeaderProps = {}) => {
  const router = useRouter();
  const pathname = usePathname() || "";
  const derivedActive = useMemo(() => {
    if (isDashboardPath(pathname)) return "dashboard";
    return PATH_TO_KEY.find((entry) => entry.test(pathname))?.key ?? "";
  }, [pathname]);
  const activeKey = activeHeader ?? derivedActive;
  const { company_logo, company_name, name } = useNameContext();
  const cachedLogo = useCachedImage(company_logo);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const [isUserDashboard, setIsUserDashboard] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    setIsUserDashboard(!!token);

    const onLogin = () => setIsUserDashboard(true);
    window.addEventListener("auth:login", onLogin);
    return () => window.removeEventListener("auth:login", onLogin);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleDashboard = () => {
    const token = sessionStorage.getItem("access_token");
    if (token == null) setIsLoginModalOpen(true);
    else window.location.href = "/collection";
  };

  const openRegistration = () => {
    setIsLoginModalOpen(false);
    setIsRegistrationModalOpen(true);
  };

  const handleLoginSuccess = () => setIsLoginModalOpen(false);
  const handleRegistrationSuccess = () => setIsRegistrationModalOpen(false);

  // Logout helper for header cluster
  const handleLogout = async () => {
    try {
      const { postUserLogout } = await import("@/services/profile/ProfileServices");
      await postUserLogout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
    sessionStorage.clear();
    window.location.href = "/home";
  };

  return (
    <>
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onSuccess={handleRegistrationSuccess}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        handleModal={() => setIsLoginModalOpen(true)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onOpenRegistration={openRegistration}
        onOpenForgotPassword={() => {
          setIsLoginModalOpen(false);
          setIsForgotPasswordModalOpen(true);
        }}
        isHeader={true}
      />
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        onOpenLogin={() => {
          setIsForgotPasswordModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? "bg-[var(--surface-ink)]/92 backdrop-blur-xl border-b border-[var(--line-soft)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div
          className={`container-wide relative flex items-center justify-between transition-all duration-500 ${
            isScrolled ? "py-3" : "py-5"
          }`}
        >
          {/* Logo / Brand — absolutely centered on mobile, in-flow on desktop */}
          <Link
            href="/home"
            aria-label={company_name || name || "Home"}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0 flex items-center gap-3 min-w-0 shrink"
          >
            {cachedLogo ? (
              <div className="relative flex items-center min-w-0 shrink">
                {/* Responsive logo size for mobile */}
                <img
                  src={cachedLogo}
                  alt={company_name || name || "Logo"}
                  className={`site-logo block w-auto h-auto object-contain transition-[max-height,max-width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isScrolled ? "is-scrolled" : ""
                  }`}
                />
              </div>
            ) : (
              <span className="font-serif text-white text-2xl tracking-tight">
                {name || "RealtiPro"}
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = activeKey === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.path}
                  className={`relative px-4 py-2 text-[13px] font-medium tracking-[0.08em] uppercase transition-colors duration-300 ${
                    active
                      ? "text-[var(--gold-500)]"
                      : "text-white/85 hover:text-[var(--gold-500)]"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-4 right-4 -bottom-0.5 h-px bg-[var(--gold-500)] origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA cluster */}
          <div className="flex items-center gap-3 ml-auto lg:ml-0">
            {/* Desktop CTA cluster */}
            {isUserDashboard ? (
              <>
                <Link
                  href="/collection/favourites"
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-white/85 hover:text-[var(--gold-500)] transition"
                  aria-label="Dashboard"
                >
                  <FiUser size={16} />
                  Dashboard
                </Link>
                <div className="hidden md:block">
                  <button
                    onClick={handleLogout}
                    className="btn-outline-new"
                    aria-label="Sign out"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Sign In only in sidebar for mobile */}
                <button
                  onClick={handleDashboard}
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-white/85 hover:text-white transition"
                  aria-label="Sign in"
                >
                  <FiUser size={16} />
                  Sign In
                </button>
                {/* Book a Showing already handled above for mobile */}
              </>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 text-white"
              aria-label="Open menu"
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              className="fixed top-0 right-0 bottom-0 w-[88%] max-w-[420px] bg-[var(--surface-ink)] z-[70] flex flex-col border-l border-[var(--line-soft)]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--line-soft)]">
                <Link
                  href="/home"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center"
                >
                  {cachedLogo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={cachedLogo}
                      alt={company_name || name || "Logo"}
                      style={{ objectFit: "contain", height: 38, width: "auto" }}
                    />
                  ) : (
                    <span className="font-serif text-white text-xl">
                      {name || "RealtiPro"}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-white/90"
                  aria-label="Close menu"
                >
                  <FiX size={22} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-8">
                <ul className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item, i) => {
                    const active = activeKey === item.key;
                    return (
                      <motion.li
                        key={item.key}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.08 + i * 0.05,
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <Link
                          href={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`group flex items-center justify-between py-4 border-b border-[var(--line-soft)] transition ${
                            active ? "text-[var(--gold-500)]" : "text-white"
                          }`}
                        >
                          <span className="font-serif text-2xl tracking-tight">
                            {item.label}
                          </span>
                          <span className="text-[var(--gold-500)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            →
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <div className="px-6 pb-8 pt-4 border-t border-[var(--line-soft)] flex flex-col gap-3">
                <Link
                  href="/connect"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-gold-new w-full justify-center"
                >
                  Book a Showing
                </Link>
                {isUserDashboard ? (
                  <>
                    <Link
                      href="/collection/favourites"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-outline-new w-full justify-center"
                    >
                      <FiUser size={16} />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="btn-outline-new w-full justify-center"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleDashboard();
                    }}
                    className="btn-outline-new w-full justify-center"
                  >
                    <FiUser size={16} />
                    Sign In
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
