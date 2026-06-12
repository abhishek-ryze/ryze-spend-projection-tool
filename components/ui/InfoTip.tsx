"use client";
import { useState } from "react";

/* ---------------------------------------------------------------------------
   Small "i" trigger with a styled hover/focus tooltip. Used beside KPI and
   field labels to demystify jargon without a popup library dependency.
--------------------------------------------------------------------------- */
export default function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", verticalAlign: "middle" }}>
      <button
        type="button"
        aria-label="What is this?"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        style={{
          width: 16, height: 16, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.7)",
          fontFamily: "var(--font-serif)", fontSize: 11, fontStyle: "italic", fontWeight: 600, lineHeight: 1,
          cursor: "help", padding: 0,
        }}
      >
        i
      </button>
      {open && (
        <span
          role="tooltip"
          style={{
            position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
            zIndex: 10, width: "max-content", maxWidth: 260,
            background: "#15151d", border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 12, padding: "10px 12px",
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, lineHeight: 1.5,
            letterSpacing: 0, textTransform: "none",
            color: "var(--paper)", boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
            pointerEvents: "none", whiteSpace: "normal",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
