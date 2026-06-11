<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ryze-design-system -->
## Ryze Design System

This project uses the **Ryze Design System**. All UI work must follow it. The full rules live in
[`ryze-design-system/AGENT.md`](ryze-design-system/AGENT.md) — read it before building UI. Quick summary of the
non-negotiables:

- **Shared primitives are locked.** Import `RyzeNavbar`, `RyzeFooter`, `MegaMenu`, `HeroParticles` from
  `@/components/ryze/*` and `NumberField` from `@/components/ui/NumberField`. Never rebuild or inline-restyle them.
- **Page shell:** `<RyzeNavbar />` → `<main className="bg-ink" style={{ position:"relative", zIndex:2 }}>…</main>`
  → `<RyzeFooter />`. The `<main>` z-index is required for the footer scroll-reveal.
- **CSS wiring:** `app/globals.css` starts with `@import "../ryze-design-system/tokens.css";` then
  `@import "../ryze-design-system/shared/shared.css";`. Base/body/navbar/footer/marquee CSS lives in `shared.css` —
  don't redeclare it.
- **Headings:** page H1 uses `.text-title` (Instrument Serif + cream-fade); one italic-serif lavender accent per
  headline. Section H2s use `font-display` (Schibsted Grotesk).
- **Cards:** `bg-ink-soft rounded-xl ring-1-white-10`, eyebrow-block + `font-display` H2, 24px gap between stacked cards.
- **Pills for interactive elements**, glows over shadows on dark surfaces, `ease-out cubic-bezier(0.22,1,0.36,1)` @ 400ms,
  respect `prefers-reduced-motion`, no emojis as decoration.

Pull tokens/utility classes from `ryze-design-system/tokens.css` and recipes from `ryze-design-system/COMPONENTS.md`.
<!-- END:ryze-design-system -->
