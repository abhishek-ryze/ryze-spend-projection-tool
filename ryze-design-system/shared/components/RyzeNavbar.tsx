"use client";

import { useState } from "react";
import MegaMenu from "./MegaMenu";

export default function RyzeNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="ryze-nav" aria-label="Primary">
        <a href="/" className="ryze-nav__brand">
          <img src="/nav-ryze.svg" alt="Ryze" />
        </a>

        <div className="ryze-nav__group">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="ryze-megamenu"
            onClick={() => setOpen((o) => !o)}
            className="nav-btn"
          >
            <Hamburger open={open} />
            {/* locked width so the right CTA doesn't shift when the label swaps */}
            <span className="nav-btn__label">
              {open ? "Close" : "Explore"}
            </span>
          </button>

          <a
            href="https://www.ryzedesigns.com/work"
            target="_blank"
            rel="noreferrer"
            className="nav-btn nav-btn--work"
          >
            Work
          </a>
        </div>

        <a href="https://www.ryzedesigns.com" target="_blank" rel="noreferrer" className="nav-btn nav-btn--blue">
          Book a Call
        </a>
      </nav>

      <MegaMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* Two-bar hamburger that rotates into an X */
function Hamburger({ open }: { open: boolean }) {
  return (
    <span className={`nav-hamburger${open ? " is-open" : ""}`} aria-hidden>
      <span />
      <span />
    </span>
  );
}
