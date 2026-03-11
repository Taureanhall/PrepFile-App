/**
 * Email nurture sequences — PrepFile
 *
 * Four event-triggered sequences (wired via Resend):
 *   1. welcome          — sent immediately on signup
 *   2. activation-nudge — sent 24h post-signup if no brief has been created
 *   3. upgrade-prompt   — sent after user generates their 2nd free brief
 *   4. reengagement     — sent 7 days after last visit if no brief generated in that window
 *
 * Each email includes two subject variants for A/B testing.
 * Body: plain text only, under 150 words.
 * ctaUrl: replace with dynamic URL at send time where noted.
 */

export type Email = {
  id: string;
  trigger: string;               // human-readable trigger condition for Resend wiring
  subjectA: string;              // A/B variant A
  subjectB: string;              // A/B variant B
  previewText: string;
  body: string;                  // plain text, no HTML
  ctaText: string;
  ctaUrl: string;                // use production URL or dynamic URL at send time
  delayDays: number;             // days after trigger before sending (0 = immediate)
};

// ─── 1. Welcome ─────────────────────────────────────────────────────────────
// Trigger: user completes signup

export const welcomeEmail: Email = {
  id: "welcome-1",
  delayDays: 0,
  trigger: "user.signup",
  subjectA: "Your first brief takes 60 seconds",
  subjectB: "PrepFile is ready — here's how to use it",
  previewText: "Enter a company, paste a job description, get a prep brief.",
  body: `Thanks for signing up.

Here's how PrepFile works: enter a company name, your job title, and paste the job description. Answer 4 quick questions about your interview situation. PrepFile generates a prep brief covering the company's competitive position, what your interviewer is evaluating in this role, the round structure you should expect, and the questions you should be asking.

It takes under a minute. Most users find something in the brief they hadn't thought about.

Generate your first one now.`,
  ctaText: "Create My First Brief",
  ctaUrl: "https://prepfile.work",
};

export const welcome2Email: Email = {
  id: "welcome-2",
  delayDays: 2,
  trigger: "user.signup + 2d",
  subjectA: "One thing most candidates skip",
  subjectB: "The part of prep most people miss",
  previewText: "It's the questions you ask the interviewer.",
  body: `Most candidates prep answers. Few prep questions.

The questions you ask your interviewer signal whether you've done surface-level research or actually understand the role. PrepFile generates interviewer questions tailored to the specific company and position — the kind that make the interviewer think "this person gets it."

If you haven't generated a brief yet, it takes under a minute.`,
  ctaText: "Generate a Brief",
  ctaUrl: "https://prepfile.work",
};

export const welcome3Email: Email = {
  id: "welcome-3",
  delayDays: 5,
  trigger: "user.signup + 5d",
  subjectA: "How PrepFile users prep differently",
  subjectB: "What changes when you have a prep brief",
  previewText: "Structure beats volume.",
  body: `The difference between a good interview and a great one usually comes down to preparation structure, not volume.

PrepFile gives you a single document that covers what the company values in this role, what each round is designed to evaluate, where your background may have gaps, and what to ask that shows you've done real research.

One brief. Under a minute. Everything you need in one place.`,
  ctaText: "Create a Brief",
  ctaUrl: "https://prepfile.work",
};

// ─── 2. Activation nudge ─────────────────────────────────────────────────────
// Trigger: 24h post-signup, no brief generated yet

export const activationNudgeEmail: Email = {
  id: "activation-nudge",
  delayDays: 1,
  trigger: "user.signup + 24h, no brief created",
  subjectA: "Haven't tried PrepFile yet?",
  subjectB: "What you get in 60 seconds",
  previewText: "Paste a job description. That's the whole input.",
  body: `You signed up yesterday but haven't generated a brief yet.

Here's what PrepFile produces: a structured summary of what the company looks for in your specific role, what your interview rounds will likely include, questions to ask your interviewer that show strategic thinking, and where your background may have gaps relative to the job description.

You need a job description and a company name. That's it. Takes 60 seconds.

If you have an interview scheduled, now is a good time.`,
  ctaText: "Generate a Brief",
  ctaUrl: "https://prepfile.work",
};

// ─── 3. Upgrade prompt ───────────────────────────────────────────────────────
// Trigger: user has generated their 2nd free brief (1 remaining before weekly limit)

export const upgradePromptEmail: Email = {
  id: "upgrade-prompt",
  delayDays: 0,
  trigger: "user.brief_created, count == 2 (free tier)",
  subjectA: "You've used 2 of 3 free briefs — here's what Pro unlocks",
  subjectB: "Unlimited briefs, resume match, full analysis — $9.99/mo",
  previewText: "One free brief left this week.",
  body: `You've generated 2 free briefs. You have one left this week.

Free briefs cover the essentials. Pro briefs include the full round-by-round breakdown, resume match against the job description, brief history across every role you're prepping for, and no weekly limits.

The resume match alone changes how you prep — it shows specifically where your experience doesn't map to what the role requires, so you're not blindsided in the room.

If you have more than one interview coming up, Pro pays for itself.`,
  ctaText: "Upgrade to Pro — $9.99/mo",
  ctaUrl: "https://prepfile.work/upgrade",
};

// ─── 4. Re-engagement ────────────────────────────────────────────────────────
// Trigger: 7 days since last app visit, no brief generated in that window

export const reengagementEmail: Email = {
  id: "reengagement-1",
  delayDays: 7,
  trigger: "user.last_visit + 7d, no brief in 7d",
  subjectA: "Still preparing for that interview?",
  subjectB: "Your PrepFile account is here when you need it",
  previewText: "When you have a job description, you're ready.",
  body: `When you have an interview coming up, PrepFile turns one job description into a structured prep brief — what the company is looking for in your role, what interview format to expect, the questions you should ask your interviewer, and where you might be underprepared.

Takes under a minute. No account setup needed beyond what you've already done.

If you have something lined up, now is a good time to run one.`,
  ctaText: "Open PrepFile",
  ctaUrl: "https://prepfile.work",
};

export const reengagement2Email: Email = {
  id: "reengagement-2",
  delayDays: 14,
  trigger: "user.last_visit + 14d, no brief in 14d",
  subjectA: "One brief before your next interview",
  subjectB: "PrepFile is still here when you need it",
  previewText: "60 seconds of prep that changes the conversation.",
  body: `Interviews come in waves. When your next one lands, PrepFile turns a job description into a structured prep brief — company context, role expectations, likely interview format, and questions that show strategic thinking.

No setup required. You already have an account.

When you're ready, it takes under a minute.`,
  ctaText: "Open PrepFile",
  ctaUrl: "https://prepfile.work",
};

// ─── Sequence arrays (consumed by email-sequences.ts) ────────────────────────

export const welcomeSequence: Email[] = [welcomeEmail, welcome2Email, welcome3Email];
export const reengagementSequence: Email[] = [reengagementEmail, reengagement2Email];

// ─── Export all ──────────────────────────────────────────────────────────────

export const allEmailSequences: Email[] = [
  ...welcomeSequence,
  activationNudgeEmail,
  upgradePromptEmail,
  ...reengagementSequence,
];
