"use client";
import { useState, useCallback } from "react";
import Questionnaire from "@/components/Questionnaire";
import Results from "@/components/Results";
import {
  Model, Stage, Channel,
  newModel, newChannel, seedCustomers, calculate,
} from "@/lib/calculations";

type Phase = "quiz" | "results";

export default function ProjectionTool() {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [model, setModel] = useState<Model>(() => newModel("post"));

  const setStage = useCallback((stage: Stage) => {
    setModel(newModel(stage)); // reseed channels + defaults for the new stage
  }, []);

  const updateGlobal = useCallback((field: keyof Model["global"], value: number) => {
    setModel(prev => ({ ...prev, global: { ...prev.global, [field]: value } }));
  }, []);

  const updateChannel = useCallback((id: string, patch: Partial<Channel>) => {
    setModel(prev => ({ ...prev, channels: prev.channels.map(c => (c.id === id ? { ...c, ...patch } : c)) }));
  }, []);

  const addChannel = useCallback(() => {
    setModel(prev => ({ ...prev, channels: [...prev.channels, newChannel()] }));
  }, []);

  const removeChannel = useCallback((id: string) => {
    setModel(prev => ({ ...prev, channels: prev.channels.filter(c => c.id !== id) }));
  }, []);

  // Pre-launch: toggle a benchmark channel on/off by name.
  const toggleBenchmark = useCallback((name: string) => {
    setModel(prev => {
      const exists = prev.channels.find(c => c.name === name);
      if (exists) return { ...prev, channels: prev.channels.filter(c => c.id !== exists.id) };
      const spend = 2000;
      const seeded: Channel = { id: crypto.randomUUID?.() ?? `${name}-${Date.now()}`, name, monthlySpend: spend, customers: seedCustomers(name, spend) };
      return { ...prev, channels: [...prev.channels, seeded] };
    });
  }, []);

  const restart = useCallback(() => {
    setModel(newModel("post"));
    setPhase("quiz");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const submit = useCallback(() => {
    setPhase("results");
    if (typeof window !== "undefined") {
      document.getElementById("tool")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const results = calculate(model);

  return (
    <section id="tool" style={{ background: "var(--ink)" }} className="px-4 md:px-8">
      <div className="mx-auto" style={{ maxWidth: 1180, paddingBlock: "clamp(64px, 9vw, 120px)" }}>
        {phase === "quiz" ? (
          <Questionnaire
            model={model}
            onStage={setStage}
            onGlobal={updateGlobal}
            onChannel={updateChannel}
            onAddChannel={addChannel}
            onRemoveChannel={removeChannel}
            onToggleBenchmark={toggleBenchmark}
            onSubmit={submit}
          />
        ) : (
          <Results
            model={model}
            results={results}
            onGlobal={updateGlobal}
            onChannel={updateChannel}
            onAddChannel={addChannel}
            onRemoveChannel={removeChannel}
            onRestart={restart}
          />
        )}
      </div>
    </section>
  );
}
