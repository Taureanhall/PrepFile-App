/**
 * Email nurture sequences — PrepFile
 *
 * Two sequences:
 *   1. welcome  — sent to new signups (3 emails: immediate, day 2, day 5)
 *   2. reengagement — sent to inactive users (2 emails: day 7, day 14)
 *
 * Each email: subject, previewText, body (plain text), ctaText, ctaUrl (placeholder).
 * FE wires into Resend (or equivalent) transactional email API.
 * Keep each email under 150 words. No HTML formatting in body — plain text only.
 */

export type Email = {
  id: string;
  subject: string;
  previewText: string;
  body: string;
  ctaText: string;
  ctaUrl: string; // Replace with actual URL at send time (may be dynamic)
  delayDays: number; // Days after trigger event to send
};

export const welcomeSequence: Email[] = [
  {
    id: "welcome-1",
    delayDays: 0,
    subject: "Your first brief takes 60 seconds",
    previewText: "Here's what PrepFile actually does.",
    body: `Thanks for signing up.

Here's how PrepFile works: enter a company name, your job title, paste the job description, and answer 4 quick questions about your interview situation. You get a personalized prep brief — company snapshot, what the role actually requires, what your interviewer is evaluating, and the questions you should be asking.

It takes 60 seconds to generate. Most users say it surfaces something they didn't already know.

Generate your first one now.`,
    ctaText: "Generate My First Brief",
    ctaUrl: "https://prepfile-production.up.railway.app",
  },
  {
    id: "welcome-2",
    delayDays: 2,
    subject: "What the free brief doesn't include",
    previewText: "Pro goes deeper. Here's exactly how.",
    body: `The free brief covers the essentials: company snapshot, role context, a few key signals.

The Pro brief goes further: full round-by-round expectations, questions to ask your interviewer that signal strategic thinking, and a resume match that shows where you're underprepared for this specific role.

One way to see the difference: generate a brief for a Google PM role versus a Director role at an early-stage startup. The interview is a different game. PrepFile adjusts.`,
    ctaText: "Try a Google Brief",
    ctaUrl: "https://prepfile-production.up.railway.app",
  },
  {
    id: "welcome-3",
    delayDays: 5,
    subject: "Most people prep the night before",
    previewText: "That's the mistake. Here's how to avoid it.",
    body: `Most job seekers Google "[Company] interview questions" the night before, get the same recycled lists, and walk in with generic answers.

PrepFile users spend 30 minutes with a brief personalized to their role, their background, and the specific job description. They go in knowing what the interviewer is actually evaluating — not what a forum post guesses they care about.

Pro is $9.99/month. One good prep session is worth more than a month of anxious Googling.`,
    ctaText: "Upgrade to Pro",
    ctaUrl: "https://prepfile-production.up.railway.app",
  },
];

export const reengagementSequence: Email[] = [
  {
    id: "reengagement-1",
    delayDays: 7, // 7 days since last activity
    subject: "Your next interview is closer than you think",
    previewText: "A brief takes 60 seconds.",
    body: `You signed up for PrepFile a week ago. If you haven't generated a brief yet, this is a good time.

Most people wait until 24 hours before an interview to prep. The ones who do best start a few days early — they know the company's competitive position, what the role actually demands, and what questions to ask.

Takes 60 seconds to generate. Whether you have an interview scheduled or not, run one for your target role.`,
    ctaText: "Generate a Brief",
    ctaUrl: "https://prepfile-production.up.railway.app",
  },
  {
    id: "reengagement-2",
    delayDays: 14, // 14 days since last activity
    subject: "New: Stripe, Notion, Figma interview guides",
    previewText: "Company-specific prep pages, freshly researched.",
    body: `We've added interview guides for Stripe, Notion, Figma, and more — covering each company's hiring process, what they look for, and how to approach the interview.

These are a solid starting point. The brief you generate in PrepFile goes deeper: personalized to your role, your background, and the specific job description you're applying to.

Start with the Stripe guide, then generate a brief for your target role.`,
    ctaText: "Read the Stripe Guide",
    ctaUrl: "https://prepfile-production.up.railway.app/interview-prep/stripe",
  },
];
