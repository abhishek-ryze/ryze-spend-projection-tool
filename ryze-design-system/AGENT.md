# Ryze Design System — Agent Prompt

> **Paste this whole file** as a system prompt / project instructions when working with Claude Code, Cursor, v0, or any other code-gen agent. It teaches the agent how to apply the Ryze aesthetic consistently.

---

You are building a UI using the **Ryze Design System** — an Awwwards-grade aesthetic that mixes **cinematic dark-mode** (deep cosmic navy → black, chrome stacked-echo display type, electric-blue glowing CTAs) with **polished editorial light-mode** (warm cream backgrounds, candy-gradient pill-rounded cards, italic serif accents). Think high-end design studio, not SaaS.

## Files you have access to in this design system

| File | Read when… |
|---|---|
| `DESIGN-SYSTEM.md`  | You need the philosophy, color logic, type rules, motion principles |
| `tokens.json`       | You're integrating with Figma, Style Dictionary, or another tool |
| `tokens.css`        | You're working in a project **without** Tailwind — `@import` it |
| `tailwind.config.js`| You're working in a project **with** Tailwind — extend from it |
| `COMPONENTS.md`     | You need a copy-paste JSX/HTML recipe for a known pattern |

**Always prefer composing from existing tokens/components.** Don't invent new colors or radii unless the user explicitly asks.

## Non-negotiable rules

0. **The shared bundle is the source of truth.** `<RyzeNavbar />`, `<RyzeFooter />`, `<MegaMenu />`, `<HeroParticles />`, `icons.tsx`, and `<NumberField />` are installed under `components/ryze/` and `components/ui/`. **Import them — never rebuild them, never inline-style their internals, never tweak icon sizes per-project.** If a real change is needed, push it back into the skill's `shared/` so every future project inherits it. `COMPONENTS.md` recipes exist for *new* patterns, not for re-deriving locked primitives.
0a. **The footer is `position: fixed; bottom: 0; z-index: 1`. `<main>` must be `<main className="bg-ink" style={{ position: "relative", zIndex: 2 }}>`** and wrap everything above the footer. `body { padding-bottom: 776px; scrollbar-gutter: stable; }` lives in `shared/shared.css` and is auto-disabled below 1100px. Without the `<main>` z-index, the scroll-reveal breaks.
0b. **Use the binary assets shipped with the skill — don't re-draw them.** The chrome R (`/ryze-mark.png`), Nav lockup (`/nav-ryze.svg`), CTA swoosh (`/cta-swoosh.svg`), marquee noise (`/marquee-pattern.png`), and Lottie loop (`./ryze-footer-loop.json`, sits next to `RyzeFooter.tsx`) are the canonical source files. Re-tracing them produces visibly wrong results.
0c. **Locked sizes & spacings — don't change inline.** Footer social icons = `<Icon size={32} />`. Megamenu social icons = `<Icon size={28} />`. Navbar logo = 44px (42px below 720px). Vertical gap between stacked cards in a column = **24px**. Section padding = `clamp(96px, 10vw, 140px) clamp(24px, 5vw, 64px)`. Card padding = 40–48px (large) / 24–28px (compact). Card-internal `gap` between header + body + footer = 24–36px. If you reach for a different number, stop and use the canonical one.
1. **Instrument Serif is the primary heading font.** Every page H1 / hero title uses `.text-title` (Instrument Serif Regular + warm cream→white vertical gradient clipped to text). Schibsted Grotesk is the **secondary** display, used for section H2s and UI display only. Never default an H1 to Schibsted.
2. **Pill-first for chips and tags, soft rectangles for buttons.** Chips, nav-pills, tags, badges, and decorative pills use `rounded-pill` (9999px). Primary CTAs (`btn-electric`) and nav buttons use `rounded-sm` (the soft rectangle Book-a-Call style). Cards use `rounded-xl` (32px). Never sharp corners.
3. **No shadows on buttons.** `.btn-electric` and `.btn-secondary` carry zero shadow — hover is `translateY(-1px)` only. Reserve `shadow-glow-electric` for decorative accents (imagery hover, eyebrow dots). Drop shadows live on light-mode cards (`shadow-card-lift`) only.
4. **Mega display type is sacred.** Reserve `text-mega` + `font-chrome` + `.text-chrome` gradient for **2–3 hero/transition words per page max** ("RYZE", "FEATURED", "WORKS", "LET'S CONNECT"). Overuse kills it.
5. **One italic serif accent per headline.** Use `<em className="font-serif text-lavender" style={{ fontStyle:"italic", fontWeight:400, whiteSpace:"nowrap" }}>phrase</em>` for a single emphasis phrase inside any headline. `whiteSpace: "nowrap"` keeps the italic phrase together as a unit — never let the browser break it mid-phrase across lines.
6. **Rare-accent fonts (`font-bringbold`, `font-gochi`, `font-yourbold`) are spice, not staple.** ~1 instance per page, on a single word or label. Never on body text. Never two sections in a row.
7. **Title-fade tint matches section mood.** Default `.text-title` (cream); use `.text-title-sky` for product, `.text-title-rose` for warm/playful, `.text-title-sun` for energetic, `.text-title-ember` for hot/urgent. Don't use the same variant on every H1.
8. **Section pacing alternates moods.** Cream light section → black or cosmos dark section → cream again. This rhythm is the whole vibe.
9. **Eyebrows above section headlines.** Always: `<span class="eyebrow">DISCOVERY</span>` (uppercase, tracked, lavender) above any major H2.
10. **Numbered structure.** Process steps, footer links, and feature lists use `01 / 02 / 03` prefixes in mono, electric-blue.
11. **Motion is `ease-out` `cubic-bezier(0.22, 1, 0.36, 1)`** at `400ms` by default. Heroes get ambient drift (`.hero-blob-a/b` + `<HeroParticles />`). Testimonial pills `animate-float`. CTAs do *not* pulse.
12. **Respect `prefers-reduced-motion`** — wrap decorative animations in the existing CSS guards.
13. **Never use emojis as design elements** (✨, 🚀, etc.) unless the user explicitly asks. Use the `✦` sparkle character between marquee phrases only.

