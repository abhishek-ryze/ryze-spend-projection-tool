"use client";
import { useState, useCallback } from "react";
import NumberField from "@/components/ui/NumberField";
import {
  Model, Scenario, Channel, ProjectionResult,
  clonePreset, newChannel, calculate,
  fmt, fmtMoney, fmtPct, fmtRatio,
} from "@/lib/calculations";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const SCENARIO_META: Record<Scenario, { label: string; color: string; desc: string }> = {
  bear:  { label: "Bear",  color: "#F95823", desc: "Conservative — expensive leads, soft conversion, higher churn." },
  base:  { label: "Base",  color: "#001AFF", desc: "Realistic median across typical early-stage GTM benchmarks." },
  bull:  { label: "Bull",  color: "#B93DF5", desc: "Optimistic — efficient acquisition, strong retention, fast scaling." },
};

const CHANNEL_COLORS = ["#001AFF", "#B93DF5", "#F3BD1A", "#F95823", "#EE3DF5", "#898BFF", "#22c55e"];
const colorFor = (i: number) => CHANNEL_COLORS[i % CHANNEL_COLORS.length];

const DIVIDER = "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)";

export default function ProjectionTool() {
  const [scenario, setScenario] = useState<Scenario>("base");
  const [model, setModel] = useState<Model>(() => clonePreset("base"));
  const [customized, setCustomized] = useState(false);

  const results = calculate(model);

  const applyScenario = (s: Scenario) => {
    setScenario(s);
    setModel(clonePreset(s));
    setCustomized(false);
  };

  const updateGlobal = useCallback((field: keyof Model["global"], value: number) => {
    setModel(prev => ({ ...prev, global: { ...prev.global, [field]: value } }));
    setCustomized(true);
  }, []);

  const updateChannel = useCallback((id: string, patch: Partial<Channel>) => {
    setModel(prev => ({
      ...prev,
      channels: prev.channels.map(c => (c.id === id ? { ...c, ...patch } : c)),
    }));
    setCustomized(true);
  }, []);

  const addChannel = useCallback(() => {
    setModel(prev => ({ ...prev, channels: [...prev.channels, newChannel()] }));
    setCustomized(true);
  }, []);

  const removeChannel = useCallback((id: string) => {
    setModel(prev => ({ ...prev, channels: prev.channels.filter(c => c.id !== id) }));
    setCustomized(true);
  }, []);

  return (
    <section id="tool" style={{ background: "var(--ink)" }} className="px-4 md:px-8" >
      <div
        className="mx-auto"
        style={{ maxWidth: 1180, paddingBlock: "clamp(64px, 9vw, 120px)", display: "flex", flexDirection: "column", gap: 24 }}
      >

        {/* ---- Scenario selector ---------------------------------------- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span className="eyebrow-block">Scenario</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            {(Object.keys(SCENARIO_META) as Scenario[]).map(s => {
              const active = scenario === s && !customized;
              return (
                <button
                  key={s}
                  onClick={() => applyScenario(s)}
                  className="rounded-pill"
                  style={{
                    fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600,
                    padding: "10px 22px", cursor: "pointer",
                    transition: "all var(--dur-base) var(--ease-out)",
                    background: active ? SCENARIO_META[s].color : "rgba(255,255,255,0.04)",
                    color: active ? "#fff" : "rgba(255,255,255,0.65)",
                    border: `1px solid ${active ? SCENARIO_META[s].color : "rgba(255,255,255,0.14)"}`,
                    boxShadow: active ? `0 0 24px ${SCENARIO_META[s].color}55` : "none",
                  }}
                >
                  {SCENARIO_META[s].label}
                </button>
              );
            })}
            {customized && (
              <span
                className="rounded-pill"
                style={{
                  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, padding: "8px 18px",
                  color: "var(--sun)", border: "1px solid rgba(243,189,26,0.35)", background: "rgba(243,189,26,0.08)",
                }}
              >
                Custom
              </span>
            )}
          </div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
            {customized ? "Your edited assumptions are applied. Pick a scenario to reset." : SCENARIO_META[scenario].desc}
          </p>
        </div>

        {/* ---- KPI cards ------------------------------------------------- */}
        <KpiRow results={results} />

        {/* ---- 12-month projection chart -------------------------------- */}
        <Card eyebrow="Projection" titleA="Twelve months," accent="of momentum" titleB="">
          <ProjectionChart results={results} />
        </Card>

        {/* ---- Business model + Channels -------------------------------- */}
        <Card eyebrow="Business Model" titleA="What a customer" accent="is worth" titleB="">
          <div
            style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}
          >
            <NumberField label="ARPU / month" value={model.global.arpu} prefix="$"
              onChange={v => updateGlobal("arpu", v)} hint="Avg recurring revenue per customer." />
            <NumberField label="Gross margin" value={model.global.grossMargin} suffix="%"
              onChange={v => updateGlobal("grossMargin", v)} hint="Revenue left after cost to serve." />
            <NumberField label="Monthly churn" value={model.global.churnRate} suffix="%"
              onChange={v => updateGlobal("churnRate", v)} hint="Share of customers lost each month." />
            <NumberField label="Spend growth / mo" value={model.global.spendGrowth} suffix="%"
              onChange={v => updateGlobal("spendGrowth", v)} hint="How fast you scale budget." />
          </div>
        </Card>

        <Card eyebrow="Channels" titleA="Where the" accent="budget goes" titleB="">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {results.channels.length === 0 && (
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#b3b3b3" }}>
                No channels yet. Add one to start projecting.
              </p>
            )}
            {model.channels.map((ch, i) => (
              <ChannelRow
                key={ch.id}
                channel={ch}
                result={results.channels.find(r => r.id === ch.id)!}
                color={colorFor(i)}
                onChange={patch => updateChannel(ch.id, patch)}
                onRemove={() => removeChannel(ch.id)}
              />
            ))}
            <button
              onClick={addChannel}
              className="rounded-pill"
              style={{
                alignSelf: "flex-start", marginTop: 4, cursor: "pointer",
                fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--paper)",
                padding: "11px 22px", background: "rgba(0,26,255,0.12)",
                border: "1px solid rgba(0,26,255,0.5)",
                transition: "all var(--dur-base) var(--ease-out)",
              }}
            >
              + Add channel
            </button>
          </div>
        </Card>

        {/* ---- Channel breakdown ---------------------------------------- */}
        <Card eyebrow="Breakdown" titleA="Customers &amp; CAC" accent="by channel" titleB="">
          <ChannelBreakdown results={results} />
        </Card>

        {/* ---- Insights ------------------------------------------------- */}
        <Insights results={results} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* Card shell                                                                */
