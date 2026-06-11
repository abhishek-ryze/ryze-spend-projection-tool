# Ryze Design System

A reusable visual language extracted from [ryzedesigns.com](https://ryzedesigns.com) and codified so any agent (Claude Code, Cursor, v0, Lovable) can recreate the same look on a new project.

---

## 1. Brand essence in one paragraph

Ryze is **dark by default**, **electric**, and **theatrical** without losing **polish**. The site alternates between two moods on the same canvas:

- **Polished editorial light mode** — warm cream backgrounds (`#F3EFEB`), rounded service cards drenched in vivid candy gradients (mango-yellow, lavender, tomato-orange), and a tiny chrome `R` mark.
- **Cinematic dark mode** — deep cosmic navy (`#020846`) fading into pure black (`#000`), oversized chrome/metallic display headlines that **stack-echo into the distance**, an electric blue CTA (`#0000EE` → `#001AFF`) that **glows**, and floating pill chips that look back-lit.

The connective tissue is: **massive bold display type · italic serif accents · pill-shaped everything · gradient surfaces · neon glows · numbered/structured navigation.** Think Awwwards-grade studio site, not SaaS landing page.

---

## 2. Color system

The palette comes straight from the Figma file [`Ryze Brand / Website 2026`](https://www.figma.com/design/ZctsL0NVfK5HODgcFDs6zG/Ryze-Brand---Website-2026?node-id=3467-1966). There are **7 canonical ramps** (blue, lavendar, magenta, orange, pink, yellow, black), each on a `100 → 700` scale with a `base` swatch.

> **Note:** `lavendar` is spelled that way in the Figma variable. Preserved for parity — don't auto-correct.

### Ramps (canonical — use these names everywhere)

#### `ryze-blue` — the electric brand color
| Stop | Hex | Typical use |
|---|---|---|
| 100 | `#E3E3FF` | Soft pill backgrounds, hover halos |
| 200 | `#B6B7FF` | `grad-sky` mid-stop |
| 300 | `#898BFF` | Chrome gradient mid-light |
| **500 / base** | `#001AFF` | **Primary CTA, links, brand accent** |
| 600 | `#000CA2` | CTA pressed, gradient bottom |
| 700 | `#00034D` | Cosmos gradient anchor, chrome darkest |

#### `ryze-lavendar`
| Stop | Hex | Typical use |
|---|---|---|
| 100 | `#F6EDFE` | Soft tile gradient top |
| 200 | `#DEBAFB` | Lavender card mid-stop |
| 300 | `#CA84F9` | Lavender card bottom |
| 500 | `#8C1CBC` | Dark lavendar text on light |
| 600 | `#5A0E7B` | Deep lavendar shadow |
| 700 | `#2E0440` | Cosmos accent |
| **base** | `#B93DF5` | **Italic accent text, eyebrow labels** |

#### `ryze-magenta`
| Stop | Hex | Typical use |
|---|---|---|
| 100 | `#FEEDEF` · 200 `#FBBCC7` · 300 `#F9809B` | Light wash, soft chips |
| **400 / base** | `#F4256D` | **Tomato gradient hot-spot, energetic accent** |
| 500 `#B4184E` · 600 `#770C32` · 700 `#400317` | Dark variants |

#### `ryze-orange`
| Stop | Hex | Typical use |
|---|---|---|
| 100 `#FDD2CE` · 200 `#FB9B8D` | Soft peach wash |
| **300 / base** | `#F95823` | **Hot accent — `ember`, "View Reel" pill, tag highlight** |
| 400 `#BC4018` · 500 `#832A0D` · 600 `#4E1604` · 700 `#260701` | Dark variants |

#### `ryze-pink`
| Stop | Hex | Typical use |
|---|---|---|
| 100 `#FAD2FC` · 200 `#F494F9` | Rose card top stops |
| 400 `#B725BD` · 500 `#801784` | Rose card bottom |
| **base** | `#EE3DF5` | **Playful magenta accent** |

#### `ryze-yellow`
| Stop | Hex | Typical use |
|---|---|---|
| 100 `#FFEACB` | Mango card top |
| **200 / base** | `#F3BD1A` | **Sun, mango card mid-stop** |
| 300 `#C49813` · 400+ | Dark mustard variants |

#### `ryze-black` — neutral grayscale
| Stop | Hex | Typical use |
|---|---|---|
| 100 `#D6D6D6` | `smoke` — dividers, muted text on dark |
| 200 `#AFAFAF` · 300 `#898989` | Mid-grays |
| 400 `#656565` | Subtle borders on dark |
| 500 `#434343` | `ash` — body text on light/cream |
| 600 `#242424` | `ink-soft` — card surface on dark |
| **700 / base** | `#000000` | `ink` — page background, max-contrast text |

### Semantic aliases (preferred in component code)

| Alias | Resolves to | Use |
|---|---|---|
| `--ink` | `ryze-black-700` | Page bg dark / black text on light |
| `--ink-soft` | `ryze-black-600` | Card surface on dark sections |
| `--cosmos` | `#020846` (custom) | Deep navy hero gradient anchor |
| `--electric` | `ryze-blue-500` | Primary CTA, links |
| `--electric-deep` | `ryze-blue-600` | CTA pressed, gradient bottom |
| `--electric-soft` | `ryze-blue-100` | Pill backgrounds on light |
| `--lavender` | `ryze-lavendar-base` | Italic accents, eyebrow labels |
| `--ember` | `ryze-orange-300` | Hot accent, "View Reel" chip |
| `--magenta` | `ryze-magenta-base` | Energetic gradient stop |
| `--pink` | `ryze-pink-base` | Playful gradient stop |
| `--sun` | `ryze-yellow-base` | Mango / sun stop |
| `--cream` | `#F3EFEB` (custom) | Warm light-mode page bg |
| `--paper` | `#FFFFFF` | Cards on cream, max-contrast on dark |
| `--ash` | `ryze-black-500` | Body text on light |
| `--smoke` | `ryze-black-100` | Muted text / dividers on dark |

### Service-card gradients (signature candy tiles)

Built from the ramps above:

```css
--grad-mango:    linear-gradient(160deg, #FFEACB 0%, #F3BD1A 60%, #F95823 100%);  /* yellow→orange */
--grad-lavender: linear-gradient(160deg, #F6EDFE 0%, #DEBAFB 40%, #CA84F9 100%);  /* lavendar 100→300 */
--grad-tomato:   linear-gradient(160deg, #FB9B8D 0%, #F95823 60%, #F4256D 100%);  /* orange→magenta */
--grad-rose:     linear-gradient(160deg, #FAD2FC 0%, #F494F9 50%, #B725BD 100%);  /* pink→pink-400 */
--grad-sky:      linear-gradient(160deg, #E3E3FF 0%, #B6B7FF 50%, #001AFF 100%);  /* blue 100→500 */
```

### Dark-mode atmospheric gradients

```css
--grad-cosmos:   radial-gradient(60% 80% at 50% 0%, #000CA2 0%, #00034D 35%, #020846 60%, #000 100%);
--grad-electric: linear-gradient(180deg, #001AFF 0%, #000CA2 100%);  /* ryze-blue 500→600 */
--grad-night:    linear-gradient(180deg, #242424 0%, #000 100%);     /* ryze-black 600→700 */
```

### Chrome / metallic text gradient (used on "RYZE", "FEATURED", "WORKS")

Built entirely from the `ryze-blue` ramp — that's why it reads as on-brand:

```css
--grad-chrome: linear-gradient(180deg,
  #FFFFFF 0%,
  #E3E3FF 35%,    /* ryze-blue-100 */
  #898BFF 65%,    /* ryze-blue-300 */
  #00034D 100%);  /* ryze-blue-700 */

/* Apply with the .text-chrome utility, or: */
background: var(--grad-chrome);
-webkit-background-clip: text;
background-clip: text;
color: transparent;
```

---

## 3. Typography

Type roles in priority order — **Instrument Serif is the star of the show** and does most highlight/title work. Everything else supports it.

| Role | Family | Weights | Used for |
|---|---|---|---|
| 🌟 **Primary heading** | `Instrument Serif` | 400 regular + 400 italic | **All page H1s, hero titles, "highlight nicely" moments.** Title example: *"Ideas, Impact & Everything Between"*. Italic for accent words. |
| **Secondary display** | `Schibsted Grotesk` | 700, 800 | Section H2s, subheadlines, UI display, eyebrow labels |
| **Body** | `Inter` (or `Inter Display`) | 400, 500, 600 | Body copy, nav, captions, button labels |
| **Mega chrome** | `Mohave` *or* `Schibsted Grotesk 900` | 900 | Mega stacked-echo words: "FEATURED", "WORKS", "LET'S CONNECT". **Max 2–3 per page.** |
| **Rare accent 1** | `Bringbold Nineties` | — | Retro punch — **sparingly, ~1 per page** |
| **Rare accent 2** | `Gochi Hand` | — | Handwritten note feel — **sparingly, ~1 per page** |
| **Rare accent 3** | `YourBold` | — | Bold display alternate — **sparingly, ~1 per page** |

> ⚠️ **About the rare accents.** Bringbold, Gochi Hand, and YourBold are spice, not staple. Use one to punch a single word or label per page, never paragraphs, never headings two sections in a row. They should feel like a wink.

### Title-fade gradient (the signature H1 treatment)

Page titles get a **vertical gradient** clipped to text — a soft tint at the **bottom** fading up to **pure white** at the top. Combined with Instrument Serif, this is what makes Ryze titles glow.

```css
/* Default — warm cream tint */
--grad-title-cream: linear-gradient(0deg, #EFE8D9 0%, #FFFFFF 100%);

/* Tint variants — pick to match section mood */
--grad-title-sky:   linear-gradient(0deg, #B6B7FF 0%, #FFFFFF 100%);  /* ryze-blue-200 */
--grad-title-rose:  linear-gradient(0deg, #F494F9 0%, #FFFFFF 100%);  /* ryze-pink-200 */
--grad-title-sun:   linear-gradient(0deg, #F3BD1A 0%, #FFFFFF 100%);  /* ryze-yellow-200 */
--grad-title-ember: linear-gradient(0deg, #F95823 0%, #FFFFFF 100%);  /* ryze-orange-300 */
```

```html
<!-- One class does the font + gradient + clip in one go -->
<h1 class="text-title text-5xl">Ideas, Impact &amp; Everything Between</h1>

<!-- Variants -->
<h1 class="text-title text-title-sky text-5xl">Built for builders</h1>
<h1 class="text-title text-title-rose text-5xl">Stories worth telling</h1>

<!-- Italic accent word inside a title — uses Instrument Serif italic + lavender -->
<h1 class="text-title text-5xl">
  Let's create what's next,
  <em class="text-accent">together.</em>
</h1>
```

### Type scale (clamp-based, fluid)

```css
--text-xs:    0.75rem;                              /* 12px - chip labels */
--text-sm:    0.875rem;                             /* 14px - captions */
--text-base:  1rem;                                 /* 16px - body */
--text-lg:    1.125rem;                             /* 18px - lead body */
--text-xl:    1.375rem;                             /* 22px - subhead */
--text-2xl:   clamp(1.75rem, 2vw + 1rem, 2.25rem);  /* card titles */
--text-3xl:   clamp(2.25rem, 3vw + 1rem, 3rem);     /* eyebrow display */
--text-4xl:   clamp(3rem,  4vw + 1rem, 4.5rem);     /* section headline */
--text-5xl:   clamp(4rem,  6vw + 1rem, 7rem);       /* hero headline */
--text-mega:  clamp(6rem, 14vw + 1rem, 18rem);      /* "FEATURED", "RYZE" */
```

### Headline patterns

- **Page H1s** are Instrument Serif Regular + `text-title` gradient + `line-height: 0.95`, centered, often 2 lines.
- **Section H2s** use Schibsted Grotesk bold — keeps the H1 as the visual anchor.
- **Italic accent words** sit *inline* inside an H1, using Instrument Serif italic + lavender, e.g.:
  > Let's create what's next, *together.*

  Render as: `<em class="text-accent">together.</em>` (works inside or outside `.text-title`).
- **Mega stack-echo words** (signature move): the same word repeated 3× stacked vertically, each instance fades into the background. Implementation in §6.

### Eyebrow labels

Small all-caps colored labels above section headlines:

```css
.eyebrow {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--lavender); /* or --ember, --electric */
}
```

Used like: `<span class="eyebrow">DISCOVERY</span>` above "See the problem before you try to solve it."

---

## 4. Radii, spacing, elevation

### Radii

| Token | Value | Use |
|---|---|---|
| `--r-sm` | `8px` | Small chips, inputs |
| `--r-md` | `16px` | Cards on dark sections |
| `--r-lg` | `24px` | Service cards (light mode) |
| `--r-xl` | `32px` | Featured-work cards |
| `--r-pill` | `999px` | Nav, buttons, chips, tags — **default for all interactive elements** |

The site is dominated by `r-pill` and `r-xl`. Avoid sharp corners unless intentional.

### Spacing scale (8-point with extras)

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160` — section padding usually `120px+` on desktop.

### Elevation (glow-first, not shadow-first)

Ryze barely uses traditional drop shadows. It uses **glows** — colored, blurred, large.

```css
/* Glow tokens */
--glow-electric:    0 0 40px rgba(0, 26, 255, 0.45),
                    0 0 120px rgba(0, 26, 255, 0.25);
--glow-lavender:    0 0 40px rgba(160, 116, 255, 0.40),
                    0 0 120px rgba(160, 116, 255, 0.20);
--glow-ember:       0 0 30px rgba(249, 88, 35, 0.45);
--glow-soft-white:  0 8px 32px rgba(255, 255, 255, 0.08);

/* Used as box-shadow on buttons, pills, node-graph circles */
```

The "Book a Call" / "Start a Project" / "View All Projects" buttons all carry `--glow-electric`.

---

## 5. Component anatomy

Detailed JSX recipes live in [`COMPONENTS.md`](./COMPONENTS.md). Quick mental model below.

### 5.1 RyzeNavbar — compact + mega-menu

Three squared-rectangle buttons on a transparent `position: fixed` bar: white "Explore" (with hamburger↔X animation), white "Work", solid-blue "Book a Call". Each `8px` radius, `1px solid #000` border, `12px × 24px` padding. The nav has `max-width: 1600px` and `80px` outer gutter, so on wide viewports the buttons don't drift to the edges. Clicking Explore opens a full-screen `<MegaMenu>` overlay (huge ghost-grey nav list with the active item in `text-electric`, a 7-link social-icon row, a Featured Case Study card, and `connect@…` with a hand-drawn scribble underline). Brand on the left is the shipped `nav-ryze.svg` lockup — never re-trace it. Pair with `html { scrollbar-gutter: stable; }` so opening the menu doesn't widen the viewport and shift the right-side CTA.

### 5.2 Service cards (light mode)

Big rounded-rect cards on cream background. Each card is filled with a candy gradient. Card holds: title (bold sans, dark), and a clipped illustration/screenshot that **bleeds to the bottom edge** of the card. Cards in a 2-col responsive grid with generous gaps (`32-40px`).

### 5.3 Featured-work cards (dark mode)

Wrapped in a `--grad-cosmos` background section. Card = device-frame screenshot on top, white title below, then 1–2 small electric-blue pill tags. Hover lifts card slightly + intensifies glow.

### 5.4 Mega stacked-echo headline

Three copies of the same word, each absolutely positioned with decreasing y-offset and decreasing opacity, all in chrome gradient. Reads as "FEATURED / FEATURED / FEATURED" diminishing into the floor.

### 5.5 Node-graph illustration (process section)

Black background, glowing colored pill labels (`Stakeholders`, `Data`, `Users`, `Competitors`) connected by thin blue glowing lines, with bright pulse dots at intersections. Use SVG `<line>` with `filter: drop-shadow()` for the glow.

### 5.6 Testimonial cluster

Floating pill cards each containing: 32px circular avatar + bold name + italic lowercase role. Cards scatter around a giant chrome "RYZE" wordmark behind. Subtle float animation (4–6s, ease-in-out).

### 5.7 RyzeFooter — composed CTA + scroll-revealed marquee + footer body

**One component, three layers, one scroll mechanic.**

- **Top layer (inside `<main>`):** "Ready to Work Together?" CTA (80px Schibsted ExtraBold, `Start a Project` blue square button) wrapped together with the marquee band so the deep-blue `cta-swoosh.svg` can anchor to the marquee's bottom edge and bleed upward into the CTA.
- **Marquee band:** 126px tall solid `#00034D` body with black fade-to-corners (8% → 92% colour stops), cream noise overlay (`marquee-pattern.png` at `background-blend-mode: overlay`), inner cream glow shadow. Track of "LET'S CONNECT" (cream `#F1E5DB` 64px Schibsted ExtraBold) scrolls 38s linear infinite; symmetric 4-point sparkle separators spin 18s clockwise. Both respect `motion-reduce`.
- **Bottom layer (`position: fixed; bottom: 0; z-index: 1`):** 3-column grid — chrome R logo (`ryze-mark.png` 124×139) + tagline + 4 social icons | numbered nav 01→06 (top + per-row hairline dividers, gradient-fill on hover) | "Let's create what's next, *together.*" (the italic `together.` uses `var(--grad-together)` blue 200→400 fade). Below: legal row with `©…`, Terms, Privacy, Cookie. Rotating "RYZE DESIGN STUDIO" Lottie loop pinned bottom-right of col 3, anchored to the divider above the legal row.

The scroll-reveal works because `<main>` is `relative z-[2] bg-ink` (opaque, on top) and the footer is `position: fixed; z-[1]` (behind). `body { padding-bottom: 776px; }` reserves the reveal-room. As you scroll, the top layer slides up and out, revealing the footer beneath.

---

## 6. Motion principles

- **Default duration:** 400ms · **default easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (gentle ease-out)
- **Hover scale** on cards: `scale(1.02)` over 300ms
- **Glow pulse** on CTAs: 3s infinite, opacity 0.6 → 1
- **Marquee scroll:** 30s linear infinite
- **Stagger entry** on grids: 80ms per child, `opacity 0 → 1` + `translateY(20px → 0)`
- **Float** on testimonial pills: 5s ease-in-out infinite alternate, `translateY(-6px → 6px)`
- **Respect** `prefers-reduced-motion: reduce` — disable all decorative animations.

---

## 7. Layout rules

- **Max content width:** `1280px` (`max-w-7xl`)
- **Outer page gutter:** `clamp(24px, 5vw, 80px)`
- **Section vertical rhythm:** `padding-block: clamp(80px, 12vw, 160px)`
- **Card grids:** 2 columns from `md`, never more than 3 on a service grid
- **Background sections snap** — alternate cream → black → cosmos → black for cinematic pacing.

---

## 8. Voice (for any AI-generated copy)

- Confident, slightly grand, never corporate. "Limitless Possibilities," "See the problem before you try to solve it," "Let's create what's next, together."
- Short headlines, longer supporting paragraphs (2–3 sentences).
- Numbered process steps (`01 Discovery`, `02 Define`, ...).
- One-word italic accents.
- Use sentence case in body, ALL CAPS for eyebrows and mega display.

---

## 9. Files in this folder

| File | What to use it for |
|---|---|
| [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) | This file — high-level overview, **start here** |
| [`tokens.json`](./tokens.json) | W3C DTCG tokens — feed to Style Dictionary, Figma, etc. |
| [`tokens.css`](./tokens.css) | Drop-in CSS custom properties — `@import` into any project |
| [`tailwind.config.js`](./tailwind.config.js) | Drop-in Tailwind config with all tokens + utility plugins |
| [`COMPONENTS.md`](./COMPONENTS.md) | Copy-paste JSX/React + Tailwind for every component above |
| [`AGENT.md`](./AGENT.md) | System prompt — paste this into Claude/Cursor before asking for UI |
