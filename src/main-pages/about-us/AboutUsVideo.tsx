"use client";
import { useState, useRef } from "react";
import { useNameContext } from "@/component/NameProvider";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

export const AboutUsVideo = () => {
  const { name, longDescription, socialUrls, profile_image } = useNameContext();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoProgress(
        (videoRef.current.currentTime / videoRef.current.duration) * 100,
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time =
        (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setVideoProgress(parseFloat(e.target.value));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const noProfileImg = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1200&fit=crop&crop=faces";

  return (
    <section className="bg-black text-white py-20 pb-40 md:py-32 md:pb-60 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#EDB75E]/5 blur-[100px] rounded-full" />

      <div className="container mx-auto px-6 lg:px-24 relative z-10 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center justify-items-center glass-premium p-10 md:p-16 rounded-none">

          {/* Left Column - Video Player */}
          <div className="flex flex-col gap-6 group">
            <div
              className="relative w-full overflow-hidden shadow-2xl transition-all duration-700 group-hover:shadow-[#EDB75E]/10"
              style={{
                aspectRatio: "16/9",
                borderRadius: "0px",
                border: "1px solid rgba(255, 255, 255, 0.05)"
              }}
            >
              <video
                ref={videoRef}
                className="w-full h-full scale-[1.01]"
                style={{ objectFit: "cover" }}
                poster="/images/aboutus-coverpic.png"
                muted
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              >
                <source src="/images/aboutus-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {!isVideoPlaying && (
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 backdrop-blur-[2px] transition-all duration-500 hover:bg-black/20"
                  onClick={handlePlayPause}
                >
                  <div
                    style={{
                      background: "rgba(237, 183, 94, 0.15)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      borderRadius: "0%",
                      padding: "24px",
                      border: "1px solid rgba(237, 183, 94, 0.4)",
                      boxShadow: "0 0 30px rgba(237, 183, 94, 0.2)"
                    }}
                    className="hover:scale-110 transition-all duration-300"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#EDB75E">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <h4 className="text-[#EDB75E] text-xs uppercase tracking-[0.2em] font-semibold mb-3">Our Legacy</h4>
              <p className="text-sm text-white/50 leading-relaxed max-w-sm">
                Setting the gold standard in premium real estate through unparalleled expertise and global reach.
              </p>
            </div>
          </div>

          {/* Right Column - About Us Info */}
          <div className="flex flex-col gap-10 items-center justify-center w-full">
            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
              <div className="relative w-40 h-52 flex-shrink-0 group">
                {/* Square Profile Image */}
                <div className="relative w-full h-full overflow-hidden border border-[#EDB75E]/30">
                  <Image
                    src={profile_image || noProfileImg}
                    alt={name || "Agent"}
                    fill
                    className="transition-transform duration-700 group-hover:scale-105"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="text-center pt-2">
                <h3
                  className="text-4xl md:text-5xl font-normal leading-tight mb-4 tracking-tight"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {name || "Bino"}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-[1px] bg-[#EDB75E]" />
                  <p className="text-[#EDB75E] text-sm uppercase tracking-widest font-medium">
                    Trusted Global Advisor
                  </p>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-[#EDB75E]/40 via-[#EDB75E]/10 to-transparent w-full" />

            <div className="relative">
              <div className="text-lg leading-relaxed text-white/70 font-light flex flex-col gap-6 text-center">
                <p>
                  Bino is a dependable and accomplished real estate professional serving the greater Seattle area.
                  She has called Redmond home for over 20 years, giving her a deep understanding of the local market and community.
                </p>
                <p>
                  Bino's clients are her top priority, and she is committed to walking with them every step of the way—from
                  the initial consultation to closing.
                </p>
              </div>
            </div>

            {/* Social Links & CTA */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 pt-4">
              <div className="flex items-center gap-10">
                {socialUrls?.facebook && (
                  <a href={socialUrls.facebook} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#EDB75E] transition-all duration-300 hover:-translate-y-1">
                    <FaFacebookF size={22} />
                  </a>
                )}
                {socialUrls?.instagram && (
                  <a href={socialUrls.instagram} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#EDB75E] transition-all duration-300 hover:-translate-y-1">
                    <FaInstagram size={22} />
                  </a>
                )}
                {socialUrls?.twitter && (
                  <a href={socialUrls.twitter} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#EDB75E] transition-all duration-300 hover:-translate-y-1">
                    <FaTwitter size={22} />
                  </a>
                )}
                {(socialUrls?.linkedin || socialUrls?.linked_in) && (
                  <a href={socialUrls.linkedin || socialUrls.linked_in} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#EDB75E] transition-all duration-300 hover:-translate-y-1">
                    <FaLinkedinIn size={22} />
                  </a>
                )}
              </div>

              <button className="btn-gold">
                Contact Agent
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
