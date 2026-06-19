"use client";
import Image from "next/image";
import { useNameContext } from "@/component/NameProvider";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaTwitter,
    FaStar,
    FaHandshake,
    FaAward,
} from "react-icons/fa";

export default function AboutUsPage() {
    const { name, company_name, longDescription, shortDescription, profile_image, socialUrls } =
        useNameContext();

    const noProfileImg =
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1200&fit=crop&crop=faces";

    const stats = [
        {
            icon: <FaAward style={{ color: "#c2a878", fontSize: 22 }} />,
            title: "20+ Years Experience",
            desc: "Over two decades of trusted expertise in the local real estate market.",
        },
        {
            icon: <FaStar style={{ color: "#c2a878", fontSize: 22 }} />,
            title: "500+ Properties Sold",
            desc: "A proven track record of successful closings for buyers and sellers alike.",
        },
        {
            icon: <FaHandshake style={{ color: "#c2a878", fontSize: 22 }} />,
            title: "Trusted Advisor",
            desc: "Committed to guiding every client with integrity, transparency, and care.",
        },
    ];

    return (
        <>
            {/* ───────────── HERO ───────────── */}
            <section style={{ 
                position: "relative", 
                background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)", 
                overflow: "hidden",
                paddingTop: "80px",
                paddingBottom: "80px",
            }}>
                {/* Animated background pattern */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
                        linear-gradient(90deg, rgba(194, 168, 120, 0.03) 1px, transparent 1px),
                        linear-gradient(rgba(194, 168, 120, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: "50px 50px",
                    opacity: 0.5,
                    zIndex: 0,
                }} />
                
                {/* bg image + gradient */}
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 1,
                            background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 100%)",
                        }}
                    />
                    <Image
                        src="/images/aboutus-coverpic.png"
                        alt="About Us Hero"
                        fill
                        style={{ objectFit: "cover", opacity: 0.3 }}
                        priority
                    />
                </div>

                {/* Radial glow overlay */}
                <div style={{ 
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at 30% 50%, rgba(194, 168, 120, 0.08) 0%, transparent 60%)",
                    zIndex: 1,
                }} />

                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        maxWidth: 1280,
                        margin: "0 auto",
                        padding: "0 24px",
                        textAlign: "center",
                    }}
                >
                    <div style={{ maxWidth: 800, margin: "0 auto" }}>
                        <span
                            style={{
                                display: "inline-block",
                                padding: "8px 20px",
                                background: "rgba(80, 58, 10, 0.7)",
                                border: "1px solid rgba(194, 168, 120, 0.5)",
                                borderRadius: 0,
                                color: "#c2a878",
                                fontSize: 13,
                                fontWeight: 700,
                                letterSpacing: 2,
                                textTransform: "uppercase",
                                marginBottom: 24,
                                fontFamily: "var(--font-lato)",
                            }}
                        >
                            ABOUT ME
                        </span>

                        <h1
                            style={{
                                fontSize: "clamp(36px, 5vw, 64px)",
                                fontWeight: 700,
                                lineHeight: 1.15,
                                marginBottom: 20,
                                fontFamily: "var(--font-playfair)",
                                background: "linear-gradient(135deg, #f5e6c8 0%, #c2a878 60%, #c8902e 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            The {" "}
                            {company_name || "Realtipro"}{" "}
                            Story
                        </h1>

                        <p
                            style={{
                                fontSize: "clamp(15px, 1.6vw, 18px)",
                                color: "#a0a0a0",
                                lineHeight: 1.7,
                                marginBottom: 32,
                                maxWidth: 600,
                                margin: "0 auto 32px",
                                fontFamily: "var(--font-lato)",
                            }}
                        >
                            {shortDescription ||
                                "Dedicated to excellence, driven by results, and committed to your real estate journey. With deep roots in the community and unmatched market knowledge, we put your success first."}
                        </p>

                        <a
                            href="/connect"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "14px 28px",
                                background: "#c2a878",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: 15,
                                textDecoration: "none",
                                transition: "background .3s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#957a4b")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#c2a878")}
                        >
                            Get In Touch
                        </a>
                    </div>
                </div>
            </section>

            {/* ───────────── STATS / VALUE CARDS ───────────── */}
            {/* <section style={{ background: "#0a0a0a", padding: "80px 0" }}>
                <div
                    style={{
                        maxWidth: 1280,
                        margin: "0 auto",
                        padding: "0 24px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: 28,
                    }}
                >
                    {stats.map((stat) => (
                        <div
                            key={stat.title}
                            style={{
                                background: "#171717",
                                border: "1px solid #313131",
                                padding: 32,
                                transition: "border-color .3s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#EDB75E")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#313131")}
                        >
                            <div
                                style={{
                                    width: 56,
                                    height: 56,
                                    border: "1px solid #EDB75E",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 24,
                                    background: "rgba(237,183,94,.08)",
                                }}
                            >
                                {stat.icon}
                            </div>
                            <h3
                                style={{
                                    color: "#fff",
                                    fontSize: 20,
                                    fontWeight: 600,
                                    marginBottom: 10,
                                }}
                            >
                                {stat.title}
                            </h3>
                            <p style={{ color: "#9ca3af", margin: 0, lineHeight: 1.6 }}>
                                {stat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section> */}

            {/* ───────────── AGENT BIO SECTION ───────────── */}
            <section style={{ background: "#ffffff", padding: "100px 0" }}>
                <div
                    style={{
                        maxWidth: 1280,
                        margin: "0 auto",
                        padding: "0 24px",
                    }}
                >
                    {/* Section label */}
                    {/* <span
                        style={{
                            display: "inline-block",
                            padding: "8px 18px",
                            border: "1px solid #EDB75E",
                            color: "#EDB75E",
                            fontSize: 13,
                            fontWeight: 600,
                            letterSpacing: 1.5,
                            textTransform: "uppercase",
                            marginBottom: 60,
                            background: "rgba(237,183,94,.08)",
                        }}
                    >
                        Meet The Agent
                    </span> */}

                    {/* Two-column layout */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 64,
                            alignItems: "start",
                        }}
                        className="au-bio-grid"
                    >
                        {/* Left – profile image + name + socials */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                            <div
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    aspectRatio: "3/4",
                                    maxWidth: 420,
                                    overflow: "hidden",
                                    border: "1px solid #e7e4de",
                                }}
                            >
                                <Image
                                    src={profile_image || noProfileImg}
                                    alt={name || "Agent"}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>

                            {/* Name + title */}
                            <div>
                                <h2
                                    style={{
                                        color: "#1a1a1a",
                                        fontSize: "clamp(28px, 3vw, 40px)",
                                        fontWeight: 700,
                                        marginBottom: 8,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {name || "Realty Pro"}
                                </h2>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                                    <div style={{ width: 32, height: 1, background: "#c2a878" }} />
                                    <p
                                        style={{
                                            color: "#957a4b",
                                            fontSize: 13,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.15em",
                                            fontWeight: 600,
                                            margin: 0,
                                        }}
                                    >
                                        Real Estate Professional
                                    </p>
                                </div>

                                {/* Social icons */}
                                <div style={{ display: "flex", gap: 10 }}>
                                    {socialUrls?.facebook && (
                                        <SocialIcon href={socialUrls.facebook}>
                                            <FaFacebookF size={15} />
                                        </SocialIcon>
                                    )}
                                    {socialUrls?.twitter && (
                                        <SocialIcon href={socialUrls.twitter}>
                                            <FaTwitter size={15} />
                                        </SocialIcon>
                                    )}
                                    {socialUrls?.instagram && (
                                        <SocialIcon href={socialUrls.instagram}>
                                            <FaInstagram size={15} />
                                        </SocialIcon>
                                    )}
                                    {(socialUrls?.linkedin || socialUrls?.linked_in) && (
                                        <SocialIcon href={socialUrls.linkedin || socialUrls.linked_in}>
                                            <FaLinkedinIn size={15} />
                                        </SocialIcon>
                                    )}
                                    {socialUrls?.youtube && (
                                        <SocialIcon href={socialUrls.youtube}>
                                            <FaYoutube size={15} />
                                        </SocialIcon>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right – bio text + CTA */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingTop: 8 }}>
                            <h2
                                style={{
                                    fontSize: "clamp(28px, 4vw, 48px)",
                                    fontWeight: 700,
                                    color: "#1a1a1a",
                                    lineHeight: 1.2,
                                    margin: 0,
                                }}
                            >
                                Committed to Your{" "}
                                <span style={{ color: "#c2a878" }}>Real Estate Success</span>
                            </h2>

                            {/* Gold divider */}
                            <div
                                style={{
                                    height: 1,
                                    background:
                                        "linear-gradient(to right, #c2a878 0%, rgba(194, 168, 120,.3) 50%, transparent 100%)",
                                    width: "100%",
                                }}
                            />

                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                {longDescription ? (
                                    <p
                                        style={{
                                            color: "#555350",
                                            fontSize: 17,
                                            lineHeight: 1.8,
                                            margin: 0,
                                        }}
                                    >
                                        {longDescription}
                                    </p>
                                ) : (
                                    <>
                                        <p
                                            style={{
                                                color: "#555350",
                                                fontSize: 17,
                                                lineHeight: 1.8,
                                                margin: 0,
                                            }}
                                        >
                                            {name || "Our agent"} is a dependable and accomplished real estate
                                            professional serving the local community with dedication. With deep roots
                                            in the area, they bring unmatched knowledge of the local market and a
                                            genuine commitment to every client's success.
                                        </p>
                                        <p
                                            style={{
                                                color: "#555350",
                                                fontSize: 17,
                                                lineHeight: 1.8,
                                                margin: 0,
                                            }}
                                        >
                                            Clients are the top priority, and every transaction is approached with
                                            integrity, transparency, and a relentless drive to deliver the best
                                            possible outcome—from the initial consultation all the way to closing day.
                                        </p>
                                    </>
                                )}
                            </div>

                            <div>
                                <a
                                    href="/connect"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "14px 28px",
                                        background: "#1a1a1a",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: 15,
                                        textDecoration: "none",
                                        transition: "background .3s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#957a4b")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1a1a")}
                                >
                                    Connect with Agent
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Responsive grid fix */}
            <style>{`
        @media (max-width: 768px) {
          .au-bio-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
        </>
    );
}

/* ─── Social icon helper ─── */
function SocialIcon({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                width: 42,
                height: 42,
                border: "1px solid #e7e4de",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#555350",
                transition: "all .3s",
                textDecoration: "none",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#957a4b";
                e.currentTarget.style.color = "#957a4b";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e7e4de";
                e.currentTarget.style.color = "#555350";
            }}
        >
            {children}
        </a>
    );
}
