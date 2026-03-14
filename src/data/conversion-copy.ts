/**
 * Conversion Copy Package — PrepFile
 * Authored by: Marketing Agent
 * Task: PRE-100
 *
 * Covers: pricing page, upgrade nudges, social proof, post-brief CTA.
 * Tone: direct, specific, no fluff. Free users have already seen value — copy bridges to the full version.
 */

// ─── Pricing Page ─────────────────────────────────────────────────────────────

export const pricingPage = {
  headline: "Get the full picture before you walk in.",
  subheadline:
    "Free briefs give you a starting point. Pro gives you the complete brief — every round, every signal, your blind spots, and how your resume actually maps to the role.",

  tiers: [
    {
      name: "Free",
      price: "$0",
      billingNote: "No credit card required",
      limit: "3 briefs per week",
      briefQuality: "Concise brief",
      features: [
        "Company overview and competitive snapshot",
        "2 role signals",
        "Basic prep direction",
        "3 briefs per week",
      ],
      cta: "Start free",
      ctaVariant: "secondary" as const,
      highlight: false,
    },
    {
      name: "Pro",
      price: "$14.99",
      billingNote: "per month, cancel anytime",
      limit: "Unlimited briefs",
      briefQuality: "Comprehensive brief",
      badge: "Most popular",
      features: [
        "Unlimited full briefs",
        "Complete round-by-round breakdown",
        "All role signals + evaluation criteria",
        "Questions to ask your interviewer",
        "Blind spot analysis",
        "Resume match — see how your background maps to the role",
        "Brief history saved",
      ],
      cta: "Upgrade to Pro",
      ctaVariant: "primary" as const,
      highlight: true,
    },
    {
      name: "Interview Pack",
      price: "$6.99",
      billingNote: "one-time, no subscription",
      limit: "5 briefs",
      briefQuality: "Comprehensive brief",
      features: [
        "5 full briefs",
        "Complete round-by-round breakdown",
        "All role signals + evaluation criteria",
        "Questions to ask your interviewer",
        "Blind spot analysis",
        "Resume match included",
      ],
      cta: "Get 5 briefs",
      ctaVariant: "secondary" as const,
      highlight: false,
    },
  ],

  comparisonTable: {
    heading: "Free vs. Pro — what you actually get",
    rows: [
      {
        feature: "Company snapshot",
        free: true,
        pro: true,
        pack: true,
      },
      {
        feature: "Role signals",
        free: "2 signals",
        pro: "Full signal set",
        pack: "Full signal set",
      },
      {
        feature: "Round-by-round expectations",
        free: false,
        pro: true,
        pack: true,
      },
      {
        feature: "Questions to ask interviewers",
        free: false,
        pro: true,
        pack: true,
      },
      {
        feature: "Blind spot analysis",
        free: false,
        pro: true,
        pack: true,
      },
      {
        feature: "Resume match",
        free: false,
        pro: true,
        pack: true,
      },
      {
        feature: "Brief history",
        free: false,
        pro: true,
        pack: false,
      },
      {
        feature: "Briefs per week",
        free: "3",
        pro: "Unlimited",
        pack: "5 total",
      },
    ],
  },

  faq: [
    {
      q: "What's the difference between a free brief and a Pro brief?",
      a: "Free briefs give you a company overview and two role signals — enough to orient yourself before a first call. Pro briefs are comprehensive: every round mapped out, the full set of evaluation signals, questions to ask your interviewers, and a blind spot analysis specific to your background. Resume match is also included with Pro and Pack.",
    },
    {
      q: "What is resume match?",
      a: "Resume match compares your uploaded resume against the brief to identify where your experience maps strongly, where there are gaps, and what to emphasize or address in the interview. It's included with Pro and the Interview Pack.",
    },
    {
      q: "Can I cancel Pro anytime?",
      a: "Yes. Cancel from your account at any time. Your Pro access stays active until the end of your billing period.",
    },
    {
      q: "What's the Interview Pack for?",
      a: "If you're not job hunting regularly and don't want a monthly subscription, the Pack gives you 5 full briefs at a flat $6.99. No recurring charge. Useful if you have a few interviews coming up and want comprehensive prep without committing to a subscription.",
    },
    {
      q: "How long does it take to generate a brief?",
      a: "Under a minute. You input the company name, job title, job description, and a few context questions. PrepFile generates the full brief immediately.",
    },
    {
      q: "Do I need to upload a resume?",
      a: "No — you can generate a brief without a resume. Resume match is an optional add-on available after your brief is generated, included with Pro and Pack.",
    },
  ],
} as const;

// ─── Upgrade Nudges ───────────────────────────────────────────────────────────
// Shown after a free brief is generated. <30 words each. Reference what the user just did.

export const upgradeNudges = [
  {
    id: "nudge-1",
    trigger: "post_brief_generation",
    copy: "You got the overview. Pro shows you every round, every evaluation signal, and where your resume lands. Upgrade for $14.99/month.",
    cta: "Upgrade to Pro",
  },
  {
    id: "nudge-2",
    trigger: "post_brief_generation",
    copy: "Your brief is trimmed. The full version includes blind spot analysis, round expectations, and resume match — all in the same brief.",
    cta: "Get the full brief",
  },
  {
    id: "nudge-3",
    trigger: "post_brief_generation",
    copy: "One interview coming up? The Interview Pack gives you 5 full briefs for $6.99. No subscription.",
    cta: "Get 5 briefs — $6.99",
  },
  {
    id: "nudge-4",
    trigger: "post_brief_generation",
    copy: "This brief covered the company. Pro tells you what the interviewer will actually evaluate — and what questions to ask them.",
    cta: "Unlock full brief",
  },
  {
    id: "nudge-5",
    trigger: "post_brief_generation",
    copy: "See how your resume maps to this role. Resume match is included with Pro and the Interview Pack.",
    cta: "Add resume match",
  },
] as const;

// ─── Social Proof Blocks ──────────────────────────────────────────────────────
// Populate with real user quotes when available. Do not use fabricated testimonials.

export const socialProof = [] as const;

// ─── Post-Brief CTA ───────────────────────────────────────────────────────────
// Shown after a user reads their free brief. Bridges from value received → full version.

export const postBriefCta = {
  heading: "See how your resume stacks up against this role",
  subheading:
    "You have the company overview. The full brief adds every round, every evaluation signal, your blind spots, and a resume match — so you know exactly what to lead with.",
  primaryCta: {
    label: "Unlock full brief — $14.99/mo",
    href: "/pricing",
  },
  secondaryCta: {
    label: "Get 5 briefs for $6.99",
    href: "/pricing",
  },
  dismissLabel: "Continue with free brief",
  valueRestatement: "No generic tips. No filler. Just what this company actually evaluates.",

  // Variant with more urgency — use when user is on their last free brief
  urgencyVariant: {
    heading: "Last free brief of the week",
    subheading:
      "Make it count — or upgrade to Pro for unlimited briefs and the full breakdown, including round expectations, blind spots, and resume match.",
    primaryCta: {
      label: "Upgrade to Pro",
      href: "/pricing",
    },
    secondaryCta: {
      label: "Get 5 briefs for $6.99",
      href: "/pricing",
    },
  },
} as const;
