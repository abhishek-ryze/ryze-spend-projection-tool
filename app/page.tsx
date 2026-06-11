import RyzeNavbar from "@/components/ryze/RyzeNavbar";
import RyzeFooter from "@/components/ryze/RyzeFooter";
import ProjectionTool from "@/components/ProjectionTool";

export default function Home() {
  return (
    <>
      <RyzeNavbar />

      <main className="bg-ink" style={{ position: "relative", zIndex: 2 }}>
        {/* Hero — cosmos gradient with ambient glow */}
        <section
          className="relative isolate overflow-hidden flex flex-col items-center justify-center text-center px-6 pt-40 md:pt-52 pb-20 md:pb-28 min-h-[58vh] md:min-h-[66vh]"
          style={{ background: "linear-gradient(160deg, #2E0440 0%, #020846 45%, #000000 100%)" }}
        >
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{ top: "-10%", left: "28%", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(185,61,245,0.32) 0%, transparent 70%)", filter: "blur(60px)" }}
          />
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{ bottom: "0%", right: "18%", width: 520, height: 360, background: "radial-gradient(ellipse, rgba(0,26,255,0.30) 0%, transparent 70%)", filter: "blur(70px)" }}
          />
          <div
            aria-hidden
            style={{ position: "absolute", inset: "auto 0 0 0", height: "35%", background: "linear-gradient(to bottom, transparent, #000)", zIndex: 1, pointerEvents: "none" }}
          />

          <div className="relative z-[2] mx-auto max-w-4xl">
            <span className="eyebrow mb-5 block">GTM Spend Projection</span>

            <h1 className="text-title text-title-sky" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", lineHeight: 0.98 }}>
              Project your sales &amp;<br />
              marketing{" "}
              <em className="text-accent" style={{ whiteSpace: "nowrap" }}>returns.</em>
            </h1>

            <p
              className="mx-auto mt-6 mb-10 max-w-[54ch]"
              style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(1rem, 1.5vw, 1.125rem)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7 }}
            >
              Allocate spend across any channel and watch it turn into customers, CAC, MRR and ROI —
              projected over 12 months. Built for founders sizing up their go-to-market before they commit the budget.
            </p>

            <div className="flex flex-wrap gap-3 justify-center items-center">
              <a href="#tool" className="btn-electric">Open the model</a>
              <div
                className="flex items-center gap-2 rounded-pill text-sm"
                style={{ fontFamily: "var(--font-sans)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.04)", padding: "10px 18px" }}
              >
                <span className="rounded-pill" style={{ width: 8, height: 8, background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                Live calculations
              </div>
            </div>

            <div className="mt-14 md:mt-16 mx-auto grid grid-cols-3 gap-4 md:gap-8 max-w-lg">
              {[
                { value: "12-mo", label: "Projection horizon" },
                { value: "Any", label: "Editable channels" },
                { value: "Live", label: "CAC · LTV · ROI" },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 4vw, 2.1rem)", fontWeight: 700, color: "var(--paper)", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "rgba(255,255,255,0.42)", marginTop: 6 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ProjectionTool />
      </main>

      <RyzeFooter />
    </>
  );
}
