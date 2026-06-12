import RyzeNavbar from "@/components/ryze/RyzeNavbar";
import RyzeFooter from "@/components/ryze/RyzeFooter";
import ProjectionTool from "@/components/ProjectionTool";

export default function Home() {
  return (
    <>
      <RyzeNavbar />

      <main className="bg-ink" style={{ position: "relative", zIndex: 2 }}>
        {/* Hero: cosmos gradient with ambient glow */}
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
            <span className="eyebrow-block mb-5">GTM Spend Projection</span>

            <h1
              className="text-title"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 6rem)",
                lineHeight: 1.08,
                paddingBottom: 4,
                background: "linear-gradient(0deg, #DEBAFB 0%, #FFFFFF 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
              Project your sales &amp;<br />
              marketing <span style={{ whiteSpace: "nowrap" }}>returns.</span>
            </h1>

            <p
              className="mx-auto mt-6 mb-14 md:mb-16 max-w-[54ch]"
              style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(1rem, 1.5vw, 1.125rem)", color: "rgba(255,255,255,0.66)", lineHeight: 1.7 }}
            >
              Answer a few questions about your spend and customers. We work out your real CAC,
              project the next 12 months, and show you exactly where your next dollar should go.
            </p>

            <div className="flex flex-wrap gap-3 justify-center items-center" style={{ marginTop: "clamp(40px, 5vw, 64px)" }}>
              <a href="#tool" className="btn-electric">Find where to spend</a>
              <div
                className="flex items-center gap-2 rounded-pill text-sm"
                style={{ fontFamily: "var(--font-sans)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.04)", padding: "10px 18px" }}
              >
                <span className="rounded-pill" style={{ width: 8, height: 8, background: "#898BFF", boxShadow: "0 0 6px #898BFF" }} />
                Takes 2 minutes
              </div>
            </div>
          </div>
        </section>

        <ProjectionTool />
      </main>

      <RyzeFooter />
    </>
  );
}
