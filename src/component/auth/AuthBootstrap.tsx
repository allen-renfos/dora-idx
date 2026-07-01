"use client";

import { useEffect } from "react";
import { bootstrapSession } from "@/services/auth/sessionManager";

export default function AuthBootstrap() {
  useEffect(() => {
    // Revalidate a prior session on first load (new tab / browser restart).
    bootstrapSession().catch(() => {
      /* anonymous — ignore */
    });
  }, []);
  return null;
}
