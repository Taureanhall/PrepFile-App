/**
 * PrepFile Landing Page — Headline + CTA A/B Variants
 *
 * Current (baseline) copy for reference:
 *   badge:       "Personalized prep brief in 60 seconds"
 *   headline:    "Know exactly what the company needs — before you walk in."
 *   subheadline: "Drop in the job description. Get a personalized brief covering
 *                 the company's competitive position, what the interviewer is actually
 *                 evaluating, and the questions to ask that signal strategic thinking
 *                 — in under a minute."
 *   cta:         "Get Your Prep Brief"
 *   sub-cta:     "Free to try — no credit card required"
 *
 * Each variant targets a different conversion angle.
 * FE: swap headline/subheadline/cta into LandingPage.tsx hero section for A/B test.
 */

export interface LandingVariant {
  id: string;
  angle: string;
  badge: string;
  headline: string;
  subheadline: string;
  cta: string;
  rationale: string;
}

export const landingVariants: LandingVariant[] = [
  {
    id: "fear-urgency",
    angle: "Fear / urgency",
    badge: "Interview in the next 48 hours?",
    headline: "Your next interview is closer than you think.",
    subheadline: "Stop winging it. Get a targeted prep brief for your exact role in 60 seconds.",
    cta: "Prep Before It's Late",
    rationale:
      "Loss aversion is a stronger motivator than gain — candidates with an interview on the calendar are the highest-intent users, and this angle converts at the moment they feel the clock ticking.",
  },
  {
    id: "confidence",
    angle: "Confidence",
    badge: "Walk in knowing what they're actually looking for",
    headline: "Walk into any interview feeling genuinely prepared.",
    subheadline: "PrepFile reads the job description and tells you exactly what the interviewer will evaluate — and what to say.",
    cta: "Build Your Confidence",
    rationale:
      "Job seekers' core anxiety is feeling underprepared; this variant sells the emotional outcome (confidence) rather than the feature (brief generation), which resonates with mid-career candidates who know they should prepare but don't know where to start.",
  },
  {
    id: "speed",
    angle: "Speed",
    badge: "Full prep brief in under a minute",
    headline: "Interview prep that works in under five minutes.",
    subheadline: "Paste the job description. Get a personalized brief covering company strategy, role expectations, and smart questions to ask.",
    cta: "Get My Brief Now",
    rationale:
      "Time-constrained candidates (same-day or next-day interviews) will not read long landing pages — leading with speed filters for the highest-urgency segment and sets a clear, credible promise.",
  },
  {
    id: "specificity",
    angle: "Specificity",
    badge: "Built for your exact role, not generic advice",
    headline: "Get a prep brief built for your company and role.",
    subheadline: "Not generic tips. PrepFile generates a brief specific to the company you're interviewing at and the job description you're applying to.",
    cta: "Generate My Brief",
    rationale:
      "The core differentiator from interview prep content sites is specificity — this variant makes that contrast explicit, which is most effective for users who have already tried generic prep and found it lacking.",
  },
  {
    id: "simplicity",
    angle: "Simplicity",
    badge: "Company name + job title = prep brief",
    headline: "Prep smarter, not harder.",
    subheadline: "PrepFile turns your job description into a personalized interview brief — company strategy, role signals, and questions that impress interviewers.",
    cta: "Start Prepping Free",
    rationale:
      "Simplicity-focused copy reduces cognitive load for first-time visitors; leading with the easy input model and pairing with the free entry point lowers the conversion barrier.",
  },
];

/**
 * Baseline (current production copy) — exported separately for reference in A/B framework.
 */
export const landingBaseline: LandingVariant = {
  id: "baseline",
  angle: "Baseline (current)",
  badge: "Personalized prep brief in 60 seconds",
  headline: "Know exactly what the company needs — before you walk in.",
  subheadline:
    "Drop in the job description. Get a personalized brief covering the company's competitive position, what the interviewer is actually evaluating, and the questions to ask that signal strategic thinking — in under a minute.",
  cta: "Get Your Prep Brief",
  rationale: "Current production copy — used as control in any A/B test.",
};
