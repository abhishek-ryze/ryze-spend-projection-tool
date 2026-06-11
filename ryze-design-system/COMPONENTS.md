# Ryze Components — copy-paste recipes

All snippets assume the [Tailwind config](./tailwind.config.js) is loaded **or** [`tokens.css`](./tokens.css) is imported. React/JSX shown; the same classes work in plain HTML.

**Binary assets shipped with this skill** (`assets/`) — copy them into the consuming project alongside the markdown:
- `ryze-mark.png` — chrome R logomark (used inside the Nav Ryze SVG and other layouts)
- `nav-ryze.svg` — full navbar logo lockup (R mark + "Ryze" wordmark, single SVG)
- `cta-swoosh.svg` — deep-blue radial swoosh anchored to the marquee in the CTA block
- `marquee-pattern.png` — seamless cream noise texture for the "Let's Connect" band
- `ryze-footer-loop.json` — Lottie animation for the rotating "RYZE DESIGN STUDIO" footer loop

---

## 1a. Compact Navbar (transparent, fixed)

The live-site navbar — three squared-rectangle buttons (white "Explore" with hamburger, white "Work", blue "Book a Call"), max-width 1600px, 80px gutter, 1px black border on each.

```jsx
import { useState } from "react";

export function RyzeNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed inset-x-0 top-6 z-[100] mx-auto flex max-w-[1600px] items-center justify-between px-20 pointer-events-none"
        aria-label="Primary"
      >
        <a href="/" className="flex items-center pointer-events-auto">
          <img src="/nav-ryze.svg" alt="Ryze" className="h-11 w-auto block" />
        </a>

        <div className="flex gap-2 pointer-events-auto">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="ryze-megamenu"
            onClick={() => setOpen(o => !o)}
            className="inline-flex items-center gap-3 max-[720px]:gap-0 rounded-lg border border-black bg-paper text-ink px-6 py-3 max-[720px]:p-[10px] font-display text-[17px] font-semibold tracking-[-0.01em] transition-transform duration-200 hover:-translate-y-px"
          >
            <Hamburger open={open} />
            {/* Label hides below 720px so the navbar collapses to icon + logo */}
            <span className="inline-block w-[62px] text-left max-[720px]:hidden">{open ? "Close" : "Explore"}</span>
          </button>

          <a
            href="/work"
            className="inline-flex items-center rounded-lg border border-black bg-paper text-ink px-6 py-3 font-display text-[17px] font-semibold tracking-[-0.01em] transition-transform duration-200 hover:-translate-y-px max-[720px]:hidden"
          >
            Work
          </a>
        </div>

        {/* Book-a-Call CTA hides below 720px so mobile is just logo + hamburger */}
        <a
          href="/book"
          className="pointer-events-auto inline-flex items-center rounded-lg border border-black bg-electric text-paper px-6 py-3 font-display text-[17px] font-semibold tracking-[-0.01em] transition-transform duration-200 hover:-translate-y-px max-[720px]:hidden"
        >
          Book a Call
        </a>
      </nav>

      <MegaMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* Two-bar hamburger that rotates into an X */
function Hamburger({ open }) {
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
```

**Non-negotiable nav details:**

- `max-width: 1600px` + `margin-inline: auto` so the nav doesn't push to the viewport edges on wide screens.
- `px-20` (80px) gutter — tighter than this and the buttons feel cramped against the brand.
- `pointer-events-none` on the `<nav>` with `pointer-events-auto` on every child — lets clicks pass through the empty middle so cards underneath stay interactive.
- Lock the Explore label width (`w-[62px]`) to prevent the right-side CTA from shifting when the label swaps to "Close".
- Use `<img src="/nav-ryze.svg">` — never re-trace the R. The shipped SVG already includes the chrome bevel.
- Set `html { scrollbar-gutter: stable; }` in your global CSS so opening the menu (`body { overflow: hidden }`) doesn't widen the viewport and shift the right-side CTA.

---

## 1b. Mega-menu overlay (full-screen, opens from Explore)

