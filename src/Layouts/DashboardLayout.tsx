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
    <div className="min-h-screen flex bg-[#181818] text-white">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col py-8 px-4 bg-[#181818] border-r border-[#222]">
        <div className="mb-10 flex items-center gap-2 px-2">
          <span className="text-2xl font-bold tracking-wide">{useNameContext().name}</span>
        </div>
        <nav className="flex flex-col gap-2">
          {sidebarLinks.map(link => (
            <button
              key={link.label}
              onClick={() => router.push(link.href)}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition
                ${link.label === "Favourites" ? "bg-[#EDB75E] text-black font-semibold" : "hover:bg-[#232323]"}
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
      <main className="flex-1 p-10 bg-[#1a1a1a] min-h-screen">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-semibold">Favourites</h1>
          <button className="flex items-center gap-2 bg-[#EDB75E] text-black px-6 py-2 rounded-full font-semibold hover:bg-[#e0a94e] transition">
            <FaPlus />
            Create New
          </button>
        </div>
        {/* Main Content Area */}
        <div className="bg-[#181818] rounded-2xl p-8 min-h-[300px] flex flex-col items-center justify-center border border-[#232323] max-w-lg mx-auto">
          <div className="text-lg text-gray-300 mb-4">No listing yet</div>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#232323] text-[#EDB75E] text-xl mb-2">
            <FaPlus />
          </button>
          <div className="text-base text-gray-400">Favourites</div>
          <div className="flex items-center gap-2 mt-4 text-[#EDB75E]">
            <FaHome />
            <span>Home</span>
          </div>
        </div>
      </main>
    </div>
  );
}