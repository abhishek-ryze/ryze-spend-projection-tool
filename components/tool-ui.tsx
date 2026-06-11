"use client";
import NumberField from "@/components/ui/NumberField";
import { Channel, seedCustomers, benchmarkFor, fmtMoney } from "@/lib/calculations";

/* ---------------------------------------------------------------------------
   Monotone palette. Blue is the brand (CTA, active, positive); purple shades
   are the only data-viz accent; one muted warning tone for genuinely bad states.
--------------------------------------------------------------------------- */
export const BRAND = "#001AFF";        // electric blue
export const BRAND_BRIGHT = "#4D5CFF"; // brighter blue (chart stroke / hover)
export const PURPLE = "#B93DF5";       // lavender/purple — data accent
export const PURPLE_SOFT = "#DEBAFB";
export const WARN = "#F95823";         // muted ember — bad states only

export const SURFACE = "rgba(255,255,255,0.045)";
export const SURFACE_BORDER = "1px solid rgba(255,255,255,0.09)";
export const DIVIDER = "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 50%, transparent 100%)";

export const ltvColor = (r: number) => (r >= 3 ? BRAND : r >= 1 ? PURPLE : WARN);
export const roiColor = (r: number) => (r >= 0 ? BRAND : WARN);
export const paybackColor = (m: number) => (m > 0 && m <= 12 ? BRAND : WARN);

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
export function Card({ eyebrow, titleA, accent, action, children }: {
  eyebrow: string; titleA: string; accent: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div
      className="bg-ink-soft rounded-xl ring-1-white-10"
      style={{ padding: "clamp(24px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: 28, minWidth: 0 }}
    >
      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="eyebrow-block">{eyebrow}</span>
          <h2
            className="font-display text-paper"
            style={{ fontSize: "clamp(24px, 2.6vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}
          >
            {titleA}{" "}
            <em className="font-serif text-lavender" style={{ fontStyle: "italic", fontWeight: 400, whiteSpace: "nowrap" }}>
              {accent}
            </em>
          </h2>
        </div>
        {action}
      </header>
      {children}
    </div>
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
          <input
            value={channel.name}
            onChange={e => onChange({ name: e.target.value })}
            aria-label="Channel name"
            className="font-display text-paper"
            style={{
              flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none",
              fontSize: 17, fontWeight: 600, padding: "4px 0", borderBottom: "1px solid transparent",
              transition: "border-color var(--dur-base) var(--ease-out)",
            }}
            onFocus={e => (e.currentTarget.style.borderBottomColor = "rgba(0,26,255,0.6)")}
            onBlur={e => (e.currentTarget.style.borderBottomColor = "transparent")}
          />
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
        <NumberField label="Spend / month" value={channel.monthlySpend} prefix="$" onChange={onSpend} />
        <NumberField
          label={mode === "pre" ? "Est. customers / mo" : "Paying customers / mo"}
          value={channel.customers}
          onChange={v => onChange({ customers: v })}
          hint={mode === "pre" && bench ? `Estimated from ~${fmtMoney(bench.cac)} CAC. Adjust if you expect better.` : undefined}
        />
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontFamily: "var(--font-sans)", fontSize: 12.5 }}>
        <span style={{ color: "rgba(255,255,255,0.55)" }}>
          CAC{" "}
          <strong className="tabular" style={{ color: "var(--paper)", fontWeight: 600 }}>{channel.customers > 0 ? fmtMoney(cac) : "n/a"}</strong>
        </span>
        {vs > 0 && (
          <span style={{ color: vs <= 1 ? BRAND_BRIGHT : WARN }}>
            {vs <= 1 ? `${Math.round((1 - vs) * 100)}% below benchmark` : `${Math.round((vs - 1) * 100)}% above benchmark`}
          </span>
        )}
      </div>
    </div>
  );
}