```jsx
import { useEffect } from "react";

const NAV_LINKS = [
  { href: "/",        label: "Home",     active: true },
  { href: "/work",    label: "Work" },
  { href: "/academy", label: "Academy" },
  { href: "/blog",    label: "Blog" },
  { href: "/about",   label: "About Us" },
];

const SOCIALS = [
  { href: "https://linkedin.com/...",  label: "Linkedin",  Icon: LinkedinIcon  },
  { href: "https://youtube.com/...",   label: "YouTube",   Icon: YouTubeIcon   },
  { href: "https://instagram.com/...", label: "Instagram", Icon: InstagramIcon },
  { href: "https://x.com/...",         label: "X Twitter", Icon: XIcon         },
  { href: "https://contra.com/...",    label: "Contra",    Icon: ContraIcon    },
  { href: "https://dribbble.com/...",  label: "Dribbble",  Icon: DribbbleIcon  },
  { href: "https://awwwards.com/...",  label: "Awwwards",  Icon: AwwwardsIcon  },
];

export function MegaMenu({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="ryze-megamenu"
      className="fixed inset-0 z-[99] flex flex-col overflow-y-auto bg-ink px-12 pt-24 pb-16"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-2 gap-24">
        {/* Left: big nav list + social row */}
        <div>
          <ul className="m-0 mb-16 list-none p-0 space-y-1">
            {NAV_LINKS.map(({ href, label, active }) => (
              <li key={label}>
                <a
                  href={href}
                  className={`block font-display text-[84px] font-bold leading-[1.05] tracking-[-0.04em] transition-colors duration-200 hover:text-paper ${
                    active ? "text-electric" : "text-white/[0.18]"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <p className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-white/50">
            Follow Us On
          </p>
          <div className="grid max-w-[480px] grid-cols-2 gap-x-8 gap-y-2.5">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                className="inline-flex items-center gap-3 py-2 font-display text-[18px] font-medium tracking-[-0.02em] text-white/85 transition-colors hover:text-paper"
              >
                <Icon className="w-7 h-7 shrink-0" />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Right: featured case study + connect email */}
        <div>
          <a href="/case/your-featured-study" className="block mb-16 overflow-hidden rounded-lg bg-ink-soft">
            <div className="aspect-[16/10] w-full bg-grad-tomato" />
            <div className="px-7 py-6">
              <p className="m-0 mb-3 font-display text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                Featured Case Study
              </p>
              <h3 className="m-0 font-display text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-paper">
                Your featured project title goes here
              </h3>
            </div>
          </a>

          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            Start Your Project
          </p>
          <a
            href="mailto:connect@yourdomain.com"
            className="relative inline-block font-display text-[32px] font-medium tracking-[-0.02em] text-paper"
          >
            connect@yourdomain.com
            {/* hand-drawn scribble underline */}
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 -bottom-3.5 h-3.5 bg-no-repeat bg-[length:100%_100%]"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 14' preserveAspectRatio='none'><path d='M2 8 C 40 2, 80 12, 130 6 C 180 2, 220 12, 270 6 C 310 2, 340 10, 358 6' stroke='%23001AFF' stroke-width='3' stroke-linecap='round' fill='none'/></svg>")`,
              }}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

## 2. Hero with chrome stacked-echo headline

The signature move — same word stacked 3× with diminishing opacity.

```jsx
export function HeroEcho({ word = "FEATURED" }) {
  return (
    <section className="relative isolate overflow-hidden bg-grad-cosmos py-40 text-center">
      {/* Content at z-2 so it sits above the bottom-fade overlay */}
      <div className="relative z-[2] mx-auto max-w-7xl px-6">
        <h2 className="font-chrome text-mega leading-[0.85] tracking-[-0.04em]">
          {[1, 0.55, 0.25].map((opacity, i) => (
            <span
              key={i}
              className="block text-chrome"
              style={{ opacity, marginTop: i === 0 ? 0 : "-0.35em" }}
            >
              {word}
            </span>
          ))}
        </h2>
      </div>
      {/* Bottom-fade: blends hero into the next dark section without a hard cut */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "auto 0 0 0",
          height: "40%",
          background: "linear-gradient(to bottom, transparent, var(--ink))",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
```

### NumberField — dark-mode text input with prefix/suffix/hint

Pill-rounded, electric focus ring, comma-formatted number, hint text at `#b3b3b3`.

```tsx
"use client";
import { useEffect, useId, useRef, useState } from "react";

function fmt(n: number) {
  return Number.isFinite(n) && n !== 0 ? n.toLocaleString("en-US") : "";
}

export function NumberField({ label, value, onChange, prefix, suffix, min, hint }) {
  const id = useId();
  const inputRef = useRef(null);
  const [raw, setRaw] = useState(fmt(value));

  useEffect(() => {
    const parsed = parseInt(raw.replace(/\D/g, ""), 10);
    if (parsed !== value) setRaw(fmt(value));
  }, [value]);

  function handleChange(e) {
    const el = e.target;
    const digitsBeforeCursor = el.value.slice(0, el.selectionStart).replace(/\D/g, "").length;
    const digits = el.value.replace(/\D/g, "");
    const n = digits === "" ? 0 : parseInt(digits, 10);
    const formatted = digits === "" ? "" : n.toLocaleString("en-US");
    setRaw(formatted);
    if (!isNaN(n) && (min === undefined || n >= min)) onChange(n);
    requestAnimationFrame(() => {
      let seen = 0, pos = formatted.length;
      if (digitsBeforeCursor === 0) { pos = 0; }
      else { for (let i = 0; i < formatted.length; i++) { if (/\d/.test(formatted[i])) { seen++; if (seen === digitsBeforeCursor) { pos = i + 1; break; } } } }
      inputRef.current?.setSelectionRange(pos, pos);
    });
  }

  return (
    <label htmlFor={id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Label — uppercase, tracked, smoke */}
      <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--smoke)", fontFamily: "var(--font-sans)" }}>
        {label}
      </span>

      {/* Pill wrapper — electric glow on focus */}
      <div
        className="rounded-pill"
        style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", padding: "12px 20px", transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)" }}
        onFocus={e => { e.currentTarget.style.borderColor = "rgba(0,26,255,0.7)"; e.currentTarget.style.background = "rgba(0,26,255,0.08)"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,26,255,0.18)"; }}
        onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        {prefix && <span style={{ color: "var(--electric-bright)", fontWeight: 600 }}>{prefix}</span>}
        <input
          ref={inputRef} id={id} type="text" inputMode="numeric" value={raw}
          onChange={handleChange}
          onFocus={e => e.target.select()}
          onBlur={() => setRaw(value === 0 ? "" : value.toLocaleString("en-US"))}
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 18, fontWeight: 500, minWidth: 0, width: "100%", color: "var(--paper)" }}
        />
        {suffix && <span style={{ fontSize: 14, fontWeight: 500, color: "var(--smoke)" }}>{suffix}</span>}
      </div>

      {/* Hint — visibly lighter than label */}
      {hint && <span style={{ fontSize: 13, lineHeight: 1.5, color: "#b3b3b3" }}>{hint}</span>}
    </label>
  );
}
```

---

### CTA button pair (primary + secondary)

Use `.btn-electric` for the primary action and `.btn-secondary` for the ghost/outline action. Always pair them side by side on the same baseline.

```jsx
<div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
  <a href="#start" className="btn-electric">
    Start a Project <span aria-hidden>→</span>
  </a>
  <a href="#work" className="btn-secondary">
    See our work
  </a>
</div>
```

`.btn-secondary` — transparent fill, `1.5px solid #001aff` border, same padding/radius/type as `.btn-electric`. Hover gains a faint electric tint (`rgba(0,26,255,0.08)`). Never add underline.

---

## 3. Service card grid (light, candy gradients)

```jsx
const services = [
  { title: "Website Design",   variant: "mango",    blurb: "Focus on fun, we'll plan the rest." },
  { title: "Brand Identity",   variant: "lavender", blurb: "Typography, brand guidelines, identity systems." },
  { title: "Mobile Applications", variant: "lavender", blurb: "Native and cross-platform builds." },
  { title: "Motion Design",    variant: "tomato",   blurb: "Editorial-grade motion + video." },
  { title: "AI Transformations", variant: "rose",   blurb: "Workflow + product reinvention." },
];

export function ServiceGrid() {
  return (
    <section className="bg-cream py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <ServiceCard key={s.title} {...s} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ title, variant, blurb }) {
  const grad = {
    mango:    "bg-grad-mango",
    lavender: "bg-grad-lavender",
    tomato:   "bg-grad-tomato",
    rose:     "bg-grad-rose",
    sky:      "bg-grad-sky",
  }[variant];

  return (
    <article className={`group relative overflow-hidden rounded-xl ${grad} aspect-[4/5] p-8 transition duration-400 ease-out hover:-translate-y-1 hover:shadow-card-lift`}>
      <h3 className="font-display text-2xl font-bold text-ink-soft">{title}</h3>
      <p className="mt-2 max-w-[18ch] text-ink-soft/80">{blurb}</p>
      {/* Decorative illustration bleeds from bottom — drop your image here */}
      <div className="absolute inset-x-6 bottom-0 h-1/2 rounded-t-lg bg-white/20" />
    </article>
  );
}
```

---

## 4. Featured-work card (dark)

```jsx
export function WorkCard({ title, image, tags = [] }) {
  return (
    <article className="group relative flex flex-col gap-4">
      <div className="aspect-[16/10] overflow-hidden rounded-xl ring-1 ring-white/10 transition duration-400 ease-out group-hover:shadow-glow-electric">
        <img src={image} alt={title} className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105" />
      </div>
      <h3 className="font-display text-xl font-bold text-paper">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => <span key={t} className="chip">{t}</span>)}
      </div>
    </article>
  );
}
```

---

## 5. Process section with eyebrow + node graph

```jsx
export function ProcessSection() {
  return (
    <section className="bg-ink py-32">
      <div className="mx-auto max-w-7xl px-6">
        <header className="text-center">
          <h2 className="font-display text-4xl font-bold text-paper">Ryze's 6D Process</h2>
          <p className="mx-auto mt-4 max-w-md text-smoke">
            Keeps the work clear from the first question to the final handover.
          </p>
        </header>

        <div className="mt-24 grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow text-lavender">Discovery</span>
            <h3 className="mt-3 font-display text-3xl font-bold text-paper">
              See the problem before you <br />try to solve it.
            </h3>
            <p className="mt-4 max-w-lg text-smoke">
              We begin by listening, looking, and checking what is true. Good decisions
              usually start with better evidence, not louder opinions.
            </p>
          </div>

          <NodeGraph />
        </div>
      </div>
    </section>
  );
}

function NodeGraph() {
  // Glowing connected pill labels — Stakeholders / Competitors / Data / Users
  return (
    <div className="relative aspect-square w-full">
      {/* Radial glow background */}
      <div className="absolute inset-0 rounded-pill bg-grad-cosmos opacity-80 blur-2xl" />
      {/* Pills */}
      {[
        { label: "Stakeholders", x: "10%", y: "20%", glow: "shadow-glow-electric" },
        { label: "Competitors",  x: "70%", y: "20%", glow: "shadow-glow-lavender" },
        { label: "Data",         x: "55%", y: "55%", glow: "shadow-glow-electric" },
        { label: "Users",        x: "40%", y: "85%", glow: "shadow-glow-ember"    },
      ].map((p) => (
        <span
          key={p.label}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-pill bg-ink-soft ring-1 ring-white/10 px-4 py-2 text-sm font-medium text-paper ${p.glow}`}
          style={{ left: p.x, top: p.y }}
        >
          {p.label}
        </span>
      ))}
    </div>
  );
}
```

---

## 6. Testimonial cluster

Big chrome "RYZE" wordmark in the background, floating pill cards orbit it.

```jsx
const people = [
  { name: "Nico Lang",     role: "Co-Founder, Aligre",         x: "45%", y: "10%" },
  { name: "Katherine Tsai",role: "Founder, Coach Rocks",       x: "78%", y: "25%" },
  { name: "Flemming Bust", role: "Founder, ABM Blueprint",     x: "12%", y: "35%" },
  { name: "Sharmishtha",   role: "Director, Momeet",           x: "60%", y: "50%" },
  { name: "Evan Gutierrez",role: "Founder, Astrem",            x: "35%", y: "65%" },
  { name: "Ghadeer G.",    role: "Chief AI Officer, Nexomic",  x: "18%", y: "80%" },
  { name: "Erik Porter",   role: "CTO/Co-Founder, Aligre",     x: "70%", y: "78%" },
];

