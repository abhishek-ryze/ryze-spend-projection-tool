// ---------------------------------------------------------------------------
// GTM Spend → Returns projection model
//
// A founder allocates monthly spend across editable marketing channels. Each
// channel turns spend into leads (via cost-per-lead) and leads into customers
// (via a conversion rate). Customers compound month over month against churn to
// produce an MRR/ARR curve, and the spend feeds CAC / LTV:CAC / payback / ROI.
// ---------------------------------------------------------------------------

export interface Channel {
  id: string;
  name: string;
  monthlySpend: number; // $ / month
  cpl: number;          // $ cost per lead
  convRate: number;     // % of leads that become customers (whole number, 0–100)
}

export interface GlobalAssumptions {
  arpu: number;        // $ monthly recurring revenue per customer
  grossMargin: number; // % (whole number)
  churnRate: number;   // % monthly logo churn (whole number)
  spendGrowth: number; // % monthly spend growth (whole number)
}

export interface Model {
  channels: Channel[];
  global: GlobalAssumptions;
}

export type Scenario = "bear" | "base" | "bull";

export const HORIZON_MONTHS = 12;

// ----- Derived shapes -------------------------------------------------------

export interface ChannelResult {
  id: string;
  name: string;
  spend: number;
  leads: number;
  customers: number;
  cac: number;        // $ per customer (0 when no customers)
  sharePct: number;   // % of total new customers
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
  roi: number;            // (revenue − spend) / spend over the horizon
  breakEvenMonth: number; // first month cumRevenue ≥ cumSpend, else 0
}

// ----- Presets --------------------------------------------------------------

let _id = 0;
const cid = () => `seed-${_id++}`;

export function newChannel(): Channel {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `ch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "New Channel",
    monthlySpend: 1000,
    cpl: 30,
    convRate: 6,
  };
}

export const PRESETS: Record<Scenario, Model> = {
  bear: {
    channels: [
      { id: cid(), name: "Paid Search",          monthlySpend: 4000, cpl: 55, convRate: 5 },
      { id: cid(), name: "Paid Social",          monthlySpend: 3000, cpl: 35, convRate: 3 },
      { id: cid(), name: "Cold Email / Outbound", monthlySpend: 1500, cpl: 45, convRate: 4 },
      { id: cid(), name: "Content & Lead Magnets", monthlySpend: 2000, cpl: 30, convRate: 4 },
      { id: cid(), name: "Referral",             monthlySpend: 500,  cpl: 25, convRate: 8 },
    ],
    global: { arpu: 60, grossMargin: 70, churnRate: 7, spendGrowth: 2 },
  },
  base: {
    channels: [
      { id: cid(), name: "Paid Search",          monthlySpend: 4000, cpl: 40, convRate: 8 },
      { id: cid(), name: "Paid Social",          monthlySpend: 3000, cpl: 25, convRate: 5 },
      { id: cid(), name: "Cold Email / Outbound", monthlySpend: 1500, cpl: 30, convRate: 6 },
      { id: cid(), name: "Content & Lead Magnets", monthlySpend: 2000, cpl: 20, convRate: 7 },
      { id: cid(), name: "Referral",             monthlySpend: 500,  cpl: 15, convRate: 12 },
    ],
    global: { arpu: 80, grossMargin: 75, churnRate: 4, spendGrowth: 5 },
  },
  bull: {
    channels: [
      { id: cid(), name: "Paid Search",          monthlySpend: 4000, cpl: 30, convRate: 12 },
      { id: cid(), name: "Paid Social",          monthlySpend: 3000, cpl: 18, convRate: 8 },
      { id: cid(), name: "Cold Email / Outbound", monthlySpend: 1500, cpl: 20, convRate: 9 },
      { id: cid(), name: "Content & Lead Magnets", monthlySpend: 2000, cpl: 14, convRate: 10 },
      { id: cid(), name: "Referral",             monthlySpend: 500,  cpl: 10, convRate: 18 },
    ],
    global: { arpu: 110, grossMargin: 80, churnRate: 2, spendGrowth: 8 },
  },
};

// Deep clone so editing a model never mutates the shared preset object.
export function clonePreset(s: Scenario): Model {
  const p = PRESETS[s];
  return {
    channels: p.channels.map((c) => ({ ...c, id: c.id })),
    global: { ...p.global },
  };
}

// ----- Core calculation -----------------------------------------------------

function channelCustomers(c: Channel): number {
  if (c.cpl <= 0) return 0;
  const leads = c.monthlySpend / c.cpl;
  return leads * (c.convRate / 100);
}

export function calculate(model: Model): ProjectionResult {
  const { channels, global } = model;
  const churn = global.churnRate / 100;
  const growth = global.spendGrowth / 100;
  const margin = global.grossMargin / 100;

  // Month-1 channel snapshot
  const month1Customers = channels.reduce((s, c) => s + channelCustomers(c), 0);

  const channelResults: ChannelResult[] = channels.map((c) => {
    const leads = c.cpl > 0 ? c.monthlySpend / c.cpl : 0;
    const customers = channelCustomers(c);
    return {
      id: c.id,
      name: c.name,
      spend: c.monthlySpend,
      leads,
      customers,
      cac: customers > 0 ? c.monthlySpend / customers : 0,
      sharePct: month1Customers > 0 ? (customers / month1Customers) * 100 : 0,
    };
  });

  const monthlySpend = channels.reduce((s, c) => s + c.monthlySpend, 0);
  const blendedCac = month1Customers > 0 ? monthlySpend / month1Customers : 0;

  // Unit economics
  const grossArpu = global.arpu * margin;
  const ltv = churn > 0 ? grossArpu / churn : 0;
  const ltvCac = blendedCac > 0 ? ltv / blendedCac : 0;
  const paybackMonths = grossArpu > 0 ? blendedCac / grossArpu : 0;

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
  const total12Spend = last.cumSpend;
  const total12Revenue = last.cumRevenue;

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
    total12Spend,
    total12Revenue,
    roi: total12Spend > 0 ? (total12Revenue - total12Spend) / total12Spend : 0,
    breakEvenMonth,
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
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(1) + "×";
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
