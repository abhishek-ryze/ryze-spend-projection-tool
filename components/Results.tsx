"use client";
import { useState } from "react";
import NumberField from "@/components/ui/NumberField";
import {
  Card, ChannelEditor, Kpi, BRAND_BRIGHT, SUPPORT, PURPLE, WARN,
  SURFACE, SURFACE_BORDER, DIVIDER, purpleShade, ltvColor, roiColor, paybackColor,
} from "@/components/tool-ui";
import {
  Model, Channel, ProjectionResult,
  fmt, fmtMoney, fmtPct, fmtRatio,
} from "@/lib/calculations";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Results({
  model, results, onGlobal, onChannel, onAddChannel, onRemoveChannel, onRestart,
}: {
  model: Model;
  results: ProjectionResult;
  onGlobal: (field: keyof Model["global"], v: number) => void;
  onChannel: (id: string, patch: Partial<Channel>) => void;
  onAddChannel: () => void;
  onRemoveChannel: (id: string) => void;
  onRestart: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const isPre = model.stage === "pre";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Top bar: restart + adjust */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap" }}>
        <PillAction label={editing ? "Hide inputs" : "Adjust inputs"} onClick={() => setEditing(e => !e)} />
        <PillAction label="Start over" onClick={onRestart} />
      </div>

      {/* Quick-edit panel */}
      {editing && (
        <Card eyebrow="Adjust" titleA="Tweak your" accent="numbers">
          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
            <NumberField label="Price / customer / mo" value={model.global.arpu} prefix="$" onChange={v => onGlobal("arpu", v)} />
            <NumberField label="Gross margin" value={model.global.grossMargin} suffix="%" onChange={v => onGlobal("grossMargin", v)} />
            <NumberField label="Monthly churn" value={model.global.churnRate} suffix="%" onChange={v => onGlobal("churnRate", v)} />
            <NumberField label="Spend growth / mo" value={model.global.spendGrowth} suffix="%" onChange={v => onGlobal("spendGrowth", v)} />
          </div>
          <div style={{ height: 1, background: DIVIDER }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {model.channels.map(ch => (
              <ChannelEditor key={ch.id} channel={ch} mode={isPre ? "pre" : "actual"}
                onChange={patch => onChannel(ch.id, patch)} onRemove={() => onRemoveChannel(ch.id)} />
            ))}
            <button
              onClick={onAddChannel}
              className="rounded-pill"
              style={{
                alignSelf: "flex-start", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600,
                color: "var(--paper)", padding: "11px 22px", background: "rgba(0,26,255,0.14)", border: "1px solid rgba(0,26,255,0.55)",
              }}
            >
              + Add channel
            </button>
          </div>
        </Card>
      )}

      {/* KPI cards */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <Kpi label="Blended CAC" value={fmtMoney(results.blendedCac)} sub={`${fmt(results.newCustomersPerMonth)} customers / mo`} />
        <Kpi label="LTV : CAC" value={fmtRatio(results.ltvCac)} sub={results.ltvCac >= 3 ? "Healthy" : results.ltvCac >= 1 ? "Workable" : "Underwater"} accent={ltvColor(results.ltvCac)} />
        <Kpi label="Ending MRR (mo 12)" value={fmtMoney(results.endingMrr)} sub={`${fmtMoney(results.arr)} ARR`} accent={SUPPORT} highlight />
        <Kpi label="12-mo ROI" value={fmtPct(results.roi, 0)} sub={results.breakEvenMonth > 0 ? `Break-even mo ${results.breakEvenMonth}` : "No break-even in 12 mo"} accent={roiColor(results.roi)} />
      </div>

      {/* Where to spend — the headline answer */}
      <WhereToSpend results={results} />

      {/* 12-month projection */}
      <Card eyebrow="Projection" titleA="Twelve months," accent="of momentum">
        <ProjectionChart results={results} />
      </Card>

      {/* Channel breakdown */}
      <Card eyebrow="Breakdown" titleA="Customers &amp; CAC" accent="by channel">
        <Breakdown results={results} />
      </Card>

      {/* Insights */}
      <Insights results={results} />
    </div>
  );
}

function PillAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-pill"
      style={{
        cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600, padding: "10px 20px",
        background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.16)",
        transition: "all var(--dur-base) var(--ease-out)",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(0,26,255,0.6)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)")}
    >
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------------- */
/* Where to spend                                                            */
/* ------------------------------------------------------------------------- */
function WhereToSpend({ results }: { results: ProjectionResult }) {
  const ranked = [...results.channels]
    .filter(c => c.customers > 0)
    .sort((a, b) => a.cac - b.cac);
  const rec = results.recommendation;
  const n = ranked.length;

  return (
    <Card eyebrow="Where to spend" titleA="Your next dollar" accent="works hardest here">
      {ranked.length === 0 ? (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#b3b3b3" }}>
          Add channels with customers to see a ranking.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ranked.map((c, i) => {
            const isBest = i === 0;
            const isWorst = i === n - 1 && n > 1;
            const tag = isBest ? "Most efficient" : isWorst ? "Least efficient" : "";
            const tagColor = isBest ? SUPPORT : isWorst ? WARN : "rgba(255,255,255,0.5)";
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderRadius: 14, border: SURFACE_BORDER, background: SURFACE }}>
                <span className="tabular" style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: purpleShade(n > 1 ? i / (n - 1) : 0), width: 22 }}>{String(i + 1).padStart(2, "0")}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="font-display text-paper" style={{ fontSize: 15.5, fontWeight: 600 }}>{c.name}</p>
                  {tag && <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: tagColor, marginTop: 2 }}>{tag}</p>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <p className="tabular" style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--paper)" }}>{fmtMoney(c.cac)}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>CAC</p>
                </div>
                <div style={{ textAlign: "right", minWidth: 64 }}>
                  <p className="tabular" style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: SUPPORT }}>{fmtRatio(c.returnMultiple)}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>return</p>
                </div>
              </div>
            );
          })}

          <div style={{ padding: "18px 22px", borderRadius: 16, border: "1px solid rgba(0,26,255,0.32)", background: "rgba(0,26,255,0.08)", marginTop: 4 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--paper)", fontFamily: "var(--font-display)" }}>Recommendation: </strong>
              {rec.hasMove
                ? `Shift ${fmtMoney(rec.amount)} from ${rec.worstName} to ${rec.bestName} and you gain about ${fmt(rec.deltaCustomers)} more customers a month at the same total spend. Keep feeding the channels at the top of this list.`
                : `${ranked[0].name} is your most efficient channel at ${fmtMoney(ranked[0].cac)} CAC. Put incremental budget there until its CAC starts climbing, then diversify.`}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------------- */
/* Chart                                                                     */
/* ------------------------------------------------------------------------- */
function ProjectionChart({ results }: { results: ProjectionResult }) {
  const data = results.series.map(r => ({ name: `M${r.month}`, mrr: Math.round(r.mrr) }));
  return (
    <div style={{ height: 300, width: "100%", minWidth: 0, overflow: "hidden" }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 800, height: 300 }}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BRAND_BRIGHT} stopOpacity={0.5} />
              <stop offset="100%" stopColor={PURPLE} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "var(--font-sans)" }} />
          <YAxis axisLine={false} tickLine={false} width={56} tickFormatter={(v) => fmtMoney(Number(v))} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "var(--font-sans)" }} />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.2)" }}
            contentStyle={{ background: "#15151d", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--paper)" }}
            labelStyle={{ color: "rgba(255,255,255,0.6)", marginBottom: 4 }}
            formatter={(v: number | string) => [fmtMoney(Number(v)), "MRR"]}
          />
          <Area type="monotone" dataKey="mrr" stroke={BRAND_BRIGHT} strokeWidth={2.5} fill="url(#mrrFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Breakdown                                                                 */
/* ------------------------------------------------------------------------- */
function Breakdown({ results }: { results: ProjectionResult }) {
  const max = Math.max(...results.channels.map(c => c.customers), 1);
  const sorted = [...results.channels].sort((a, b) => b.customers - a.customers);
  if (results.channels.length === 0) {
    return <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#b3b3b3" }}>No channels to break down.</p>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {sorted.map((c, i) => (
        <div key={c.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "rgba(255,255,255,0.78)" }}>{c.name}</span>
            <span style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{c.customers > 0 ? `${fmtMoney(c.cac)} CAC` : "n/a"}</span>
              <span className="tabular" style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--paper)", minWidth: 36, textAlign: "right" }}>{fmt(c.customers)}</span>
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 999, width: `${(c.customers / max) * 100}%`, background: purpleShade(sorted.length > 1 ? i / (sorted.length - 1) : 0), transition: "width var(--dur-slow) var(--ease-out)" }} />
          </div>
        </div>
      ))}
      <div style={{ height: 1, background: DIVIDER, marginTop: 4 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>Total / month</span>
        <span className="tabular" style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--paper)" }}>{fmt(results.newCustomersPerMonth)}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Insights                                                                  */
/* ------------------------------------------------------------------------- */
function Insights({ results }: { results: ProjectionResult }) {
  const insights: { n: string; color: string; title: string; body: string }[] = [];

  insights.push({
    n: "01", color: ltvColor(results.ltvCac), title: "Unit economics",
    body: results.ltvCac >= 3
      ? `At ${fmtRatio(results.ltvCac)} LTV:CAC, every $1 of acquisition returns about ${fmtMoney(results.ltv)} in gross lifetime value. Healthy enough to scale.`
      : results.ltvCac >= 1
        ? `${fmtRatio(results.ltvCac)} LTV:CAC is workable but thin. Below the roughly 3x rule of thumb, lift price, retention, or efficiency before scaling spend.`
        : `${fmtRatio(results.ltvCac)} LTV:CAC means you lose money per customer. CAC of ${fmtMoney(results.blendedCac)} exceeds the ${fmtMoney(results.ltv)} a customer is worth.`,
  });

  insights.push({
    n: "02", color: paybackColor(results.paybackMonths), title: "CAC payback",
    body: results.paybackMonths <= 0
      ? `No customers are being acquired yet, so there is nothing to pay back.`
      : results.paybackMonths <= 12
        ? `You recover the ${fmtMoney(results.blendedCac)} CAC in ${results.paybackMonths.toFixed(1)} months of gross margin, inside what most early budgets can carry.`
        : `It takes ${results.paybackMonths.toFixed(1)} months to recover CAC, longer than most runways tolerate. Cheaper acquisition or higher price is needed.`,
  });

  insights.push({
    n: "03", color: SUPPORT, title: "12-month outcome",
    body: `You spend ${fmtMoney(results.total12Spend)} over the year to reach ${fmtMoney(results.endingMrr)} MRR (${fmtMoney(results.arr)} ARR). ${results.breakEvenMonth > 0 ? `Cumulative revenue overtakes spend in month ${results.breakEvenMonth}.` : `Revenue does not overtake spend within 12 months.`}`,
  });

  return (
    <Card eyebrow="Read-out" titleA="The honest" accent="read-out">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {insights.map(ins => (
          <div key={ins.n} style={{ display: "flex", gap: 18, padding: "18px 20px", borderRadius: 16, border: SURFACE_BORDER, background: SURFACE }}>
            <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, background: `${ins.color}26`, color: ins.color, marginTop: 2 }}>{ins.n}</span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 15.5, fontWeight: 600, color: "var(--paper)", marginBottom: 6 }}>{ins.title}</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.65 }}>{ins.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
