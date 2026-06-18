"use client";

interface Props {
  activeHeader: string;
}

// Auth state is now reflected in the main `Header` cluster.
// This component is intentionally a no-op kept for backwards compatibility.
export const DashboardHeader = ({ activeHeader: _ }: Props) => null;
