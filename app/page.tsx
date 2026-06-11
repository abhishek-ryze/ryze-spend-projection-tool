import { RyzeNavbar } from "@/components/Navbar";
import { RyzeFooter } from "@/components/Footer";
import ProjectionTool from "@/components/ProjectionTool";

export default function Home() {
  return (
    <>
      <RyzeNavbar />

      <main className="relative z-[2]" style={{ background: "var(--ink)" }}>
        {/* Hero Section — lavender-cosmos-black gradient */}
        <section
          className="relative isolate overflow-hidden flex flex-col items-center justify-center text-center px-6 pt-40 md:pt-52 pb-20 md:pb-32 min-h-[60vh] md:min-h-[70vh]"
          style={{
            background: "linear-gradient(160deg, #2E0440 0%, #020846 45%, #000000 100%)",
          }}
        >
          {/* Ambient glow orbs */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              top: "-10%",
              left: "30%",
              width: 600,
              height: 400,
              background: "radial-gradient(ellipse, rgba(185,61,245,0.35) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              bottom: "0%",
              right: "20%",
              width: 500,
              height: 350,
              background: "radial-gradient(ellipse, rgba(0,26,255,0.30) 0%, transparent 70%)",
              filter: "blur(70px)",
            }}
          />

          {/* Bottom fade to ink */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "auto 0 0 0",
              height: "35%",
              background: "linear-gradient(to bottom, transparent, #000000)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          <div className="relative z-[2] mx-auto max-w-4xl">
            <span className="eyebrow mb-5 block">GTM Projection Model</span>

            <h1
              className="text-title mb-6"
              style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
            >
              Sales &amp; Marketing<br />
              <em className="accent" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}>Spend Projections</em>
            </h1>

            <p
              className="mx-auto mb-10 max-w-[52ch]"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
                color: "rgba(255,255,255,0.60)",
                lineHeight: 1.7,
              }}
            >
              Model your go-to-market spend across 6 channels. Adjust assumptions and see real-time
              projections for Bear, Base, and Bull scenarios.
            </p>

            <div className="flex flex-wrap gap-3 justify-center items-center">
              <a href="#tool" className="btn-electric">
                Open the Tool
              </a>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "rgba(255,255,255,0.55)",
                  borderColor: "rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
                />
                Live calculations
              </div>
            </div>

            {/* Stats row */}
            <div
              className="mt-14 md:mt-16 mx-auto grid grid-cols-3 gap-4 md:gap-8 max-w-lg"
            >
              {[
                { label: "Channels Modeled", value: "6" },
                { label: "Scenarios", value: "3" },
                { label: "Launch Goal", value: "100+" },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, color: "var(--paper)", lineHeight: 1 }}>
                    {s.value}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "rgba(255,255,255,0.40)", marginTop: 6 }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benchmark Context Band */}
        <div
          className="border-y px-6 py-4 text-center"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.015)",
          }}
        >
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "rgba(255,255,255,0.40)" }}>
            Benchmarks sourced from Mailchimp 2024/25, Buffer/Hootsuite 2025, Andrew Chen / Reforge consumer growth data, and Apollo/Smartlead 2025 reports
          </p>
        </div>

        {/* Projection Tool */}
        <ProjectionTool />
      </main>

      <RyzeFooter />
    </>
  );
}
