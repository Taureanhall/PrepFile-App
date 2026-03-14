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
  subjectA: "The part of your brief you might have missed",
  subjectB: "What PrepFile Pro adds to your prep",
  previewText: "Blind spots, round expectations, and resume match.",
  body: `Most candidates focus on the company snapshot and interview themes in their brief. But two sections deserve more attention: the blind spots analysis (which flags where your background may not match what the role requires) and the questions to ask (which signal you've done real research).

If you're prepping for multiple roles, Pro gives you unlimited briefs, full round-by-round breakdowns, and resume match against each job description. No weekly limits.

Free briefs are a good start. Pro is what you use when the stakes are higher.`,
  ctaText: "Upgrade to Pro — $14.99/mo",
  ctaUrl: "https://prepfile.work/upgrade",
};

// ─── 2. Feature discovery ────────────────────────────────────────────────────
// Trigger: user generates their first brief

export const featureDiscovery1Email: Email = {
  id: "feature-discovery-1",
  delayDays: 0,
  trigger: "user.brief_created, count == 1",
  subjectA: "You just scratched the surface",
  subjectB: "What the full brief looks like",
  previewText: "Free briefs are concise. Pro briefs go deeper.",
  body: `You ran your first brief. Good.

Free briefs give you the essentials — company snapshot, role signals, and a few interviewer questions. Pro briefs go deeper: full round-by-round expectations, resume match against the job description, and a complete blind spots analysis that shows exactly where your background doesn't map to what the role requires.

If you're interviewing at a competitive company or preparing for multiple roles, that depth matters.

Pro is $14.99/month. Unlimited briefs, brief history, resume match — no weekly limits.`,
  ctaText: "See What Pro Unlocks",
  ctaUrl: "https://prepfile.work/upgrade",
};

export const featureDiscovery2Email: Email = {
  id: "feature-discovery-2",
  delayDays: 1,
  trigger: "user.brief_created + 24h, no upgrade",
  subjectA: "Most interviews aren't won on answers",
  subjectB: "The part of prep that actually moves outcomes",
  previewText: "Resume match changes how you show up in the room.",
  body: `The resume match feature is the part of Pro that changes preparation most.

It runs your resume against the job description and tells you specifically where your experience doesn't align with what the role requires. Not in a general sense — line by line, competency by competency.

That lets you prepare specific stories, reframe experience, or acknowledge gaps before you're asked. Candidates who do this walk in without blind spots.

Free tier doesn't include resume match. Pro does.`,
  ctaText: "Upgrade to Pro — $14.99/mo",
  ctaUrl: "https://prepfile.work/upgrade",
};

export const featureDiscoverySequence: Email[] = [featureDiscovery1Email, featureDiscovery2Email];

// ─── 3. Activation nudge ─────────────────────────────────────────────────────
// Trigger: 24h post-signup, no brief generated yet

export const activationNudgeEmail: Email = {
  id: "activation-nudge",
  delayDays: 1,
  trigger: "user.signup + 24h, no brief created",
  subjectA: "What a PrepFile brief actually shows you",
  subjectB: "You're one job description away from a prep brief",
  previewText: "Company snapshot, round expectations, blind spots — 60 seconds.",
  body: `You signed up yesterday but haven't generated a brief yet.

Here's what PrepFile produces when you paste a job description: a company snapshot covering the competitive position and what drives decisions there, round-by-round expectations for how your interview is likely structured, specific questions to ask your interviewer that signal strategic thinking, and a blind spots section that flags where your background may not match what the role requires.

Not generic interview tips. Specific to the company and role you enter.

Not sure where to start? Use our pre-filled example — one click and you'll see exactly what a brief looks like.`,
  ctaText: "Try with example",
  ctaUrl: "https://prepfile.work/?example=true",
};

// ─── 4. Upgrade nudge ────────────────────────────────────────────────────────
// Trigger: user has generated their 2nd free brief (1 remaining before weekly limit)

export const upgradePromptEmail: Email = {
  id: "upgrade-prompt",
  delayDays: 0,
  trigger: "user.brief_created, count == 2 (free tier)",
  subjectA: "You've used 2 of 3 free briefs — here's what Pro unlocks",
  subjectB: "Unlimited briefs, resume match, full analysis — $14.99/mo",
  previewText: "One free brief left this week.",
  body: `You've generated 2 free briefs. You have one left this week.

Free briefs cover the essentials. Pro briefs include the full round-by-round breakdown, resume match against the job description, brief history across every role you're prepping for, and no weekly limits.

The resume match alone changes how you prep — it shows specifically where your experience doesn't map to what the role requires, so you're not blindsided in the room.

If you have more than one interview coming up, Pro pays for itself.`,
  ctaText: "Upgrade to Pro — $14.99/mo",
  ctaUrl: "https://prepfile.work/upgrade",
};

