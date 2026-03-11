/**
 * Example content file — use this as a template for new company interview prep pages.
 *
 * To add a new company:
 * 1. Copy this file and rename it to <company-slug>.ts (e.g. stripe.ts)
 * 2. Fill in all fields below
 * 3. Import and add the content to InterviewPrepPage.tsx → COMPANIES record
 * 4. The slug must match the filename (used in the URL: /interview-prep/<slug>)
 *
 * Slug rules: lowercase, hyphens only (e.g. "goldman-sachs", "jp-morgan")
 */

export const slug = "example-company";

export const content = {
  /** Browser tab title and OG title — keep under 60 chars */
  metaTitle: "How to Prepare for an Example Company Interview | PrepFile",

  /** Meta description shown in search results — keep under 160 chars */
  metaDescription:
    "Everything you need to ace an Example Company interview: culture, hiring process, what they look for, and tips. Generate a personalized prep brief in 10 minutes.",

  /** Page H1 — typically "How to Prepare for a [Company] Interview" */
  h1: "How to Prepare for an Example Company Interview",

  /** Opening paragraph — sets context for why this company's process is distinctive */
  intro:
    "Example Company is known for its rigorous hiring process and strong engineering culture. Understanding how they think about candidates — before you prep a single answer — gives you a structural edge over everyone else who prepares generically.",

  /**
   * Main content sections — render as h2 + body paragraph.
   * Recommended: 3 sections covering culture, hiring process, and what they look for.
   * Add more as needed; they render in order.
   */
  sections: [
    {
      heading: "Example Company's Culture",
      body: "Describe what makes this company's culture distinctive. What values drive decisions? What does the company reward — speed, rigor, ownership, collaboration? What would a new hire find surprising in the first 90 days?",
    },
    {
      heading: "The Hiring Process",
      body: "Walk through the interview stages: screens, assessments, onsite format, number of rounds, who's in the room (e.g. Bar Raiser, hiring committee), and typical timeline from application to offer.",
    },
    {
      heading: "What Example Company Looks For",
      body: "Be specific about what interviewers evaluate: question types (LeetCode difficulty, case-style, behavioral STAR), signals they weight (ownership, structured thinking, communication), and common failure modes.",
    },
  ],

  /** CTA block at the bottom of the page */
  cta: {
    headline: "Get a personalized Example Company interview brief in 10 minutes",
    subtext:
      "PrepFile analyzes your job description and generates a precise prep brief: company signals, role intelligence, round expectations, and questions that show you've done your homework.",
    buttonLabel: "Generate my Example Company brief →",
  },
};
