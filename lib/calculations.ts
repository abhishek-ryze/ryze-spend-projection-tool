export interface WarmEmailInputs {
  listSize: number;
  openRate: number;
  ctr: number;
  signupConv: number;
}

export interface ColdEmailInputs {
  listSize: number;
  deliveryRate: number;
  openRate: number;
  ctr: number;
  signupConv: number;
}

export interface LinkedInInputs {
  posts: number;
  avgReach: number;
  ctr: number;
  signupConv: number;
}

export interface CommunityInputs {
  postsSurviving: number;
  avgViews: number;
  ctr: number;
  signupConv: number;
}

export interface ReferralInputs {
  kFactor: number;
}

export interface PartnershipInputs {
  partnersContacted: number;
  activeRate: number;
  signupsPerPartner: number;
}

export interface FunnelInputs {
  activationRate: number;
  d7Retention: number;
  d30Retention: number;
}

export interface Assumptions {
  warmEmail: WarmEmailInputs;
  coldEmail: ColdEmailInputs;
  linkedin: LinkedInInputs;
  community: CommunityInputs;
  referral: ReferralInputs;
  partnership: PartnershipInputs;
  funnel: FunnelInputs;
}

export interface ChannelResult {
  name: string;
  signups: number;
  steps: { label: string; value: number }[];
}

export interface ProjectionResult {
  channels: {
    warmEmail: ChannelResult;
    coldEmail: ChannelResult;
    linkedin: ChannelResult;
    community: ChannelResult;
    partnership: ChannelResult;
    referral: ChannelResult;
  };
  subtotal: number;
  referrals: number;
  totalSignups: number;
  activated: number;
  d7: number;
  d30: number;
  vsGoal: number;
}

export type Scenario = "bear" | "base" | "bull";

export const PRESETS: Record<Scenario, Assumptions> = {
  bear: {
    warmEmail:   { listSize: 150,  openRate: 0.40, ctr: 0.15, signupConv: 0.25 },
    coldEmail:   { listSize: 4200, deliveryRate: 0.55, openRate: 0.12, ctr: 0.010, signupConv: 0.10 },
    linkedin:    { posts: 12,  avgReach: 200, ctr: 0.005, signupConv: 0.15 },
    community:   { postsSurviving: 4,  avgViews: 80,  ctr: 0.005, signupConv: 0.12 },
    referral:    { kFactor: 0.08 },
    partnership: { partnersContacted: 25, activeRate: 0.10, signupsPerPartner: 1.5 },
    funnel:      { activationRate: 0.30, d7Retention: 0.20, d30Retention: 0.08 },
  },
  base: {
    warmEmail:   { listSize: 200,  openRate: 0.50, ctr: 0.25, signupConv: 0.35 },
    coldEmail:   { listSize: 4200, deliveryRate: 0.70, openRate: 0.20, ctr: 0.025, signupConv: 0.15 },
    linkedin:    { posts: 16,  avgReach: 400, ctr: 0.012, signupConv: 0.25 },
    community:   { postsSurviving: 8,  avgViews: 200, ctr: 0.010, signupConv: 0.20 },
    referral:    { kFactor: 0.18 },
    partnership: { partnersContacted: 25, activeRate: 0.20, signupsPerPartner: 3.0 },
    funnel:      { activationRate: 0.45, d7Retention: 0.35, d30Retention: 0.18 },
  },
  bull: {
    warmEmail:   { listSize: 300,  openRate: 0.60, ctr: 0.35, signupConv: 0.50 },
    coldEmail:   { listSize: 4200, deliveryRate: 0.82, openRate: 0.28, ctr: 0.050, signupConv: 0.25 },
    linkedin:    { posts: 24,  avgReach: 600, ctr: 0.020, signupConv: 0.35 },
    community:   { postsSurviving: 14, avgViews: 400, ctr: 0.018, signupConv: 0.30 },
    referral:    { kFactor: 0.30 },
    partnership: { partnersContacted: 30, activeRate: 0.35, signupsPerPartner: 5.0 },
    funnel:      { activationRate: 0.60, d7Retention: 0.50, d30Retention: 0.30 },
  },
};

