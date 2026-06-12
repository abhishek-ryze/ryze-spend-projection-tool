"use client";
import { useState } from "react";
import NumberField from "@/components/ui/NumberField";
import { Card, ChannelEditor, BRAND, SURFACE, SURFACE_BORDER } from "@/components/tool-ui";
import {
  Model, Stage, Channel, CHANNEL_BENCHMARKS, benchmarkExample,
} from "@/lib/calculations";

const STAGE_META: { key: Stage; label: string; desc: string; consequence: string }[] = [
  {
    key: "pre",
    label: "Pre-launch",
    desc: "No customers yet.",
    consequence: "We'll estimate customers from industry benchmarks; you set the budget.",
  },
  {
    key: "post",
    label: "Post-launch",
    desc: "Live with early traction.",
    consequence: "Enter what you actually spend and how many customers each channel brings.",
  },
  {
    key: "established",
    label: "Established",
    desc: "Running for a while.",
    consequence: "Tune where the budget goes and compare against benchmarks.",
  },
];

type Cadence = "monthly" | "annual";

export default function Questionnaire({
  model, onStage, onGlobal, onChannel, onRemoveChannel, onToggleBenchmark, onSubmit,
}: {
  model: Model;
  onStage: (s: Stage) => void;
  onGlobal: (field: keyof Model["global"], v: number) => void;
  onChannel: (id: string, patch: Partial<Channel>) => void;
  onAddChannel: () => void;
  onRemoveChannel: (id: string) => void;
  onToggleBenchmark: (name: string) => void;
  onSubmit: () => void;
}) {
  const isPre = model.stage === "pre";
  const hasUsableChannel = model.channels.some(c => c.monthlySpend > 0 && c.customers > 0);

  // Display-only billing cadence. Underlying global.arpu always stores monthly.
  const [cadence, setCadence] = useState<Cadence>("monthly");
  const priceDisplay = cadence === "annual" ? model.global.arpu * 12 : model.global.arpu;
  const onPriceChange = (v: number) => onGlobal("arpu", cadence === "annual" ? Math.round(v / 12) : v);

  const channelIntro =
    model.stage === "pre"
      ? "Pick the channels you plan to try. We'll estimate customers from typical cost-per-customer."
      : model.stage === "post"
      ? "Pick the channels you're actually running, then enter what they spend and bring."
      : "Pick the channels in your mix. Adjust budget and customers to match reality.";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Step 1 — Journey stage */}
      <Card eyebrow="Step 1" titleA="Where are you in the" accent="journey">
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {STAGE_META.map(s => {
            const active = model.stage === s.key;
            return (
              <button
                key={s.key}
                onClick={() => onStage(s.key)}
                className="rounded-xl"
                style={{
                  textAlign: "left", cursor: "pointer", padding: "18px 20px",
                  background: active ? "rgba(0,26,255,0.12)" : SURFACE,
                  border: active ? `1px solid ${BRAND}` : SURFACE_BORDER,
                  boxShadow: active ? `0 0 26px ${BRAND}33` : "none",
                  transition: "all var(--dur-base) var(--ease-out)",
                  display: "flex", flexDirection: "column", gap: 8,
                }}
              >
                <p className="font-display text-paper" style={{ fontSize: 17, fontWeight: 700 }}>{s.label}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{s.desc}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: active ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, fontStyle: "italic" }}>
                  {s.consequence}
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Step 2 — Business basics */}
      <Card eyebrow="Step 2" titleA="What a customer" accent="is worth">
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {/* Price + cadence toggle */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <NumberField
              label="How much does one customer pay you?"
              value={priceDisplay}
              prefix="$"
              onChange={onPriceChange}
              hint={
                cadence === "annual"
                  ? "Enter the annual contract value, e.g. $1,200/yr. We'll convert to monthly."
                  : "Enter what they pay per month, e.g. a $50/mo plan."
              }
            />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: 4, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 999, alignSelf: "flex-start" }}>
              {(["monthly", "annual"] as Cadence[]).map(c => {
                const on = cadence === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCadence(c)}
                    className="rounded-pill"
                    style={{
                      cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 600,
                      height: 30, padding: "0 14px",
                      lineHeight: "30px",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      background: on ? BRAND : "transparent",
                      color: on ? "#fff" : "rgba(255,255,255,0.65)",
                      border: "none",
                      transition: "all var(--dur-base) var(--ease-out)",
                    }}
                  >
                    {c === "monthly" ? "Monthly" : "Annual"}
                  </button>
                );
              })}
            </div>
          </div>

          <NumberField
            label="For every $100 you charge, how much is left?"
            value={model.global.grossMargin}
            suffix="%"
            onChange={v => onGlobal("grossMargin", v)}
            hint="After hosting, payments, and the people who deliver the service. Not sure? 70% is typical for software."
          />
          <NumberField
            label="Out of 100 customers, how many cancel each month?"
            value={model.global.churnRate}
            suffix="%"
            onChange={v => onGlobal("churnRate", v)}
            hint="A normal SaaS range is 2–5. We multiply this each month to project who stays."
          />
        </div>
      </Card>

      {/* Step 3 — Channels */}
      <Card eyebrow="Step 3" titleA={isPre ? "Which channels will you" : "What each channel"} accent={isPre ? "try" : "brings"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "rgba(255,255,255,0.6)" }}>
            {channelIntro}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {CHANNEL_BENCHMARKS.map(b => {
              const on = model.channels.some(c => c.name === b.name);
              return (
                <button
                  key={b.name}
                  onClick={() => onToggleBenchmark(b.name)}
                  title={benchmarkExample(b.name)}
                  className="rounded-pill"
                  style={{
                    cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600, padding: "9px 18px",
                    background: on ? BRAND : "rgba(255,255,255,0.05)",
                    color: on ? "#fff" : "rgba(255,255,255,0.7)",
                    border: `1px solid ${on ? BRAND : "rgba(255,255,255,0.16)"}`,
                    transition: "all var(--dur-base) var(--ease-out)",
                  }}
                >
                  {b.name}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {model.channels.length === 0 && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#b3b3b3" }}>
              Select a channel above to start.
            </p>
          )}
          {model.channels.map(ch => (
            <ChannelEditor
              key={ch.id}
              channel={ch}
              mode={isPre ? "pre" : "actual"}
              onChange={patch => onChannel(ch.id, patch)}
              onRemove={() => onRemoveChannel(ch.id)}
            />
          ))}
        </div>
      </Card>

      {/* Submit */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 8 }}>
        <button
          onClick={onSubmit}
          disabled={!hasUsableChannel}
          className="btn-electric"
          style={{ opacity: hasUsableChannel ? 1 : 0.5, cursor: hasUsableChannel ? "pointer" : "not-allowed", border: "none" }}
        >
          See where to spend
        </button>
        {!hasUsableChannel && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#b3b3b3" }}>
            Add at least one channel with a budget and customers to continue.
          </p>
        )}
      </div>
    </div>
  );
}