/* ------------------------------------------------------------------------- */
function Card({ eyebrow, titleA, accent, titleB, children }: {
  eyebrow: string; titleA: string; accent: string; titleB: string; children: React.ReactNode;
}) {
  return (
    <div
      className="bg-ink-soft rounded-xl ring-1-white-10"
      style={{ padding: "clamp(24px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: 28, minWidth: 0 }}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span className="eyebrow-block">{eyebrow}</span>
        <h2
          className="font-display text-paper"
          style={{ fontSize: "clamp(24px, 2.6vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}
        >
          {titleA}{" "}
          <em className="font-serif text-lavender" style={{ fontStyle: "italic", fontWeight: 400, whiteSpace: "nowrap" }}>
            {accent}
          </em>
          {titleB ? ` ${titleB}` : ""}
        </h2>
      </header>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* KPI cards                                                                 */
/* ------------------------------------------------------------------------- */
function KpiRow({ results }: { results: ProjectionResult }) {
  const ltvHealth =
    results.ltvCac >= 3 ? "#B93DF5" : results.ltvCac >= 1 ? "#F3BD1A" : "#F95823";
  const roiHealth = results.roi >= 0 ? "#22c55e" : "#F95823";
  const paybackHealth = results.paybackMonths > 0 && results.paybackMonths <= 12 ? "#898BFF" : "#F95823";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <Kpi label="Ending MRR (mo 12)" value={fmtMoney(results.endingMrr)} sub={`${fmtMoney(results.arr)} ARR`} accent="#001AFF" highlight />
        <Kpi label="New customers / mo" value={fmt(results.newCustomersPerMonth)} sub={`${fmtMoney(results.monthlySpend)} spend / mo`} accent="#898BFF" />
        <Kpi label="Blended CAC" value={fmtMoney(results.blendedCac)} sub={`LTV ${fmtMoney(results.ltv)}`} accent="#EE3DF5" />
        <Kpi label="LTV : CAC" value={fmtRatio(results.ltvCac)} sub={results.ltvCac >= 3 ? "Healthy" : results.ltvCac >= 1 ? "Workable" : "Underwater"} accent={ltvHealth} highlight />
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        <KpiSmall label="CAC Payback" value={results.paybackMonths > 0 ? `${results.paybackMonths.toFixed(1)} mo` : "—"} accent={paybackHealth} />
        <KpiSmall label="12-mo Spend" value={fmtMoney(results.total12Spend)} accent="#F3BD1A" />
        <KpiSmall label="12-mo Revenue" value={fmtMoney(results.total12Revenue)} accent="#B93DF5" />
        <KpiSmall label="12-mo ROI" value={fmtPct(results.roi, 0)} accent={roiHealth} />
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, accent, highlight }: { label: string; value: string; sub: string; accent: string; highlight?: boolean }) {
  return (
    <div
      className="bg-ink-soft rounded-xl ring-1-white-10"
      style={{
        padding: "24px 26px",
        background: highlight ? `${accent}10` : "var(--ink-soft)",
        boxShadow: highlight ? `0 0 34px ${accent}22` : "none",
      }}
    >
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 12 }}>{label}</p>
      <p className="tabular" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.9rem, 3vw, 2.4rem)", fontWeight: 700, color: accent, lineHeight: 1, marginBottom: 8 }}>{value}</p>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "rgba(255,255,255,0.42)" }}>{sub}</p>
    </div>
  );
}

function KpiSmall({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl" style={{ padding: "18px 20px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{label}</p>
      <p className="tabular" style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: accent, lineHeight: 1 }}>{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Channel row                                                               */
/* ------------------------------------------------------------------------- */
function ChannelRow({ channel, result, color, onChange, onRemove }: {
  channel: Channel;
  result: { customers: number; cac: number };
  color: string;
  onChange: (patch: Partial<Channel>) => void;
  onRemove: () => void;
}) {
  return (
    <div style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.018)", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: color, boxShadow: `0 0 10px ${color}aa`, flexShrink: 0 }} />
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
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <p className="tabular" style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color, lineHeight: 1 }}>{fmt(result.customers)}</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>customers/mo</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p className="tabular" style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--paper)", lineHeight: 1 }}>{result.customers > 0 ? fmtMoney(result.cac) : "—"}</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>CAC</p>
          </div>
          <button
            onClick={onRemove}
            aria-label={`Remove ${channel.name}`}
            className="rounded-pill"
            style={{
              width: 32, height: 32, display: "grid", placeItems: "center", cursor: "pointer",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)", flexShrink: 0,
              transition: "all var(--dur-base) var(--ease-out)",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,88,35,0.6)"; e.currentTarget.style.color = "#F95823"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        <NumberField label="Spend / month" value={channel.monthlySpend} prefix="$" onChange={v => onChange({ monthlySpend: v })} />
        <NumberField label="Cost / lead" value={channel.cpl} prefix="$" onChange={v => onChange({ cpl: v })} />
        <NumberField label="Lead → customer" value={channel.convRate} suffix="%" onChange={v => onChange({ convRate: v })} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* 12-month projection chart                                                 */
/* ------------------------------------------------------------------------- */
function ProjectionChart({ results }: { results: ProjectionResult }) {
  const data = results.series.map(r => ({
    name: `M${r.month}`,
    mrr: Math.round(r.mrr),
    customers: Math.round(r.activeCustomers),
    spend: Math.round(r.spend),
  }));

  return (
    <div style={{ height: 300, width: "100%", minWidth: 0, overflow: "hidden" }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 800, height: 300 }}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#001AFF" stopOpacity={0.55} />
              <stop offset="55%" stopColor="#B93DF5" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#B93DF5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12, fontFamily: "var(--font-sans)" }} />
          <YAxis axisLine={false} tickLine={false} width={56}
            tickFormatter={(v) => fmtMoney(Number(v))}
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "var(--font-sans)" }} />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.18)" }}
            contentStyle={{ background: "#15151d", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--paper)" }}
            labelStyle={{ color: "rgba(255,255,255,0.55)", marginBottom: 4 }}
            formatter={(v, name) => {
              if (name === "mrr") return [fmtMoney(Number(v)), "MRR"];
              return [v, name];
            }}
          />
          <Area type="monotone" dataKey="mrr" stroke="#7B7DFD" strokeWidth={2.5} fill="url(#mrrFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Channel breakdown bars                                                    */
/* ------------------------------------------------------------------------- */
function ChannelBreakdown({ results }: { results: ProjectionResult }) {
  const max = Math.max(...results.channels.map(c => c.customers), 1);
  if (results.channels.length === 0) {
    return <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#b3b3b3" }}>Add a channel to see the breakdown.</p>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {results.channels.map((c, i) => (
        <div key={c.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "rgba(255,255,255,0.72)" }}>{c.name}</span>
            <span style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{c.customers > 0 ? `${fmtMoney(c.cac)} CAC` : "—"}</span>
              <span className="tabular" style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--paper)", minWidth: 36, textAlign: "right" }}>{fmt(c.customers)}</span>
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 999, width: `${(c.customers / max) * 100}%`, background: colorFor(i), boxShadow: `0 0 10px ${colorFor(i)}66`, transition: "width var(--dur-slow) var(--ease-out)" }} />
          </div>
        </div>
      ))}
      <div style={{ height: 1, background: DIVIDER, marginTop: 4 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Total / month</span>
        <span className="tabular" style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--paper)" }}>{fmt(results.newCustomersPerMonth)}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Dynamic insights                                                          */
/* ------------------------------------------------------------------------- */
function Insights({ results }: { results: ProjectionResult }) {
  const active = results.channels.filter(c => c.customers > 0);
  const best = active.length ? active.reduce((a, b) => (b.cac < a.cac ? b : a)) : null;
  const worst = active.length ? active.reduce((a, b) => (b.cac > a.cac ? b : a)) : null;
  const topShare = results.channels.length ? results.channels.reduce((a, b) => (b.sharePct > a.sharePct ? b : a)) : null;

  const insights: { n: string; color: string; title: string; body: string }[] = [];

  insights.push({
    n: "01", color: results.ltvCac >= 3 ? "#B93DF5" : results.ltvCac >= 1 ? "#F3BD1A" : "#F95823",
    title: "Unit economics",
    body: results.ltvCac >= 3
      ? `At ${fmtRatio(results.ltvCac)} LTV:CAC, every $1 of acquisition returns about ${fmtMoney(results.ltv)} in gross lifetime value per customer — healthy enough to pour fuel on.`
      : results.ltvCac >= 1
        ? `${fmtRatio(results.ltvCac)} LTV:CAC is workable but thin. Below the ~3× rule of thumb, scaling spend amplifies a fragile margin. Lift conversion, ARPU, or retention before pressing harder.`
        : `${fmtRatio(results.ltvCac)} LTV:CAC means you lose money on every customer — CAC of ${fmtMoney(results.blendedCac)} exceeds the ${fmtMoney(results.ltv)} a customer is worth. Fix the funnel before adding budget.`,
  });

  insights.push({
    n: "02", color: results.paybackMonths > 0 && results.paybackMonths <= 12 ? "#001AFF" : "#F95823",
    title: "CAC payback",
    body: results.paybackMonths <= 0
      ? `No customers are being acquired, so there's nothing to pay back yet.`
      : results.paybackMonths <= 12
        ? `You recover the ${fmtMoney(results.blendedCac)} blended CAC in ${results.paybackMonths.toFixed(1)} months of gross margin — inside the 12-month window most early-stage budgets can carry.`
        : `It takes ${results.paybackMonths.toFixed(1)} months to recover CAC — longer than most runways tolerate. Either cheaper acquisition or higher gross-margin ARPU is needed.`,
  });

  if (best && worst && best.id !== worst.id) {
    insights.push({
      n: "03", color: "#898BFF",
      title: "Channel efficiency",
      body: `Your cheapest customers come from ${best.name} at ${fmtMoney(best.cac)} CAC, while ${worst.name} costs ${fmtMoney(worst.cac)} — a ${fmtRatio(worst.cac / Math.max(best.cac, 1))} gap. Shifting budget toward the efficient end lowers blended CAC fast.`,
    });
  }

  if (topShare) {
    const conc = topShare.sharePct >= 50;
    insights.push({
      n: insights.length < 3 ? "03" : "04", color: conc ? "#F3BD1A" : "#EE3DF5",
      title: conc ? "Concentration risk" : "Channel mix",
      body: conc
        ? `${Math.round(topShare.sharePct)}% of new customers come from ${topShare.name} alone. One channel carrying the plan is a single point of failure — diversify before it saturates.`
        : `Your acquisition is reasonably spread, with ${topShare.name} leading at ${Math.round(topShare.sharePct)}% of new customers. No single channel is a make-or-break dependency.`,
    });
  }

  insights.push({
    n: String(insights.length + 1).padStart(2, "0"), color: "#001AFF",
    title: "12-month outcome",
    body: `On these assumptions you spend ${fmtMoney(results.total12Spend)} over the year to reach ${fmtMoney(results.endingMrr)} MRR (${fmtMoney(results.arr)} ARR). ${results.breakEvenMonth > 0
      ? `Cumulative revenue overtakes cumulative spend in month ${results.breakEvenMonth}.`
      : `Cumulative revenue does not overtake spend within 12 months — extend the horizon or tighten CAC.`}`,
  });

  return (
    <div className="bg-ink-soft rounded-xl ring-1-white-10" style={{ padding: "clamp(24px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: 24 }}>
      <header style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span className="eyebrow-block">Read-out</span>
        <h2 className="font-display text-paper" style={{ fontSize: "clamp(24px, 2.6vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          The honest{" "}
          <em className="font-serif text-lavender" style={{ fontStyle: "italic", fontWeight: 400, whiteSpace: "nowrap" }}>read-out</em>
        </h2>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {insights.map(ins => (
          <div key={ins.n} style={{ display: "flex", gap: 18, padding: "18px 20px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.012)" }}>
            <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, background: `${ins.color}1c`, color: ins.color, marginTop: 2 }}>{ins.n}</span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 15.5, fontWeight: 600, color: "var(--paper)", marginBottom: 6 }}>{ins.title}</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(255,255,255,0.58)", lineHeight: 1.65 }}>{ins.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "18px 22px", borderRadius: 16, border: "1px solid rgba(0,26,255,0.28)", background: "rgba(0,26,255,0.06)" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.65 }}>
          <strong style={{ color: "var(--paper)", fontFamily: "var(--font-display)" }}>Bottom line: </strong>
          {fmt(results.newCustomersPerMonth)} new customers/month at {fmtMoney(results.blendedCac)} blended CAC compounds to {fmtMoney(results.endingMrr)} MRR by month 12 — a {fmtRatio(results.ltvCac)} LTV:CAC business returning {fmtPct(results.roi, 0)} on a year of spend.
        </p>
      </div>
    </div>
  );
}