export function calculate(a: Assumptions): ProjectionResult {
  // CH1: Warm Email
  const ch1Opens    = a.warmEmail.listSize * a.warmEmail.openRate;
  const ch1Clicks   = ch1Opens * a.warmEmail.ctr;
  const ch1Signups  = ch1Clicks * a.warmEmail.signupConv;

  // CH2: Cold Email
  const ch2Reached  = a.coldEmail.listSize * a.coldEmail.deliveryRate;
  const ch2Opens    = ch2Reached * a.coldEmail.openRate;
  const ch2Clicks   = ch2Opens * a.coldEmail.ctr;
  const ch2Signups  = ch2Clicks * a.coldEmail.signupConv;

  // CH3: LinkedIn Organic
  const ch3Impr     = a.linkedin.posts * a.linkedin.avgReach;
  const ch3Clicks   = ch3Impr * a.linkedin.ctr;
  const ch3Signups  = ch3Clicks * a.linkedin.signupConv;

  // CH4: Community
  const ch4Impr     = a.community.postsSurviving * a.community.avgViews;
  const ch4Clicks   = ch4Impr * a.community.ctr;
  const ch4Signups  = ch4Clicks * a.community.signupConv;

  // CH6: Partnerships
  const ch6Active   = a.partnership.partnersContacted * a.partnership.activeRate;
  const ch6Signups  = ch6Active * a.partnership.signupsPerPartner;

  const subtotal    = ch1Signups + ch2Signups + ch3Signups + ch4Signups + ch6Signups;
  const referrals   = subtotal * a.referral.kFactor;
  const totalSignups = subtotal + referrals;

  const activated   = totalSignups * a.funnel.activationRate;
  const d7          = activated * a.funnel.d7Retention;
  const d30         = activated * a.funnel.d30Retention;

  return {
    channels: {
      warmEmail: {
        name: "Warm Email",
        signups: ch1Signups,
        steps: [
          { label: "List", value: a.warmEmail.listSize },
          { label: "Opens", value: ch1Opens },
          { label: "Clicks", value: ch1Clicks },
          { label: "Signups", value: ch1Signups },
        ],
      },
      coldEmail: {
        name: "Cold Email",
        signups: ch2Signups,
        steps: [
          { label: "List", value: a.coldEmail.listSize },
          { label: "Reached", value: ch2Reached },
          { label: "Opens", value: ch2Opens },
          { label: "Clicks", value: ch2Clicks },
          { label: "Signups", value: ch2Signups },
        ],
      },
      linkedin: {
        name: "LinkedIn",
        signups: ch3Signups,
        steps: [
          { label: "Posts", value: a.linkedin.posts },
          { label: "Impressions", value: ch3Impr },
          { label: "Clicks", value: ch3Clicks },
          { label: "Signups", value: ch3Signups },
        ],
      },
      community: {
        name: "Community",
        signups: ch4Signups,
        steps: [
          { label: "Posts", value: a.community.postsSurviving },
          { label: "Views", value: ch4Impr },
          { label: "Clicks", value: ch4Clicks },
          { label: "Signups", value: ch4Signups },
        ],
      },
      partnership: {
        name: "Partnerships",
        signups: ch6Signups,
        steps: [
          { label: "Contacted", value: a.partnership.partnersContacted },
          { label: "Active", value: ch6Active },
          { label: "Signups", value: ch6Signups },
        ],
      },
      referral: {
        name: "Referrals",
        signups: referrals,
        steps: [
          { label: "K-Factor", value: a.referral.kFactor },
          { label: "Signups", value: referrals },
        ],
      },
    },
    subtotal,
    referrals,
    totalSignups,
    activated,
    d7,
    d30,
    vsGoal: totalSignups / 100,
  };
}

export function fmt(n: number, decimals = 0): string {
  return Math.round(n).toLocaleString("en-US", { maximumFractionDigits: decimals });
}

export function fmtPct(n: number): string {
  return (n * 100).toFixed(1) + "%";
}
