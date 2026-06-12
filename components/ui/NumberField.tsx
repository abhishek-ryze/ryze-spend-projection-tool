"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  hint?: string;
};

function fmt(n: number) {
  return Number.isFinite(n) && n !== 0 ? n.toLocaleString("en-US") : "";
}

export default function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min,
  hint,
}: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [raw, setRaw] = useState(fmt(value));

  // Sync display when value changes from outside (e.g. reset / scenario load)
  useEffect(() => {
    const parsed = parseInt(raw.replace(/\D/g, ""), 10);
    if (parsed !== value) setRaw(fmt(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const el = e.target;
    const cursorPos = el.selectionStart ?? 0;

    // Count how many digits appear before the cursor in the current display string
    const digitsBeforeCursor = el.value.slice(0, cursorPos).replace(/\D/g, "").length;

    // Strip everything except digits
    const digits = el.value.replace(/\D/g, "");
    const n = digits === "" ? 0 : parseInt(digits, 10);
    const formatted = digits === "" ? "" : n.toLocaleString("en-US");

    setRaw(formatted);
    if (!isNaN(n) && (min === undefined || n >= min)) onChange(n);

    // After React re-renders, place the cursor at the same logical digit position
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;
      let digitsSeen = 0;
      let newPos = formatted.length;
      if (digitsBeforeCursor === 0) {
        newPos = 0;
      } else {
        for (let i = 0; i < formatted.length; i++) {
          if (/\d/.test(formatted[i])) {
            digitsSeen++;
            if (digitsSeen === digitsBeforeCursor) {
              newPos = i + 1;
              break;
            }
          }
        }
      }
      input.setSelectionRange(newPos, newPos);
    });
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    const el = e.target;
    const end = el.value.length;
    requestAnimationFrame(() => el.setSelectionRange(end, end));
  }

  function handleBlur() {
    setRaw(value === 0 ? "" : value.toLocaleString("en-US"));
  }

  return (
    <label htmlFor={id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span
        className="text-smoke"
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "var(--font-sans)",
        }}
      >
        {label}
      </span>

      <div
        className="rounded-pill"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.10)",
          padding: "12px 20px",
          transition:
            "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)",
        }}
        onFocus={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "rgba(0,26,255,0.7)";
          el.style.background = "rgba(0,26,255,0.08)";
          el.style.boxShadow = "0 0 0 4px rgba(0,26,255,0.18)";
        }}
        onBlur={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "rgba(255,255,255,0.10)";
          el.style.background = "rgba(255,255,255,0.04)";
          el.style.boxShadow = "none";
        }}
      >
        {prefix && (
          <span className="text-electric-bright tabular" style={{ fontWeight: 600 }}>
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          value={raw}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="tabular text-paper"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 18,
            fontWeight: 500,
            minWidth: 0,
            width: "100%",
          }}
        />
        {suffix && (
          <span className="text-smoke" style={{ fontSize: 14, fontWeight: 500 }}>
            {suffix}
          </span>
        )}
      </div>

      {hint && (
        <span style={{ fontSize: 13, lineHeight: 1.5, color: "#b3b3b3" }}>
          {hint}
        </span>
      )}
    </label>
  );
}
