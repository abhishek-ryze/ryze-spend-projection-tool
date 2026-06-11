"use client";
import { useState, useCallback } from "react";
import {
  Assumptions, Scenario, PRESETS, calculate, fmt, fmtPct,
} from "@/lib/calculations";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const SCENARIO_META = {
  bear: { label: "Bear", color: "#F95823", desc: "Conservative — low list quality, minimal engagement" },
  base: { label: "Base", color: "#001AFF", desc: "Realistic median across industry benchmarks" },
  bull: { label: "Bull", color: "#B93DF5", desc: "Optimistic — strong execution, warm audiences" },
};

const GOAL = 100;

export default function ProjectionTool() {
  const [scenario, setScenario] = useState<Scenario>("base");
  const [assumptions, setAssumptions] = useState<Assumptions>(PRESETS.base);
  const [customized, setCustomized] = useState(false);

  const results = calculate(assumptions);

  const applyPreset = (s: Scenario) => {
    setScenario(s);
    setAssumptions(PRESETS[s]);
    setCustomized(false);
  };

  const updateField = useCallback(
    <K extends keyof Assumptions>(channel: K, field: keyof Assumptions[K], value: number) => {
      setAssumptions(prev => ({
        ...prev,
        [channel]: { ...prev[channel], [field]: value },
      }));
      setCustomized(true);
    },
    []
  );

  const chartData = [
    { name: "Warm Email", signups: results.channels.warmEmail.signups, color: "#F3BD1A" },
    { name: "Cold Email",  signups: results.channels.coldEmail.signups,  color: "#898BFF" },
    { name: "LinkedIn",   signups: results.channels.linkedin.signups,   color: "#001AFF" },
    { name: "Community",  signups: results.channels.community.signups,  color: "#B93DF5" },
    { name: "Partners",   signups: results.channels.partnership.signups, color: "#EE3DF5" },
    { name: "Referrals",  signups: results.channels.referral.signups,   color: "#F95823" },
  ];

  const goalPct = Math.min(results.vsGoal * 100, 200);
  const onTrack = results.totalSignups >= GOAL;

  return (
    <section id="tool" style={{ background: "var(--ink)" }} className="py-16 md:py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Scenario Selector */}
        <div className="mb-12 md:mb-16">
          <span className="eyebrow mb-4 block">Scenario Presets</span>
          <div className="flex flex-wrap gap-3 mb-6">
            {(["bear", "base", "bull"] as Scenario[]).map(s => (
              <button
                key={s}
                onClick={() => applyPreset(s)}
                className="relative px-6 py-3 rounded-lg font-semibold tracking-[-0.01em] transition-all duration-300 border"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  background: scenario === s && !customized
                    ? SCENARIO_META[s].color
                    : "rgba(255,255,255,0.04)",
                  color: scenario === s && !customized ? "#fff" : "rgba(255,255,255,0.6)",
                  borderColor: scenario === s && !customized
                    ? SCENARIO_META[s].color
                    : "rgba(255,255,255,0.12)",
                  boxShadow: scenario === s && !customized
                    ? `0 0 20px ${SCENARIO_META[s].color}44`
                    : "none",
                }}
              >
                {SCENARIO_META[s].label}
              </button>
            ))}
            {customized && (
              <span
                className="px-5 py-3 rounded-lg border text-sm"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  color: "var(--sun)",
                  borderColor: "rgba(243,189,26,0.3)",
                  background: "rgba(243,189,26,0.06)",
                }}
              >
                Custom
              </span>
            )}
          </div>
          <p style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", fontSize: 14 }}>
            {customized ? "You have custom assumptions applied." : SCENARIO_META[scenario].desc}
          </p>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 md:mb-16">
          <MetricCard
            label="Total Signups (30 days)"
            value={fmt(results.totalSignups)}
            sub={`Goal: ${GOAL}`}
            highlight={onTrack}
            accent={onTrack ? "#B93DF5" : "#F95823"}
          />
          <MetricCard
            label="Activated Users"
            value={fmt(results.activated)}
            sub={`${fmtPct(assumptions.funnel.activationRate)} activation`}
            accent="#001AFF"
          />
          <MetricCard
            label="Day-7 Retained"
            value={fmt(results.d7)}
            sub={`${fmtPct(assumptions.funnel.d7Retention)} of activated`}
            accent="#898BFF"
          />
          <MetricCard
            label="Day-30 Active"
            value={fmt(results.d30)}
            sub={`${fmtPct(assumptions.funnel.d30Retention)} of activated`}
            accent="#F3BD1A"
          />
        </div>

        {/* Goal Progress */}
        <div className="mb-12 md:mb-16 p-5 md:p-6 rounded-xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
              Progress to 100 Signups Goal
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: onTrack ? "#B93DF5" : "var(--paper)" }}>
              {Math.round(results.vsGoal * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(goalPct / 2, 100)}%`,
                background: onTrack
                  ? "linear-gradient(90deg, #001AFF, #B93DF5)"
                  : "linear-gradient(90deg, #F95823, #F4256D)",
                boxShadow: onTrack ? "0 0 12px rgba(0,26,255,0.5)" : "0 0 12px rgba(249,88,35,0.5)",
              }}
            />
          </div>
        </div>

        {/* Main two-column: Assumptions + Channel Results */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-16">
          {/* Left: Assumptions */}
          <div className="xl:col-span-2 space-y-4">
            <span className="eyebrow mb-4 block">Channel Assumptions</span>

            <ChannelCard
              title="Warm Email" number="01"
              description="Nico's past-client list"
              signups={results.channels.warmEmail.signups}
              accentColor="#F3BD1A"
            >
              <NumberInput label="List Size" value={assumptions.warmEmail.listSize} min={0} max={2000} step={10}
                onChange={v => updateField("warmEmail", "listSize", v)} unit="contacts" />
              <PercentInput label="Open Rate" value={assumptions.warmEmail.openRate}
                onChange={v => updateField("warmEmail", "openRate", v)} />
              <PercentInput label="Click-Through (of opens)" value={assumptions.warmEmail.ctr}
                onChange={v => updateField("warmEmail", "ctr", v)} />
              <PercentInput label="Signup Conv. (of clicks)" value={assumptions.warmEmail.signupConv}
                onChange={v => updateField("warmEmail", "signupConv", v)} />
            </ChannelCard>

            <ChannelCard
              title="Cold Email" number="02"
              description="4,200 Seattle homeowners list"
              signups={results.channels.coldEmail.signups}
              accentColor="#898BFF"
            >
              <NumberInput label="List Size" value={assumptions.coldEmail.listSize} min={0} max={10000} step={100}
                onChange={v => updateField("coldEmail", "listSize", v)} unit="contacts" />
              <PercentInput label="Effective Delivery Rate" value={assumptions.coldEmail.deliveryRate}
                onChange={v => updateField("coldEmail", "deliveryRate", v)} />
              <PercentInput label="Open Rate" value={assumptions.coldEmail.openRate}
                onChange={v => updateField("coldEmail", "openRate", v)} />
              <PercentInput label="Click-Through (of opens)" value={assumptions.coldEmail.ctr}
                onChange={v => updateField("coldEmail", "ctr", v)} max={0.20} />
              <PercentInput label="Signup Conv. (of clicks)" value={assumptions.coldEmail.signupConv}
                onChange={v => updateField("coldEmail", "signupConv", v)} />
            </ChannelCard>

            <ChannelCard
              title="LinkedIn Organic" number="03"
              description="4 founders posting for 30 days"
              signups={results.channels.linkedin.signups}
              accentColor="#001AFF"
            >
              <NumberInput label="Total Posts (team)" value={assumptions.linkedin.posts} min={0} max={60} step={1}
                onChange={v => updateField("linkedin", "posts", v)} unit="posts" />
              <NumberInput label="Avg Reach Per Post" value={assumptions.linkedin.avgReach} min={0} max={5000} step={50}
                onChange={v => updateField("linkedin", "avgReach", v)} unit="people" />
              <PercentInput label="CTR to Landing Page" value={assumptions.linkedin.ctr}
                onChange={v => updateField("linkedin", "ctr", v)} max={0.10} />
              <PercentInput label="Signup Conv. (of clicks)" value={assumptions.linkedin.signupConv}
                onChange={v => updateField("linkedin", "signupConv", v)} />
            </ChannelCard>

            <ChannelCard
              title="Community" number="04"
              description="Reddit, FB Groups, Nextdoor, X"
              signups={results.channels.community.signups}
              accentColor="#B93DF5"
            >
              <NumberInput label="Posts Surviving Moderation" value={assumptions.community.postsSurviving} min={0} max={30} step={1}
                onChange={v => updateField("community", "postsSurviving", v)} unit="posts" />
              <NumberInput label="Avg Views Per Post" value={assumptions.community.avgViews} min={0} max={2000} step={10}
                onChange={v => updateField("community", "avgViews", v)} unit="views" />
              <PercentInput label="CTR to Landing" value={assumptions.community.ctr}
                onChange={v => updateField("community", "ctr", v)} max={0.10} />
              <PercentInput label="Signup Conv. (of clicks)" value={assumptions.community.signupConv}
                onChange={v => updateField("community", "signupConv", v)} />
            </ChannelCard>

            <ChannelCard
              title="Partnerships" number="05"
              description="Agents and lenders co-promoting"
              signups={results.channels.partnership.signups}
              accentColor="#EE3DF5"
            >
              <NumberInput label="Partners Contacted" value={assumptions.partnership.partnersContacted} min={0} max={100} step={1}
                onChange={v => updateField("partnership", "partnersContacted", v)} unit="partners" />
              <PercentInput label="% Who Actively Co-Promote" value={assumptions.partnership.activeRate}
                onChange={v => updateField("partnership", "activeRate", v)} />
              <DecimalInput label="Signups Per Active Partner" value={assumptions.partnership.signupsPerPartner} min={0} max={20} step={0.5}
                onChange={v => updateField("partnership", "signupsPerPartner", v)} unit="signups" />
            </ChannelCard>

            <ChannelCard
              title="Referral / Viral" number="06"
              description="K-factor applied to direct signups"
              signups={results.channels.referral.signups}
              accentColor="#F95823"
            >
              <PercentInput label="K-Factor (referrals per signup)" value={assumptions.referral.kFactor}
                onChange={v => updateField("referral", "kFactor", v)} max={0.60} />
              <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                  Applied to the subtotal of all direct channels. Andrew Chen consumer K-factor: 0.1 to 0.3 for non-viral but useful products in first month.
                </p>
              </div>
            </ChannelCard>
          </div>

          {/* Right: Channel Breakdown + Funnel */}
          <div className="space-y-4">
            <span className="eyebrow mb-4 block">Channel Breakdown</span>

            {/* Signup bars per channel */}
            <div className="rounded-xl p-5 md:p-6 border space-y-3" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
              {chartData.map(ch => {
                const pct = results.totalSignups > 0 ? (ch.signups / results.totalSignups) * 100 : 0;
                return (
                  <div key={ch.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "rgba(255,255,255,0.70)" }}>{ch.name}</span>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--paper)" }}>
                        {fmt(ch.signups)}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: ch.color }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="pt-3 mt-3 border-t flex justify-between items-center" style={{ borderColor: "rgba(255,255,255,0.10)" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.50)" }}>Total</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--paper)" }}>{fmt(results.totalSignups)}</span>
              </div>
            </div>

            {/* Funnel Assumptions */}
            <div className="rounded-xl p-5 md:p-6 border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
              <span className="eyebrow mb-4 block" style={{ color: "var(--sun)" }}>Post-Signup Funnel</span>
              <div className="space-y-4">
                <PercentInput label="Activation Rate" value={assumptions.funnel.activationRate}
                  onChange={v => updateField("funnel", "activationRate", v)} />
                <PercentInput label="Day-7 Retention" value={assumptions.funnel.d7Retention}
                  onChange={v => updateField("funnel", "d7Retention", v)} />
                <PercentInput label="Day-30 Retention" value={assumptions.funnel.d30Retention}
                  onChange={v => updateField("funnel", "d30Retention", v)} />
              </div>
            </div>

            {/* Funnel waterfall */}
            <div className="rounded-xl p-5 md:p-6 border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
              <span className="eyebrow mb-5 block">Funnel Stages</span>
              <FunnelWaterfall
                stages={[
                  { label: "Signups", value: results.totalSignups, color: "#001AFF" },
                  { label: "Activated", value: results.activated, color: "#898BFF" },
                  { label: "Day-7", value: results.d7, color: "#B93DF5" },
                  { label: "Day-30", value: results.d30, color: "#F3BD1A" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="mb-16 rounded-xl p-6 md:p-8 border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
          <span className="eyebrow mb-2 block">Signups by Channel</span>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 24 }}>
            Projected signups from each channel under current assumptions
          </p>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12, fontFamily: "var(--font-sans)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "var(--font-sans)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    color: "var(--paper)",
                  }}
                  formatter={(v) => [Math.round(Number(v ?? 0)), "Signups"]}
                />
                <Bar dataKey="signups" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verdict Section */}
        <VerdictSection results={results} totalSignups={results.totalSignups} d30={results.d30} />
      </div>
    </section>
  );
}

function MetricCard({ label, value, sub, highlight, accent }: { label: string; value: string; sub: string; highlight?: boolean; accent: string }) {
  return (
    <div
      className="p-5 md:p-6 rounded-xl border transition-all duration-300"
      style={{
        background: highlight ? "rgba(0,26,255,0.06)" : "rgba(255,255,255,0.02)",
        borderColor: highlight ? `${accent}44` : "rgba(255,255,255,0.08)",
        boxShadow: highlight ? `0 0 30px ${accent}22` : "none",
      }}
    >
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>
        {label}
      </p>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, color: accent, lineHeight: 1, marginBottom: 6 }}>
        {value}
      </p>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "rgba(255,255,255,0.40)" }}>
        {sub}
      </p>
    </div>
  );
}

function ChannelCard({ title, number, description, signups, accentColor, children }: {
  title: string; number: string; description: string; signups: number; accentColor: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
      >
        <div className="flex items-center gap-4">
          <span
            className="w-8 h-8 rounded-lg grid place-items-center shrink-0 text-xs font-bold"
            style={{ background: `${accentColor}22`, color: accentColor, fontFamily: "var(--font-display)" }}
          >
            {number}
          </span>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "var(--paper)", marginBottom: 2 }}>{title}</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "rgba(255,255,255,0.40)" }}>{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: accentColor, lineHeight: 1 }}>
              {fmt(signups)}
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>signups</p>
          </div>
          <svg
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            className="w-4 h-4 transition-transform duration-200"
            style={{ color: "rgba(255,255,255,0.35)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="pt-4 space-y-4">{children}</div>
        </div>
      )}
    </div>
  );
}

function PercentInput({ label, value, onChange, max = 1.0 }: {
  label: string; value: number; onChange: (v: number) => void; max?: number;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{label}</label>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--paper)" }}>
          {(value * 100).toFixed(1)}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={0.005}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max, step, unit }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; unit: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{label}</label>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--paper)" }}>
          {fmt(value)} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseInt(e.target.value, 10))}
        className="w-full"
      />
    </div>
  );
}

function DecimalInput({ label, value, onChange, min, max, step, unit }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; unit: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{label}</label>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--paper)" }}>
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function FunnelWaterfall({ stages }: {
  stages: { label: string; value: number; color: string }[];
}) {
  const max = stages[0].value || 1;
  return (
    <div className="space-y-2.5">
      {stages.map((s, i) => {
        const pct = (s.value / max) * 100;
        const dropPct = i > 0 ? ((stages[i - 1].value - s.value) / (stages[i - 1].value || 1)) * 100 : 0;
        return (
          <div key={s.label}>
            <div className="flex justify-between items-center mb-1.5">
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{s.label}</span>
              <div className="flex items-center gap-3">
                {i > 0 && (
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(255,255,255,0.30)" }}>
                    -{dropPct.toFixed(0)}%
                  </span>
                )}
                <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: s.color }}>{fmt(s.value)}</span>
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: s.color, boxShadow: `0 0 8px ${s.color}66` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VerdictSection({ results, totalSignups, d30 }: {
  results: ReturnType<typeof calculate>; totalSignups: number; d30: number;
}) {
  const rounded = Math.round(totalSignups);
  const d30Rounded = Math.round(d30);

  const insights = [
    {
      n: "01",
      color: rounded >= 100 ? "#B93DF5" : "#F95823",
      title: `${GOAL}-Signup Goal`,
      body: rounded >= 100
        ? `Your model projects ${fmt(totalSignups)} signups, exceeding the 100-signup goal. Strong execution across multiple channels is key to sustaining this.`
        : `Base-case lands at ${fmt(totalSignups)} signups, below the 100-signup target. Closing the gap requires either stronger channel execution or one channel significantly outperforming benchmarks.`,
    },
    {
      n: "02",
      color: "#F3BD1A",
      title: "Active User Reality Check",
      body: `${GOAL} signups does not equal ${GOAL} active users. Day-30 active users under current assumptions: ${fmt(d30)}. Reframe success around D7 and D30 retained users, not raw signups.`,
    },
    {
      n: "03",
      color: "#001AFF",
      title: "Biggest Swing Factors",
      body: "Nico's past-client list quality is the foundation. If fewer than 100 truly warm contacts exist, the warm channel collapses. Partnerships are the only channel with 30+ signup upside from a single win.",
    },
    {
      n: "04",
      color: "#898BFF",
      title: "Cold Email Caution",
      body: "A 4,200-contact consumer blast will trigger deliverability problems immediately. Recommendation: run warm-up sends first, then test small cold batches of 200 to 500 with high-value content only.",
    },
    {
      n: "05",
      color: "#F95823",
      title: "Budget Assessment",
      body: "Sub-$1,000 is realistic for this launch scale. The real constraint is team time (4 people x 30 to 60 min/day for 2 weeks, approximately 60 hours), not money.",
    },
  ];

  return (
    <div className="rounded-xl border p-6 md:p-8" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
      <span className="eyebrow mb-3 block">Honest Assessment</span>
      <p
        className="mb-8"
        style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, maxWidth: "72ch" }}
      >
        Based on industry benchmarks from Mailchimp 2024/25, Buffer/Hootsuite 2025, Andrew Chen / Reforge consumer growth data, and Apollo/Smartlead 2025 reports.
      </p>

      <div className="space-y-5">
        {insights.map(ins => (
          <div key={ins.n} className="flex gap-4 md:gap-6 p-4 md:p-5 rounded-lg border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
            <span
              className="shrink-0 w-8 h-8 rounded-lg grid place-items-center text-xs font-bold mt-0.5"
              style={{ background: `${ins.color}18`, color: ins.color, fontFamily: "var(--font-display)" }}
            >
              {ins.n}
            </span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--paper)", marginBottom: 6 }}>{ins.title}</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{ins.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 md:p-5 rounded-lg border" style={{ borderColor: "rgba(243,189,26,0.25)", background: "rgba(243,189,26,0.05)" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
          <strong style={{ color: "var(--sun)", fontFamily: "var(--font-display)" }}>Bottom Line:</strong> Realistic Base case = {Math.round(results.totalSignups)} signups, {Math.round(results.activated)} activated, {d30Rounded} Day-30 actives. The plan's 100-signup goal is reachable with strong execution. The implied 100-active-user goal requires either an order of magnitude more reach or 5x to 10x better activation than benchmarks suggest.
        </p>
      </div>
    </div>
  );
}
