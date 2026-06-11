"use client";

import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import footerLoopData from "./ryze-footer-loop.json";
import { InstagramIcon, LinkedinIcon, XIcon, YouTubeIcon } from "./icons";

const FOOTER_NAV = [
  { n: "01", label: "Home", href: "https://www.ryzedesigns.com", external: true },
  { n: "02", label: "Work", href: "https://www.ryzedesigns.com/work", external: true },
  { n: "03", label: "Academy", href: "https://www.ryzedesigns.com/academy", external: true },
  { n: "04", label: "Blog", href: "https://www.ryzedesigns.com/blog", external: true },
  { n: "05", label: "About Us", href: "https://www.ryzedesigns.com/about", external: true },
];

const SOCIALS = [
  { href: "https://www.instagram.com/ryzedesigns", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.linkedin.com/company/ryzedesigns", label: "LinkedIn", Icon: LinkedinIcon },
  { href: "https://www.youtube.com/@ryzedesigns", label: "YouTube", Icon: YouTubeIcon },
  { href: "https://x.com/ryzedesigns", label: "X (Twitter)", Icon: XIcon },
];

/* One component, three layers, one scroll mechanic (COMPONENTS.md §11):
   the curtain (CTA + marquee) scrolls inside <main> (z-2), the footer body
   sits fixed at the bottom (z-1) and is revealed as the curtain slides out. */
export default function RyzeFooter() {
  return (
    <>
      <FooterCurtain />
      <FooterBody />
    </>
  );
}

/* Top layer — CTA + marquee bundled so the swoosh anchors to the marquee's bottom edge */
function FooterCurtain() {
  return (
    <div className="bg-ink" style={{ position: "relative", zIndex: 2, overflow: "clip" }}>
      <img src="/cta-swoosh.svg" alt="" aria-hidden className="footer-swoosh" />

      <section className="footer-cta">
        <h2>
          Ready to
          <br />
          Work Together?
        </h2>
        <p
          className="font-display"
          style={{
            fontWeight: 500,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.45,
            letterSpacing: "-0.02em",
            margin: "0 auto 56px",
            maxWidth: "36ch",
            fontSize: "clamp(1.125rem, 1.5vw, 1.5rem)",
          }}
        >
          Let&rsquo;s build something great together.
          <br />
          Reach out and let&rsquo;s make it happen.
        </p>
        <a
          href="https://www.ryzedesigns.com"
          target="_blank"
          rel="noreferrer"
          className="font-display"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "14px 24px",
            borderRadius: "var(--r-sm)",
            background: "var(--electric)",
            color: "var(--paper)",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            textDecoration: "none",
            transition: "transform var(--dur-base) var(--ease-out)",
          }}
        >
          Start a Project
        </a>
      </section>

      <MarqueeBand />
    </div>
  );
}

function MarqueeBand({ phrase = "Let's Connect" }: { phrase?: string }) {
  return (
    <div className="marquee-band">
      <div className="marquee-band__track">
        {/* sequence rendered twice so the -50% translate loops seamlessly */}
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "inherit" }}>
            <span className="marquee-band__text">{phrase}</span>
            <Sparkle />
          </span>
        ))}
      </div>
    </div>
  );
}

/* Symmetric 4-point sparkle that spins clockwise — do not swap the glyph */
function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="marquee-band__spark">
      <path d="M12 0 L13.41 10.59 L24 12 L13.41 13.41 L12 24 L10.59 13.41 L0 12 L10.59 10.59 Z" />
    </svg>
  );
}

/* Bottom layer — the fixed footer body */
function FooterBody() {
  return (
    <footer className="footer-fixed">
      {/* Cosmic glows bleeding off bottom-left */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          pointerEvents: "none",
          left: -300,
          top: "30%",
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse, rgba(0,26,255,0.55) 0%, rgba(0,12,162,0.25) 40%, transparent 70%)",
          mixBlendMode: "hard-light",
          filter: "blur(50px)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          pointerEvents: "none",
          left: -250,
          bottom: -100,
          width: 700,
          height: 500,
          background: "radial-gradient(ellipse, rgba(0,26,255,0.4) 0%, rgba(0,12,162,0.2) 40%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="footer-grid">
        {/* Col 1 — chrome R + tagline + socials */}
        <div>
          <img src="/ryze-mark.png" alt="Ryze" style={{ display: "block", width: 124, height: 139, objectFit: "contain" }} />
          <p
            className="font-display"
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.45,
              letterSpacing: "-0.03em",
              margin: "30px 0 0",
              maxWidth: 350,
            }}
          >
            Tell us about your brand, vision, and challenges. No stress &ndash; just endless opportunities.
          </p>
          <div style={{ marginTop: 122 }}>
            <p
              className="font-display"
              style={{ fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.65)", letterSpacing: "-0.03em", margin: "0 0 16px" }}
            >
              FOLLOW US ON
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {SOCIALS.map(({ href, label, Icon }) => (
                <a key={label} href={href} aria-label={label} className="footer-social" target="_blank" rel="noreferrer">
                  <Icon size={32} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-divider" aria-hidden />

        {/* Col 2 — numbered nav */}
        <ul className="footer-nav">
          {FOOTER_NAV.map(({ n, label, href, external }) => (
            <li key={n}>
              <a
                href={href}
                className="footer-nav-link"
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <span className="footer-nav-link__n">{n}</span>
                  <span className="footer-nav-link__label">{label}</span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="footer-nav-link__arrow"
                  aria-hidden
                >
                  <path d="M5 12 H19 M13 6 L19 12 L13 18" />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        <div className="footer-divider" aria-hidden />

        {/* Col 3 — "together." + lottie loop */}
        <div className="footer-col3">
          <p
            className="font-display text-paper"
            style={{ fontSize: 48, fontWeight: 400, lineHeight: 1.2, letterSpacing: "-0.06em", margin: "0 auto auto 0" }}
          >
            Let&rsquo;s create
            <br />
            what&rsquo;s next,
            <br />
            <span className="text-together" style={{ fontSize: 64, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              together.
            </span>
          </p>
          <FooterLoop />
        </div>
      </div>

      {/* Bottom legal row */}
      <div className="footer-legal">
        <span>&copy;{new Date().getFullYear()} Ryze Designs. All Rights Reserved.</span>
        <div className="footer-legal__links">
          <a href="https://www.ryzedesigns.com/terms" target="_blank" rel="noreferrer">
            Terms &amp; Conditions
          </a>
          <a href="https://www.ryzedesigns.com/privacy" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

/* Rotating "RYZE DESIGN STUDIO" Lottie loop — pinned bottom-right of col 3 */
function FooterLoop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = ""; // StrictMode double-mount guard
    const anim = lottie.loadAnimation({
      container: ref.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: footerLoopData,
    });
    return () => anim.destroy();
  }, []);

  return <div ref={ref} aria-hidden className="footer-loop--inline" />;
}
