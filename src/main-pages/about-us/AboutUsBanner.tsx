"use client";
import { useNameContext } from "@/component/NameProvider";

export const AboutUsBanner = () => {
  const { company_name } = useNameContext();

  return (
    <section 
        className="hero-neighborhood" 
        style={{ 
            height: "auto", 
            paddingTop: "80px", 
            paddingBottom: "80px",
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
            position: "relative",
            overflow: "hidden",
        }}
    >
        {/* Animated background pattern */}
        <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
                linear-gradient(90deg, rgba(237, 183, 94, 0.03) 1px, transparent 1px),
                linear-gradient(rgba(237, 183, 94, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            opacity: 0.5,
        }} />
        
        <div className="hero-overlay" style={{ 
            background: "radial-gradient(circle at 50% 50%, rgba(237, 183, 94, 0.05) 0%, transparent 70%)",
        }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="hero-content text-center">
          <div className="hero-text" style={{ 
              marginBottom: "0px",
              textAlign: "center",
              maxWidth: "800px",
              margin: "0 auto",
          }}>
            <div style={{ marginBottom: "20px" }}>
              <span 
                  style={{
                      padding: "8px 20px",
                      background: "rgba(80, 58, 10, 0.7)",
                      border: "1px solid rgba(237, 183, 94, 0.5)",
                      borderRadius: 0,
                      color: "#EDB75E",
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "2px",
                      textTransform: "uppercase" as const,
                      display: "inline-block",
                      fontFamily: "var(--font-lato)",
                  }}
              >
                  ABOUT US
              </span>
            </div>

            <h1 
                style={{
                    fontSize: "clamp(36px, 5vw, 64px)",
                    fontWeight: 700,
                    marginBottom: "20px",
                    lineHeight: 1.15,
                    fontFamily: "var(--font-playfair)",
                    background: "linear-gradient(135deg, #f5e6c8 0%, #EDB75E 60%, #c8902e 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                }}
            >
              Presenting {company_name || "Realtipro"} Story
            </h1>

            <p 
                style={{
                    fontSize: "clamp(15px, 1.6vw, 18px)",
                    color: "#a0a0a0",
                    maxWidth: "600px",
                    margin: "0 auto",
                    lineHeight: 1.7,
                    fontFamily: "var(--font-lato)",
                }}
            >
              Dedicated to excellence, driven by results, and committed to your real estate journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