export function TestimonialCluster() {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-40">
      <h2 className="absolute inset-0 grid place-items-center font-chrome text-mega text-chrome opacity-90 select-none">
        RYZE
      </h2>
      <div className="relative mx-auto h-[700px] max-w-7xl">
        {people.map((p, i) => (
          <div
            key={p.name}
            className="absolute float flex items-center gap-3 rounded-pill bg-paper px-3 py-2 pr-5 shadow-card-lift"
            style={{ left: p.x, top: p.y, animationDelay: `${i * 0.6}s` }}
          >
            <div className="h-9 w-9 rounded-pill bg-lavender-soft" />
            <div className="text-left">
              <div className="font-display text-sm font-bold text-ink-soft">{p.name}</div>
              <div className="text-xs italic text-ash">{p.role}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative mt-12 text-center">
        <a className="btn-electric" href="#all">View All Projects</a>
      </div>
    </section>
  );
}
```

---

## 7. Numbered link list (footer) → see [§11](#11-ready-to-work-cta--scroll-revealed-marquee--footer-composed)

The numbered nav is part of `<RyzeFooter />` in §11 — there's only one canonical implementation. Don't compose this list standalone; drop the whole composed footer.

---

## 8. Marquee divider → see [§11](#11-ready-to-work-cta--scroll-revealed-marquee--footer-composed)

The "LET'S CONNECT" marquee is the middle layer of `<RyzeFooter />` in §11. If you genuinely need a standalone marquee elsewhere on the page, lift the `MarqueeBand` sub-component out, but in 99% of cases the composed footer is what you want.

---

## 9. Page H1 — Instrument Serif title with gradient fade

**The signature title treatment.** Instrument Serif Regular + warm-cream-to-white vertical gradient clipped to text. The example: *"Ideas, Impact & Everything Between"*.

```jsx
{/* Default (cream tint) */}
<h1 className="text-title text-5xl text-center">
  Ideas, Impact &amp; Everything Between
</h1>

{/* Tint variants — pick to match section mood */}
<h1 className="text-title text-title-sky   text-5xl text-center">Built for builders</h1>
<h1 className="text-title text-title-rose  text-5xl text-center">Stories worth telling</h1>
<h1 className="text-title text-title-sun   text-5xl text-center">Bright ideas</h1>
<h1 className="text-title text-title-ember text-5xl text-center">Heat &amp; momentum</h1>

{/* With inline italic accent word */}
<h1 className="text-title text-5xl text-center">
  Let's create what's next,<br />
  <em className="text-accent">together.</em>
</h1>
```

> The `.text-title` class bundles font-family, weight, line-height, letter-spacing, the gradient, and the clip. Just add a size class (`text-4xl`, `text-5xl`, etc.) and you're done.

## 9b. Rare-accent fonts (use sparingly)

These add personality when used once per page on a single word or label — **never on body text, never two sections in a row**.

```jsx
{/* Retro stamp */}
<span className="font-bringbold text-3xl text-ember">EST. 2026</span>

{/* Handwritten note */}
<span className="font-gochi text-2xl text-lavender">just shipped ✦</span>

{/* Bold display alternate */}
<span className="font-yourbold text-3xl text-paper">NEW</span>
```

---

## 10. Section background recipes

| Mood | Tailwind classes |
|---|---|
| Cinematic dark hero | `bg-grad-cosmos text-paper` |
| Pitch-black gallery | `bg-ink text-paper` |
| Polished light editorial | `bg-cream text-ink-soft` |
| Loud electric strip | `bg-grad-electric text-paper` |

---

## 11. Ready-to-Work CTA + scroll-revealed marquee + footer (composed)

**This is one component, not three.** The "Ready to Work Together?" CTA, the "LET'S CONNECT" marquee band, and the dark footer body share a layered scroll mechanic — the footer is `position: fixed` at the bottom with `z-index: 1`, and `<main>` covers it with `z-index: 2`. As you scroll past the page content, the CTA+marquee scrolls *up and out*, revealing the footer that was always sitting behind.

**Structural rule (non-negotiable):** wrap *everything above the footer* in `<main>` with an opaque `bg-ink` and `relative z-[2]`. Reserve room for the fixed footer with `body { padding-bottom: 776px; }` (or whatever your footer's `min-height` is). Don't nest the footer-reveal pieces inside an `overflow: hidden` ancestor — it breaks the fixed positioning context.

### Page-level CSS (add to `globals.css`)

```css
body {
  padding-bottom: 776px;        /* room for the fixed footer to be revealed */
}
html { scrollbar-gutter: stable; } /* prevents nav CTA shift when menu opens */

/* Mobile navbar: disable scrollbar-gutter inflation, cap nav to visual viewport */
@media (max-width: 720px) {
  html { scrollbar-gutter: auto; }
  .ryze-nav { max-width: 100dvw; margin-inline: 0; }
}

/* Footer col 3 — flex column so Lottie sits at the bottom */
.footer-col3 {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  height: 100%;
}
/* Lottie inline variant — fluid width, right-edge fade, aspect-ratio locks height */
.footer-loop--inline {
  align-self: flex-end;
  width: 100%;
  max-width: 320px;
  aspect-ratio: 2 / 1;
  margin-top: 32px;
  mask-image: linear-gradient(to right, #000 55%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, #000 55%, transparent 100%);
}

/* Footer responsive layout */
@media (max-width: 1100px) {
  .footer-grid { grid-template-columns: 1fr 1px 1fr !important; }
  .footer-col3 { grid-column: 1 / -1; flex-direction: row; align-items: flex-end; justify-content: space-between; }
}
@media (max-width: 640px) {
  .footer-grid { grid-template-columns: 1fr !important; }
  .footer-col3 { flex-direction: column; align-items: flex-start; }
  .footer-divider { display: none; }
}

/* Stat card grid: 2×2 on tablet+, single column on narrow mobile */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
@media (max-width: 480px) {
  .stat-grid { grid-template-columns: 1fr; }
}
```

### The composed component

```jsx
import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import footerLoopData from "./ryze-footer-loop.json";  // shipped in skill assets

const FOOTER_NAV = [
  { n: "01", label: "Home",       href: "https://www.ryzedesigns.com",         external: true },
  { n: "02", label: "Work",       href: "https://www.ryzedesigns.com/work",     external: true },
  { n: "03", label: "Academy",    href: "https://www.ryzedesigns.com/academy",  external: true },
  { n: "04", label: "Blog",       href: "https://www.ryzedesigns.com/blog",     external: true },
  { n: "05", label: "About Us",   href: "https://www.ryzedesigns.com/about",    external: true },
];

export function RyzeFooter() {
  return (
    <>
      {/* CTA + marquee — sits inside <main>, above the fixed footer (z-2) */}
      <FooterCurtain />

      {/* The footer itself — fixed at bottom of viewport, behind <main> */}
      <FooterBody />
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Top layer — CTA + marquee bundled in one wrapper so the swoosh SVG can
   anchor to the marquee's bottom edge.
   ──────────────────────────────────────────────────────────────────────── */
function FooterCurtain() {
  return (
    <div className="relative overflow-hidden bg-ink">
      {/* Deep-blue swoosh — anchored to the bottom of THIS wrapper = bottom of marquee */}
      {/* Fluid swoosh — percentage-based so it never clips at any viewport width */}
      <img
        src="/cta-swoosh.svg"
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none z-0"
        style={{ left: "-20%", bottom: 0, width: "120%", height: "auto" }}
      />

      {/* Ready to Work Together? */}
      <section className="relative z-[1] text-center px-8 pt-[200px] pb-[120px]">
        <h2 className="font-display font-extrabold uppercase text-paper leading-[0.86] tracking-[-0.04em] m-0 mb-10 text-[80px]">
          Ready to<br />Work Together?
        </h2>
        <p className="font-display font-medium text-white/70 leading-[1.45] tracking-[-0.02em] mx-auto mb-14 max-w-[36ch] text-[clamp(1.125rem,1.5vw,1.5rem)]">
          Let's build something great together.<br />
          Reach out and let's make it happen.
        </p>
        <a
          href="/start"
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-electric text-paper font-display text-[17px] font-semibold tracking-[-0.01em] transition-transform duration-400 hover:-translate-y-0.5"
        >
          Start a Project
        </a>
      </section>

      {/* LET'S CONNECT marquee — solid #00034D with black corner fades, noise overlay */}
      <MarqueeBand />
    </div>
  );
}

function MarqueeBand({ phrase = "Let's Connect" }) {
  return (
    <div
      className="relative h-[126px] overflow-hidden flex items-center shadow-marquee-inset"
      style={{
        backgroundImage: `url("/marquee-pattern.png"), linear-gradient(90deg, #000 0%, #00034D 8%, #00034D 92%, #000 100%)`,
        backgroundSize: "auto, 100% 100%",
        backgroundRepeat: "repeat, no-repeat",
        backgroundBlendMode: "overlay, normal",
      }}
    >
      <div className="flex items-center gap-16 whitespace-nowrap pl-16 animate-marquee motion-reduce:animate-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="flex items-center gap-16">
            <span className="font-display text-[64px] font-extrabold leading-[0.86] tracking-[-0.02em] uppercase shrink-0 text-paper">
              {phrase}
            </span>
            <Sparkle />
          </span>
        ))}
      </div>
    </div>
  );
}

/* Symmetric 4-point sparkle that spins clockwise */
function Sparkle() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="w-7 h-7 shrink-0 text-ryze-blue-300 motion-reduce:[animation:none]"
      style={{ animation: "ryze-spark-spin 18s linear infinite", transformOrigin: "center" }}
    >
      <path d="M12 0 L13.41 10.59 L24 12 L13.41 13.41 L12 24 L10.59 13.41 L0 12 L10.59 10.59 Z" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Bottom layer — the fixed footer body (chrome R + tagline + socials | numbered nav | together. + lottie loop)
   ──────────────────────────────────────────────────────────────────────── */
function FooterBody() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-[1] bg-ink min-h-[776px] overflow-hidden px-[120px] pt-[106px] pb-8">
      {/* Cosmic glows bleeding off bottom-left */}
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ left: -300, top: "30%", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(0,26,255,0.55) 0%, rgba(0,12,162,0.25) 40%, transparent 70%)", mixBlendMode: "hard-light", filter: "blur(50px)" }} />
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ left: -250, bottom: -100, width: 700, height: 500, background: "radial-gradient(ellipse, rgba(0,26,255,0.4) 0%, rgba(0,12,162,0.2) 40%, transparent 70%)", filter: "blur(70px)" }} />

      <div className="relative z-[1] mx-auto grid max-w-[1320px] grid-cols-[354px_1px_350px_1px_1fr] items-start gap-16">

        {/* Col 1 — chrome R + tagline + socials */}
        <div>
          <img src="/ryze-mark.png" alt="Ryze" className="block w-[124px] h-[139px] object-contain" />
          <p className="font-display text-[20px] font-medium text-white/70 leading-[1.45] tracking-[-0.03em] mt-[30px] mb-0 max-w-[350px]">
            Tell us about your brand, vision, and challenges. No stress – just endless opportunities.
          </p>
          <div className="mt-[122px]">
            <p className="font-display text-[18px] font-medium text-white/65 tracking-[-0.03em] mt-0 mb-4">FOLLOW US ON</p>
            <div className="flex gap-4">
              {/* Inline social-icon SVGs — see assets folder for the source SVGs */}
              <SocialIcon href="#" label="Instagram"><InstagramIcon /></SocialIcon>
              <SocialIcon href="#" label="LinkedIn"><LinkedinIcon /></SocialIcon>
              <SocialIcon href="#" label="YouTube"><YouTubeIcon /></SocialIcon>
              <SocialIcon href="#" label="X (Twitter)"><XIcon /></SocialIcon>
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="self-stretch w-px bg-white/[0.12]" />

        {/* Col 2 — numbered nav with top border + per-row border-bottom */}
        <ul className="list-none p-0 m-0 w-[350px] border-t border-white/[0.12]">
          {FOOTER_NAV.map(({ n, label, href }) => (
            <li key={n}>
              <a
                href={href}
                className="group flex items-center justify-between gap-6 py-7 border-b border-white/[0.12] transition-[padding] duration-200 hover:pl-1"
              >
                <span className="flex items-center gap-6">
                  <span className="font-display text-[20px] font-normal tracking-[-0.03em] text-white/70 group-hover:bg-grad-together group-hover:bg-clip-text group-hover:text-transparent">{n}</span>
                  <span className="font-display text-[24px] font-medium uppercase tracking-[-0.03em] text-paper group-hover:bg-grad-together group-hover:bg-clip-text group-hover:text-transparent">{label}</span>
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6 text-paper transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#7B7DFD]">
                  <path d="M5 12 H19 M13 6 L19 12 L13 18" />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        {/* Vertical divider */}
        <div className="self-stretch w-px bg-white/[0.12]" />

        {/* Col 3 — "Let's create what's next, together." + Lottie inline */}
        <div className="footer-col3">
          <p className="font-display text-[48px] font-normal text-paper leading-[1.2] tracking-[-0.06em] mt-0 mb-auto">
            Let's create<br />what's next,<br />
            <span className="text-together text-[64px] leading-[1.2] tracking-[-0.02em]">together.</span>
          </p>
          {/* Lottie sits as flex child at the bottom of col3 — scales to column width, fades right edge */}
          <FooterLoop />
        </div>
      </div>

      {/* Bottom legal row */}
      <div className="relative z-[1] flex items-center justify-between mx-auto max-w-[1320px] mt-16 pt-8 border-t border-white/10 font-display text-[18px] font-medium text-white/70 tracking-[-0.03em]">
        <span>©{new Date().getFullYear()} Your Studio. All Rights Reserved.</span>
        <div className="flex gap-16 uppercase">
          <a href="/terms"   className="hover:text-paper">Terms &amp; Conditions</a>
          <a href="/privacy" className="hover:text-paper">Privacy Policy</a>
          <a href="/cookies" className="hover:text-paper">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid place-items-center w-8 h-8 text-paper transition-[transform,color] duration-200 hover:-translate-y-0.5 hover:text-ryze-blue-200"
    >
      {children}
    </a>
  );
}

/* Rotating "RYZE DESIGN STUDIO" Lottie loop — pinned to bottom-right of col 3,
   anchored to the divider above the legal row. */
function FooterLoop() {
  const ref = useRef(null);
  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: ref.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: footerLoopData,
    });
    return () => anim.destroy();
  }, []);

  // Inline flex child inside footer-col3 — scales to column width, right-edge fade to black
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="footer-loop--inline mt-8 self-end w-full max-w-[320px] pointer-events-none"
      style={{
        aspectRatio: "2 / 1",
        WebkitMaskImage: "linear-gradient(to right, #000 55%, transparent 100%)",
        maskImage: "linear-gradient(to right, #000 55%, transparent 100%)",
      }}
    />
  );
}
```

### Sub-component details

- **MarqueeBand** — solid `#00034D` body with black fades at both corners, cream noise texture (`/marquee-pattern.png`) layered at `background-blend-mode: overlay`. Height `126px` (8px breathing above/below). Track scrolls 76s linear infinite (slow, readable cadence); sparkles spin 18s clockwise. Both honour `motion-reduce`.
- **Sparkle** — symmetric 4-point star at viewBox `0 0 24 24` with arms at the cardinal points and notches at `(13.41, 10.59)` etc — *do not* swap for a different glyph.
- **FooterLoop** — `lottie-web` with `animationData` (inlined JSON) instead of `path` (URL fetch). The inlined approach works under `file://` and any bundler. Don't switch to `dotlottie-player` unless you've confirmed the file is served over HTTP.
- **Hover state on numbered nav** — number + label both gradient-fill with `--grad-together`; arrow turns solid `#7B7DFD` (gradient midpoint) and slides `translateX(4px)`. Padding shifts `pl-1` for a subtle "drift" feel.
- **Footer column 3** — `flex flex-col self-stretch h-full` lets the lottie sit at the bottom of the column (`mb-auto` on the bigline pushes it down), so it visually lines up with the legal-row divider regardless of how tall col 2 ends up.

