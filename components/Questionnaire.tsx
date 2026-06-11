"use client";
import NumberField from "@/components/ui/NumberField";
import { Card, ChannelEditor, BRAND, SURFACE, SURFACE_BORDER } from "@/components/tool-ui";
import {
  Model, Stage, Channel, CHANNEL_BENCHMARKS,
} from "@/lib/calculations";

const STAGE_META: { key: Stage; label: string; desc: string }[] = [
  { key: "pre",         label: "Pre-launch",  desc: "No customers yet. Plan spend and we estimate returns from benchmarks." },
  { key: "post",        label: "Post-launch", desc: "Live with early traction. Enter what each channel spends and brings." },
  { key: "established", label: "Established", desc: "Running for a while. Optimise where the budget goes." },
];

export default function Questionnaire({
  model, onStage, onGlobal, onChannel, onAddChannel, onRemoveChannel, onToggleBenchmark, onSubmit,
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
                }}
              >
                <p className="font-display text-paper" style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{s.label}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{s.desc}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Step 2 — Business basics */}
      <Card eyebrow="Step 2" titleA="What a customer" accent="is worth">
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
          <NumberField label="Price / customer / mo" value={model.global.arpu} prefix="$"
            onChange={v => onGlobal("arpu", v)} hint="Average monthly revenue per customer." />
          <NumberField label="Gross margin" value={model.global.grossMargin} suffix="%"
            onChange={v => onGlobal("grossMargin", v)} hint="Revenue left after cost to serve." />
          <NumberField label="Monthly churn" value={model.global.churnRate} suffix="%"
            onChange={v => onGlobal("churnRate", v)} hint="Share of customers lost each month." />
        </div>
      </Card>

      {/* Step 3 — Channels */}
      <Card eyebrow="Step 3" titleA={isPre ? "Which channels will you" : "What each channel"} accent={isPre ? "try" : "brings"}>
        {isPre && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "rgba(255,255,255,0.6)" }}>
              Pick the channels you plan to use. We estimate customers from typical CAC, then you set the budget.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {CHANNEL_BENCHMARKS.map(b => {
                const on = model.channels.some(c => c.name === b.name);
                return (
                  <button
                    key={b.name}
                    onClick={() => onToggleBenchmark(b.name)}
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
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {model.channels.length === 0 && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#b3b3b3" }}>
              {isPre ? "Select a channel above to start." : "Add a channel to start."}
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
          {!isPre && (
            <button
              onClick={onAddChannel}
              className="rounded-pill"
              style={{
                alignSelf: "flex-start", marginTop: 4, cursor: "pointer",
                fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--paper)",
                padding: "11px 22px", background: "rgba(0,26,255,0.14)", border: "1px solid rgba(0,26,255,0.55)",
                transition: "all var(--dur-base) var(--ease-out)",
              }}
            >
              + Add channel
            </button>
          )}
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
