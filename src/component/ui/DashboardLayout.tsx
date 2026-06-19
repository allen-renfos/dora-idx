"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/component/sharable/Sidebar";

interface Props {
  active: string;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({
  active,
  eyebrow,
  title,
  description,
  actions,
  children,
}: Props) {
  return (
    <main className="bg-[var(--surface)] text-[var(--ink)] min-h-screen">
        <div className="container-wide pt-32">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-0 lg:gap-10 lg:border-t lg:border-[var(--line)]">
            <Sidebar activeSidebar={active} />

            <div className="flex-1 min-w-0 py-10 md:py-12">
              <div className="flex flex-col gap-4 mb-10">
                {eyebrow && (
                  <span className="eyebrow inline-flex items-center gap-3">
                    <span className="inline-block h-px w-10 bg-[var(--gold-500)]" />
                    {eyebrow}
                  </span>
                )}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div className="flex flex-col gap-3 max-w-2xl">
                    <h1 className="font-serif text-3xl md:text-4xl text-[var(--ink)] leading-tight tracking-[-0.01em]">
                      {title}
                    </h1>
                    {description && (
                      <p className="text-[15px] text-[var(--ink-soft)] leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>
                  {actions && <div className="shrink-0">{actions}</div>}
                </div>
              </div>

              {children}
            </div>
          </div>
        </div>
      </main>
  );
}
