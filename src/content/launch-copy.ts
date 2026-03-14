// Launch copy — Stripe checkout go-live announcement
// Deploy when Stripe account approval clears and live payments are enabled.

export const launchCopy = {
  // ─── Email blast ───────────────────────────────────────────────────────────
  email: {
    subject: "PrepFile Pro is live — unlimited briefs, resume match, history",
    body: `You signed up for PrepFile when it was free-only. That changes today.

Pro is now available: unlimited briefs, brief history, and resume match for $14.99/month. Or grab an Interview Pack — 5 comprehensive briefs for $6.99, no subscription.

The brief you've been generating in the free tier gives you an overview. Pro gives you the full picture: every round, every signal, what to ask, and where you're likely to get tripped up.

If you have an interview coming up, this is the tool for it.

→ Upgrade at https://prepfile-production.up.railway.app`,
  },

  // ─── Social posts ──────────────────────────────────────────────────────────
  social: {
    linkedin: `PrepFile Pro is live.

You input the company, role, job description, and where you are in the process. You get a full interview brief in under a minute — round structure, what they actually evaluate, what to ask, and your blind spots.

Free tier is still available. Pro unlocks unlimited briefs, brief history, and resume match.

If you're interviewing, it's worth trying once before your next call.

→ https://prepfile-production.up.railway.app`,

    twitter: `PrepFile Pro is live.

Input company + role + JD → get a full interview brief in <1 min.

- Round structure
- What they actually evaluate
- Resume match
- Brief history

$14.99/mo or $6.99 for 5 briefs.

→ prepfile-production.up.railway.app`,

    reddit: `I built a tool that generates a personalized interview prep brief in under a minute — you give it the company, job title, job description, and a few context questions, and it produces a structured breakdown: company snapshot, role-specific signals, round expectations, questions to ask, and blind spots.

Free tier has always been available. Pro just launched — unlimited briefs, history, and resume match for $14.99/month (or $6.99 for 5 briefs, no subscription).

It's at https://prepfile-production.up.railway.app if you want to try it before your next interview.`,
  },

  // ─── In-app banner ─────────────────────────────────────────────────────────
  banner: {
    heading: "Pro is here",
    body: "Unlimited briefs, brief history, and resume match. Upgrade for $14.99/month or grab 5 briefs for $6.99.",
    cta: "Upgrade to Pro",
    ctaHref: "/pricing",
    dismissible: true,
  },
} as const;
