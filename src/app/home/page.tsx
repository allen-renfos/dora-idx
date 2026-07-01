"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomeHero from "@/main-pages/home/HomeHero";
import HomeRecommended from "@/main-pages/home/HomeRecommended";
import HomeAdvisor from "@/main-pages/home/HomeAdvisor";
import HomeFeatured from "@/main-pages/home/HomeFeatured";
import HomeNeighborhoods from "@/main-pages/home/HomeNeighborhoods";
import HomePhilosophy from "@/main-pages/home/HomePhilosophy";
import HomeInsights from "@/main-pages/home/HomeInsights";
import HomeNewsletter from "@/main-pages/home/HomeNewsletter";

export default function HomePage() {
  return (
    <main className="bg-[var(--canvas)]">
      <HomeHero />
      <HomeRecommended />
      <HomeAdvisor />
      <HomeFeatured />
      <HomeNeighborhoods />
      <HomePhilosophy />
      <HomeInsights />
      <HomeNewsletter />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </main>
  );
}
