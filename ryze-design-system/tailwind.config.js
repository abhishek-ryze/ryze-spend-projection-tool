/**
 * Ryze Design System — Tailwind config (v3 + v4 compatible)
 *
 * Source: Figma "Ryze Brand / Website 2026" (file ZctsL0NVfK5HODgcFDs6zG, node 3467:1966)
 *         + ryzedesigns.com live styles
 * v1.1.0
 *
 * Usage:
 *   import ryze from "./ryze-design-system/tailwind.config.js";
 *   export default { presets: [ryze], content: [...] };
 *
 * Note: `lavendar` spelling preserved from the Figma variable for parity.
 */

import plugin from "tailwindcss/plugin";

// ---- Canonical Ryze color ramps (from Figma variables) -------------
const ryzeBlue = {
  100:  "#E3E3FF",
  200:  "#B6B7FF",
  300:  "#898BFF",
  500:  "#001AFF",
  600:  "#000CA2",
  700:  "#00034D",
  DEFAULT: "#001AFF",
};
const ryzeLavendar = {
  100:  "#F6EDFE",
  200:  "#DEBAFB",
  300:  "#CA84F9",
  500:  "#8C1CBC",
  600:  "#5A0E7B",
  700:  "#2E0440",
  DEFAULT: "#B93DF5",
};
const ryzeMagenta = {
  100:  "#FEEDEF",
  200:  "#FBBCC7",
  300:  "#F9809B",
  400:  "#F4256D",
  500:  "#B4184E",
  600:  "#770C32",
  700:  "#400317",
  DEFAULT: "#F4256D",
};
const ryzeOrange = {
  100:  "#FDD2CE",
  200:  "#FB9B8D",
  300:  "#F95823",
  400:  "#BC4018",
  500:  "#832A0D",
  600:  "#4E1604",
  700:  "#260701",
  DEFAULT: "#F95823",
};
const ryzePink = {
  100:  "#FAD2FC",
  200:  "#F494F9",
  400:  "#B725BD",
  500:  "#801784",
  600:  "#4D094F",
  700:  "#240225",
  DEFAULT: "#EE3DF5",
};
const ryzeYellow = {
  100:  "#FFEACB",
  200:  "#F3BD1A",
  300:  "#C49813",
  400:  "#97740C",
  500:  "#6C5206",
  600:  "#443302",
  700:  "#201601",
  DEFAULT: "#F3BD1A",
};
const ryzeBlack = {
  100:  "#D6D6D6",
  200:  "#AFAFAF",
  300:  "#898989",
  400:  "#656565",
  500:  "#434343",
  600:  "#242424",
  700:  "#000000",
  DEFAULT: "#000000",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx,html}"],
  theme: {
    extend: {
      colors: {
        // Canonical Figma ramps
        "ryze-blue":     ryzeBlue,
        "ryze-lavendar": ryzeLavendar,
        "ryze-magenta":  ryzeMagenta,
        "ryze-orange":   ryzeOrange,
        "ryze-pink":     ryzePink,
        "ryze-yellow":   ryzeYellow,
        "ryze-black":    ryzeBlack,

        // Semantic aliases — use these in components
        ink:             ryzeBlack[700],
        "ink-soft":      ryzeBlack[600],
        cosmos:          "#020846",
        electric:        ryzeBlue[500],
        "electric-deep": ryzeBlue[600],
        "electric-soft": ryzeBlue[100],
        lavender:        ryzeLavendar.DEFAULT,
        ember:           ryzeOrange[300],
        magenta:         ryzeMagenta.DEFAULT,
        pink:            ryzePink.DEFAULT,
        sun:             ryzeYellow.DEFAULT,
        cream:           "#F3EFEB",
        paper:           "#FFFFFF",
        ash:             ryzeBlack[500],
        smoke:           ryzeBlack[100],
      },
      backgroundImage: {
        "grad-mango":    "linear-gradient(160deg, #FFEACB 0%, #F3BD1A 60%, #F95823 100%)",
        "grad-lavender": "linear-gradient(160deg, #F6EDFE 0%, #DEBAFB 40%, #CA84F9 100%)",
        "grad-tomato":   "linear-gradient(160deg, #FB9B8D 0%, #F95823 60%, #F4256D 100%)",
        "grad-rose":     "linear-gradient(160deg, #FAD2FC 0%, #F494F9 50%, #B725BD 100%)",
        "grad-sky":      "linear-gradient(160deg, #E3E3FF 0%, #B6B7FF 50%, #001AFF 100%)",
        "grad-cosmos":   "radial-gradient(60% 80% at 50% 0%, #000CA2 0%, #00034D 35%, #020846 60%, #000 100%)",
        "grad-electric": "linear-gradient(180deg, #001AFF 0%, #000CA2 100%)",
        "grad-night":    "linear-gradient(180deg, #242424 0%, #000 100%)",
        "grad-chrome":      "linear-gradient(180deg, #FFFFFF 0%, #E3E3FF 35%, #898BFF 65%, #00034D 100%)",
        // Title-fade gradients — tint at BOTTOM, white at TOP. Use with .text-title or as bg-grad-title-*.
        "grad-title-cream": "linear-gradient(0deg, #EFE8D9 0%, #FFFFFF 100%)",
        "grad-title-sky":   "linear-gradient(0deg, #B6B7FF 0%, #FFFFFF 100%)",
        "grad-title-rose":  "linear-gradient(0deg, #F494F9 0%, #FFFFFF 100%)",
        "grad-title-sun":   "linear-gradient(0deg, #F3BD1A 0%, #FFFFFF 100%)",
        "grad-title-ember": "linear-gradient(0deg, #F95823 0%, #FFFFFF 100%)",
        // "Let's Connect" marquee band fill — solid navy with fade-to-black at the corners.
        "grad-marquee-band":"linear-gradient(90deg, #000 0%, #00034D 8%, #00034D 92%, #000 100%)",
        // Footer italic "together." gradient (blue 200 → 585CFF).
        "grad-together":    "linear-gradient(180deg, #B6B7FF 23%, #585CFF 100%)",
      },
      fontFamily: {
        // PRIMARY heading font — Instrument Serif. Use `font-serif` on H1s/titles.
        serif:    ['"Instrument Serif"', '"Times New Roman"', "serif"],
        // Secondary display — section H2s and UI display.
        display:  ['"Schibsted Grotesk"', "system-ui", "sans-serif"],
        // Body, nav, buttons.
        sans:     ["Inter", '"Inter Display"', "system-ui", "sans-serif"],
        // Mega stacked-echo display (RYZE / FEATURED). Max 2–3 per page.
        chrome:   ["Mohave", '"Schibsted Grotesk"', "Impact", "sans-serif"],
        // RARE accents — use sparingly, ~1 instance per page.
        bringbold:['"Bringbold Nineties"', "Impact", "sans-serif"],
        gochi:    ['"Gochi Hand"', '"Comic Sans MS"', "cursive"],
        yourbold: ['"YourBold"', '"Schibsted Grotesk"', "Impact", "sans-serif"],
      },
      fontSize: {
        "2xl":  ["clamp(1.75rem, 2vw + 1rem, 2.25rem)", { lineHeight: "1.15" }],
        "3xl":  ["clamp(2.25rem, 3vw + 1rem, 3rem)",    { lineHeight: "1.1"  }],
        "4xl":  ["clamp(3rem, 4vw + 1rem, 4.5rem)",     { lineHeight: "1"    }],
        "5xl":  ["clamp(4rem, 6vw + 1rem, 7rem)",       { lineHeight: "0.95" }],
        mega:   ["clamp(6rem, 14vw + 1rem, 18rem)",     { lineHeight: "0.85", letterSpacing: "-0.04em" }],
      },
      borderRadius: {
        sm:   "8px",
        md:   "16px",
        lg:   "24px",
        xl:   "32px",
        pill: "9999px",
      },
      boxShadow: {
        "glow-electric":        "0 0 40px rgba(0, 26, 255, 0.45), 0 0 120px rgba(0, 26, 255, 0.25)",
        "glow-electric-strong": "0 0 60px rgba(0, 26, 255, 0.7), 0 0 160px rgba(0, 26, 255, 0.4)",
        "glow-lavender":        "0 0 40px rgba(185, 61, 245, 0.40), 0 0 120px rgba(185, 61, 245, 0.20)",
        "glow-magenta":         "0 0 40px rgba(244, 37, 109, 0.40), 0 0 120px rgba(244, 37, 109, 0.20)",
        "glow-ember":           "0 0 30px rgba(249, 88, 35, 0.45)",
        "glow-sun":             "0 0 30px rgba(243, 189, 26, 0.45)",
        "glow-soft-white":      "0 8px 32px rgba(255, 255, 255, 0.08)",
        "card-lift":            "0 10px 40px rgba(0, 0, 0, 0.12)",
        "marquee-inset":        "inset 0 0 120px -65px rgba(246, 237, 254, 0.26)",
      },
      transitionTimingFunction: {
        out:      "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
        spring:   "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: { 400: "400ms", 700: "700ms" },
      keyframes: {
        "ryze-marquee": { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "ryze-pulse": {
          "0%, 100%": { boxShadow: "0 0 40px rgba(0,26,255,0.45), 0 0 120px rgba(0,26,255,0.25)" },
          "50%":      { boxShadow: "0 0 60px rgba(0,26,255,0.7),  0 0 160px rgba(0,26,255,0.4)"  },
        },
        "ryze-float": {
          "0%, 100%": { transform: "translateY(-6px)" },
          "50%":      { transform: "translateY(6px)"  },
        },
        "ryze-fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },
      },
      animation: {
        marquee:   "ryze-marquee 30s linear infinite",
        pulse:     "ryze-pulse 3s ease-in-out infinite",
        float:     "ryze-float 5s ease-in-out infinite alternate",
        "fade-up": "ryze-fade-up 600ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, addComponents }) {
      addUtilities({
        ".text-chrome": {
          backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, #E3E3FF 35%, #898BFF 65%, #00034D 100%)",
          "-webkit-background-clip": "text",
          backgroundClip: "text",
          color: "transparent",
          "-webkit-text-fill-color": "transparent",
        },
        // Primary H1 / title treatment — Instrument Serif + warm cream→white fade.
        // Variant classes (.text-title-sky etc.) swap the gradient tint.
        ".text-title": {
          fontFamily: '"Instrument Serif", "Times New Roman", serif',
          fontWeight: "400",
          lineHeight: "0.95",
          letterSpacing: "-0.02em",
          backgroundImage: "linear-gradient(0deg, #EFE8D9 0%, #FFFFFF 100%)",
          "-webkit-background-clip": "text",
          backgroundClip: "text",
          color: "transparent",
          "-webkit-text-fill-color": "transparent",
        },
        ".text-title-sky":   { backgroundImage: "linear-gradient(0deg, #B6B7FF 0%, #FFFFFF 100%)", "-webkit-background-clip": "text", backgroundClip: "text" },
        ".text-title-rose":  { backgroundImage: "linear-gradient(0deg, #F494F9 0%, #FFFFFF 100%)", "-webkit-background-clip": "text", backgroundClip: "text" },
        ".text-title-sun":   { backgroundImage: "linear-gradient(0deg, #F3BD1A 0%, #FFFFFF 100%)", "-webkit-background-clip": "text", backgroundClip: "text" },
        ".text-title-ember": { backgroundImage: "linear-gradient(0deg, #F95823 0%, #FFFFFF 100%)", "-webkit-background-clip": "text", backgroundClip: "text" },
        // Italic accent word — same family as .text-title but italic + lavender.
        // When nested inside .text-title it overrides the gradient.
        ".text-accent": {
          fontFamily: '"Instrument Serif", "Times New Roman", serif',
          fontStyle: "italic",
          fontWeight: "400",
          color: ryzeLavendar.DEFAULT,
          background: "none",
          "-webkit-text-fill-color": "currentColor",
        },
        // Italic with the blue "together." gradient — different from .text-accent (lavender solid).
        ".text-together": {
          fontFamily: '"Instrument Serif", "Times New Roman", serif',
          fontStyle: "italic",
          fontWeight: "400",
          backgroundImage: "linear-gradient(180deg, #B6B7FF 23%, #585CFF 100%)",
          "-webkit-background-clip": "text",
          backgroundClip: "text",
          color: "transparent",
          "-webkit-text-fill-color": "transparent",
        },
        ".eyebrow": {
          fontSize: "0.875rem",
          fontWeight: "600",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: ryzeLavendar.DEFAULT,
        },
      });
      addComponents({
        ".btn-electric": {
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.875rem 1.75rem",
          borderRadius: "9999px",
          backgroundImage: "linear-gradient(180deg, #001AFF 0%, #000CA2 100%)",
          color: "#FFFFFF",
          fontWeight: "600",
          boxShadow: "0 0 40px rgba(0, 26, 255, 0.45), 0 0 120px rgba(0, 26, 255, 0.25)",
          transition: "transform 400ms cubic-bezier(0.22,1,0.36,1), box-shadow 400ms cubic-bezier(0.22,1,0.36,1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 0 60px rgba(0, 26, 255, 0.7), 0 0 160px rgba(0, 26, 255, 0.4)",
          },
        },
        ".chip": {
          display: "inline-flex",
          alignItems: "center",
          padding: "0.375rem 0.875rem",
          borderRadius: "9999px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          color: "#FFFFFF",
          fontSize: "0.875rem",
          fontWeight: "500",
          backdropFilter: "blur(8px)",
        },
      });
    }),
  ],
};
