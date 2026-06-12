// ---------------------------------------------------------------------------
// GTM Spend -> Returns projection model (inverted)
//
// Founders enter what they actually know: monthly spend per channel and how many
// paying customers that channel brings. From those we DERIVE cost-per-acquisition
// (CAC), compare it to channel benchmarks, project an MRR/ARR curve against churn,
// and recommend where the next dollar should go.
//
// Pre-launch founders have no history, so they pick channels + a planned budget and
// we seed expected customers from CHANNEL_BENCHMARKS (overridable).
// ---------------------------------------------------------------------------

export type Stage = "pre" | "post" | "established";

export interface Channel {
  id: string;
  name: string;
  monthlySpend: number; // $ / month
  customers: number;    // paying customers acquired / month
}

export interface GlobalAssumptions {
  arpu: number;        // $ monthly recurring revenue per customer
  grossMargin: number; // % (whole number)
  churnRate: number;   // % monthly logo churn (whole number)
  spendGrowth: number; // % monthly spend growth (whole number)
}

export interface Model {
  stage: Stage;
  channels: Channel[];
  global: GlobalAssumptions;
}

export const HORIZON_MONTHS = 12;

// ----- Channel benchmarks (typical blended CAC, USD) ------------------------
// Rough industry medians used to seed pre-launch estimates and to flag whether a
// founder's actual CAC is running above or below what's typical for that channel.
export interface Benchmark {
  name: string;
  cac: number;        // typical $ cost per paying customer
  blurb: string;
}

export const CHANNEL_BENCHMARKS: Benchmark[] = [
  { name: "Paid Search",          cac: 350, blurb: "High intent, scales with budget, gets pricier as you grow." },
  { name: "Paid Social",          cac: 300, blurb: "Great for awareness, CAC swings with creative quality." },
  { name: "SEO / Content",        cac: 180, blurb: "Slow to start, compounding, low marginal cost once ranked." },
  { name: "Cold Email / Outbound",cac: 250, blurb: "Cheap to run, deliverability and targeting decide the CAC." },
  { name: "Referral",             cac: 120, blurb: "Cheapest customers, capped by your existing base." },
  { name: "Partnerships",         cac: 200, blurb: "Lumpy but high-trust, one good partner moves the number." },
  { name: "Events",               cac: 400, blurb: "Expensive per head, strong for enterprise and brand." },
];

// Plain-English example of what a typical $2,000 budget buys on this channel,
// derived from the benchmark CAC so the two numbers stay in sync.
export function benchmarkExample(name: string, exampleSpend = 2000): string {
  const b = benchmarkFor(name);
  if (!b || b.cac <= 0) return "";
  const customers = Math.max(1, Math.round(exampleSpend / b.cac));
  return `Roughly $${exampleSpend.toLocaleString("en-US")} ≈ ${customers} paying customers/mo.`;
}

export function benchmarkFor(name: string): Benchmark | undefined {
  return CHANNEL_BENCHMARKS.find(b => b.name.toLowerCase() === name.toLowerCase());
}

// ----- Derived shapes -------------------------------------------------------

export interface ChannelResult {
  id: string;
  name: string;
  spend: number;
  customers: number;
  cac: number;            // $ per customer (0 when no customers)
  returnMultiple: number; // customers * ltv / spend
  sharePct: number;       // % of total new customers
  spendSharePct: number;  // % of total spend
  benchmarkCac: number;   // 0 if no benchmark for this channel
  vsBenchmark: number;    // cac / benchmarkCac (1 = on benchmark, <1 cheaper); 0 if n/a
}

export interface MonthRow {
  month: number;
  spend: number;
  newCustomers: number;
  activeCustomers: number;
  mrr: number;
  cumSpend: number;
  cumRevenue: number;
}

export interface Recommendation {
  hasMove: boolean;
  bestName: string;
  worstName: string;
  amount: number;        // $ suggested to shift
  deltaCustomers: number;// extra customers/mo at the same total spend
}

