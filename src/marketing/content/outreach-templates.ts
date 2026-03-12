/**
 * Outreach message templates — PrepFile
 *
 * Four 1:1 direct message templates for manual outreach to job seekers.
 * These are designed to read like genuine messages from a person, not marketing blasts.
 *
 * Templates:
 *   1. linkedin-cold-interview-post   — LinkedIn DM to someone who posted about landing an interview
 *   2. linkedin-advice-thread         — LinkedIn DM replying to someone asking for interview advice
 *   3. twitter-job-search-frustration — Twitter/X DM to someone tweeting job search frustrations
 *   4. twitter-public-reply           — Twitter/X public reply to an interview prep tweet
 */

export type OutreachTemplate = {
  id: string;
  platform: "linkedin" | "twitter";
  type: "dm" | "public-reply";
  context: string; // when to use this template
  message: string; // the actual message — keep placeholders in [brackets]
  wordCount: number;
  url: string;
};

// ─── 1. LinkedIn DM — cold outreach to someone who posted about getting an interview ────────────

export const linkedinColdInterviewPost: OutreachTemplate = {
  id: "linkedin-cold-interview-post",
  platform: "linkedin",
  type: "dm",
  context:
    "Use when someone posts on LinkedIn about landing an interview (e.g., 'just got an interview at Google!'). Send within 24 hours of the post.",
  message: `Hey [Name] — congrats on the [Company] interview! That's a big deal.

I know how much prep goes into these. I built a tool called PrepFile that puts together a personalized brief — company culture, what they look for, likely questions — in under a minute. Might be worth a look before your interview.

https://prepfile.work

Good luck either way — you've got this.`,
  wordCount: 62,
  url: "https://prepfile.work",
};

// ─── 2. LinkedIn DM — response to someone asking for interview advice ─────────────────────────

export const linkedinAdviceThread: OutreachTemplate = {
  id: "linkedin-advice-thread",
  platform: "linkedin",
  type: "dm",
  context:
    "Use when someone in a comment thread is asking for interview advice or tips. Lead with value, then mention PrepFile naturally.",
  message: `The thing that helped me most was researching the company's actual priorities — not just the job description. Interviewers notice when you know what they're working on.

If you want a shortcut, PrepFile (prepfile.work) builds a full prep brief from just the company and role. Takes about a minute.`,
  wordCount: 52,
  url: "https://prepfile.work",
};

// ─── 3. Twitter/X DM — cold outreach to someone tweeting about job search frustrations ─────────

export const twitterJobSearchFrustration: OutreachTemplate = {
  id: "twitter-job-search-frustration",
  platform: "twitter",
  type: "dm",
  context:
    "Use when someone tweets about job search frustrations, rejections, or feeling overwhelmed by interview prep. Empathetic tone, casual register.",
  message: `Saw your tweet — the job search grind is real. One thing that helped me was having a tight prep brief for each company instead of starting from scratch every time.

Built prepfile.work for exactly this. Plug in the company + role and it does the research for you.

Hope things turn around soon.`,
  wordCount: 53,
  url: "https://prepfile.work",
};

// ─── 4. Twitter/X public reply — reply to a tweet about interview prep ────────────────────────

export const twitterPublicReply: OutreachTemplate = {
  id: "twitter-public-reply",
  platform: "twitter",
  type: "public-reply",
  context:
    "Use as a public reply to tweets asking for interview prep tips or resources. Lead with a genuine tip, mention PrepFile briefly at the end.",
  message: `Tip: research what the team actually ships, not just the job req. Interviewers can tell.

Also prepfile.work auto-generates a prep brief for any company in ~1 min — saves a ton of time.`,
  wordCount: 38,
  url: "https://prepfile.work",
};

// ─── All templates ────────────────────────────────────────────────────────────────────────────

export const outreachTemplates: OutreachTemplate[] = [
  linkedinColdInterviewPost,
  linkedinAdviceThread,
  twitterJobSearchFrustration,
  twitterPublicReply,
];
