"use client";
import { ReactNode } from "react";
import { useNameContext } from "../component/NameProvider";
import { useRouter } from "next/navigation";
import { FaSearch, FaHeart, FaBookmark, FaChartBar, FaUser, FaUserTie, FaHome, FaPlus } from "react-icons/fa";

const sidebarLinks = [
  { label: "Search", icon: <FaSearch />, href: "/search" },
  { label: "Favourites", icon: <FaHeart />, href: "/collection/favourites" },
  { label: "Saved Searches", icon: <FaBookmark />, href: "/saved-searches" },
  { label: "Market Report", icon: <FaChartBar />, href: "/market-report" },
  { label: "Profile", icon: <FaUser />, href: "/profile" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex bg-[#ffffff] text-[#1a1a1a]">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col py-8 px-4 bg-[#fafaf8] border-r border-[#e7e4de]">
        <div className="mb-10 flex items-center gap-2 px-2">
          <span className="text-2xl font-bold tracking-wide">{useNameContext().name}</span>
        </div>
        <nav className="flex flex-col gap-2">
          {sidebarLinks.map(link => (
            <button
              key={link.label}
              onClick={() => router.push(link.href)}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition
                ${link.label === "Favourites" ? "bg-[#1a1a1a] text-white font-semibold" : "hover:bg-[#f4f2ec]"}
              `}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-base">{link.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          {/* Add more sidebar items if needed */}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-[#ffffff] min-h-screen">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-semibold">Favourites</h1>
          <button className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#333230] transition">
            <FaPlus />
            Create New
          </button>
        </div>
        {/* Main Content Area */}
        <div className="bg-[#fafaf8] rounded-2xl p-8 min-h-[300px] flex flex-col items-center justify-center border border-[#e7e4de] max-w-lg mx-auto">
          <div className="text-lg text-[#555350] mb-4">No listing yet</div>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f4f2ec] text-[#8a6a3b] text-xl mb-2">
            <FaPlus />
          </button>
          <div className="text-base text-[#8a8780]">Favourites</div>
          <div className="flex items-center gap-2 mt-4 text-[#8a6a3b]">
            <FaHome />
            <span>Home</span>
          </div>
        </div>
      </main>
    </div>
  );
}