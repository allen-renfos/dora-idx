"use client";

import Link from "next/link";
import { FaHeart, FaBookmark, FaUser, FaStar } from "react-icons/fa";
import {
  HiOutlineCollection,
  HiOutlineBookmark,
  HiOutlineUser,
  HiOutlineStar,
} from "react-icons/hi";

const sidebarLinks = [
  {
    label: "Favourites",
    icon: <HiOutlineCollection size={18} />,
    activeIcon: <FaHeart size={16} />,
    href: "/collection/favourites",
  },
  {
    label: "Saved Searches",
    icon: <HiOutlineBookmark size={18} />,
    activeIcon: <FaBookmark size={16} />,
    href: "/saved-searches",
  },
  {
    label: "Testimonial",
    icon: <HiOutlineStar size={18} />,
    activeIcon: <FaStar size={16} />,
    href: "/testimonial",
  },
  {
    label: "Profile",
    icon: <HiOutlineUser size={18} />,
    activeIcon: <FaUser size={16} />,
    href: "/profile",
  },
];

interface Props {
  activeSidebar: string;
}

export const Sidebar = ({ activeSidebar }: Props) => {
  return (
    <aside className="hidden lg:flex flex-col w-[268px] shrink-0 bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-md)] py-9 px-5 sticky top-[104px] self-start max-h-[calc(100vh-128px)] overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-8 px-3">
        <span className="eyebrow inline-flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-[var(--gold)]" />
          Your Dashboard
        </span>
      </div>

      <nav className="flex flex-col gap-0.5">
        {sidebarLinks.map((link) => {
          const isActive = link.label === activeSidebar;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`relative flex items-center gap-3.5 px-4 py-3 rounded-[var(--radius-sm)] text-[13px] tracking-[0.14em] uppercase font-[family-name:var(--font-accent)] transition-colors ${
                isActive
                  ? "bg-[var(--canvas)] text-[var(--pine)]"
                  : "text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--canvas)]/60"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-[2.5px] rounded-full bg-[var(--gold)]" />
              )}
              <span
                className={`shrink-0 ${isActive ? "text-[var(--gold-deep)]" : "text-[var(--ink-faint)]"}`}
              >
                {isActive ? link.activeIcon : link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-[var(--line)]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)] px-3">
          © {new Date().getFullYear()} RealtiPro
        </p>
      </div>
    </aside>
  );
};
