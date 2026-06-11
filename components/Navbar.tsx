"use client";
import { useState } from "react";

export function RyzeNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed inset-x-0 top-6 z-[100] mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-20 pointer-events-none"
        aria-label="Primary"
      >
        <a href="https://www.ryzedesigns.com" className="flex items-center pointer-events-auto" target="_blank" rel="noopener noreferrer">
          <img src="/nav-ryze.svg" alt="Ryze" className="h-11 w-auto block" />
        </a>

        <div className="flex gap-2 pointer-events-auto">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="ryze-megamenu"
            onClick={() => setOpen(o => !o)}
            className="inline-flex items-center gap-3 max-[720px]:gap-0 rounded-lg border border-black bg-white text-black px-6 py-3 max-[720px]:p-[10px] font-display text-[17px] font-semibold tracking-[-0.01em] transition-transform duration-200 hover:-translate-y-px"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Hamburger open={open} />
            <span className="inline-block w-[62px] text-left max-[720px]:hidden">{open ? "Close" : "Explore"}</span>
          </button>

          <a
            href="https://www.ryzedesigns.com/work"
            className="inline-flex items-center rounded-lg border border-black bg-white text-black px-6 py-3 font-semibold tracking-[-0.01em] transition-transform duration-200 hover:-translate-y-px max-[720px]:hidden"
            style={{ fontFamily: "var(--font-display)", fontSize: 17 }}
            target="_blank" rel="noopener noreferrer"
          >
            Work
          </a>
        </div>

        <a
          href="https://www.ryzedesigns.com/book"
          className="pointer-events-auto inline-flex items-center rounded-lg border border-black px-6 py-3 font-semibold tracking-[-0.01em] transition-transform duration-200 hover:-translate-y-px max-[720px]:hidden"
          style={{ fontFamily: "var(--font-display)", fontSize: 17, background: "var(--electric)", color: "var(--paper)" }}
          target="_blank" rel="noopener noreferrer"
        >
          Book a Call
        </a>
      </nav>

      <MegaMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <span className="relative inline-block w-[18px] h-[14px] shrink-0">
      <span
        className={`absolute left-0 right-0 top-0 h-0.5 rounded-sm bg-current origin-center transition-transform duration-[250ms] ease-out ${
          open ? "translate-y-[6px] rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 right-0 bottom-0 h-0.5 rounded-sm bg-current origin-center transition-transform duration-[250ms] ease-out ${
          open ? "-translate-y-[6px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

const NAV_LINKS = [
  { href: "https://www.ryzedesigns.com",         label: "Home",     active: false },
  { href: "https://www.ryzedesigns.com/work",     label: "Work" },
  { href: "https://www.ryzedesigns.com/academy",  label: "Academy" },
  { href: "https://www.ryzedesigns.com/blog",     label: "Blog" },
  { href: "https://www.ryzedesigns.com/about",    label: "About Us" },
];

function MegaMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div
      id="ryze-megamenu"
      className="fixed inset-0 z-[99] flex flex-col overflow-y-auto px-12 pt-24 pb-16"
      style={{ background: "var(--ink)" }}
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
        <div>
          <ul className="m-0 mb-16 list-none p-0 space-y-1">
            {NAV_LINKS.map(({ href, label, active }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={onClose}
                  className="block font-bold leading-[1.05] tracking-[-0.04em] transition-colors duration-200 hover:text-white"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.5rem, 7vw, 84px)",
                    color: active ? "var(--electric)" : "rgba(255,255,255,0.18)",
                  }}
                  target="_blank" rel="noopener noreferrer"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 20 }}>
            Start Your Project
          </p>
          <a
            href="mailto:connect@ryzedesigns.com"
            className="relative inline-block"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.25rem, 3vw, 2rem)", fontWeight: 500, letterSpacing: "-0.02em", color: "var(--paper)" }}
          >
            connect@ryzedesigns.com
          </a>
        </div>
      </div>
    </div>
  );
}
