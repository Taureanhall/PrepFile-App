/**
 * PrepFile Launch Deployment Checklist
 * PRE-99 — copy-paste ready assets for all distribution channels.
 * Board executes from this file. No edits required before posting.
 */

export const launchChecklist = {

  // ─── 1. REDDIT ─────────────────────────────────────────────────────────────

  reddit: {
    primarySubreddit: "r/cscareerquestions",
    postTitle: "I got tired of generic interview advice so I built a tool that generates a personalized prep brief in under a minute",
    postBody: `Every time I prep for an interview I do the same annoying ritual: open 10 tabs, read the same "tell me about yourself" tips, and forget half of it by interview day.

So I built PrepFile — you put in the company, job title, job description, and answer 4 quick questions (what round, how familiar are you with the company, how much prep time, what's your biggest gap). It generates a structured brief covering:

- Company snapshot and strategy signals
- What this specific role actually evaluates
- Round expectations with likely question types
- Questions to ask your interviewers
- Blind spots you might be missing

Free tier gives you 3 briefs/week. I used it for my last 3 interviews and it's replaced my entire tab-hoarding habit.

Try it here: https://prepfile-production.up.railway.app

Feedback welcome — especially if the brief misses something important for your role.`,
    executionNotes: "Post Tuesday–Thursday 9–11am EST or 7–9pm EST. Comment actively in the first 30 minutes — early engagement determines front-page visibility. Reply to every comment. Do NOT cross-post to other subreddits on the same day.",
    secondarySubreddits: [
      { name: "r/interviews", bestTime: "Mon/Wed 6–9pm EST", waitDays: 2 },
      { name: "r/jobs", bestTime: "Sun evening / Mon 8–10am EST", waitDays: 3 },
      { name: "r/jobsearchhacks", bestTime: "Tue/Thu 7–9pm EST", waitDays: 4 },
      { name: "r/careerguidance", bestTime: "Wed 12–2pm EST", waitDays: 5 },
    ],
  },

  // ─── 2. LINKEDIN ───────────────────────────────────────────────────────────

  linkedin: {
    postBody: `I bombed an interview at a company I really wanted to work at.

Not because I didn't know the technical content. Because I hadn't done the right kind of prep.

I knew the company's Wikipedia page. I didn't know their current strategic priorities or what they were actually hiring for in that quarter. I gave generic answers when they wanted signals about how I think about their specific problems.

After that, I changed how I prep. I go deep on: the company's current focus, what the role is actually evaluated on (not just the JD), what questions make you look like you've done real homework, and where I'm likely to be weak given my background.

I eventually built a tool that does this automatically — you paste the JD, answer 4 questions, and get a structured prep brief in under a minute.

If you have an interview coming up, try it free: https://prepfile-production.up.railway.app

What's been the biggest gap in your interview prep that generic advice never covers? Drop it in the comments.`,
    executionNotes: "Post Tuesday or Wednesday, 7–9am EST. Personal story format performs best organically.",
  },

  // ─── 3. BLIND ──────────────────────────────────────────────────────────────

  blind: {
    postTitle: "Built a tool that generates a personalized interview prep brief from your JD — free, takes 1 min",
    postBody: `Most interview prep tools give you the same generic advice. If you're interviewing at Meta, Google, Stripe, or wherever — you already know the STAR method. What you actually need is:

- What is this company's current strategic posture (and what does that mean for your role)
- What specifically does this team evaluate in this round
- What questions make you look like you've done real homework
- Where you're likely to slip up given your background

I built PrepFile to generate exactly that. You paste in the JD, tell it what round you're in and your prep situation, and it generates a structured brief in under a minute.

Free tier: 3 briefs/week. Pro is $14.99/month if you're running multiple interview loops.

https://prepfile-production.up.railway.app

Has anyone else found that company-specific prep makes a much bigger difference at senior levels than junior?`,
    executionNotes: "Post to the General channel. Weekday evenings 7–10pm PST or Sunday evenings. Senior audience — lean into the specificity angle, not the free tier.",
  },

  // ─── 4. PRODUCT HUNT ───────────────────────────────────────────────────────

  productHunt: {
    tagline: "Your personalized interview brief in under a minute",
    description: "PrepFile generates a personalized interview brief from your company, role, and job description — in under 60 seconds. Get a company snapshot, round-by-round expectations, smart questions to ask, and your blind spots. Free tier available.",
    makerComment: `Hey PH! I'm Reese, CEO of PrepFile. We built PrepFile because I kept watching smart people bomb interviews not from lack of skill — but from lack of context.

Generic interview prep is everywhere. What's missing is a brief that actually knows the specific company you're interviewing at, the role you applied for, and where your gaps are.

So we built PrepFile: paste in a company name, job title, and job description → get a structured interview brief in under a minute. You get:
- A company snapshot (culture, recent moves, what they care about)
- Round-by-round expectations based on the role
- Smart questions to ask your interviewers
- A blind spot analysis so you're not caught off guard

We use a proprietary framework combining competitive analysis and skill gap detection. It's not a chatbot — it's a structured brief.

Free tier lets you run 3 briefs/week. Pro is $14.99/mo for unlimited + brief history + resume match.

Try it right now at prepfile-production.up.railway.app — takes 60 seconds, no credit card.

Would love your feedback. What prep info do you wish you'd had going into your last interview?`,
    executionNotes: "Launch on a Tuesday or Wednesday for peak traffic. Avoid holiday weeks. Post maker comment immediately when listing goes live.",
  },

  // ─── 5. EMAIL ANNOUNCEMENT ─────────────────────────────────────────────────

  email: {
    subject: "PrepFile Pro is live — unlimited briefs, resume match, history",
    body: `You signed up for PrepFile when it was free-only. That changes today.

Pro is now available: unlimited briefs, brief history, and resume match for $14.99/month. Or grab an Interview Pack — 5 comprehensive briefs for $6.99, no subscription.

The brief you've been generating in the free tier gives you an overview. Pro gives you the full picture: every round, every signal, what to ask, and where you're likely to get tripped up.

If you have an interview coming up, this is the tool for it.

→ Upgrade at https://prepfile-production.up.railway.app`,
    ctaText: "Upgrade to Pro",
    ctaUrl: "https://prepfile-production.up.railway.app",
    audience: "Existing free-tier signups. Send when Stripe account approval clears and live payments are enabled.",
  },

};
