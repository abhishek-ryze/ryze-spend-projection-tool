"use client";
import { useEffect, useRef } from "react";
import lottie from "lottie-web";

const FOOTER_NAV = [
  { n: "01", label: "Home",     href: "https://www.ryzedesigns.com" },
  { n: "02", label: "Work",     href: "https://www.ryzedesigns.com/work" },
  { n: "03", label: "Academy",  href: "https://www.ryzedesigns.com/academy" },
  { n: "04", label: "Blog",     href: "https://www.ryzedesigns.com/blog" },
  { n: "05", label: "About Us", href: "https://www.ryzedesigns.com/about" },
];

export function RyzeFooter() {
  return (
    <>
      <FooterCurtain />
      <FooterBody />
      <MobileFooter />
    </>
  );
}

function FooterCurtain() {
  return (
    <div className="relative overflow-hidden" style={{ background: "var(--ink)" }}>
      <img
        src="/cta-swoosh.svg"
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none z-0"
        style={{ left: "-20%", bottom: 0, width: "120%", height: "auto" }}
      />

      <section className="relative z-[1] text-center px-8 pt-[120px] md:pt-[200px] pb-[80px] md:pb-[120px]">
        <h2
          className="font-extrabold uppercase leading-[0.86] tracking-[-0.04em] m-0 mb-8 md:mb-10"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--paper)",
            fontSize: "clamp(2.5rem, 8vw, 80px)",
          }}
        >
          Ready to<br />Work Together?
        </h2>
        <p
          className="mx-auto mb-10 md:mb-14 max-w-[36ch]"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            color: "rgba(255,255,255,0.70)",
            lineHeight: 1.45,
            letterSpacing: "-0.02em",
            fontSize: "clamp(1rem, 1.5vw, 1.5rem)",
          }}
        >
          Let's build something great together.<br />
          Reach out and let's make it happen.
        </p>
        <a
          href="https://www.ryzedesigns.com/book"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-electric"
        >
          Start a Project
        </a>
      </section>

      <MarqueeBand />
    </div>
  );
}

function MarqueeBand() {
  const phrase = "Let's Connect";
  return (
    <div
      className="relative h-[126px] overflow-hidden flex items-center"
      style={{
        backgroundImage: `url("/marquee-pattern.png"), linear-gradient(90deg, #000 0%, #00034D 8%, #00034D 92%, #000 100%)`,
        backgroundSize: "auto, 100% 100%",
        backgroundRepeat: "repeat, no-repeat",
        backgroundBlendMode: "overlay, normal",
        boxShadow: "inset 0 0 120px -65px rgba(246,237,254,0.26)",
      }}
    >
      <div className="flex items-center gap-16 whitespace-nowrap pl-16 animate-marquee motion-reduce:animate-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="flex items-center gap-16">
            <span
              className="shrink-0 uppercase"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 64px)",
                fontWeight: 800,
                lineHeight: 0.86,
                letterSpacing: "-0.02em",
                color: "var(--paper)",
              }}
            >
              {phrase}
            </span>
            <Sparkle />
          </span>
        ))}
      </div>
    </div>
  );
}

function Sparkle() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="w-7 h-7 shrink-0"
      style={{
        color: "var(--ryze-blue-300)",
        animation: "ryze-spark-spin 18s linear infinite",
        transformOrigin: "center",
      }}
    >
      <path d="M12 0 L13.41 10.59 L24 12 L13.41 13.41 L12 24 L10.59 13.41 L0 12 L10.59 10.59 Z" />
    </svg>
  );
}