## Color use map

| Where | Token |
|---|---|
| Page background (dark mode) | `bg-ink` or `bg-grad-cosmos` |
| Page background (light mode) | `bg-cream` |
| Card surface (dark) | `bg-ink-soft` with `ring-1 ring-white/10` |
| Card surface (light, gradient) | `bg-grad-mango/lavender/tomato/rose/sky` |
| Primary CTA | `.btn-electric` (solid electric, no glow) |
| Secondary / outline CTA | `.btn-secondary` (transparent fill, `1.5px solid #001aff` border, same size as electric) |
| Eyebrow + italic accents | `text-lavender` |
| Hot single accent (rare) | `text-ember` |
| Body text on dark | `text-smoke` for secondary, `text-paper` for primary |
| Body text on cream | `text-ash` for secondary, `text-ink-soft` for primary |
| Input hint / supporting text | `#b3b3b3` (explicitly, not `text-smoke` — keeps it visibly lighter than labels) |

## Typography map

| Where | Class combo |
|---|---|
| 🌟 **Page H1 / hero title** | `<h1 class="text-title text-5xl">…</h1>` (Instrument Serif + cream-fade) |
| H1 tint variants | add `text-title-sky` / `text-title-rose` / `text-title-sun` / `text-title-ember` to match section mood |
| Italic accent inside H1 | `<em class="text-accent">word.</em>` (Instrument Serif italic, lavender) |
| Hero / mega echo word | `font-chrome text-mega text-chrome` |
| Section H2 | `font-display text-4xl font-bold` (Schibsted Grotesk) |
| Subhead / card title | `font-display text-2xl font-bold` |
| Body | `font-sans text-base text-smoke` (dark) / `text-ash` (light) |
| Eyebrow above H2 | `<span class="eyebrow">LABEL</span>` |
| Numbered prefix | `font-mono text-sm text-electric-bright` |
| Rare accent — retro stamp | `<span class="font-bringbold text-3xl text-ember">EST. 2026</span>` |
| Rare accent — handwritten | `<span class="font-gochi text-2xl text-lavender">just shipped</span>` |
| Rare accent — bold display | `<span class="font-yourbold text-3xl text-paper">NEW</span>` |

## When the user asks for…

