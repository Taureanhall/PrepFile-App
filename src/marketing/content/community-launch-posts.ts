/**
 * Community launch posts — ready to publish
 * PRE-130
 *
 * Three posts tailored to specific community norms:
 * r/cscareerquestions, r/jobs/r/interviews, and Hacker News Show HN.
 *
 * Usage: Copy body verbatim. Do not add hashtags or marketing language.
 */

export type CommunityLaunchPost = {
  platform: "reddit" | "hackernews";
  destination: string;
  title: string;
  body: string;
  notes: string;
};

export const communityLaunchPosts: CommunityLaunchPost[] = [
  {
    platform: "reddit",
    destination: "r/cscareerquestions",
    title: "I built a tool that generates a personalized interview prep brief in under a minute — free, looking for feedback",
    body: `Quick background: I kept prepping for interviews by opening 15 tabs — Glassdoor, LinkedIn, the company blog — and still walking in feeling like I'd missed something.

So I built PrepFile. You paste in the job description, pick the company and role, answer 4 quick questions (which round, how familiar you are with the company, how much prep time you have, what your biggest gap is), and it generates a structured brief covering:

- What the company is focused on right now and why it matters for your interview
- What this specific role is actually evaluated on (beyond what the JD says)
- What to expect round by round, including likely question types
- Questions to ask your interviewers that show genuine homework
- Blind spots specific to your situation

Free tier is 3 briefs per week. No credit card.

https://prepfile.work

Genuinely want feedback — especially if you're interviewing at smaller companies or non-FAANG roles. I want to make sure the briefs are useful across the board, not just for big tech loops.`,
    notes: "Post mid-week morning (Tue–Thu, 9–11am EST). Respond to comments quickly, especially skeptics. Do not open with 'I built a tool' — lead with the problem. Edit title slightly if needed to match subreddit norms.",
  },

  {
    platform: "reddit",
    destination: "r/jobs",
    title: "Most people prep for interviews by Googling questions and reading Glassdoor. Here's a better approach.",
    body: `The standard interview prep loop goes something like: search "[Company] interview questions", read a few Glassdoor reviews, practice a couple STAR stories, hope for the best.

The problem is it's all generic. Companies don't interview the same way. A PM at Salesforce is evaluated differently than a PM at Airbnb. A data analyst at a bank gets a different set of probes than one at a startup. Generic prep produces generic answers.

What actually helps:
- Understanding what the company is prioritizing right now (not just their mission statement)
- Knowing what this specific role is evaluated on, not just what the JD lists
- Identifying your blind spots before the interviewer does
- Asking questions that signal you've done real homework

I built a tool that does this. You paste in the job description, answer 4 quick questions, and get a structured prep brief in under a minute.

Free: https://prepfile.work

Would especially like to hear from people who landed roles at companies where they felt underprepared going in — curious what actually made the difference.`,
    notes: "r/jobs has a broader, non-tech audience. Keep the framing general. End with a genuine question to invite engagement. Avoid any language that sounds like an ad.",
  },

  {
    platform: "hackernews",
    destination: "Show HN",
    title: "Show HN: PrepFile – paste a job description, get a structured interview prep brief",
    body: `PrepFile takes a job description, company name, and four input questions (interview round, familiarity with the company, available prep time, biggest perceived gap) and returns a structured brief covering the company's current strategic context, what the role is actually evaluated on, round-by-round expectations, suggested interviewer questions, and candidate-specific blind spots.

Built on Gemini. Free tier is 3 briefs per week.

https://prepfile.work`,
    notes: "HN Show HN should be extremely short. No marketing language. Technical community — they'll dig in or they won't. The 4-input detail adds credibility. Don't over-explain; let the product speak. Post on a weekday morning (Mon–Wed, 8–10am ET).",
  },
];
