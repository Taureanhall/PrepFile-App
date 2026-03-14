/**
 * Career Services Landing Page — /for/career-services
 *
 * Target audience: Bootcamp directors and career services leads
 * Goal: Schedule a pilot call with Taurean
 *
 * This is a B2B page — voice is outcome-oriented, not feature-oriented.
 * Pricing: $1,500/year annual license (primary) or per-cohort flat tiers (fallback).
 * Updated 2026-03-14 per PRE-306 pricing research (Morgan).
 *
 * Kai: this page needs its own component (CareerServicesPage.tsx) since
 * the B2C SegmentPage format doesn't cover valueProps, how-it-works, or pricing.
 * Route: /for/career-services
 */

export interface CareerServicesContent {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subhead: string;
  valueProps: { heading: string; body: string }[];
  howItWorks: { step: string; body: string }[];
  pricing: {
    headline: string;
    annualLicense: {
      label: string;
      price: string;
      unit: string;
      description: string;
    };
    cohortTiers: {
      label: string;
      tiers: { range: string; price: string }[];
      description: string;
    };
    pilot: {
      label: string;
      description: string;
    };
  };
  cta: {
    label: string;
    subtext: string;
    href: string;
  };
}

export const content: CareerServicesContent = {
  slug: "career-services",

  metaTitle: "Interview Prep for Bootcamp Students — PrepFile for Career Services",

  metaDescription:
    "Give every student a personalized interview prep brief before each interview. PrepFile generates company-specific briefs in 60 seconds. Annual site license from $1,500/year.",

  headline: "Your students are getting interviews. Are they walking in prepared?",

  subhead:
    "PrepFile gives every student a personalized, company-specific prep brief in 60 seconds — covering the company's culture, likely interview format, and what the interviewer is actually evaluating. No generic tips. No extra coaching hours.",

  valueProps: [
    {
      heading: "Better placement outcomes",
      body:
        "Students who walk in knowing the company's hiring signals, round structure, and evaluation criteria perform better in final rounds. PrepFile turns a good candidate into a well-prepared one — without adding to your team's workload.",
    },
    {
      heading: "Scales to every student, every interview",
      body:
        "One career coach can't personally prep every student for every company. PrepFile does it in parallel — each brief is tailored to the specific company and role, generated from the job description the student already has.",
    },
    {
      heading: "Saves your team 2–3 hours per student per job search",
      body:
        "Stop rebuilding the same company overviews in Notion. Stop fielding \"what should I know about this company?\" the night before an interview. PrepFile handles company research and interview context so your team handles coaching and relationships.",
    },
    {
      heading: "Shows employers your students are serious",
      body:
        "Students who demonstrate company-specific knowledge in the first five minutes signal to interviewers they did the work. That signal matters — especially for new grads competing against experienced candidates.",
    },
  ],

  howItWorks: [
    {
      step: "Student enters the company, role, and job description",
      body:
        "Takes under two minutes. No account setup required for the student — just the information they already have.",
    },
    {
      step: "PrepFile generates a personalized brief",
      body:
        "Covers company competitive position, culture signals, expected interview format and rounds, likely evaluation criteria, and smart questions to ask interviewers.",
    },
    {
      step: "Student walks in informed, not guessing",
      body:
        "Brief is accessible on any device. Students can review on the train, in the lobby, or the night before. No prep guide to maintain, no outdated Glassdoor links.",
    },
    {
      step: "Admin sees who prepared and for which companies",
      body:
        "Your career services dashboard shows which students generated briefs and for which employers — so you can follow up proactively and track which placements came through the pipeline.",
    },
  ],

  pricing: {
    headline: "Transparent pricing. No per-seat accounting.",
    annualLicense: {
      label: "Annual site license",
      price: "$1,500",
      unit: "per year",
      description:
        "All cohorts, unlimited students. One invoice per year — no per-head reporting, no cohort windows. Includes admin dashboard and usage reports.",
    },
    cohortTiers: {
      label: "Per-cohort (if you're not ready to commit annually)",
      tiers: [
        { range: "Up to 30 students", price: "$300 / cohort" },
        { range: "31–80 students", price: "$450 / cohort" },
        { range: "81+ students", price: "$650 / cohort" },
      ],
      description: "Flat fee per cohort regardless of exact enrollment. Invoice once, students get unlimited briefs for their full job search.",
    },
    pilot: {
      label: "Free pilot",
      description:
        "1 cohort free, up to 30 students, no time limit. The only requirement: a 15-minute debrief call with Taurean at cohort end. Available to programs running 4+ cohorts per year with an active career services director.",
    },
  },

  cta: {
    label: "Schedule a 15-minute call",
    subtext: "Talk to Taurean directly. No sales team, no demo deck — just a conversation about whether this fits your program.",
    href: "mailto:taurean@prepfile.work?subject=PrepFile%20for%20Career%20Services%20%E2%80%94%20Pilot%20Interest",
  },
};
