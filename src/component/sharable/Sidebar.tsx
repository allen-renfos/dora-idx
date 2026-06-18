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
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-[var(--surface-obsidian)] border-r border-[var(--line-soft)] py-8 px-5 sticky top-[88px] self-start max-h-[calc(100vh-88px)] overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-8 px-2">
        <span className="eyebrow inline-flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-[var(--gold-500)]" />
          Dashboard
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {sidebarLinks.map((link) => {
          const isActive = link.label === activeSidebar;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`relative flex items-center gap-3 px-4 py-3 text-[13px] tracking-[0.06em] uppercase transition-colors ${
                isActive
                  ? "text-[var(--gold-500)]"
                  : "text-white/72 hover:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-[2px] bg-[var(--gold-500)]" />
              )}
              <span
                className={`shrink-0 ${isActive ? "text-[var(--gold-500)]" : "text-white/55"}`}
              >
                {isActive ? link.activeIcon : link.icon}
              </span>
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-[var(--line-soft)]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/35 px-2">
          © {new Date().getFullYear()} RealtiPro
        </p>
      </div>
    </aside>
  );
};