export const upgradeNudge1Email: Email = {
  id: "upgrade-nudge-1",
  delayDays: 0,
  trigger: "user.brief_created, count == 2 (free tier)",
  subjectA: "2 of 3 free briefs used — your limit resets in 5 days",
  subjectB: "One free brief left this week",
  previewText: "Pro removes the weekly cap entirely.",
  body: `You've used 2 of your 3 free briefs this week. One left before you hit your limit.

If you have more interviews lined up, Pro removes the cap entirely — unlimited briefs, brief history, resume match, and full round-by-round breakdowns.

Pro is $14.99/month. If you'd rather not commit, the Interview Pack is $6.99 one-time for 5 comprehensive briefs with resume match included. No subscription.

Either way, you won't hit another limit.`,
  ctaText: "Upgrade to Pro — $14.99/mo",
  ctaUrl: "https://prepfile.work/upgrade",
};

export const upgradeNudge2Email: Email = {
  id: "upgrade-nudge-2",
  delayDays: 1,
  trigger: "user.brief_created + 24h, count == 2 (free tier), no upgrade",
  subjectA: "No subscription? The Interview Pack is $6.99",
  subjectB: "5 full briefs + resume match, one-time $6.99",
  previewText: "5 comprehensive briefs. No monthly charge.",
  body: `Not ready for a monthly subscription? The Interview Pack is a one-time purchase.

$6.99 gets you 5 comprehensive briefs — full round-by-round breakdowns, resume match against each job description, and no weekly limits. Pay once, use them whenever you need them.

If you have a round of interviews coming up, that's the right option. One brief for each stage: phone screen, technical, behavioral, final panel.

Five is usually enough for a full hiring process.`,
  ctaText: "Get the Interview Pack — $6.99",
  ctaUrl: "https://prepfile.work/upgrade",
};

export const upgradeNudgeSequence: Email[] = [upgradeNudge1Email, upgradeNudge2Email];

// ─── 4. Re-engagement ────────────────────────────────────────────────────────
// Trigger: 3 days since last brief (or signup), no upgrade

export const reengagementEmail: Email = {
  id: "reengagement-1",
  delayDays: 3,
  trigger: "user.last_active_at + 3d, brief_count >= 1, plan = free, no upgrade prompt in 7d",
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

// ─── 5. Upgrade welcome ──────────────────────────────────────────────────────
// Trigger: checkout.session.completed (pro or pack)

export const upgradeWelcomeEmail: Email = {
  id: "upgrade-welcome",
  delayDays: 0,
  trigger: "user.upgraded",
  subjectA: "You're on Pro — here's what's unlocked",
  subjectB: "Pro is active. Here's what changed.",
  previewText: "Unlimited briefs, resume match, and full round breakdowns.",
  body: `You're on Pro.

Unlimited briefs, no weekly cap. Full round-by-round breakdowns for each interview stage. Resume match — run your resume against any job description to see exactly where your experience maps and where it doesn't.

Everything is available now. Log in and generate your next brief.`,
  ctaText: "Open PrepFile",
  ctaUrl: "https://prepfile.work",
};

// ─── 6. Dunning ──────────────────────────────────────────────────────────────
// Trigger: invoice.payment_failed

export const dunningEmail: Email = {
  id: "dunning-1",
  delayDays: 0,
  trigger: "invoice.payment_failed",
  subjectA: "Your PrepFile payment failed",
  subjectB: "Action needed — update your payment method",
  previewText: "Update your card to keep Pro access.",
  body: `Your most recent PrepFile payment didn't go through.

To keep your Pro access, update your payment method in the billing portal. Stripe will retry the charge automatically, but your subscription may pause if it doesn't clear.

Takes 30 seconds to update.`,
  ctaText: "Update Payment Method",
  ctaUrl: "https://prepfile.work",
};

// ─── Sequence arrays (consumed by email-sequences.ts) ────────────────────────

export const welcomeSequence: Email[] = [welcomeEmail, welcome2Email, welcome3Email];
export const reengagementSequence: Email[] = [reengagementEmail, reengagement2Email];

// ─── Export all ──────────────────────────────────────────────────────────────

export const allEmailSequences: Email[] = [
  ...welcomeSequence,
  activationNudgeEmail,
  ...featureDiscoverySequence,
  upgradePromptEmail,
  ...upgradeNudgeSequence,
  ...reengagementSequence,
];
