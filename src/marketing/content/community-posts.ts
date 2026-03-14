/**
 * Community distribution templates — ready-to-post content
 * PRE-80
 *
 * Usage: Copy each post body verbatim. Adjust [COMPANY] and [ROLE] to match
 * your own interview when personalizing.
 */

export const communityPosts = {

  reddit: [
    {
      subreddit: "r/cscareerquestions",
      title: "I got tired of generic interview advice so I built a tool that generates a personalized prep brief in under a minute",
      body: `Every time I prep for an interview I do the same annoying ritual: open 10 tabs, read the same \"tell me about yourself\" tips, and forget half of it by interview day.

So I built PrepFile — you put in the company, job title, job description, and answer 4 quick questions (what round, how familiar are you with the company, how much prep time, what's your biggest gap). It generates a structured brief covering:

- Company snapshot and strategy signals
- What this specific role actually evaluates
- Round expectations with likely question types
- Questions to ask your interviewers
- Blind spots you might be missing

Free tier gives you 3 briefs/week. I used it for my last 3 interviews and it's replaced my entire tab-hoarding habit.

Try it here: https://prepfile-production.up.railway.app

Feedback welcome — especially if the brief misses something important for your role.`,
      suggestedTime: "Tuesday–Thursday, 9–11am EST or 7–9pm EST",
      notes: "Lead with the problem. Do not open with 'I built X'. Answer comments quickly — especially pushback. Genuine engagement is what keeps this from being flagged as spam.",
    },

    {
      subreddit: "r/interviews",
      title: "The interview prep checklist I wish I had — and how I automated it",
      body: `After bombing a few interviews where I thought I was prepared, I realized I was prepping generically instead of specifically.

The thing that actually moves the needle: knowing what *this company* is focused on right now, what *this role* is actually evaluated on (not just the JD), and what questions to ask that show you've done homework.

I ended up building a tool that does this: you paste in the JD, answer a few questions about your situation, and it generates a brief with all of that in under a minute.

It's free (3 briefs/week): https://prepfile-production.up.railway.app

Here's what a brief covers:
- Company snapshot (strategy, recent signals)
- Role intelligence (what they actually want vs. what the JD says)
- Round-by-round expectations
- Curated questions to ask interviewers
- Blind spots specific to your situation

Has anyone else found company-specific prep made a big difference over generic advice?`,
      suggestedTime: "Monday or Wednesday, 6–9pm EST",
      notes: "End with a genuine question to invite discussion. r/interviews is smaller so it's less likely to get flagged.",
    },

    {
      subreddit: "r/jobs",
      title: "Free tool I built after spending too many hours on interview prep with nothing to show for it",
      body: `Real talk: I used to spend 3+ hours prepping for interviews and still walk in feeling underprepared. The problem was I was doing surface-level research — company Wikipedia, Glassdoor reviews, memorizing STAR answers.

What actually helped was getting specific: what is this company's current strategic focus, what does *this team* care about, what signals distinguish candidates in this round.

I built a tool that generates that brief in under a minute. You input the company, role, and job description, answer 4 questions about your prep situation, and it produces a structured document covering everything above.

It's free to try (3 briefs/week, no credit card): https://prepfile-production.up.railway.app

Would especially like feedback from people interviewing at mid-size companies or non-FAANG — I want to make sure the briefs are useful beyond big tech.`,
      suggestedTime: "Sunday evening or Monday morning — when people are thinking about the week ahead",
      notes: "r/jobs has a broader audience including non-tech. Adjust framing toward job seekers generally, not just engineers.",
    },
  ],

  blind: [
    {
      title: "Built a tool that generates a personalized interview prep brief from your JD — free, takes 1 min",
      body: `Most interview prep tools give you the same generic advice. If you're interviewing at Meta, Google, Stripe, or wherever — you already know the STAR method. What you actually need is:

- What is this company's current strategic posture (and what does that mean for your role)
- What specifically does this team evaluate in this round
- What questions make you look like you've done real homework
- Where you're likely to slip up given your background

I built PrepFile to generate exactly that. You paste in the JD, tell it what round you're in and your prep situation, and it generates a structured brief in under a minute.

Free tier: 3 briefs/week. Pro is $14.99/month if you're running multiple interview loops.

https://prepfile-production.up.railway.app

Has anyone else found that company-specific prep makes a much bigger difference at senior levels than junior?`,
      suggestedTime: "Weekday evenings 7–10pm PST, or Sunday evenings",
      notes: "Blind users are mostly senior tech workers. Lean into the specificity angle. The \"senior levels\" hook at the end drives replies from L5/L6+ who care about strategic framing over basics.",
    },
  ],

  linkedin: [
    {
      angle: "personal-story",
      copy: `I bombed an interview at a company I really wanted to work at.

Not because I didn't know the technical content. Because I hadn't done the right kind of prep.

I knew the company's Wikipedia page. I didn't know their current strategic priorities or what they were actually hiring for in that quarter. I gave generic answers when they wanted signals about how I think about their specific problems.

After that, I changed how I prep. I go deep on: the company's current focus, what the role is actually evaluated on (not just the JD), what questions make you look like you've done real homework, and where I'm likely to be weak given my background.

I eventually built a tool that does this automatically — you paste the JD, answer 4 questions, and get a structured prep brief in under a minute.

If you have an interview coming up, try it free: https://prepfile-production.up.railway.app

What's been the biggest gap in your interview prep that generic advice never covers? Drop it in the comments.`,
      suggestedTime: "Tuesday or Wednesday, 7–9am or 12–1pm in your target audience's timezone",
      notes: "Personal story format performs well on LinkedIn. End with a question to drive comments. Do not lead with product.",
    },

    {
      angle: "tips-based",
      copy: `5 things that actually move the needle in interview prep (that most advice ignores):

1. **Know the company's current strategic focus, not just their About page.** Interviewers want to know you understand the business, not just the product.

2. **Read the JD like an engineer reads a spec.** What problem are they actually hiring for? What does success in year 1 look like?

3. **Prepare questions that reveal you've done homework.** Generic questions ("what's the culture like?") signal you haven't. Specific ones ("I noticed you're expanding into X — how does this team fit into that?") signal you have.

4. **Know which round you're in and what it actually evaluates.** A culture fit round and a systems design round call for completely different prep.

5. **Identify your blind spots before they do.** What will they see on your resume and probe on? Get ahead of it.

I built PrepFile to systemize all of this — it generates a brief covering every point above in under a minute from your JD.

Free to try: https://prepfile-production.up.railway.app`,
      suggestedTime: "Monday morning 7–9am — people planning their week",
      notes: "List format gets strong organic reach on LinkedIn. Each point should feel like genuine advice, not a setup for the product plug.",
    },

    {
      angle: "data-driven",
      copy: `Most people spend 5+ hours prepping for interviews. Most of that time is wasted on generic content.

The highest-leverage prep isn't memorizing answers — it's understanding:
- What the company is actually trying to solve right now
- What this specific role is evaluated on in this specific round
- Where you're most likely to fall short given your background

Generic prep covers none of this. Company-specific prep covers all of it.

I built PrepFile to make company-specific prep take 1 minute instead of 5 hours. You paste in the job description, answer 4 questions, and get a structured brief: company snapshot, role intelligence, round expectations, interviewer questions, and your blind spots.

Free tier includes 3 briefs/week. No credit card.

https://prepfile-production.up.railway.app

If you're currently in an interview loop — try it before your next round.`,
      suggestedTime: "Thursday or Friday, 12–1pm — people thinking about job search as the week winds down",
      notes: "Data/insight framing works well for LinkedIn's professional audience. Keep it tight and declarative. The call to action targets active job seekers who will see immediate utility.",
    },
  ],

};
