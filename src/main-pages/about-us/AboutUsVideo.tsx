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
    <section className="bg-[var(--canvas)] text-[var(--ink)] py-20 pb-40 md:py-32 md:pb-60 relative overflow-hidden">
      <div className="container-wide relative z-10 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center justify-items-center bg-[var(--cream)] border border-[var(--line)] rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)] p-10 md:p-16">

          {/* Left Column - Video Player */}
          <div className="flex flex-col gap-6 group">
            <div
              className="relative w-full overflow-hidden shadow-2xl transition-all duration-700"
              style={{
                aspectRatio: "16/9",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--line)"
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
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-[var(--pine)]/45 backdrop-blur-[2px] transition-all duration-500 hover:bg-[var(--pine)]/25"
                  onClick={handlePlayPause}
                >
                  <div
                    style={{
                      background: "rgba(194, 168, 120, 0.18)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      borderRadius: "999px",
                      padding: "24px",
                      border: "1px solid rgba(217, 198, 157, 0.5)",
                      boxShadow: "0 0 30px rgba(194, 168, 120, 0.25)"
                    }}
                    className="hover:scale-110 transition-all duration-300"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--gold-300)">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <h4 className="text-[var(--gold-deep)] text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-accent)] mb-3">Our Legacy</h4>
              <p className="text-sm text-[var(--ink-soft)] leading-relaxed max-w-sm">
                A quiet standard for fine homes — set through deep local knowledge and patient, attentive care.
              </p>
            </div>
          </div>

          {/* Right Column - About Us Info */}
          <div className="flex flex-col gap-10 items-center justify-center w-full">
            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
              <div className="relative w-40 h-52 flex-shrink-0 group">
                {/* Square Profile Image */}
                <div className="relative w-full h-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--gold)]/40">
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
                <h3 className="display-md mb-4">
                  {name || "Dora"}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-[1px] bg-[var(--gold)]" />
                  <p className="text-[var(--gold-deep)] text-sm uppercase tracking-widest font-[family-name:var(--font-accent)]">
                    Trusted Advisor
                  </p>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-[var(--gold)]/50 via-[var(--gold)]/15 to-transparent w-full" />

            <div className="relative">
              <div className="text-lg leading-relaxed text-[var(--ink-soft)] font-light flex flex-col gap-6 text-center">
                <p>
                  A dependable, accomplished advisor with deep roots in the
                  region — years spent in one community lending a genuine feel
                  for its market and its people.
                </p>
                <p>
                  Clients come first, always — held with care from the first
                  conversation through to the closing table and well beyond.
                </p>
              </div>
            </div>

            {/* Social Links & CTA */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 pt-4">
              <div className="flex items-center gap-10">
                {socialUrls?.facebook && (
                  <a href={socialUrls.facebook} target="_blank" rel="noopener noreferrer" className="text-[var(--ink-faint)] hover:text-[var(--gold-deep)] transition-all duration-300 hover:-translate-y-1">
                    <FaFacebookF size={22} />
                  </a>
                )}
                {socialUrls?.instagram && (
                  <a href={socialUrls.instagram} target="_blank" rel="noopener noreferrer" className="text-[var(--ink-faint)] hover:text-[var(--gold-deep)] transition-all duration-300 hover:-translate-y-1">
                    <FaInstagram size={22} />
                  </a>
                )}
                {socialUrls?.twitter && (
                  <a href={socialUrls.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--ink-faint)] hover:text-[var(--gold-deep)] transition-all duration-300 hover:-translate-y-1">
                    <FaTwitter size={22} />
                  </a>
                )}
                {(socialUrls?.linkedin || socialUrls?.linked_in) && (
                  <a href={socialUrls.linkedin || socialUrls.linked_in} target="_blank" rel="noopener noreferrer" className="text-[var(--ink-faint)] hover:text-[var(--gold-deep)] transition-all duration-300 hover:-translate-y-1">
                    <FaLinkedinIn size={22} />
                  </a>
                )}
              </div>

              <button className="btn-gold-new">
                Contact Agent
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
