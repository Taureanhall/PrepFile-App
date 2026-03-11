/**
 * Community distribution — Round 2
 * PRE-94
 *
 * Covers the batch 2-4 content additions:
 * Company guides: McKinsey, Goldman Sachs, JPMorgan, Deloitte, BCG, Microsoft, Apple, Netflix, Uber
 * Job-role guides: Software Engineer, Product Manager, Data Scientist, UX Designer, Marketing Manager
 *
 * Do NOT repost the original community-posts.ts content — these are fresh posts for new channels
 * and updated audiences. Posting too frequently to the same subreddit triggers spam filters.
 */

export const distributionRound2 = {
  reddit: [
    {
      subreddit: "r/cscareerquestions",
      title: "Company-specific interview pages for Microsoft, Apple, Netflix, Uber — what they actually evaluate vs. generic advice",
      body: `There's a gap between what interview advice sites tell you about FAANG interviews and what the loops actually look like.

Apple doesn't care about STAR format the same way Google does. Netflix's culture interview (the Keeper Test conversation) is an active evaluation, not a formality. Uber's system design rounds are heavily influenced by their marketplace infrastructure — and if you don't know that going in, your examples miss the mark.

I've been building out company-specific interview pages on PrepFile that cover the actual hiring loop, what the interviewers are scoring, and concrete prep strategies for each company:

- **Microsoft**: emphasis on growth mindset signals, customer obsession questions, and why their system design rounds weight practicality over theoretical scale
- **Apple**: deeply confidential process but consistent patterns — secrecy culture means you're often interviewing for a role without knowing the exact team
- **Netflix**: the "fully formed adult" culture is evaluated in every round, not just fit; expect to justify your decisions to senior people who will push back hard
- **Uber**: product + marketplace system design is its own category; marketplace balance, surge pricing mechanisms, driver/rider matching are all fair territory

Pages are free, no account required: https://prepfile-production.up.railway.app/interview-prep/microsoft etc.

Anyone here who's gone through these loops — what surprised you that's not covered in the usual prep resources?`,
      suggestedTime: "Tuesday–Thursday, 9–11am EST or 7–9pm EST",
      notes: "Lead with the insight gap, not the product. Name specific companies and specific differences — that's what gets upvotes and keeps it from being spam-flagged. Engage with any replies about specific companies quickly.",
    },

    {
      subreddit: "r/consulting",
      title: "What I learned researching how McKinsey, BCG, and Deloitte actually evaluate candidates differently",
      body: `Most consulting interview prep advice treats MBB as interchangeable. They're not — and the differences matter for how you prepare.

A few things I dug into while building company-specific interview guides:

**McKinsey**: strictly interviewer-led cases. The interviewer gives you structured sub-questions. This is fundamentally different from BCG/Bain where you drive the structure. If you only practice candidate-led cases, McKinsey rounds will feel disorienting.

**BCG**: more emphasis on your framework originality. Recycled frameworks (Porter's Five Forces, 3 C's) score lower than structures you build from the problem. Also introduced the Casey chatbot screening — it's worth practicing specifically because it's a different interaction mode than a live case.

**Deloitte**: fit interview weight is higher than at MBB, and they lean more on behavioral stories than case purity. The case is typically less ambiguous than MBB cases.

I put all of this into interview prep pages at PrepFile if you want the full breakdown: https://prepfile-production.up.railway.app/interview-prep/mckinsey

Has anyone who's done MBB superdays found other meaningful differences that the standard prep resources miss?`,
      suggestedTime: "Sunday evening or Monday morning — when people are planning recruiting week",
      notes: "r/consulting is a high-quality audience who will call out anything generic. Lead with genuine insight, not product. The question at the end is important — this sub rewards discussion.",
    },

    {
      subreddit: "r/FinancialCareers",
      title: "Goldman Sachs vs JPMorgan interview differences that actually affect how you prep",
      body: `If you're recruiting at both GS and JPMorgan simultaneously (common in IB recruiting), it's worth knowing they run meaningfully different processes.

**Goldman Sachs**: superday structure has more rounds, behavioral questions lean heavily toward 'why Goldman, why this division', and the technical bar for IB analyst roles is genuinely high — they expect you to walk through valuation methodologies cold, not just describe them.

**JPMorgan**: the loop includes specific technical screens earlier in the process. Their 'why JPMorgan' question is scrutinized for specificity — generic answers about deal flow or prestige read as weak. Division-specific knowledge matters: IBD at JPM has different culture signals than Markets or Corporate Banking.

Both firms run highly structured superdays (multiple back-to-back 30-minute slots), so pacing your energy matters. The behavioral portion is not filler — at both firms, a strong behavioral performance with average technicals advances more often than the reverse.

I put together prep pages for both if you want the full breakdown on loop structure and evaluation criteria:
- https://prepfile-production.up.railway.app/interview-prep/goldman-sachs
- https://prepfile-production.up.railway.app/interview-prep/jpmorgan

Happy to discuss if anyone's going through the process — what rounds have people found most difficult to prep for?`,
      suggestedTime: "Weekday evenings 6–9pm EST, or Sunday evening — recruiting cycle is fall-heavy so adjust for season",
      notes: "r/FinancialCareers has both students and professionals. Tone should be knowledgeable but not condescending. Specific named differences between GS and JPM is the hook.",
    },

    {
      subreddit: "r/interviews",
      title: "Role-specific interview prep pages for Software Engineer, PM, Data Scientist, UX Designer, Marketing Manager",
      body: `Generic interview advice covers behavioral questions and STAR format. What it misses is that the evaluation criteria, interview format, and what actually differentiates candidates varies significantly by role.

A PM interview and a data science interview at the same company are almost entirely different loops. A UX designer interviewing at a product company vs. a consultancy faces different portfolio presentation expectations. A marketing manager at a growth-stage startup gets evaluated on very different signals than at an enterprise company.

I've built out free role-specific interview prep pages covering each of these:

**Software Engineer**: coding round formats, what interviewers actually score beyond 'working solution', system design for mid/senior levels, behavioral signals that can veto strong technical scores

**Product Manager**: product sense vs. analytical vs. behavioral rounds, the difference between a CIRCLES-reciter and someone who actually thinks that way, what makes PM cases at Google vs. Amazon different

**Data Scientist**: SQL rounds (deeper than most expect), statistics and probability questions, ML system design, and the difference between the analytics track and the research/ML track

**UX Designer**: portfolio presentation structure, whiteboard challenge tactics, what 'design critique' rounds actually evaluate

**Marketing Manager**: channel strategy questions, how to structure a marketing case answer, metrics and attribution knowledge bar

Pages at: https://prepfile-production.up.railway.app/interview-prep/[role]

What role do you think has the worst quality interview advice available online?`,
      suggestedTime: "Monday or Wednesday evening 6–9pm EST",
      notes: "r/interviews covers all industries and roles. Role-specificity is the value signal here. The closing question invites debate, which drives comments and visibility.",
    },
  ],

  blind: [
    {
      channel: "Microsoft",
      title: "Microsoft interview: the growth mindset evaluation is real and more specific than you think",
      body: `Prepping for Microsoft interviews and noticed that a lot of advice about their 'growth mindset' culture treats it as a generic behavioral theme. It's more operationalized than that.

In Microsoft loops, interviewers are specifically looking for: how you responded to being wrong, how you updated your approach after a failure, and whether you can articulate what you'd do differently — not just that you faced a challenge and 'learned from it.' The STAR answers that work at Google don't land the same way here because the evaluation lens is different.

Also: the Collaboration round (specific to some teams) is explicitly scoring whether you'd bring conflict to the surface or smooth it over. They want the former.

Put together a full prep breakdown at: https://prepfile-production.up.railway.app/interview-prep/microsoft

Anyone who's been through the loop recently — how explicit were interviewers about the growth mindset framing?`,
      suggestedTime: "Weekday evenings 7–10pm PST",
      notes: "Blind Microsoft channel has a lot of current/former MSFT employees and active candidates. Specific insight about the growth mindset scoring will get engagement. Avoid being preachy.",
    },

    {
      channel: "Netflix",
      title: "Netflix interview: the Keeper Test isn't a formality — it's the whole evaluation",
      body: `Netflix's culture deck is public and most candidates read it before interviewing. What fewer people internalize is that the 'Keeper Test' mindset permeates every interview, not just the culture fit conversation.

When a Netflix interviewer asks about a decision you made, they're often checking: would a 'fully formed adult' at Netflix have made this call autonomously, or would they have needed hand-holding? The cultural interview explicitly asks your former manager whether they'd fight to keep you — and that test is proxied in how you describe past work.

The other thing that catches people off guard: Netflix interviewers will push back on your answers with direct disagreement. This isn't aggression — it's testing whether you can hold a position under scrutiny or collapse. Candidates who immediately capitulate score poorly.

Breakdown at: https://prepfile-production.up.railway.app/interview-prep/netflix

Have others found the culture evaluation harder to prep for than the technical rounds?`,
      suggestedTime: "Sunday evening or Tuesday evening PST",
      notes: "Blind Netflix channel has engaged users who are either interviewing there or work there. The 'Keeper Test' angle will resonate — it's a known topic but the interview implication is less discussed.",
    },

    {
      channel: "Goldman Sachs",
      title: "GS superday survival — the behavioral portion matters more than most prep guides admit",
      body: `Quick note for anyone prepping for Goldman superdays: the behavioral rounds are not filler between technicals. Anecdotally (and from published data), Goldman rejects more candidates on behavioral than technical at the analyst level because technical can be improved faster than judgment and communication.

Specific things Goldman behavioral rounds probe that most prep resources underemphasize:
- **Why this division specifically** — generic IBD interest doesn't land; they want a view on the group's work
- **Resilience under high-volume pressure** — they're hiring for a role that involves all-nighters on live deals, and they want evidence you can maintain quality under that
- **Client-readiness signals** — at Goldman more than most banks, analysts interact with clients earlier; communication clarity is scored

Full prep breakdown: https://prepfile-production.up.railway.app/interview-prep/goldman-sachs

Anyone who's done the GS superday recently — which behavioral questions caught you off guard?`,
      suggestedTime: "Weekday evenings 7–10pm EST, especially during fall recruiting season",
      notes: "Blind GS channel has a mix of analysts, associates, and recruiting candidates. Direct, specific prep insight is valued. The closing question invites replies from people in active loops.",
    },
  ],

  linkedin: [
    {
      angle: "company-guides",
      copy: `Most interview prep assumes you already know what you're walking into.

You don't — until you've researched how each company actually runs its loop.

Apple and Google both hire software engineers. Their interview processes are fundamentally different. Apple's rounds are more execution-focused, more secretive about team context, and evaluate product intuition differently than Google's PM-adjacent culture. McKinsey's case format is interviewer-led. BCG's is candidate-led. That difference alone changes how you should structure every case answer.

I've been building company-specific interview prep pages that cover the actual loop structure, what interviewers score, and concrete prep strategies — not generic advice repackaged per company.

Currently live: McKinsey, Goldman Sachs, JPMorgan, Deloitte, BCG, Microsoft, Apple, Netflix, Uber — plus a dozen more.

Free, no account required: https://prepfile-production.up.railway.app

Which company's interview process surprised you most when you actually went through it?`,
      suggestedTime: "Tuesday or Wednesday, 7–9am in your primary audience's timezone",
      notes: "Lead with the knowledge gap angle. Named companies in the copy improves search discoverability in LinkedIn's feed algorithm. End with the question to drive comments.",
    },

    {
      angle: "role-guides",
      copy: `The reason interview prep often doesn't work: you're prepping for the role in general, not the role at the company you're interviewing at.

A 'product manager interview' at Amazon and at a Series B startup are almost completely different loops. Amazon's PM loop runs 5-6 rounds with explicit Leadership Principles scoring. A startup PM interview might be a two-hour working session with the founding team. Same title. Completely different evaluation.

I've built role-specific interview prep pages for the most common roles people are interviewing for:

→ **Software Engineer** — coding formats, system design for mid/senior, what behavioral signals can veto strong technical scores

→ **Product Manager** — product sense vs. analytical vs. behavioral, the difference between a framework-reciter and someone who actually thinks that way

→ **Data Scientist** — SQL depth, statistics and ML design, analytics track vs. research track differences

→ **UX Designer** — portfolio structure, whiteboard challenge strategy, design critique evaluation

→ **Marketing Manager** — channel strategy, metrics and attribution bar, how to structure a marketing case

All free: https://prepfile-production.up.railway.app

What role do you think has the biggest gap between available advice and what interviews actually test?`,
      suggestedTime: "Monday morning 7–9am — people planning their week and thinking about job search",
      notes: "Specific role-by-role bullets drive saves and shares. The question at the end targets working professionals who have opinions on this. Arrow characters increase visual scan-ability.",
    },

    {
      angle: "tool-itself",
      copy: `Interview prep is broken in a specific way: the best advice is company-specific and role-specific, but it's scattered across Glassdoor, Reddit threads, anonymous Blind posts, and blog articles from 2019.

By the time you've aggregated it, you've spent 3 hours and have a Google Doc of notes that doesn't tell you what to prioritize in the 2 days before your interview.

I built PrepFile to solve exactly this.

You enter the company, job title, and job description. Answer 4 quick questions about your prep situation. Get a structured brief in under a minute covering:

— Company snapshot and current strategic signals
— What this specific role actually evaluates (not just the JD)
— Round expectations with likely question types
— Questions to ask interviewers that show real homework
— Your personal blind spots given your background

Free tier: 3 briefs per week. Pro is $9.99/month.

https://prepfile-production.up.railway.app

If you have an interview in the next 30 days — try it before your next round. Feedback welcome.`,
      suggestedTime: "Thursday, 12–1pm — people thinking about weekend job search activities",
      notes: "This is the direct product post. It needs to lead with the problem and the solution mechanism, not the product name. Em dashes instead of bullets look cleaner in LinkedIn's mobile rendering. Keep it tight.",
    },
  ],
};
