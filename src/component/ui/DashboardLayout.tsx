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
    <main className="bg-[var(--canvas)] text-[var(--ink)] min-h-screen">
        <div className="container-wide pt-32 pb-20">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-10">
            <Sidebar activeSidebar={active} />

            <div className="flex-1 min-w-0 pt-1 md:pt-2">
              <div className="flex flex-col gap-4 mb-10">
                {eyebrow && (
                  <span className="eyebrow inline-flex items-center gap-3">
                    <span className="inline-block h-px w-10 bg-[var(--gold)]" />
                    {eyebrow}
                  </span>
                )}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                  <div className="flex flex-col gap-3 max-w-2xl">
                    <h1 className="font-serif text-3xl md:text-[2.6rem] text-[var(--ink)] leading-[1.05] tracking-[-0.015em]">
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
                <div aria-hidden className="gold-rule mt-1" />
              </div>

              {children}
            </div>
          </div>
        </div>
      </main>
  );
}
