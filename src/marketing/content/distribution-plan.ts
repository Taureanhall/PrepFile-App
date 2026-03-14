/**
 * Distribution plan — community and social content calendar
 * PRE-86
 *
 * References existing content in community-posts.ts and social-posts.ts.
 * Each entry maps to a post body in those files or a variant derived from them.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type SubredditPlan = {
  subreddit: string;
  subscribers: string;
  postingRules: string[];
  bestTime: string;
  contentRef: string; // maps to community-posts.ts post or describes the variant to use
  notes: string;
};

export type LinkedInVariant = {
  id: string;
  angle: string;
  hook: string;
  value: string;
  cta: string;
  hashtags: string[];
  targetAudience: string;
  bestTime: string;
};

export type BlindTemplate = {
  id: string;
  targetThread: string; // thread type or company-specific
  title: string;
  body: string;
  bestTime: string;
  notes: string;
};

export type CalendarDay = {
  week: number;
  day: string;
  platform: "reddit" | "linkedin" | "blind" | "twitter";
  contentRef: string; // subreddit / variant id / blind template id
  postTime: string;
  action: string;
};

// ─── Reddit Distribution Plan ────────────────────────────────────────────────

export const redditPlan: SubredditPlan[] = [
  {
    subreddit: "r/cscareerquestions",
    subscribers: "~1.1M",
    postingRules: [
      "No pure self-promotion — must provide value in the post body",
      "Flair required: 'Discussion' or 'Resource' for tool shares",
      "No affiliate links; direct product URL is acceptable if post is substantive",
      "Moderators remove posts that read as ads — lead with the problem, not the product",
    ],
    bestTime: "Tuesday–Thursday, 9–11am EST or 7–9pm EST",
    contentRef: "community-posts.ts > reddit[0] (r/cscareerquestions post)",
    notes:
      "Highest traffic subreddit for this audience. Comment actively in the first 30 minutes after posting. Upvotes from early engagement determine front-page visibility. Do not cross-post to other subreddits on the same day.",
  },
  {
    subreddit: "r/interviews",
    subscribers: "~190K",
    postingRules: [
      "Self-promotion allowed if it contributes to the community",
      "Must add genuine advice — not a pure product link",
      "Flair: 'Tool' or 'Tip'",
    ],
    bestTime: "Monday or Wednesday, 6–9pm EST",
    contentRef: "community-posts.ts > reddit[1] (r/interviews post)",
    notes:
      "Smaller, more engaged audience. Conversion rate per view is higher than r/cscareerquestions. Use the 'how I changed my prep approach' angle. Engage every comment.",
  },
  {
    subreddit: "r/jobs",
    subscribers: "~770K",
    postingRules: [
      "Broader audience — non-tech job seekers included",
      "No spam or repeated posts within 30 days",
      "Flair required",
      "Posts with external links are auto-reviewed — plain-text posts rank better",
    ],
    bestTime: "Sunday evening or Monday morning 8–10am EST",
    contentRef: "community-posts.ts > reddit[2] (r/jobs post)",
    notes:
      "Adjust framing for non-tech audience. Emphasize 'any industry, any company' angle. The free-tier message (no credit card) is the strongest hook here.",
  },
  {
    subreddit: "r/jobsearchhacks",
    subscribers: "~145K",
    postingRules: [
      "Must share a genuine hack or tip — pure product posts removed",
      "Short form preferred: lead with the insight, then reference the tool",
      "No repeated submissions",
    ],
    bestTime: "Tuesday or Thursday, 7–9pm EST",
    contentRef:
      "Variant: 'The one prep habit that changed my hit rate' — lead with the company-specific prep insight, mention PrepFile as the tool that automates it. Body ~200 words.",
    notes:
      "Community expects actionable hacks. Frame the post as: 'Stop prepping generically — here's how company-specific prep works and the shortcut I use.' Keep it conversational.",
  },
  {
    subreddit: "r/careerguidance",
    subscribers: "~580K",
    postingRules: [
      "Helpful, non-promotional tone required",
      "Self-promotion flagged unless it reads as genuine advice",
      "Flair: 'Resource' or 'Job Search'",
    ],
    bestTime: "Wednesday, 12–2pm EST",
    contentRef:
      "Variant: 'Interview prep checklist that actually works' — 5-point list post with PrepFile as step 5 ('I automated this with a tool'). Soft CTA.",
    notes:
      "Softest pitch of all subreddits. Frame as a career advice post that mentions the tool as an aside. Comments asking about the tool are the organic CTA.",
  },
  {
    subreddit: "r/ProductManagement",
    subscribers: "~90K",
    postingRules: [
      "PM-specific content only",
      "Self-promotion tolerated if on-topic and valuable",
      "Discussion posts perform better than link posts",
    ],
    bestTime: "Tuesday or Thursday, 9–11am EST",
    contentRef:
      "Variant: 'How I prep for PM interviews at FAANG vs. series A startups' — substantive post comparing what's different, ending with PrepFile as how I systemize company-specific research.",
    notes:
      "Senior PM audience. They care about frameworks and signal — not generic tips. The 'different interview formats' angle resonates. Link to /interview-prep/google or /interview-prep/amazon as supporting context.",
  },
  {
    subreddit: "r/SoftwareEngineering",
    subscribers: "~320K",
    postingRules: [
      "Discussion-oriented community",
      "Tool shares OK if embedded in a substantive post",
      "No job board links",
    ],
    bestTime: "Monday or Wednesday, 10am–12pm EST",
    contentRef:
      "Variant: 'What actually separates candidates at FAANG system design rounds' — educational post on what companies evaluate, PrepFile mentioned as how I built company-specific prep into my process.",
    notes:
      "Engineering audience responds to specifics. Lead with a concrete insight about system design evaluation criteria. The tool is a footnote, not the headline.",
  },
  {
    subreddit: "r/learnprogramming",
    subscribers: "~4.1M",
    postingRules: [
      "Beginner/mid-level audience — frame for people early in their career",
      "High spam moderation — must be substantive",
      "Tool posts allowed if they address a real learning need",
    ],
    bestTime: "Saturday or Sunday, 11am–1pm EST",
    contentRef:
      "Variant: 'Breaking into your first tech job — how I approach interview prep differently now' — junior-focused post about moving from generic to specific prep. PrepFile as the shortcut for people without a network to ask.",
    notes:
      "Largest sub on the list but least conversion-optimized. Use for brand awareness only. The free tier (3 briefs/week) is the primary hook.",
  },
  {
    subreddit: "r/datascience",
    subscribers: "~510K",
    postingRules: [
      "Technical community — avoid marketing tone entirely",
      "Self-promotion allowed 1x per month, flagged by mods if excessive",
      "Discussion posts preferred over link posts",
    ],
    bestTime: "Wednesday or Thursday, 12–2pm EST",
    contentRef:
      "Variant: 'How DS/MLE interviews differ by company (and why generic prep misses this)' — substantive comparison of interview formats at different companies. PrepFile as the tool used to research this.",
    notes:
      "Technical credibility is essential here. Lead with the insight about how ML/DS interview formats vary. Don't lead with the product.",
  },
  {
    subreddit: "r/ExperiencedDevs",
    subscribers: "~205K",
    postingRules: [
      "Verified experience required (account history checked)",
      "High quality bar — shallow posts are downvoted quickly",
      "Self-promotion: thread once a quarter, clearly labeled",
    ],
    bestTime: "Tuesday, 9–11am EST",
    contentRef:
      "Variant: 'Senior interview prep is different — here's what changed for me at L5+' — senior-audience post about strategic vs. tactical prep, signal evaluation at senior levels, company-specific narrative. PrepFile as one tool in the toolkit.",
    notes:
      "Most demanding audience. Requires genuine insight about senior-level interview dynamics. Only post here after r/cscareerquestions has traction — credibility transfer helps. Frame PrepFile as research acceleration, not a crutch.",
  },
];

// ─── LinkedIn Distribution Plan ──────────────────────────────────────────────

export const linkedInVariants: LinkedInVariant[] = [
  {
    id: "li-personal-story",
    angle: "personal-story",
    hook: "I bombed an interview at a company I really wanted to work at.\n\nNot because I didn't know the content. Because I hadn't done the right kind of prep.",
    value:
      "After that failure: went deep on what the company was actually focused on, what the role was evaluated on beyond the JD, and where I was most likely to be weak. That specificity changed my conversion rate entirely.",
    cta: "I eventually built a tool that does this research in 1 minute. Try it free before your next round → prepfile.co",
    hashtags: [
      "#InterviewPrep",
      "#JobSearch",
      "#CareerAdvice",
      "#JobOffer",
      "#TechCareers",
    ],
    targetAudience: "Mid-career professionals actively interviewing",
    bestTime: "Tuesday or Wednesday, 7–9am or 12–1pm (audience's local time)",
  },
  {
    id: "li-tips-list",
    angle: "tips-list",
    hook: "5 things that actually move the needle in interview prep (that most advice skips):",
    value:
      "1. Know the company's current strategic focus, not just their About page.\n2. Read the JD like a spec — what problem are they actually hiring for?\n3. Prepare questions that reveal you've done real homework.\n4. Know which round you're in and what it specifically evaluates.\n5. Identify your blind spots before they do.",
    cta: "I built PrepFile to systemize all of this — it generates a brief covering every point in under a minute from your JD. Free to try: prepfile.co",
    hashtags: [
      "#InterviewTips",
      "#JobSearch",
      "#CareerDevelopment",
      "#Hiring",
      "#InterviewPrep",
    ],
    targetAudience: "Broad LinkedIn professional audience",
    bestTime: "Monday, 7–9am — people planning the week",
  },
  {
    id: "li-data-insight",
    angle: "data-insight",
    hook: "Most people spend 5+ hours prepping for interviews. Most of that time is wasted on generic content.",
    value:
      "The highest-leverage prep isn't memorizing answers. It's understanding what the company is solving right now, what this role is evaluated on in this specific round, and where you're likely to fall short. Generic prep covers none of this.",
    cta: "PrepFile makes company-specific prep take 1 minute instead of 5 hours. Free tier — no credit card. Try before your next round: prepfile.co",
    hashtags: [
      "#InterviewPrep",
      "#JobSearch",
      "#ProductivityTips",
      "#CareerGrowth",
    ],
    targetAudience: "Data-oriented professionals and hiring managers",
    bestTime: "Thursday or Friday, 12–1pm — end-of-week reflection mode",
  },
  {
    id: "li-anxiety-reframe",
    angle: "anxiety-reframe",
    hook: "Interview anxiety is usually just a preparation gap in disguise.",
    value:
      "When you know what the interview format looks like, what signals the interviewer is watching for, what smart questions to ask, and where your weaknesses actually are — the anxiety drops significantly. You can't eliminate nerves. But you can eliminate uncertainty, which is where most anxiety lives.",
    cta: "PrepFile builds that clarity layer in under a minute. Free tier available: prepfile.co",
    hashtags: [
      "#InterviewAnxiety",
      "#InterviewPrep",
      "#CareerAdvice",
      "#JobSearch",
      "#Confidence",
    ],
    targetAudience: "Junior to mid-level candidates feeling underprepared",
    bestTime: "Sunday evening, 6–8pm — pre-week anxiety peak",
  },
  {
    id: "li-company-contrast",
    angle: "company-contrast",
    hook: "Microsoft, Meta, Google, Amazon, Apple — same tier, very different interviews.",
    value:
      "Microsoft focuses on growth mindset and collaborative problem-solving. Meta moves fast and cares about impact at scale. Google is obsessed with structured thinking and Googleyness. Getting them confused in prep is more common than most admit. The format, the evaluation signals, and the questions they probe — all different.",
    cta: "PrepFile generates a company-specific brief so you're prepping for the interview you're actually about to take. Takes about a minute: prepfile.co",
    hashtags: [
      "#FAANG",
      "#InterviewPrep",
      "#Microsoft",
      "#Meta",
      "#Google",
      "#Amazon",
      "#Apple",
    ],
    targetAudience: "Engineers and PMs targeting FAANG/MAANG roles",
    bestTime: "Tuesday, 9–11am — mid-morning professional browsing peak",
  },
];

// ─── Blind Distribution Plan ─────────────────────────────────────────────────

export const blindTemplates: BlindTemplate[] = [
  {
    id: "blind-senior-eng",
    targetThread: "Company-specific interview threads (Google, Meta, Amazon, Apple, Microsoft)",
    title: "Built a tool that generates a personalized prep brief from your JD — free, 1 min",
    body: `Most interview prep tools give you the same generic advice. If you're interviewing at Meta, Google, or wherever — you already know STAR. What you actually need is:

- What is this company's current strategic posture and what does that mean for your role
- What specifically does this team evaluate in this round (not what the JD says)
- What questions make you look like you've done real homework
- Where you're likely to slip up given your specific background

I built PrepFile to generate exactly that. You paste in the JD, tell it what round you're in and your prep situation, and it generates a structured brief in under a minute.

Free tier: 3 briefs/week. Pro is $14.99/month if you're running multiple interview loops.

prepfile-production.up.railway.app

Has anyone else found that company-specific prep makes a bigger difference at L5+ than at junior levels?`,
    bestTime: "Weekday evenings 7–10pm PST, or Sunday evenings",
    notes:
      "Post in active company interview threads (e.g., 'Google interview prep', 'Meta interview loop'). Blind audience skews senior tech — L5/L6+. The 'senior levels' hook at the end drives replies. The question at the end keeps the thread alive and drives organic upvotes.",
  },
  {
    id: "blind-job-search",
    targetThread: "General job search / FAANG hunt threads",
    title: "How I cut my interview prep time from 5 hours to 45 minutes",
    body: `Used to spend an entire Sunday prepping for a single interview. Open 10 tabs, watch YouTube explainers, read Glassdoor reviews, end up with nothing organized.

Changed my approach: instead of generic prep, I go company-specific.

What's the company's current strategic focus? What does this specific role evaluate — not what the JD says, what the hiring panel actually cares about? What questions distinguish candidates who've done real homework from those who haven't? Where am I most likely to be weak given my background?

I built a tool that answers all of this from the JD in under a minute: PrepFile.

Free: 3 briefs/week. Pro is $14.99/month.

prepfile-production.up.railway.app

Not a magic bullet — you still have to do the work. But it eliminates the research and organization phase entirely.`,
    bestTime: "Sunday evenings or Monday mornings",
    notes:
      "Post in job search threads or when someone asks 'how do you prep for interviews?' Reply threads are also valid — answer the question genuinely and mention PrepFile as your current tool at the end.",
  },
  {
    id: "blind-pm-specific",
    targetThread: "PM interview threads (APM, PM, Senior PM loops)",
    title: "PM interview prep is different from eng prep — here's how I approach it",
    body: `PM interviews are frustratingly under-documented compared to engineering. The Glassdoor reviews are vague, the prep guides are generic, and every company runs a different format.

What I've found actually works:

1. Understand the company's current product strategy — not their mission statement, their actual bets. What are they building aggressively right now?

2. Know which PM competencies this specific role weights. A growth PM loop and a platform PM loop at the same company can look completely different.

3. Prepare situational answers that reference their actual products. "I noticed Meta has been pushing [X feature] — here's how I'd think about that problem" signals real homework.

4. Know what round you're in. Executive rounds and hiring manager rounds evaluate very differently.

I've been using PrepFile to do the research phase fast — you paste the JD, answer a few questions, and get a brief covering all of the above in under a minute.

Free: prepfile-production.up.railway.app

What's the biggest thing PM candidates get wrong prepping for loops?`,
    bestTime: "Weekday evenings 7–9pm PST",
    notes:
      "PM community on Blind is vocal and engaged. The question at the end is important — it invites the community to contribute rather than feeling like an ad. Keep the advice substantive. PrepFile is mentioned as 'what I use', not as the subject of the post.",
  },
];

// ─── Distribution Calendar — Week 1–4 ────────────────────────────────────────

export const distributionCalendar: CalendarDay[] = [
  // ── Week 1: Establish Reddit presence ─────────────────────────────────────
  {
    week: 1,
    day: "Monday",
    platform: "linkedin",
    contentRef: "li-tips-list",
    postTime: "8:00am EST",
    action: "Post LinkedIn variant li-tips-list. Monitor comments for 2 hours.",
  },
  {
    week: 1,
    day: "Tuesday",
    platform: "reddit",
    contentRef: "r/cscareerquestions",
    postTime: "9:30am EST",
    action:
      "Post community-posts.ts reddit[0] to r/cscareerquestions. Respond to every comment within 1 hour for the first 3 hours.",
  },
  {
    week: 1,
    day: "Wednesday",
    platform: "blind",
    contentRef: "blind-senior-eng",
    postTime: "7:00pm PST",
    action:
      "Post blind-senior-eng template to an active Google or Meta interview thread on Blind.",
  },
  {
    week: 1,
    day: "Thursday",
    platform: "reddit",
    contentRef: "r/interviews",
    postTime: "7:00pm EST",
    action: "Post community-posts.ts reddit[1] to r/interviews.",
  },
  {
    week: 1,
    day: "Friday",
    platform: "linkedin",
    contentRef: "li-data-insight",
    postTime: "12:00pm EST",
    action: "Post LinkedIn variant li-data-insight.",
  },

  // ── Week 2: Expand subreddits, activate Blind ──────────────────────────────
  {
    week: 2,
    day: "Monday",
    platform: "linkedin",
    contentRef: "li-personal-story",
    postTime: "7:30am EST",
    action: "Post LinkedIn variant li-personal-story.",
  },
  {
    week: 2,
    day: "Tuesday",
    platform: "reddit",
    contentRef: "r/SoftwareEngineering",
    postTime: "10:00am EST",
    action:
      "Post r/SoftwareEngineering variant ('What actually separates candidates at FAANG system design rounds').",
  },
  {
    week: 2,
    day: "Wednesday",
    platform: "blind",
    contentRef: "blind-job-search",
    postTime: "8:00pm PST",
    action:
      "Post blind-job-search template in a general FAANG hunt or job search thread on Blind.",
  },
  {
    week: 2,
    day: "Thursday",
    platform: "reddit",
    contentRef: "r/jobsearchhacks",
    postTime: "7:30pm EST",
    action:
      "Post r/jobsearchhacks variant ('The one prep habit that changed my hit rate').",
  },
  {
    week: 2,
    day: "Sunday",
    platform: "linkedin",
    contentRef: "li-anxiety-reframe",
    postTime: "6:30pm EST",
    action:
      "Post LinkedIn variant li-anxiety-reframe. Target Sunday pre-week anxiety window.",
  },

  // ── Week 3: Niche subreddits + PM Blind thread ────────────────────────────
  {
    week: 3,
    day: "Monday",
    platform: "reddit",
    contentRef: "r/jobs",
    postTime: "9:00am EST",
    action:
      "Post community-posts.ts reddit[2] to r/jobs. Broaden framing for non-tech audience.",
  },
  {
    week: 3,
    day: "Tuesday",
    platform: "linkedin",
    contentRef: "li-company-contrast",
    postTime: "9:30am EST",
    action: "Post LinkedIn variant li-company-contrast (MAANG comparison angle).",
  },
  {
    week: 3,
    day: "Wednesday",
    platform: "reddit",
    contentRef: "r/ProductManagement",
    postTime: "10:00am EST",
    action:
      "Post r/ProductManagement variant ('How I prep for PM interviews at FAANG vs. series A').",
  },
  {
    week: 3,
    day: "Thursday",
    platform: "blind",
    contentRef: "blind-pm-specific",
    postTime: "7:30pm PST",
    action: "Post blind-pm-specific in an active PM interview thread on Blind.",
  },
  {
    week: 3,
    day: "Saturday",
    platform: "reddit",
    contentRef: "r/learnprogramming",
    postTime: "11:30am EST",
    action:
      "Post r/learnprogramming variant (junior-focused, free tier emphasis). Brand awareness play.",
  },

  // ── Week 4: Data science + senior audience ────────────────────────────────
  {
    week: 4,
    day: "Monday",
    platform: "linkedin",
    contentRef: "li-tips-list",
    postTime: "8:00am EST",
    action:
      "Re-run li-tips-list with a modified hook ('The interview prep checklist I wish existed 5 years ago'). A/B test engagement vs. week 1.",
  },
  {
    week: 4,
    day: "Tuesday",
    platform: "reddit",
    contentRef: "r/ExperiencedDevs",
    postTime: "9:30am EST",
    action:
      "Post r/ExperiencedDevs variant ('Senior interview prep is different — L5+ framing'). Only post if r/cscareerquestions post has strong upvote history for credibility.",
  },
  {
    week: 4,
    day: "Wednesday",
    platform: "reddit",
    contentRef: "r/datascience",
    postTime: "12:30pm EST",
    action:
      "Post r/datascience variant ('How DS/MLE interviews differ by company'). Technical credibility required — do not lead with product.",
  },
  {
    week: 4,
    day: "Thursday",
    platform: "reddit",
    contentRef: "r/careerguidance",
    postTime: "12:00pm EST",
    action:
      "Post r/careerguidance variant (5-point list, soft CTA, PrepFile as aside).",
  },
  {
    week: 4,
    day: "Friday",
    platform: "linkedin",
    contentRef: "li-data-insight",
    postTime: "12:00pm EST",
    action:
      "Re-run li-data-insight with updated hook based on week 1 performance data. End-of-month push.",
  },
];

// ─── Export ──────────────────────────────────────────────────────────────────

export const distributionPlan = {
  reddit: redditPlan,
  linkedin: linkedInVariants,
  blind: blindTemplates,
  calendar: distributionCalendar,
};
