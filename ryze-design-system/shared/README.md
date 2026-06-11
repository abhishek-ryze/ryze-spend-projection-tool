# Ryze Shared Bundle

Canonical, drop-in code for every Ryze tool. **Copy these files verbatim** into a new project — never rebuild them from `COMPONENTS.md` recipes. The recipes exist for *new* patterns; the navbar, footer, mega-menu, hero ambient, and NumberField are *locked* primitives that must look pixel-identical across every tool.

## What's in here

```
shared/
├── README.md                       (this file)
├── shared.css                      ← @import after tokens.css
├── components/
│   ├── RyzeNavbar.tsx              top-of-page navbar (fixed)
│   ├── MegaMenu.tsx                full-screen menu (opened from navbar)
│   ├── RyzeFooter.tsx              CTA curtain + marquee + fixed footer body
│   ├── icons.tsx                   social icons (Instagram, LinkedIn, YouTube, X)
│   ├── HeroParticles.tsx           ambient particle field for heroes
│   └── ryze-footer-loop.json       lottie data — must sit next to RyzeFooter.tsx
└── ui/
    └── NumberField.tsx             pill-rounded number input with live comma formatting
```

## Install (Next.js / Vite — any React + TS project)

1. Copy `shared/components/*` → `components/ryze/`
2. Copy `shared/ui/*` → `components/ui/`
3. Copy `shared/shared.css` → `ryze-design-system/shared.css`
4. In your `globals.css`, the **first two imports** must be:
   ```css
   @import "../ryze-design-system/tokens.css";
   @import "../ryze-design-system/shared.css";
   ```
5. Copy these binaries into `public/` so the components' `/<file>` URLs resolve:
   - `ryze-mark.png`
   - `nav-ryze.svg`
   - `cta-swoosh.svg`
   - `marquee-pattern.png`
6. `npm install lottie-web` (only runtime dep — used by `RyzeFooter`)

## Use (every page)

```tsx
import RyzeNavbar from "@/components/ryze/RyzeNavbar";
import RyzeFooter from "@/components/ryze/RyzeFooter";

export default function Page() {
  return (
    <>
      <RyzeNavbar />
      <main className="bg-ink" style={{ position: "relative", zIndex: 2 }}>
        {/* ...page content... */}
      </main>
      <RyzeFooter />
    </>
  );
}
```

That's it. The CSS in `shared.css` handles all responsiveness, the scroll-reveal mechanic, the mobile breakpoints (1100 / 960 / 720 / 640 / 480), the lottie inline placement, the swoosh anchoring, the marquee speed, the scrollbar style — **don't override any of it**.

## Hard rules

1. **Never rebuild `RyzeNavbar`, `RyzeFooter`, or `MegaMenu` from primitives.** If you need a variant, ask the user first.
2. **Never copy these `.tsx` files and then edit them per-project** for cosmetic tweaks. If the change is real, push it back into this skill so every future project inherits it.
3. **Don't change icon sizes inline.** Footer socials = `<Icon size={32} />`, megamenu socials = `<Icon size={28} />`. These were tuned — don't drift.
4. **Don't move `ryze-footer-loop.json`.** It's imported relative to `RyzeFooter.tsx` (`./ryze-footer-loop.json`). Keep them in the same folder.
5. **`<main>` must be `position: relative; z-index: 2; background: var(--ink)`** for the scroll-reveal to work. The footer is `position: fixed; z-index: 1`. The CTA curtain inside `RyzeFooter` is `z-index: 2` and scrolls *with* main; the footer body sits behind. If you set `<main>` to `z-index: auto`, the reveal breaks.
6. **`body { padding-bottom: 776px; scrollbar-gutter: stable; }`** is in `shared.css`. Leave it. Below 1100px both are auto-disabled.
