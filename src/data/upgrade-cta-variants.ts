export interface UpgradeCTAVariant {
  id: string;
  headline: string;
  body: string;
  cta: string;
  lever: "urgency" | "loss_aversion" | "social_proof" | "scarcity" | "aspirational";
}

// Jordan's copy variants (PRE-257) — rotate these on the post-brief nudge
export const jordanCTAVariants: UpgradeCTAVariant[] = [
  {
    id: "jordan-a-feature-gap",
    headline: "You're missing half the brief.",
    body: "Free briefs skip round expectations and blind spot analysis — the parts that actually change how you prep. Pro unlocks the full picture.",
    cta: "Upgrade to Pro — $9.99/month",
    lever: "loss_aversion",
  },
  {
    id: "jordan-b-confidence",
    headline: "Go in knowing more than the other candidates.",
    body: "Pro users get round-by-round expectations, a resume match against the role, and unlimited briefs. Free users get a start.",
    cta: "Get full access →",
    lever: "aspirational",
  },
  {
    id: "jordan-c-urgency",
    headline: "Your interview is soon. Your brief isn't done.",
    body: "Pro briefs include what questions to ask, what signals interviewers look for, and how your resume stacks up. Upgrade before you walk in.",
    cta: "Unlock the full brief",
    lever: "urgency",
  },
];

export const upgradeCTAVariants: UpgradeCTAVariant[] = [
  {
    id: "v1-urgency",
    headline: "Your interview is closer than you think.",
    body: "The free brief covers the surface. Your interviewer is already prepared to probe deeper — round expectations, scoring signals, and your specific blind spots aren't in the free version.",
    cta: "Get the Full Brief",
    lever: "urgency",
  },
  {
    id: "v2-loss-aversion",
    headline: "You just saw what was left out.",
    body: "Round-by-round question types, what your interviewer is actually scoring, and your resume gaps against this role — none of that is in the free brief. Those are the things that end interviews early.",
    cta: "Unlock What's Missing",
    lever: "loss_aversion",
  },
  {
    id: "v3-social-proof",
    headline: "Most offers go to the overprepared candidate.",
    body: "Pro briefs include the full round breakdown, resume-to-role match analysis, and interviewer scoring signals — the details that most candidates never think to research. It takes 10 minutes.",
    cta: "Prep Like a Pro Candidate",
    lever: "social_proof",
  },
  {
    id: "v4-scarcity",
    headline: "3 free briefs. You've used one.",
    body: "You have 2 briefs left this week. If you're interviewing at multiple companies, that limit will hit before you're done. Upgrade to Pro for unlimited briefs, full detail, and brief history.",
    cta: "Go Unlimited",
    lever: "scarcity",
  },
  {
    id: "v5-aspirational",
    headline: "Walk in knowing what other candidates don't.",
    body: "Your full brief includes the questions your interviewer is likely to ask by round, how your resume maps to this specific role, and the blind spots most candidates overlook. The prep you'd do in 10 hours, done in 10 minutes.",
    cta: "Get My Full Brief",
    lever: "aspirational",
  },
];
