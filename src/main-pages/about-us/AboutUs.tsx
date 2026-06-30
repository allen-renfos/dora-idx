"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { useNameContext } from "@/component/NameProvider";
import { Reveal } from "@/component/ui/Reveal";
import HomeNewsletter from "@/main-pages/home/HomeNewsletter";

const PILLARS = [
  {
    n: "01",
    title: "Quiet Representation",
    body: "Private, unhurried client service held in complete confidence — full attention from the first walkthrough to the keys in hand.",
  },
  {
    n: "02",
    title: "A Feel for the Market",
    body: "Two decades of closings paired with a measured, evidence-led read on pricing — shaped by the rooms and the rhythms of place.",
  },
  {
    n: "03",
    title: "A Considered Close",
    body: "Trusted inspectors, stagers, lenders, and attorneys — gathered and choreographed so the move feels effortless.",
  },
];

const SERVICES = [
  { title: "Buyer Representation", body: "From quiet private previews to the last detail of diligence." },
  { title: "Seller Strategy", body: "Pricing, presentation, and a marketing plan made with intent." },
  { title: "Investment Advisory", body: "Yield-minded counsel for portfolios of every shape." },
  { title: "Relocation", body: "Considered, fully held moves between markets." },
];

export const AboutUs = () => {
  const { name, shortDescription, longDescription, profile_image, socialUrls } =
    useNameContext();

  const portrait = profile_image || "/images/advisor-image.png";

  const socials: { href?: string; Icon: React.ComponentType<{ size?: number }>; label: string }[] = [
    { href: socialUrls?.instagram, Icon: FaInstagram, label: "Instagram" },
    { href: socialUrls?.facebook, Icon: FaFacebookF, label: "Facebook" },
    { href: socialUrls?.linkedin || socialUrls?.linked_in, Icon: FaLinkedinIn, label: "LinkedIn" },
    { href: socialUrls?.twitter, Icon: FaTwitter, label: "X" },
    { href: socialUrls?.youtube, Icon: FaYoutube, label: "YouTube" },
  ].filter((s) => s.href);

  const nameParts = (name || "").trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  return (
    <div className="bg-[var(--canvas)] text-[var(--ink)]">
      {/* HERO + STORY — combined */}
      <section className="relative isolate overflow-hidden bg-[var(--canvas)]">
        {/* Background */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--canvas-2)] via-[var(--canvas)] to-[var(--canvas)]" />

        <div className="container-wide pt-16 pb-10 md:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-12 items-start">

            {/* ── LEFT COLUMN ── */}
            <div className="lg:col-span-7 flex flex-col gap-10 pb-10 lg:pb-10 lg:pr-8">

              {/* Eyebrow */}
              <Reveal>
                <span className="eyebrow inline-flex items-center gap-3">
                  <span className="h-px w-10 bg-[var(--gold)]" />
                  The Practice
                </span>
              </Reveal>

              {/* Agent name — creative display */}
              <Reveal delay={0.06}>
                <div className="relative select-none">
                  {/* Ghost watermark behind */}
                  <span
                    aria-hidden
                    className="absolute -top-4 -left-3 font-serif leading-none text-[var(--ink)]/[0.05] whitespace-nowrap pointer-events-none"
                    style={{ fontSize: "clamp(72px, 14vw, 180px)" }}
                  >
                    {firstName}
                  </span>
                  {/* Actual name */}
                  <div className="relative flex flex-col gap-0.5">
                    <span
                      className="font-serif text-[var(--ink)] leading-[1]"
                      style={{ fontSize: "clamp(44px, 7vw, 88px)" }}
                    >
                      {firstName || "Your"}
                    </span>
                    <span
                      className="font-serif italic text-[var(--gold-deep)] leading-[1]"
                      style={{ fontSize: "clamp(44px, 7vw, 88px)" }}
                    >
                      {lastName || "Name"}
                    </span>
                  </div>
                  {/* Role tag */}
                  <div className="flex items-center gap-3 mt-5">
                    <span className="h-px w-8 bg-[var(--gold)]/60" />
                    <span className="text-[11px] text-[var(--ink-faint)] uppercase tracking-[0.2em] font-[family-name:var(--font-accent)]">
                      Real Estate Advisor
                    </span>
                  </div>
                </div>
              </Reveal>

              {/* Pull quote */}
              <Reveal delay={0.14}>
                <blockquote className="border-l-2 border-[var(--gold)]/60 pl-6">
                  <p className="font-serif italic text-[clamp(17px,2vw,22px)] text-[var(--ink-soft)] leading-[1.6]">
                    &ldquo;{shortDescription ||
                      "Real estate, made personal — every client given the care a once-in-a-generation decision deserves."}&rdquo;
                  </p>
                </blockquote>
              </Reveal>

              {/* Thin divider + Story label */}
              <Reveal delay={0.18}>
                <div className="flex items-center gap-4">
                  <span className="h-px flex-1 bg-[var(--line)]" />
                  <span className="eyebrow text-[var(--ink-faint)]">The Story</span>
                  <span className="h-px w-8 bg-[var(--line)]" />
                </div>
              </Reveal>

              {/* Story content */}
              <Reveal delay={0.22}>
                <div className="flex flex-col gap-4 text-[15px] text-[var(--ink-soft)] leading-[1.85]">
                  {longDescription ? (
                    <p className="whitespace-pre-line">{longDescription}</p>
                  ) : (
                    <>
                      <p>
                        What began nearly two decades ago as a single representation has become a quiet practice with far reach — built one relationship at a time. My work is to turn market noise into clarity, and to bring calm discipline to one of the most consequential decisions a family ever makes.
                      </p>
                      <p>
                        I sit on both sides of the table — buyers and sellers alike — across the region&rsquo;s most considered markets. The approach never changes: prepare thoroughly, advocate quietly, close with care.
                      </p>
                      <p>
                        And the relationship rarely ends at the closing. Introductions become referrals, first homes become second and third moves, neighbors become clients become friends.
                      </p>
                    </>
                  )}
                </div>
              </Reveal>

              {/* CTAs */}
              <Reveal delay={0.28}>
                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/connect" className="btn-gold-new">
                    Begin a conversation
                  </Link>
                  <Link href="/properties" className="link-underline">
                    View current listings
                    <FiArrowRight size={14} />
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* ── RIGHT COLUMN — portrait ── */}
            <div className="lg:col-span-5 relative flex items-start justify-center lg:justify-end pt-4 lg:pt-14">
              <Reveal y={40} delay={0.1} className="w-full">
                <div className="relative w-full max-w-[440px] mx-auto lg:mx-0 lg:ml-auto">

                  {/* Decorative offset frame */}
                  <div
                    aria-hidden
                    className="absolute -top-5 -right-5 w-full h-full rounded-[var(--radius-md)] border border-[var(--gold)]/40 pointer-events-none"
                  />

                  {/* Portrait */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] bg-[var(--pine)]">
                    <Image
                      src={portrait}
                      alt={name || "Advisor"}
                      fill
                      sizes="(max-width: 1024px) 85vw, 38vw"
                      className="object-cover object-top"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)] via-[var(--pine)]/15 to-transparent pointer-events-none" />

                    {/* Name nameplate on photo */}
                    <div className="absolute bottom-0 left-0 right-0 px-7 py-6">
                      <p className="font-serif text-[22px] text-[var(--on-pine)] leading-tight">
                        {firstName}{" "}
                        <span className="italic text-[var(--gold-300)]">{lastName}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="h-px w-5 bg-[var(--gold-300)]/70" />
                        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--on-pine-soft)] font-[family-name:var(--font-accent)]">
                          Real Estate Advisor
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Corner accent dot */}
                  <div
                    aria-hidden
                    className="absolute -bottom-3 -left-3 w-6 h-6 rounded-[var(--radius-xs)] border border-[var(--gold)]/60"
                  />
                </div>
              </Reveal>

              {/* Vertical label */}
              <div
                aria-hidden
                className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 items-center gap-2"
                style={{ transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center" }}
              >
                <span className="h-px w-6 bg-[var(--gold)]/50" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)] whitespace-nowrap">
                  A Boutique Practice
                </span>
                <span className="h-px w-6 bg-[var(--gold)]/50" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="bg-[var(--canvas-2)] border-y border-[var(--line)]">
        <div className="container-wide section-pad">
          <Reveal className="max-w-2xl mb-12">
            <span className="eyebrow inline-flex items-center gap-3 mb-5">
              <span className="inline-block h-px w-10 bg-[var(--gold)]" />
              How I Work
            </span>
            <h2 className="display-md text-[var(--ink)]">
              Three quiet commitments,
              <br />
              kept without exception.
            </h2>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {PILLARS.map((p) => (
              <motion.div
                key={p.n}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="bg-[var(--cream)] rounded-[var(--radius-md)] border border-[var(--line)] p-7 flex flex-col gap-3 hover:shadow-[var(--shadow-soft)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <span className="font-serif text-[var(--gold-deep)] text-lg">
                  {p.n}
                </span>
                <h3 className="font-serif text-2xl text-[var(--ink)] leading-tight">
                  {p.title}
                </h3>
                <p className="text-[14px] text-[var(--ink-soft)] leading-relaxed">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-pad bg-[var(--canvas)]">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-3 mb-5">
                <span className="inline-block h-px w-10 bg-[var(--gold)]" />
                Services
              </span>
              <h2 className="display-md text-[var(--ink)]">
                Engagements shaped around{" "}
                <em className="text-[var(--gold-deep)]">your goal</em>.
              </h2>
              <p className="lede mt-5 max-w-md">
                Every relationship opens with a conversation. From there, the
                work is shaped to fit the moment in front of you.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="bg-[var(--cream)] rounded-[var(--radius-md)] border border-[var(--line)] hover:shadow-[var(--shadow-soft)] hover:-translate-y-1 p-6 md:p-7 h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <h3 className="font-serif text-xl text-[var(--ink)] mb-2">{s.title}</h3>
                  <p className="text-[14px] text-[var(--ink-soft)] leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + SOCIAL — pine band */}
      <section className="relative isolate overflow-hidden bg-[var(--pine)]">
        <span
          aria-hidden
          className="pointer-events-none select-none absolute -bottom-16 right-[3vw] font-serif text-[clamp(7rem,18vw,16rem)] leading-none text-[var(--on-pine)]/[0.04]"
        >
          Hello
        </span>
        <div className="container-wide section-pad flex flex-col items-center text-center gap-6 relative">
          <Reveal>
            <span className="eyebrow on-dark inline-flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-[var(--gold-300)]" />
              Connect
              <span className="inline-block h-px w-10 bg-[var(--gold-300)]" />
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="display-md max-w-2xl text-[var(--on-pine)]">
              Let&rsquo;s begin with a quiet conversation about your{" "}
              <em className="text-[var(--gold-300)]">next move</em>.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <Link href="/connect" className="btn-outline-new on-dark mt-2">
              Arrange a private consultation
            </Link>
          </Reveal>
          {socials.length > 0 && (
            <Reveal delay={0.2}>
              <div className="flex items-center gap-3 mt-6">
                {socials.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full border border-[rgba(241,237,227,0.2)] flex items-center justify-center text-[var(--on-pine-soft)] hover:text-[var(--pine)] hover:bg-[var(--gold-300)] hover:border-[var(--gold-300)] transition-colors duration-300"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <HomeNewsletter />
    </div>
  );
};
