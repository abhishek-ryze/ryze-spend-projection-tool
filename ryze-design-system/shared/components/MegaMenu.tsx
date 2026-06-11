"use client";

import { useEffect } from "react";
import { InstagramIcon, LinkedinIcon, XIcon, YouTubeIcon } from "./icons";

const NAV_LINKS = [
  { href: "https://www.ryzedesigns.com", label: "Home", active: false, external: true },
  { href: "https://www.ryzedesigns.com/work", label: "Work", active: false, external: true },
  { href: "https://www.ryzedesigns.com/academy", label: "Academy", active: false, external: true },
  { href: "https://www.ryzedesigns.com/blog", label: "Blog", active: false, external: true },
  { href: "https://www.ryzedesigns.com/about", label: "About Us", active: false, external: true },
];

const SOCIALS = [
  { href: "https://www.linkedin.com/company/ryzedesigns", label: "Linkedin", Icon: LinkedinIcon },
  { href: "https://www.youtube.com/@ryzedesigns", label: "YouTube", Icon: YouTubeIcon },
  { href: "https://www.instagram.com/ryzedesigns", label: "Instagram", Icon: InstagramIcon },
  { href: "https://x.com/ryzedesigns", label: "X Twitter", Icon: XIcon },
];

export default function MegaMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div id="ryze-megamenu" className="megamenu" role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="megamenu__grid">
        {/* Left: big nav list + social row */}
        <div>
          <ul style={{ margin: "0 0 64px", listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_LINKS.map(({ href, label, active, external }) => (
              <li key={label}>
                <a
                  href={href}
                  className={`megamenu__link${active ? " is-active" : ""}`}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  onClick={external ? undefined : onClose}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <p
            className="font-display"
            style={{
              margin: "0 0 20px",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Follow Us On
          </p>
          <div style={{ display: "grid", maxWidth: 480, gridTemplateColumns: "1fr 1fr", columnGap: 32, rowGap: 10 }}>
            {SOCIALS.map(({ href, label, Icon }) => (
              <a key={label} href={href} className="megamenu__social" target="_blank" rel="noreferrer">
                <Icon size={28} />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Right: featured tool card + connect email */}
        <div>
          <a
            href="#calculator"
            onClick={onClose}
            className="bg-ink-soft"
            style={{ display: "block", marginBottom: 64, overflow: "hidden", borderRadius: "var(--r-md)", textDecoration: "none" }}
          >
            <div className="bg-grad-cosmos" style={{ aspectRatio: "16 / 10", width: "100%", display: "grid", placeItems: "center" }}>
              <span className="text-title text-4xl" style={{ textAlign: "center", padding: "0 24px" }}>
                Runway,
                <br />
                <em className="accent">in real time.</em>
              </span>
            </div>
            <div style={{ padding: "24px 28px" }}>
              <p
                className="font-display"
                style={{
                  margin: "0 0 12px",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Featured Tool
              </p>
              <h3
                className="font-display text-paper"
                style={{ margin: 0, fontSize: 28, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em" }}
              >
                Startup Runway Calculator — know your zero-cash date
              </h3>
            </div>
          </a>

          <p
            className="font-display"
            style={{
              margin: "0 0 12px",
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Start Your Project
          </p>
          <a
            href="mailto:connect@ryzedesigns.com"
            className="font-display text-paper"
            style={{
              position: "relative",
              display: "inline-block",
              fontSize: "clamp(20px, 4vw, 32px)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              textDecoration: "none",
            }}
          >
            connect@ryzedesigns.com
            {/* hand-drawn scribble underline */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -14,
                height: 14,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 14' preserveAspectRatio='none'><path d='M2 8 C 40 2, 80 12, 130 6 C 180 2, 220 12, 270 6 C 310 2, 340 10, 358 6' stroke='%23001AFF' stroke-width='3' stroke-linecap='round' fill='none'/></svg>")`,
              }}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
