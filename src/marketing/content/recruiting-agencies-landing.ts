/**
 * Recruiting Agencies Landing Page — /for/recruiting-agencies
 *
 * Target audience: Recruiting agency talent managers, VP of Recruiting Operations, agency owners
 * Goal: Schedule a free pilot (5 candidates, we generate prep briefs)
 *
 * This is a B2B page — voice is ROI-oriented. Every placement = $15-30k in fees.
 * Pricing: $500/month unlimited or $10/brief. No seat minimums.
 *
 * Kai: this page follows the same interface as CareerServicesContent (career-services-landing.ts)
 * Route: /for/recruiting-agencies
 */

export interface RecruitingAgenciesContent {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subhead: string;
  valueProps: { heading: string; body: string }[];
  howItWorks: { step: string; body: string }[];
  pricing: {
    headline: string;
    price: string;
    unit: string;
    minimum: string;
    body: string;
  };
  cta: {
    label: string;
    subtext: string;
    href: string;
  };
}

export const content: RecruitingAgenciesContent = {
  slug: "recruiting-agencies",

  metaTitle: "Interview Prep for Recruiting Agencies — PrepFile",

  metaDescription:
    "Help your candidates walk into interviews prepared. PrepFile generates personalized, company-specific prep briefs in 60 seconds. Higher placement rates. $500/month unlimited.",

  headline: "Your candidates are getting interviews. Are they closing them?",

  subhead:
    "PrepFile gives every candidate a personalized prep brief — company culture, expected interview format, evaluation signals, and smart questions to ask — generated in 60 seconds from the job they already applied for. Better-prepared candidates close more offers. More offers means more placements.",

  valueProps: [
    {
      heading: "Higher placement rates",
      body:
        "Candidates who walk in knowing the company's hiring signals, round structure, and what the interviewer is scoring perform better in final rounds. That's the difference between a placement and a referral bonus that never comes. PrepFile gives your candidates the edge — without adding hours to their prep or yours.",
    },
    {
      heading: "Fewer failed final rounds",
      body:
        "Most candidates lose offers in final rounds — not because of skill, but because they didn't know what to expect. PrepFile's briefs cover the specific company's process: whether they use case studies, panel interviews, or behavioral loops, and what they're actually looking for at each stage.",
    },
    {
      heading: "Branded prep your clients notice",
      body:
        "Send candidates a PrepFile brief with your agency's name on it. \"Powered by PrepFile\" branding makes your prep process visible to both the candidate and the hiring manager. It signals you invest in your candidates — which is what separates a boutique recruiter from a resume-forwarding service.",
    },
    {
      heading: "No per-prep calls. No outdated company guides.",
      body:
        "Stop spending 30 minutes on the phone walking candidates through what to expect at a company you placed someone at 6 months ago. PrepFile generates fresh, AI-driven company briefs on demand — no stale Notion docs, no manual research. Your team focuses on relationships, not research.",
    },
  ],

  howItWorks: [
    {
      step: "Enter the company, role, and job description",
      body:
        "Takes under two minutes. Works from any job listing the candidate already has. No manual setup per company.",
    },
    {
      step: "PrepFile generates a personalized brief",
      body:
        "Covers company competitive position, culture signals, expected interview format and rounds, what the interviewer is evaluating, and smart questions to ask. Updated in real time — not cached from last quarter.",
    },
    {
      step: "Candidate reviews before the interview",
      body:
        "Brief is accessible on any device. They can review the night before or in the lobby. No guide to maintain, no outdated prep deck to send.",
    },
    {
      step: "You see who prepared and track placement outcomes",
      body:
        "Agency dashboard shows which candidates generated briefs, for which companies, and when — so you can follow up proactively and connect prep activity to placement results.",
    },
  ],

  pricing: {
    headline: "Flat monthly rate. No per-seat limits.",
    price: "$500",
    unit: "per month, unlimited briefs",
    minimum: "Or $10 per brief — no subscription needed",
    body:
      "One flat rate covers your whole team and every candidate in your pipeline. No per-seat contracts, no cohort windows. Start with a free pilot — send us 5 candidates, we generate their briefs, you tell us if it helped your placement rate.",
  },

  cta: {
    label: "Start a free pilot",
    subtext:
      "Send 5 candidates. We generate their prep briefs. You tell us if it makes a difference. Talk to Taurean directly — no sales team.",
    href: "mailto:taurean@prepfile.work?subject=PrepFile%20for%20Recruiting%20Agencies%20%E2%80%94%20Pilot%20Interest",
  },
};