export interface ProjectionResult {
  channels: ChannelResult[];
  // Month-1 snapshot
  monthlySpend: number;
  newCustomersPerMonth: number;
  blendedCac: number;
  // Unit economics
  ltv: number;
  ltvCac: number;
  paybackMonths: number;
  // 12-month series + outcomes
  series: MonthRow[];
  endingMrr: number;
  arr: number;
  total12Spend: number;
  total12Revenue: number;
  roi: number;            // (revenue - spend) / spend over the horizon
  breakEvenMonth: number; // first month cumRevenue >= cumSpend, else 0
  recommendation: Recommendation;
}

// ----- Factories ------------------------------------------------------------

function uid(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `ch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function newChannel(name = "New Channel"): Channel {
  return { id: uid(), name, monthlySpend: 1000, customers: 0 };
}

// Estimate customers from a planned budget using the channel benchmark (pre-launch).
export function seedCustomers(name: string, monthlySpend: number): number {
  const b = benchmarkFor(name);
  if (!b || b.cac <= 0) return 0;
  return Math.round(monthlySpend / b.cac);
}

// Build a channel from a benchmark name. Pre-launch seeds customers from the benchmark CAC;
// post/established start at 0 so the founder enters real numbers.
export function seedChannelByName(name: string, stage: Stage, spend = 2000): Channel {
  return {
    id: uid(),
    name,
    monthlySpend: spend,
    customers: stage === "pre" ? seedCustomers(name, spend) : 0,
  };
}

export function defaultGlobals(): GlobalAssumptions {
  return { arpu: 80, grossMargin: 75, churnRate: 4, spendGrowth: 0 };
}

// Starting channel set per journey stage.
export function seedForStage(stage: Stage): Channel[] {
  if (stage === "pre") {
    // Two common channels at a planned budget, customers estimated from benchmarks.
    return ["Paid Search", "SEO / Content"].map(name => {
      const spend = 2000;
      return { id: uid(), name, monthlySpend: spend, customers: seedCustomers(name, spend) };
    });
  }
  if (stage === "established") {
    return [
      { id: uid(), name: "Paid Search", monthlySpend: 6000, customers: 18 },
      { id: uid(), name: "SEO / Content", monthlySpend: 3000, customers: 16 },
      { id: uid(), name: "Referral", monthlySpend: 1000, customers: 12 },
    ];
  }
  // post-launch — seeded with real efficiency spread so the ranking is meaningful
  return [
    { id: uid(), name: "Paid Search", monthlySpend: 3000, customers: 6 },  // ~$500 CAC
    { id: uid(), name: "Paid Social", monthlySpend: 2000, customers: 6 },  // ~$333 CAC
    { id: uid(), name: "Referral",    monthlySpend: 800,  customers: 7 },  // ~$114 CAC
  ];
}

export function newModel(stage: Stage): Model {
  return { stage, channels: seedForStage(stage), global: defaultGlobals() };
}

// ----- Core calculation -----------------------------------------------------

export function calculate(model: Model): ProjectionResult {
  const { channels, global } = model;
  const churn = global.churnRate / 100;
  const growth = global.spendGrowth / 100;
  const margin = global.grossMargin / 100;

  const month1Customers = channels.reduce((s, c) => s + (c.customers || 0), 0);
  const monthlySpend = channels.reduce((s, c) => s + (c.monthlySpend || 0), 0);

  // Unit economics
  const grossArpu = global.arpu * margin;
  const ltv = churn > 0 ? grossArpu / churn : 0;
  const blendedCac = month1Customers > 0 ? monthlySpend / month1Customers : 0;
  const ltvCac = blendedCac > 0 ? ltv / blendedCac : 0;
  const paybackMonths = grossArpu > 0 ? blendedCac / grossArpu : 0;

  const channelResults: ChannelResult[] = channels.map((c) => {
    const cac = c.customers > 0 ? c.monthlySpend / c.customers : 0;
    const bench = benchmarkFor(c.name);
    return {
      id: c.id,
      name: c.name,
      spend: c.monthlySpend,
      customers: c.customers,
      cac,
      returnMultiple: c.monthlySpend > 0 ? (c.customers * ltv) / c.monthlySpend : 0,
      sharePct: month1Customers > 0 ? (c.customers / month1Customers) * 100 : 0,
      spendSharePct: monthlySpend > 0 ? (c.monthlySpend / monthlySpend) * 100 : 0,
      benchmarkCac: bench ? bench.cac : 0,
      vsBenchmark: bench && bench.cac > 0 && cac > 0 ? cac / bench.cac : 0,
    };
  });

  // 12-month projection
  const series: MonthRow[] = [];
  let active = 0;
  let cumSpend = 0;
  let cumRevenue = 0;
  let breakEvenMonth = 0;

  for (let m = 1; m <= HORIZON_MONTHS; m++) {
    const factor = Math.pow(1 + growth, m - 1);
    const spend = monthlySpend * factor;
    const newCustomers = month1Customers * factor;
    active = active * (1 - churn) + newCustomers;
    const mrr = active * global.arpu;
    cumSpend += spend;
    cumRevenue += mrr;
    if (breakEvenMonth === 0 && cumRevenue >= cumSpend) breakEvenMonth = m;
    series.push({ month: m, spend, newCustomers, activeCustomers: active, mrr, cumSpend, cumRevenue });
  }

  const last = series[series.length - 1];

  return {
    channels: channelResults,
    monthlySpend,
    newCustomersPerMonth: month1Customers,
    blendedCac,
    ltv,
    ltvCac,
    paybackMonths,
    series,
    endingMrr: last.mrr,
    arr: last.mrr * 12,
    total12Spend: last.cumSpend,
    total12Revenue: last.cumRevenue,
    roi: last.cumSpend > 0 ? (last.cumRevenue - last.cumSpend) / last.cumSpend : 0,
    breakEvenMonth,
    recommendation: recommend(channelResults),
  };
}

// Where to spend: shift ~25% of the worst (highest-CAC) channel's budget into the
// best (lowest-CAC) channel, and report the extra customers gained at equal spend.
export function recommend(channels: ChannelResult[]): Recommendation {
  const active = channels.filter(c => c.customers > 0 && c.cac > 0);
  if (active.length < 2) {
    return { hasMove: false, bestName: "", worstName: "", amount: 0, deltaCustomers: 0 };
  }
  const best = active.reduce((a, b) => (b.cac < a.cac ? b : a));
  const worst = active.reduce((a, b) => (b.cac > a.cac ? b : a));
  if (best.id === worst.id || worst.cac <= best.cac) {
    return { hasMove: false, bestName: best.name, worstName: worst.name, amount: 0, deltaCustomers: 0 };
  }
  const amount = Math.round((worst.spend * 0.25) / 50) * 50; // round to nearest $50
  const delta = amount / best.cac - amount / worst.cac;
  return {
    hasMove: amount > 0 && delta >= 1, // only suggest a move when it's worth at least 1 customer/mo
    bestName: best.name,
    worstName: worst.name,
    amount,
    deltaCustomers: delta,
  };
}

// ----- Formatters -----------------------------------------------------------

export function fmt(n: number, decimals = 0): string {
  return (Number.isFinite(n) ? n : 0).toLocaleString("en-US", { maximumFractionDigits: decimals });
}

export function fmtPct(n: number, decimals = 0): string {
  return (n * 100).toFixed(decimals) + "%";
}

export function fmtRatio(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "n/a";
  return n.toFixed(1) + "x";
}

// Compact money: $1,234 / $12.3k / $1.2M
export function fmtMoney(n: number): string {
  const v = Number.isFinite(n) ? n : 0;
  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
  if (abs >= 10_000) return `${sign}$${(abs / 1000).toFixed(abs >= 100_000 ? 0 : 1)}k`;
  return `${sign}$${Math.round(abs).toLocaleString("en-US")}`;
}