### Asset paths

The component imports/references these — make sure they're in your `public/` (Next.js / Vite) or static-assets folder:

| Asset | Where in the markup |
|---|---|
| `/nav-ryze.svg` | `<RyzeNavbar />` brand image |
| `/ryze-mark.png` | Footer col 1 chrome R |
| `/cta-swoosh.svg` | CTA-curtain wrapper background swoosh |
| `/marquee-pattern.png` | Marquee `background-image` overlay |
| `./ryze-footer-loop.json` | `import`-ed by `<FooterLoop />` (relative to the component file) |

The skill ships all five in `assets/` — just copy them into your project's static folder.

---

## 12. Putting it together — a full page skeleton

```jsx
export default function RyzeStylePage() {
  return (
    <>
      <RyzeNavbar />

      <main className="relative z-[2] bg-ink text-paper font-sans">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-grad-cosmos pt-40 pb-32 text-center">
          <span className="eyebrow">Design Studio</span>
          <h1 className="mt-6 text-title text-5xl">
            Ideas, Impact &amp; <em className="text-accent">Everything</em> Between
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-smoke">
            We design brand systems, products, and motion that feel inevitable.
          </p>
          <a className="btn-electric mt-10" href="#start">Start a Project</a>
        </section>

        {/* Light-mode services */}
        <ServiceGrid />

        {/* Mega echo */}
        <HeroEcho word="FEATURED" />

        {/* Work cards */}
        <section className="bg-ink py-32">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-3">
            <WorkCard title="Aligre"      image="/aligre.jpg" tags={["Web Design"]} />
            <WorkCard title="Tidescape"   image="/tide.jpg"   tags={["Web Design"]} />
            <WorkCard title="CoachRocks"  image="/coach.jpg"  tags={["Product Design", "AI Automation"]} />
          </div>
        </section>

        {/* Process */}
        <ProcessSection />

        {/* Testimonials */}
        <TestimonialCluster />
      </main>

      {/* RyzeFooter renders BOTH the CTA-curtain (inside <main>'s scroll layer)
          AND the fixed <footer>. Don't wrap it in additional containers. */}
      <RyzeFooter />
    </>
  );
}
```

