/**
 * Product Hunt launch email sequences — 7 behavior-triggered emails for PH users.
 *
 * Trigger detection: referral_source = 'producthunt' (captured via UTM, PRE-322).
 *
 * | # | Trigger                         | Timing    | Email ID           |
 * |---|--------------------------------|-----------|---------------------|
 * | 1 | Signup from PH referrer         | Immediate | ph-welcome          |
 * | 2 | Signup, no brief generated      | +24h      | ph-nudge-24h        |
 * | 3 | Signup, no brief, no return     | +72h      | ph-nudge-72h        |
 * | 4 | Generated 1 brief, no return    | +48h      | ph-brief-followup   |
 * | 5 | Hit 3-brief free limit          | Immediate | ph-free-limit       |
 * | 6 | Converted to Pro/Pack           | +24h      | ph-upgrade-welcome  |
 * | 7 | Pro user, no brief in 7d        | +7d       | ph-pro-reengage     |
 */

import type { Email } from "./emails.js";

// ─── 1. PH Welcome — immediate on signup ────────────────────────────────────

export const phWelcomeEmail: Email = {
  id: "ph-welcome",
  delayDays: 0,
  trigger: "signup, referral_source = producthunt",
  subjectA: "Welcome from Product Hunt — your first brief is free",
  subjectB: "Hey from PrepFile — thanks for finding us on PH",
  previewText: "Enter a company + job description → full interview prep in 60 seconds.",
  body: `Thanks for checking out PrepFile on Product Hunt.

Here's what it does: paste a job description and PrepFile generates a structured interview prep brief — company snapshot, what each round evaluates, questions to ask your interviewer, and blind spots most candidates miss.

Your first brief is free, no card required. Takes about 60 seconds.

If you're prepping for an interview right now, this is the fastest way to walk in prepared.`,
  ctaText: "Generate My First Brief",
  ctaUrl: "https://prepfile.work",
};

// ─── 2. Signup, no brief generated — +24h ───────────────────────────────────

export const phNudge24hEmail: Email = {
  id: "ph-nudge-24h",
  delayDays: 1,
  trigger: "signup + 24h, no brief, referral_source = producthunt",
  subjectA: "Here's what a PrepFile brief looks like",
  subjectB: "You signed up yesterday — here's a sample brief",
  previewText: "See a real brief before you create your own.",
  body: `You signed up from Product Hunt yesterday but haven't generated a brief yet.

Here's what you get when you paste a job description: a company snapshot with competitive positioning and recent signals, round-by-round interview structure, specific questions to ask your interviewer, and a blind spots analysis showing where your background may not match the role.

Not generic tips — specific to the company and role you enter.

Try with our pre-filled example to see exactly what a brief looks like. One click.`,
  ctaText: "Try the Example Brief",
  ctaUrl: "https://prepfile.work/?example=true",
};

// ─── 3. Signup, no brief, no return — +72h ──────────────────────────────────

export const phNudge72hEmail: Email = {
  id: "ph-nudge-72h",
  delayDays: 3,
  trigger: "signup + 72h, no brief, referral_source = producthunt",
  subjectA: "One job description is all you need",
  subjectB: "Your PrepFile account is still waiting",
  previewText: "Paste a JD, get a full prep brief in under a minute.",
  body: `You signed up a few days ago but haven't tried it yet.

If you don't have a job description handy, try the pre-filled example — it generates a full brief so you can see exactly what PrepFile produces.

Company snapshot, round expectations, questions to ask, blind spots. All from one job description.

No commitment. Your free brief doesn't expire.`,
  ctaText: "Try with a Sample JD",
  ctaUrl: "https://prepfile.work/?example=true",
};

// ─── 4. Generated 1 brief, no return — +48h ─────────────────────────────────

export const phBriefFollowupEmail: Email = {
  id: "ph-brief-followup",
  delayDays: 2,
  trigger: "1 brief + 48h, no return, referral_source = producthunt",
  subjectA: "How did the prep go?",
  subjectB: "Your brief is saved — ready for the next one?",
  previewText: "Generate another brief for your next interview.",
  body: `You generated a brief a couple days ago. How's the prep going?

If you have another interview lined up, PrepFile builds a separate brief for each role. Different company, different round structure, different questions to ask.

You have 2 free briefs remaining. Each one takes under a minute.`,
  ctaText: "Generate Another Brief",
  ctaUrl: "https://prepfile.work",
};

// ─── 5. Hit 3-brief free limit — immediate ──────────────────────────────────

export const phFreeLimitEmail: Email = {
  id: "ph-free-limit",
  delayDays: 0,
  trigger: "3rd free brief generated, referral_source = producthunt",
  subjectA: "You've used all 3 free briefs — here's what's next",
  subjectB: "Free briefs used up — two options",
  previewText: "Pro: $14.99/mo unlimited. Pack: $6.99 one-time for 5.",
  body: `You've generated 3 free briefs — that's the limit for free accounts.

Two options if you're still interviewing:

Pro ($14.99/month) — unlimited briefs, full round-by-round breakdowns, resume match against each job description, and brief history across every role you're prepping for.

Interview Pack ($6.99 one-time) — 5 comprehensive briefs with resume match. No subscription, no expiry.

As a Product Hunt user, you're among the first to try PrepFile. Pro subscribers in the first 50 get founding member status with 5 bonus briefs.`,
  ctaText: "Compare Plans",
  ctaUrl: "https://prepfile.work",
};

// ─── 6. Converted to Pro/Pack — +24h ────────────────────────────────────────

export const phUpgradeWelcomeEmail: Email = {
  id: "ph-upgrade-welcome",
  delayDays: 1,
  trigger: "checkout.session.completed, referral_source = producthunt",
  subjectA: "You're upgraded — here's what just unlocked",
  subjectB: "Pro is active — here's how to get the most from it",
  previewText: "Resume match, unlimited briefs, brief history — all live.",
  body: `Your upgrade is live.

Here's what changed:

Resume Match — upload your resume alongside any job description. PrepFile shows you exactly where your experience maps to the role and where it doesn't, so you can prepare specific stories for the gaps.

Unlimited briefs — no weekly cap. Generate a brief for every role you're considering.

Brief history — all your briefs are saved and searchable. Compare prep across companies.

If you found PrepFile through Product Hunt, we'd genuinely appreciate an upvote or review. It helps other job seekers find the tool.`,
  ctaText: "Generate a Pro Brief",
  ctaUrl: "https://prepfile.work",
};

// ─── 7. Pro user, no brief in 7d — +7d ──────────────────────────────────────

export const phProReengageEmail: Email = {
  id: "ph-pro-reengage",
  delayDays: 7,
  trigger: "pro user, no brief in 7d, referral_source = producthunt",
  subjectA: "Haven't used PrepFile in a week — still interviewing?",
  subjectB: "Your Pro account is ready when you are",
  previewText: "Unlimited briefs + resume match, whenever you need them.",
  body: `It's been a week since your last brief. If you're still in interview mode, PrepFile is ready whenever you are.

Resume match, unlimited briefs, full round breakdowns — all still active on your Pro account.

Interviews come in waves. When your next one lands, you're one job description away from being prepared.`,
  ctaText: "Open PrepFile",
  ctaUrl: "https://prepfile.work",
};

// ─── Exports ─────────────────────────────────────────────────────────────────

export const allPhEmails: Email[] = [
  phWelcomeEmail,
  phNudge24hEmail,
  phNudge72hEmail,
  phBriefFollowupEmail,
  phFreeLimitEmail,
  phUpgradeWelcomeEmail,
  phProReengageEmail,
];
