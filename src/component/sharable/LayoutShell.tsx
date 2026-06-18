"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/password-reset",
];

const isAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

// Header/Footer live here so they persist across navigation between sibling
// routes — only their internal state (active link, scroll style) updates,
// they never unmount. Auth routes opt out because AuthShell renders its own
// chrome.
export function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  if (isAuthRoute(pathname)) {
    return <>{children}</>;
  }
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