| Request | Reach for |
|---|---|
| "A navbar" / "header" / "menu" | `<RyzeNavbar />` from §1a (with mega-menu §1b — they're wired together) |
| "A footer" / "contact CTA" / "let's connect" | `<RyzeFooter />` from §11 — composed CTA + marquee + footer + scroll reveal, do **not** compose from §7/§8 primitives |
| "A hero section" | `HeroEcho` from §2, with eyebrow + italic accent headline + `btn-electric` CTA + ambient `.hero-blob-a/b` + `<HeroParticles />` |
| "A pricing / services grid" | `ServiceGrid` from §3 — light cream background, candy gradient cards |
| "A portfolio / case studies block" | `WorkCard` from §4 — dark, chips below |
| "An about / process section" | `ProcessSection` from §5 — eyebrow + node graph |
| "Testimonials" | `TestimonialCluster` from §6 — floating pills around chrome wordmark |
| "A primary button" | `<a class="btn-electric">…</a>` — solid electric, no glow |
| "A secondary / outline button" | `<a class="btn-secondary">…</a>` — transparent + electric blue border, same sizing as primary. Always pair next to `btn-electric`, never standalone. |
| "A CTA button pair" | See §2 CTA pair recipe — `btn-electric` left, `btn-secondary` right, `gap: 16`, `flex-wrap: wrap` |
| "A tag / category label" | `<span class="chip">…</span>` |
| "An input field with hint" | Use `NumberField` or equivalent — label uppercase tracked smoke, hint text `color: #b3b3b3`, pill-rounded border |

## Card spec (locked — copy verbatim)

Every dark-mode card in a Ryze tool follows the exact same shell:

```tsx
<div
  className="bg-ink-soft rounded-xl ring-1-white-10"
  style={{
    padding: 48,                          // 40 for compact, 48 for headline cards
    display: "flex",
    flexDirection: "column",
    gap: 36,                              // 24 if the card holds a single block
  }}
>
  <header style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <span className="eyebrow-block">YOUR INPUTS</span>
    <h2
      className="font-display text-paper"
      style={{
        fontSize: "clamp(26px, 2.6vw, 34px)",
        fontWeight: 700,
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
      }}
    >
      Type anything,{" "}
      <em
        className="font-serif text-lavender"
        style={{ fontStyle: "italic", fontWeight: 400, whiteSpace: "nowrap" }}
      >
        the dashboard
      </em>{" "}
      moves.
    </h2>
  </header>
  {/* …body… */}
</div>
```

**Rules:**
- Card shell **always** `bg-ink-soft rounded-xl ring-1-white-10`. `border-radius: var(--r-xl)` = 32px.
- Card padding: **48px** (headline / hero cards), **40px** (standard), **24–28px** (compact / stat cards inside a `.stat-grid`).
- Card-internal `gap`: **36px** when header + form + footer, **24px** when single block.
- Vertical gap **between** stacked cards in a column: **24px**.
- Header pattern is always `<span className="eyebrow-block">LABEL</span>` (the pill-rounded lavender block with a dot prefix — see `shared.css`) + `font-display` H2 with `clamp(26px, 2.6vw, 34px)` + `lineHeight: 1.2` + italic-serif accent. No other eyebrow style.
- Body text inside cards: `text-smoke` for secondary, `text-paper` for primary. Hint text under inputs: `#b3b3b3`.
- Internal dividers inside a card: 1px gradient line:
  ```css
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
  ```

## Eyebrow rules

There are **two** eyebrow variants — pick by context, don't invent a third:

| Variant | Use | Markup |
|---|---|---|
| **Pill block** (default for cards & sections) | Above any card H2 or section H2 — the lavender pill with the glowing dot prefix | `<span className="eyebrow-block">YOUR INPUTS</span>` |
| **Numbered eyebrow** | Inside a card to label an *optional* / *secondary* block (e.g. "05 / OPTIONAL") | `<span className="font-mono text-electric-bright" style={{ fontSize: 12, letterSpacing: "0.1em" }}>05 / OPTIONAL</span>` |

Eyebrow text is always **UPPERCASE** with tracked letter-spacing. Never use sentence case.

## Project setup checklist

When scaffolding a new project for the Ryze aesthetic:

1. Copy `ryze-design-system/` into the project (includes `shared/`).
2. Copy `shared/components/*` → `components/ryze/` (incl. `ryze-footer-loop.json`).
3. Copy `shared/ui/NumberField.tsx` → `components/ui/`.
4. Copy `ryze-mark.png`, `nav-ryze.svg`, `cta-swoosh.svg`, `marquee-pattern.png` → `public/`.
5. In `globals.css`, the first two imports are:
   ```css
   @import "../ryze-design-system/tokens.css";
   @import "../ryze-design-system/shared/shared.css";
   ```
6. `npm install lottie-web`.
7. Every page: `<RyzeNavbar />` → `<main className="bg-ink" style={{ position:"relative", zIndex:2 }}>…</main>` → `<RyzeFooter />`.
8. Build sections by composing recipes from `COMPONENTS.md` — the shared bundle is non-negotiable, but the rest is composable.
9. Alternate section background mood (dark → light → dark) for cinematic pacing.
10. Audit the page against the §11 "Do / Don't" table in `COMPONENTS.md` before shipping.

## If you're tempted to deviate

Stop and ask: *"Is the request to break the system, or to apply it?"* If apply — use the tokens. If break — confirm with the user first.

The goal is **visual consistency with ryzedesigns.com**, not novelty. Every component you produce should look like it belongs on that site.
