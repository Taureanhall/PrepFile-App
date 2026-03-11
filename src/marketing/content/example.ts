/**
 * Example content file — use this as a template for new company interview prep pages.
 *
 * To add a new company:
 * 1. Copy this file and rename it to <company-slug>.ts (e.g. stripe.ts)
 * 2. Fill in all fields below
 * 3. Import and add the entry to InterviewPrepPage.tsx → COMPANIES record
 * 4. Add the slug to INTERVIEW_PREP_PAGES in server.ts for SEO meta injection
 * 5. The slug must match the filename and URL: /interview-prep/<slug>
 *
 * Slug rules: lowercase, hyphens only (e.g. "goldman-sachs", "jp-morgan")
 *
 * Schema matches CompanyData interface in InterviewPrepPage.tsx.
 */

export const content = {
  /** URL slug — must match filename and COMPANIES key */
  slug: "example-company",

  /** Display name used in headings and CTAs */
  name: "Example Company",

  /** Page subtitle shown under the H1 */
  tagline: "How to Prepare for an Example Company Interview",

  /** Browser tab title — keep under 60 chars */
  metaTitle: "How to Prepare for an Example Company Interview | PrepFile",

  /** Meta description shown in search results — keep under 160 chars */
  metaDescription:
    "Everything you need to prepare for an Example Company interview: culture, hiring process, what they look for, and tips. Get a personalized prep brief in 10 minutes.",

  /** Opening paragraph — company-specific, not generic interview advice */
  intro:
    "Example Company is known for its rigorous hiring process and strong engineering culture. Understanding how they evaluate candidates — before you prep a single answer — gives you a structural edge over everyone who prepares generically.",

  /** Culture section — what values drive decisions, what they reward */
  culture: {
    heading: "Example Company's Culture",
    body: "Describe what makes this company's culture distinctive. What values drive decisions? What does the company reward — speed, rigor, ownership, collaboration? What would a new hire find surprising in the first 90 days?",
  },

  /** Hiring process — stages, formats, timeline */
  hiring: {
    heading: "The Hiring Process",
    body: "Walk through the interview stages: screens, assessments, onsite format, number of rounds, who's in the room (e.g. Bar Raiser, hiring committee), and typical timeline from application to offer.",
  },

  /** What they evaluate — question types, signals, failure modes */
  lookFor: {
    heading: "What Example Company Looks For",
    body: "Be specific about what interviewers evaluate: question types (LeetCode difficulty, case-style, behavioral STAR), signals they weight (ownership, structured thinking, communication), and common failure modes to avoid.",
  },

  /**
   * Concrete prep tips — rendered as a bulleted list.
   * 3–5 specific, actionable tips. Not generic interview advice.
   */
  tips: [
    "Research their recent product launches and be ready to discuss what you would have done differently.",
    "Prepare a strong ownership story — a project you drove end-to-end with measurable impact.",
    "Practice explaining technical decisions in plain language; they test communication, not just knowledge.",
    "Know their core values by name and have examples ready for each.",
  ],

  /** Company name as it appears in the CTA button: 'Generate my [X] brief' */
  ctaCompany: "Example Company",
};
