/**
 * Board-ready distribution brief — PrepFile
 * PRE-97
 *
 * Synthesized from: PRE-80 (community templates), PRE-81 (PH launch kit),
 * PRE-86 (distribution plan), PRE-94 (round 2 posts), PRE-95 (Stripe launch copy).
 *
 * Purpose: Copy-paste ready brief for the board to execute distribution.
 * All copy is final. No edits required before posting.
 */

export const distributionBrief = `
# PrepFile Distribution Brief
> Board-ready. Copy-paste to execute.

---

## 1. Reddit — Post This First

**Platform:** r/cscareerquestions (~1.1M members)
**Best time:** Tuesday–Thursday, 9–11am EST or 7–9pm EST
**Flair:** Discussion or Resource

### Post Title
> I got tired of generic interview advice so I built a tool that generates a personalized prep brief in under a minute

### Post Body
Every time I prep for an interview I do the same annoying ritual: open 10 tabs, read the same "tell me about yourself" tips, and forget half of it by interview day.

So I built PrepFile — you put in the company, job title, job description, and answer 4 quick questions (what round, how familiar are you with the company, how much prep time, what's your biggest gap). It generates a structured brief covering:

- Company snapshot and strategy signals
- What this specific role actually evaluates
- Round expectations with likely question types
- Questions to ask your interviewers
- Blind spots you might be missing

Free tier gives you 3 briefs/week. I used it for my last 3 interviews and it's replaced my entire tab-hoarding habit.

Try it here: https://prepfile-production.up.railway.app

Feedback welcome — especially if the brief misses something important for your role.

**Execution notes:**
- Comment actively in the first 30 minutes after posting — early engagement determines front-page visibility
- Do NOT cross-post to other subreddits on the same day
- Reply to every comment, especially pushback — genuine engagement keeps this from being spam-flagged

---

**Secondary subreddits (post 48+ hours after r/cscareerquestions):**

| Subreddit | Subscribers | Best Time | Notes |
|---|---|---|---|
| r/interviews | ~190K | Mon/Wed 6–9pm EST | Higher conversion rate per view |
| r/jobs | ~770K | Sun evening / Mon 8–10am EST | Adjust for non-tech audience |
| r/jobsearchhacks | ~145K | Tue/Thu 7–9pm EST | Lead with the insight, mention tool as automation |
| r/careerguidance | ~580K | Wed 12–2pm EST | Softest pitch — frame as career advice |
| r/consulting | ~varies | Sun/Mon morning | Use the McKinsey/BCG/Deloitte differentiation angle |
| r/FinancialCareers | ~varies | Weekday evenings | Goldman vs JPMorgan angle |

---

## 2. Blind — Post This

**Platform:** Blind (tech workers, senior audience)
**Best time:** Weekday evenings 7–10pm PST or Sunday evenings

### Post Title
> Built a tool that generates a personalized interview prep brief from your JD — free, takes 1 min

### Post Body
Most interview prep tools give you the same generic advice. If you're interviewing at Meta, Google, Stripe, or wherever — you already know the STAR method. What you actually need is:

- What is this company's current strategic posture (and what does that mean for your role)
- What specifically does this team evaluate in this round
- What questions make you look like you've done real homework
- Where you're likely to slip up given your background

I built PrepFile to generate exactly that. You paste in the JD, tell it what round you're in and your prep situation, and it generates a structured brief in under a minute.

Free tier: 3 briefs/week. Pro is $9.99/month if you're running multiple interview loops.

https://prepfile-production.up.railway.app

Has anyone else found that company-specific prep makes a much bigger difference at senior levels than junior?

**Execution notes:**
- Post to the General channel first; cross-post to company-specific channels (Microsoft, Netflix, Goldman) using the company-specific versions in distribution-round2.ts
- Senior audience — lean into the specificity angle, not the free tier

---

## 3. LinkedIn — Post This

**Platform:** LinkedIn
**Best time:** Tuesday or Wednesday, 7–9am EST
**Format:** Personal story (performs best organically)

### Post Body
I bombed an interview at a company I really wanted to work at.

Not because I didn't know the technical content. Because I hadn't done the right kind of prep.

I knew the company's Wikipedia page. I didn't know their current strategic priorities or what they were actually hiring for in that quarter. I gave generic answers when they wanted signals about how I think about their specific problems.

After that, I changed how I prep. I go deep on: the company's current focus, what the role is actually evaluated on (not just the JD), what questions make you look like you've done real homework, and where I'm likely to be weak given my background.

I eventually built a tool that does this automatically — you paste the JD, answer 4 questions, and get a structured prep brief in under a minute.

If you have an interview coming up, try it free: https://prepfile-production.up.railway.app

What's been the biggest gap in your interview prep that generic advice never covers? Drop it in the comments.

**Secondary LinkedIn posts (space 48–72 hours apart):**
- Tips-based: "5 things that actually move the needle in interview prep" → see social-posts.ts
- Data-driven: "Most people spend 5+ hours prepping..." → see social-posts.ts

---

## 4. Product Hunt — Launch Checklist

**Target launch day:** Choose a Tuesday or Wednesday for peak traffic. Avoid holiday weeks.

### Required before launch day:

- [ ] Screenshots captured (5 slides)
- [ ] Gallery slides with text overlays uploaded (see copy below)
- [ ] Tagline confirmed: **"Your personalized interview brief in under a minute"** (51 chars ✓)
- [ ] Description confirmed: **"PrepFile generates a personalized interview brief from your company, role, and job description — in under 60 seconds. Get a company snapshot, round-by-round expectations, smart questions to ask, and your blind spots. Free tier available."** (244 chars ✓)
- [ ] Maker account created and connected to listing
- [ ] 5 hunter seed comments drafted (see below)
- [ ] Launch day social posts ready (LinkedIn + Twitter) (see below)

### Gallery slide copy:
| Slide | Headline | Subhead |
|---|---|---|
| 1 | Your interview brief in 60 seconds | Not generic tips — a brief built for your exact role. |
| 2 | Tell us the role. We do the research. | Company + job title + JD → structured brief, instantly. |
| 3 | Know what's coming before you walk in. | Round-by-round expectations. Smart questions to ask. Blind spots flagged. |
| 4 | Resume match — close the gap. | See exactly how your experience reads against the role. |
| 5 | Free to start. No credit card. | 3 briefs/week free. Pro at $9.99/mo for unlimited. |

### Maker comment (post immediately when listing goes live):
Hey PH! 👋 I'm Reese, CEO of PrepFile. We built PrepFile because I kept watching smart people bomb interviews not from lack of skill — but from lack of context.

Generic interview prep is everywhere. What's missing is a brief that actually knows the specific company you're interviewing at, the role you applied for, and where *your* gaps are.

So we built PrepFile: paste in a company name, job title, and job description → get a structured interview brief in under a minute. You get:
- A company snapshot (culture, recent moves, what they care about)
- Round-by-round expectations based on the role
- Smart questions to ask your interviewers
- A blind spot analysis so you're not caught off guard

We use a proprietary framework combining competitive analysis and skill gap detection. It's not a chatbot — it's a structured brief.

Free tier lets you run 3 briefs/week. Pro is $9.99/mo for unlimited + brief history + resume match.

Try it right now at prepfile-production.up.railway.app — takes 60 seconds, no credit card.

Would love your feedback. What prep info do you wish you'd had going into your last interview? 👇

### 5 hunter seed comments (post in sequence, ~30 min apart):

**Comment 1 — Brief quality:**
> What I love about PrepFile is what it *doesn't* do: generic tips. "Research the company" is useless advice. PrepFile actually does that research — company snapshot, how they evaluate candidates, what the role signals about team priorities. The brief reads like something a well-connected friend on the inside wrote you.

**Comment 2 — Speed:**
> Got a call scheduled in an hour? PrepFile is built for exactly that. Paste your JD, hit generate — 60 seconds later you have a structured brief covering the company, what to expect in the interview, and where your blind spots are.

**Comment 3 — FAANG prep:**
> If you're preparing for Google, Meta, Stripe, or any competitive tech company — the bar for "knowing the company" is high. PrepFile generates briefs that go deep: how the company thinks, what signals matter for your specific role, and what questions will make you stand out.

**Comment 4 — Free tier:**
> Quick note for anyone on the fence: PrepFile has a free tier — 3 briefs/week, no credit card required. Use it for your next interview. If it helps (it will), Pro is $9.99/month for unlimited briefs + history + resume match.

**Comment 5 — Resume match:**
> The feature I didn't expect to love: resume match. Once you have your brief, PrepFile can analyze your resume against it — flagging gaps, suggesting what to emphasize in your answers, and identifying what the interviewer is most likely to probe. Pro/pack feature.

### Launch day social posts:

**LinkedIn (post same day as PH launch):**
We shipped PrepFile — and it's live on Product Hunt today.

The problem we set out to solve: generic interview prep is everywhere, but contextual prep is hard to find. "Research the company" tells you nothing about what actually matters for your specific role at that specific company.

PrepFile fixes that. You input: company name, job title, job description. You get back a structured brief in under 60 seconds:
✓ Company snapshot (culture, priorities, recent context)
✓ Round-by-round expectations for your role
✓ Smart questions to ask interviewers
✓ Blind spot analysis

Free tier: 3 briefs/week, no credit card. Pro ($9.99/mo): unlimited briefs + history + resume match.

[PH LINK] — an upvote goes a long way 🙏

**Twitter/X (post same day as PH launch):**
We're live on Product Hunt today 🚀

PrepFile: your personalized interview brief in 60 seconds.

Paste a company + role + JD → structured brief covering company snapshot, round expectations, smart questions, and your blind spots.

Free tier available.

[PH LINK]

---

## 5. Stripe Go-Live Announcement

**Trigger:** Deploy when Stripe account approval clears and live payments are enabled.

### Email blast (existing signups):

**Subject:** PrepFile Pro is live — unlimited briefs, resume match, history

**Body:**
You signed up for PrepFile when it was free-only. That changes today.

Pro is now available: unlimited briefs, brief history, and resume match for $9.99/month. Or grab an Interview Pack — 5 comprehensive briefs for $4.99, no subscription.

The brief you've been generating in the free tier gives you an overview. Pro gives you the full picture: every round, every signal, what to ask, and where you're likely to get tripped up.

If you have an interview coming up, this is the tool for it.

→ Upgrade at https://prepfile-production.up.railway.app

### LinkedIn:
PrepFile Pro is live.

You input the company, role, job description, and where you are in the process. You get a full interview brief in under a minute — round structure, what they actually evaluate, what to ask, and your blind spots.

Free tier is still available. Pro unlocks unlimited briefs, brief history, and resume match.

If you're interviewing, it's worth trying once before your next call.

→ https://prepfile-production.up.railway.app

### Twitter/X:
PrepFile Pro is live.

Input company + role + JD → full interview brief in <1 min.

- Round structure
- What they actually evaluate
- Resume match
- Brief history

$9.99/mo or $4.99 for 5 briefs.

→ prepfile-production.up.railway.app

### Reddit (r/cscareerquestions):
I built a tool that generates a personalized interview prep brief in under a minute — you give it the company, job title, job description, and a few context questions, and it produces a structured breakdown: company snapshot, role-specific signals, round expectations, questions to ask, and blind spots.

Free tier has always been available. Pro just launched — unlimited briefs, history, and resume match for $9.99/month (or $4.99 for 5 briefs, no subscription).

https://prepfile-production.up.railway.app

### In-app banner:
**Heading:** Pro is here
**Body:** Unlimited briefs, brief history, and resume match. Upgrade for $9.99/month or grab 5 briefs for $4.99.
**CTA:** Upgrade to Pro → /pricing

---

## Posting Schedule (Week 1)

| Day | Platform | Action |
|---|---|---|
| Day 1 (Tue) | Reddit r/cscareerquestions | Main community post |
| Day 1 (Tue) | LinkedIn | Personal story post |
| Day 2 (Wed) | Blind | General channel post |
| Day 3 (Thu) | Reddit r/interviews | Secondary subreddit post |
| Day 4 (Fri) | LinkedIn | Tips-based post (5 things that actually move the needle) |
| Day 7 (Tue) | Reddit r/jobs | Third subreddit post |
| Day 8 (Wed) | LinkedIn | Data-driven post |
| Day 9 (Thu) | Reddit r/jobsearchhacks | Insight-led variant |
| TBD | Product Hunt | Launch day (pick Tue or Wed) |
| TBD | All platforms | Stripe go-live announcement |

**Rule:** Never post to the same subreddit more than once every 30 days.

---

## Source Files

All copy lives in:
- \`prepfile-app/src/marketing/content/community-posts.ts\` — Reddit + Blind + LinkedIn full copy
- \`prepfile-app/src/marketing/content/product-hunt-launch.ts\` — Full PH launch kit
- \`prepfile-app/src/marketing/content/distribution-plan.ts\` — Subreddit rules + calendar
- \`prepfile-app/src/marketing/content/distribution-round2.ts\` — Company/role-specific posts (round 2)
- \`prepfile-app/src/content/launch-copy.ts\` — Stripe go-live email, social, and banner copy
`;