function FooterBody() {
  return (
    <footer
      className="hidden md:block fixed inset-x-0 bottom-0 z-[1] overflow-hidden px-[60px] lg:px-[120px] pt-[80px] lg:pt-[106px] pb-8"
      style={{ background: "var(--ink)", minHeight: 776 }}
    >
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ left: -300, top: "30%", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(0,26,255,0.55) 0%, rgba(0,12,162,0.25) 40%, transparent 70%)", mixBlendMode: "hard-light", filter: "blur(50px)" }} />
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ left: -250, bottom: -100, width: 700, height: 500, background: "radial-gradient(ellipse, rgba(0,26,255,0.4) 0%, rgba(0,12,162,0.2) 40%, transparent 70%)", filter: "blur(70px)" }} />

      <div className="relative z-[1] mx-auto footer-grid items-start gap-8 lg:gap-16 max-w-[1320px]">
        <div>
          <img src="/ryze-mark.png" alt="Ryze" className="block w-[124px] h-[139px] object-contain" />
          <p
            className="mt-[30px] mb-0 max-w-[350px]"
            style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 500, color: "rgba(255,255,255,0.70)", lineHeight: 1.45, letterSpacing: "-0.03em" }}
          >
            Tell us about your brand, vision, and challenges. No stress just endless opportunities.
          </p>
          <div className="mt-[80px] lg:mt-[122px]">
            <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.65)", letterSpacing: "-0.03em", marginBottom: 16 }}>
              FOLLOW US ON
            </p>
            <div className="flex gap-4">
              <SocialIcon href="https://instagram.com/ryzedesigns" label="Instagram">
                <InstagramIcon />
              </SocialIcon>
              <SocialIcon href="https://linkedin.com/company/ryzedesigns" label="LinkedIn">
                <LinkedInIcon />
              </SocialIcon>
              <SocialIcon href="https://youtube.com/@ryzedesigns" label="YouTube">
                <YouTubeIcon />
              </SocialIcon>
            </div>
          </div>
        </div>

        <div className="footer-divider self-stretch w-px" style={{ background: "rgba(255,255,255,0.12)" }} />

        <ul className="list-none p-0 m-0 w-full border-t" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
          {FOOTER_NAV.map(({ n, label, href }) => (
            <li key={n}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-6 py-7 border-b transition-[padding] duration-200 hover:pl-1"
                style={{ borderColor: "rgba(255,255,255,0.12)" }}
              >
                <span className="flex items-center gap-6">
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 400, letterSpacing: "-0.03em", color: "rgba(255,255,255,0.70)" }}>{n}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 500, textTransform: "uppercase", letterSpacing: "-0.03em", color: "var(--paper)" }}>{label}</span>
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6 transition-transform duration-200 group-hover:translate-x-1" style={{ color: "var(--paper)" }}>
                  <path d="M5 12 H19 M13 6 L19 12 L13 18" />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        <div className="footer-divider self-stretch w-px" style={{ background: "rgba(255,255,255,0.12)" }} />

        <div className="footer-col3">
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 48px)", fontWeight: 400, color: "var(--paper)", lineHeight: 1.2, letterSpacing: "-0.06em", marginTop: 0, marginBottom: "auto" }}>
            Let's create<br />what's next,<br />
            <span className="text-together" style={{ fontSize: "clamp(2.5rem, 4.5vw, 64px)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>together.</span>
          </p>
          <FooterLoop />
        </div>
      </div>

      <div
        className="relative z-[1] flex items-center justify-between mx-auto max-w-[1320px] mt-16 pt-8 border-t"
        style={{ borderColor: "rgba(255,255,255,0.10)", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.70)", letterSpacing: "-0.03em" }}
      >
        <span>&copy;{new Date().getFullYear()} Ryze Design Studio. All Rights Reserved.</span>
        <div className="hidden lg:flex gap-16 uppercase">
          <a href="https://www.ryzedesigns.com/terms" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>
          <a href="https://www.ryzedesigns.com/privacy" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

function MobileFooter() {
  return (
    <footer
      className="block md:hidden px-6 py-12 border-t"
      style={{ background: "var(--ink)", borderColor: "rgba(255,255,255,0.08)" }}
    >
      <img src="/ryze-mark.png" alt="Ryze" className="w-16 h-auto mb-6" />
      <p
        className="mb-8 max-w-[32ch]"
        style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "rgba(255,255,255,0.60)", lineHeight: 1.5 }}
      >
        Let's create what's next, <span className="text-together" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>together.</span>
      </p>
      <ul className="list-none p-0 m-0 mb-8 space-y-1">
        {FOOTER_NAV.map(({ n, label, href }) => (
          <li key={n}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-2"
              style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "rgba(255,255,255,0.70)" }}
            >
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{n}</span>
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="flex gap-4 mb-8">
        <SocialIcon href="https://instagram.com/ryzedesigns" label="Instagram"><InstagramIcon /></SocialIcon>
        <SocialIcon href="https://linkedin.com/company/ryzedesigns" label="LinkedIn"><LinkedInIcon /></SocialIcon>
        <SocialIcon href="https://youtube.com/@ryzedesigns" label="YouTube"><YouTubeIcon /></SocialIcon>
      </div>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
        &copy;{new Date().getFullYear()} Ryze Design Studio. All Rights Reserved.
      </p>
    </footer>
  );
}

function FooterLoop() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    import("lottie-web").then(({ default: lottieLib }) => {
      import("../ryze-design-system/ryze-footer-loop.json").then((data) => {
        const anim = lottieLib.loadAnimation({
          container: ref.current!,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: data.default,
        });
        return () => anim.destroy();
      });
    });
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="footer-loop--inline mt-8 self-end pointer-events-none"
    />
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="grid place-items-center w-8 h-8 transition-transform duration-200 hover:-translate-y-0.5"
      style={{ color: "var(--paper)" }}
    >
      {children}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="var(--ink)" />
    </svg>
  );
}
