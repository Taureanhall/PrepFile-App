/**
 * Post-payment copy — PrepFile
 *
 * Three copy blocks for the moment a user completes payment.
 * This is peak excitement — the highest-likelihood moment for referral.
 *
 * Blocks:
 *   1. postPaymentEmail       — transactional thank-you sent via Resend after checkout
 *   2. postPaymentSharePrompt — in-app copy shown on the payment success page
 *   3. referralInviteEmail    — template the paying user can forward to friends
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type PostPaymentEmail = {
  id: string;
  trigger: string;
  subjectA: string;
  subjectB: string;
  previewText: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  delayDays: number;
};

export type SharePrompt = {
  id: string;
  heading: string;
  subtext: string;
  tweetText: string;
  linkedInText: string;
  ctaText: string;
};

// ─── 1. Post-payment thank-you email ─────────────────────────────────────────
// Trigger: Stripe checkout.session.completed
// Send via Resend immediately after webhook confirms payment.

export const postPaymentEmail: PostPaymentEmail = {
  id: "post-payment-thank-you",
  trigger: "stripe.checkout.session.completed",
  delayDays: 0,
  subjectA: "You're in — here's what you just unlocked",
  subjectB: "Your PrepFile Pro access is live",
  previewText: "Unlimited briefs, resume match, full round breakdowns.",
  body: `You're in. Good call.

Here's what's now available to you:

- Unlimited prep briefs — no weekly cap
- Full round-by-round breakdowns for every interview stage
- Resume match — upload your resume against any job description and see exactly where your experience aligns and where it doesn't
- Brief history — every brief you've generated, saved and searchable

The resume match is the part most people find most useful. It tells you specifically where your background doesn't map to what the role requires, so you're not blindsided in the room.

Go prep for something that matters.

— The PrepFile team

P.S. Reply to this and tell us about your next interview. We read every reply.`,
  ctaText: "Open PrepFile",
  ctaUrl: "https://prepfile.work",
};

// ─── 2. Post-payment share prompt (in-app success page) ───────────────────────
// Shown on the /success page after Stripe redirects back.
// Pre-written share text for Twitter/X and LinkedIn.

export const postPaymentSharePrompt: SharePrompt = {
  id: "post-payment-share",
  heading: "Know someone interviewing?",
  subtext: "Share PrepFile with them — it takes 60 seconds to generate a brief.",
  tweetText: `Just tried @PrepFileWork and it's the interview prep tool I wish I had earlier.

You enter a company, paste a job description, and get a full prep brief in under a minute — what to expect by interview round, what the company values, and which questions to ask.

Worth trying before your next interview: https://prepfile.work`,
  linkedInText: `I've been using PrepFile to prep for interviews and it's the most useful thing I've found.

Enter a company name and job description → get a structured brief covering the company's competitive position, what they're evaluating in your role, round-by-round format, and the questions you should ask your interviewer.

Takes under a minute. Free tier is solid, Pro is worth it if you're prepping for multiple roles.

https://prepfile.work`,
  ctaText: "Share PrepFile",
};

// ─── 3. Referral invite email template ───────────────────────────────────────
// Copy a paying user can copy-paste and forward to a friend.
// Keep it short and casual — it reads better coming from a friend.

export const referralInviteEmail: PostPaymentEmail = {
  id: "referral-invite",
  trigger: "user.manual_forward",
  delayDays: 0,
  subjectA: "This prep tool is actually good",
  subjectB: "PrepFile — worth trying before your next interview",
  previewText: "Takes 60 seconds. Generates a real brief.",
  body: `Hey,

Saw you're going through interviews — wanted to share something I've been using.

It's called PrepFile. You enter the company, paste the job description, answer a few quick questions, and it generates a full prep brief. What the company cares about in your specific role, what your interview rounds will look like, questions to ask that signal you've done real research, and where your background might have gaps.

Takes under a minute: https://prepfile.work

Free version is solid. If you're interviewing at multiple places, the paid tier removes the weekly limits and adds resume match.

Good luck.`,
  ctaText: "Try PrepFile Free",
  ctaUrl: "https://prepfile.work",
};

// ─── Exports ─────────────────────────────────────────────────────────────────

export const postPaymentCopy = {
  email: postPaymentEmail,
  sharePrompt: postPaymentSharePrompt,
  referralInvite: referralInviteEmail,
};
