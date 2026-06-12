"use client";
import NumberField from "@/components/ui/NumberField";
import { Channel, seedCustomers, benchmarkFor, fmtMoney } from "@/lib/calculations";

/* ---------------------------------------------------------------------------
   Monotone palette. Blue is the brand (CTA, active, positive); purple shades
   are the only data-viz accent; one muted warning tone for genuinely bad states.
--------------------------------------------------------------------------- */
export const BRAND = "#001AFF";        // electric blue — CTA / active / fills
export const BRAND_BRIGHT = "#4D5CFF"; // brighter blue (chart stroke / hover)
export const SUPPORT = "#898BFF";      // readable periwinkle blue for supporting text on dark/grey
export const PURPLE = "#B93DF5";       // lavender/purple — data accent
export const PURPLE_SOFT = "#DEBAFB";
export const WARN = "#F95823";         // muted ember — bad states only

export const SURFACE = "rgba(255,255,255,0.045)";
export const SURFACE_BORDER = "1px solid rgba(255,255,255,0.09)";
export const DIVIDER = "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 50%, transparent 100%)";

export const ltvColor = (r: number) => (r >= 3 ? SUPPORT : r >= 1 ? PURPLE : WARN);
export const roiColor = (r: number) => (r >= 0 ? SUPPORT : WARN);
export const paybackColor = (m: number) => (m > 0 && m <= 12 ? SUPPORT : WARN);

// Strong -> soft purple by normalized position (0 = strongest).
export function purpleShade(t: number): string {
  const a = [0xB9, 0x3D, 0xF5];
  const b = [0xDE, 0xBA, 0xFB];
  const c = a.map((x, i) => Math.round(x + (b[i] - x) * Math.max(0, Math.min(1, t))));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/* ---------------------------------------------------------------------------
   Card shell (locked Ryze pattern)
--------------------------------------------------------------------------- */
export function Card({ eyebrow, titleA, accent, action, collapsible, open = true, onToggle, children }: {
  eyebrow: string; titleA: string; accent: string; action?: React.ReactNode;
  collapsible?: boolean; open?: boolean; onToggle?: () => void; children: React.ReactNode;
}) {
  const clickable = collapsible && !!onToggle;
  return (
    <div
      className="bg-ink-soft rounded-xl ring-1-white-10"
      style={{ padding: "clamp(24px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: 28, minWidth: 0 }}
    >
      <header
        onClick={clickable ? onToggle : undefined}
        style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
          cursor: clickable ? "pointer" : "default", userSelect: clickable ? "none" : "auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span className="eyebrow-block">{eyebrow}</span>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(24px, 2.6vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3, paddingBottom: 2,
              color: "#FFFFFF",
            }}
          >
            {titleA}{" "}
            <em
              className="font-serif"
              style={{ fontStyle: "italic", fontWeight: 400, whiteSpace: "nowrap", color: "var(--lavender)" }}
            >
              {accent}
            </em>
          </h2>
        </div>
        {collapsible ? <Chevron open={open} /> : action}
      </header>
      {(!collapsible || open) && children}
    </div>
  );
}

function Chevron({ open }: { open?: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 999, flexShrink: 0,
        border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.05)",
      }}
    >
      <svg
        viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="rgba(255,255,255,0.75)"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform var(--dur-base) var(--ease-out)" }}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
}

/* ---------------------------------------------------------------------------
   KPI tile
--------------------------------------------------------------------------- */
export function Kpi({ label, value, sub, accent, highlight }: {
  label: string; value: string; sub: string; accent?: string; highlight?: boolean;
}) {
  return (
    <div
      className="bg-ink-soft rounded-xl ring-1-white-10"
      style={{
        padding: "24px 26px",
        background: highlight ? `${BRAND}12` : "var(--ink-soft)",
        boxShadow: highlight ? `0 0 34px ${BRAND}26` : "none",
      }}
    >
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>{label}</p>
      <p className="tabular" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.9rem, 3vw, 2.4rem)", fontWeight: 700, color: accent ?? "var(--paper)", lineHeight: 1, marginBottom: 8 }}>{value}</p>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "rgba(255,255,255,0.55)" }}>{sub}</p>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Channel editor row — used in the questionnaire and in the results quick-edit.
   mode "pre" estimates customers from the benchmark CAC when spend changes.
--------------------------------------------------------------------------- */
export function ChannelEditor({ channel, mode, onChange, onRemove }: {
  channel: Channel;
  mode: "pre" | "actual";
  onChange: (patch: Partial<Channel>) => void;
  onRemove?: () => void;
}) {
  const bench = benchmarkFor(channel.name);
  const cac = channel.customers > 0 ? channel.monthlySpend / channel.customers : 0;
  const vs = bench && cac > 0 ? cac / bench.cac : 0;

  const onSpend = (v: number) =>
    mode === "pre"
      ? onChange({ monthlySpend: v, customers: seedCustomers(channel.name, v) })
      : onChange({ monthlySpend: v });

  return (
    <div style={{ borderRadius: 18, border: SURFACE_BORDER, background: SURFACE, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
          <span style={{ width: 9, height: 9, borderRadius: 999, background: PURPLE, boxShadow: `0 0 10px ${PURPLE}88`, flexShrink: 0 }} />
          <span
            className="font-display text-paper"
            style={{ flex: 1, minWidth: 0, fontSize: 17, fontWeight: 600, padding: "4px 0" }}
          >
            {channel.name}
          </span>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            aria-label={`Remove ${channel.name}`}
            className="rounded-pill"
            style={{
              width: 32, height: 32, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)",
              transition: "all var(--dur-base) var(--ease-out)",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${WARN}99`; e.currentTarget.style.color = WARN; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        <NumberField
          label="How much do you spend here each month?"
          value={channel.monthlySpend}
          prefix="$"
          onChange={onSpend}
        />
        <NumberField
          label="How many paying customers does it bring each month?"
          value={channel.customers}
          onChange={v => onChange({ customers: v })}
          hint={
            mode === "pre" && bench
              ? `Estimated from ~${fmtMoney(bench.cac)} per customer. Override if you expect better.`
              : "Count the new paying customers this channel brought last month."
          }
        />
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontFamily: "var(--font-sans)", fontSize: 12.5 }}>
        <span style={{ color: "rgba(255,255,255,0.55)" }}>
          CAC{" "}
          <strong className="tabular" style={{ color: "var(--paper)", fontWeight: 600 }}>{channel.customers > 0 ? fmtMoney(cac) : "n/a"}</strong>
        </span>
        {vs > 0 && (
          <span style={{ color: vs <= 1 ? SUPPORT : WARN }}>
            {vs <= 1 ? `${Math.round((1 - vs) * 100)}% below benchmark` : `${Math.round((vs - 1) * 100)}% above benchmark`}
          </span>
        )}
      </div>
    </div>
  );
}