> **Note the structure:** `<main>` is `relative z-[2] bg-ink` and contains everything above the footer. `<RyzeFooter />` returns a fragment whose first element (`<FooterCurtain />`) sits inside `<main>`'s visual layer and whose second (`<FooterBody />`) is `position: fixed`. The `body { padding-bottom: 776px; }` reserves the reveal space. Don't add `overflow: hidden` on any ancestor of `<main>` — it breaks the fixed positioning.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| **Drop `<RyzeNavbar />` at the top of every page and `<RyzeFooter />` at the bottom** | Re-build the navbar or footer from primitives — they're pixel-perfect against ryzedesigns.com |
| **Set `body { padding-bottom: 776px; }` so the fixed footer has reveal-room** | Wrap `<main>` or its ancestors in `overflow: hidden` — it kills the footer reveal |
| **Use `<img src="/nav-ryze.svg">` for the navbar lockup** | Re-trace the R or use an `<svg>` path approximation |
| **Use `text-title` (Instrument Serif + gradient fade) on every page H1** | Default H1 to Schibsted Grotesk — that's the H2 font |
| Use `rounded-pill` on every interactive element | Use sharp 0–4px radii anywhere except dividers |
| Reach for **glows** (`shadow-glow-electric`) before drop shadows | Use generic gray drop shadows on dark surfaces |
| Mix Instrument Serif H1 + Schibsted H2 + Inter body + 1 italic accent word | Set body or paragraphs in Instrument Serif |
| Use chrome gradient on **2-3** mega words per page maximum | Apply chrome to every heading — kills the impact |
| Use Bringbold / Gochi / YourBold once per page, on a single word | Use the rare-accent fonts on a heading or two sections in a row |
| Pair candy gradient cards with `cream` page background | Put candy gradients on a black background |
| Center major hero blocks; left-align card grids | Inconsistent alignment across sections |
| Animate with `ease-out` cubic-bezier `(0.22, 1, 0.36, 1)` | Default linear easing — feels mechanical |
| Pick a title-fade tint that matches the section mood (sky for product, ember for urgent, etc.) | Use the same `text-title` variant on every H1 — flatten the rhythm |
