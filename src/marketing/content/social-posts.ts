export type SocialPost = {
  platform: "linkedin" | "twitter";
  angle: "testimonial" | "tips" | "company-insight" | "anxiety-hook";
  body: string;
  cta: string;
  hashtags: string[];
  targetUrl: string;
};

export const socialPosts: SocialPost[] = [
  // ── LinkedIn ──────────────────────────────────────────────────────────────
  {
    platform: "linkedin",
    angle: "testimonial",
    body: `I had a Google interview in 48 hours and absolutely no idea where to start.

I put the job description into PrepFile, answered 4 quick questions, and got back a brief that covered:
→ Google's actual interview format for this role
→ The specific signals they're evaluating
→ Blind spots I hadn't considered
→ Smart questions to ask the panel

Spent the rest of my prep time actually preparing — not researching.

I got the offer.

If you have an interview coming up and need to get focused fast, try it free:`,
    cta: "Generate your prep brief → prepfile.co",
    hashtags: ["#InterviewPrep", "#JobSearch", "#Google", "#CareerAdvice"],
    targetUrl: "https://prepfile.co",
  },
  {
    platform: "linkedin",
    angle: "tips",
    body: `Most people prep for interviews the wrong way.

They memorize generic answers to generic questions.

But Amazon's bar raiser interview isn't the same as Meta's system design round. A Product Manager loop at Apple isn't the same as one at a Series A startup.

The best interview prep is specific:
→ What format does THIS company use?
→ What does THIS role's hiring panel actually care about?
→ What's your specific blind spot for THIS gap?

Generic prep produces generic candidates.

PrepFile generates a brief specific to your company, your role, and your gaps — in under a minute. Free to try:`,
    cta: "See how it works → prepfile.co",
    hashtags: ["#InterviewTips", "#JobSearch", "#CareerDevelopment", "#Hiring"],
    targetUrl: "https://prepfile.co",
  },
  {
    platform: "linkedin",
    angle: "company-insight",
    body: `Amazon interviews are famously brutal — not because the questions are hard, but because most candidates don't understand the format.

There are 3 things most people get wrong:
1. Underestimating behavioral depth (STAR isn't optional — it's mandatory)
2. Not knowing which Leadership Principles apply to their specific role
3. Skipping the "bar raiser" dynamic entirely

If you're prepping for an Amazon interview, the brief I generated on PrepFile saved me hours of research.

Worth checking out before your loop:`,
    cta: "Amazon interview prep → prepfile.co/interview-prep/amazon",
    hashtags: ["#Amazon", "#InterviewPrep", "#JobSearch", "#LeadershipPrinciples"],
    targetUrl: "https://prepfile.co/interview-prep/amazon",
  },
  {
    platform: "linkedin",
    angle: "anxiety-hook",
    body: `Interview anxiety is usually just a preparation gap in disguise.

When you feel confident about:
✓ What the interview format looks like
✓ What signals the interviewer is watching for
✓ What questions to ask at the end
✓ Where your weaknesses actually are

The anxiety drops significantly.

You can't eliminate nerves. But you can eliminate uncertainty — which is where most interview anxiety lives.

PrepFile builds that confidence layer in under a minute. Free tier available:`,
    cta: "Get your prep brief → prepfile.co",
    hashtags: ["#InterviewPrep", "#InterviewAnxiety", "#CareerAdvice", "#JobSearch"],
    targetUrl: "https://prepfile.co",
  },
  {
    platform: "linkedin",
    angle: "company-insight",
    body: `Microsoft, Meta, Google, Amazon, Apple — same tier of company, very different interviews.

Microsoft focuses heavily on growth mindset and collaborative problem-solving. Meta moves fast and cares deeply about impact at scale. Google is obsessed with structured thinking and Googleyness.

Getting them confused in prep is more common than you'd think.

PrepFile generates a company-specific brief so you're actually prepping for the interview you're about to take — not a generic FAANG loop.

Takes about a minute:`,
    cta: "Try it free → prepfile.co",
    hashtags: ["#FAANG", "#InterviewPrep", "#Microsoft", "#Meta", "#Google"],
    targetUrl: "https://prepfile.co",
  },

  // ── Twitter / X ───────────────────────────────────────────────────────────
  {
    platform: "twitter",
    angle: "testimonial",
    body: `Had a Meta interview in 36 hours.

Put the JD into PrepFile, answered 4 questions, got a full prep brief in under a minute.

Walked in knowing exactly what they look for, what format to expect, and where my gaps were.

Got the offer.`,
    cta: "Free at prepfile.co",
    hashtags: ["#InterviewPrep", "#Meta", "#JobSearch"],
    targetUrl: "https://prepfile.co",
  },
  {
    platform: "twitter",
    angle: "anxiety-hook",
    body: `Interview anxiety is usually just a prep gap.

When you know:
→ The actual format
→ What they're evaluating
→ Your blind spots

The nerves drop.

PrepFile gives you that clarity in 60 seconds. Free:`,
    cta: "prepfile.co",
    hashtags: ["#InterviewPrep", "#JobSearch", "#CareerAdvice"],
    targetUrl: "https://prepfile.co",
  },
  {
    platform: "twitter",
    angle: "tips",
    body: `Unpopular opinion: most interview prep advice is useless because it's generic.

"Practice STAR stories." "Research the company."

Cool. But which leadership principles does Amazon care about for YOUR role? What does Google's hiring bar look for specifically?

Specific prep beats generic prep every time.`,
    cta: "PrepFile makes it specific → prepfile.co",
    hashtags: ["#InterviewTips", "#JobSearch"],
    targetUrl: "https://prepfile.co",
  },
  {
    platform: "twitter",
    angle: "company-insight",
    body: `Apple interviews are different from Google interviews.

Google wants structured thinking + Googleyness.
Apple wants deep craft ownership + strong opinions.

If you prep the same way for both, you're not prepping — you're guessing.

PrepFile generates company-specific briefs:`,
    cta: "prepfile.co/interview-prep/apple",
    hashtags: ["#Apple", "#Google", "#InterviewPrep"],
    targetUrl: "https://prepfile.co/interview-prep/apple",
  },
  {
    platform: "twitter",
    angle: "testimonial",
    body: `Prepped for an Amazon loop in 2 hours using PrepFile.

It told me exactly which leadership principles to focus on for a TPM role, what the bar raiser is actually looking for, and 3 things I hadn't thought about.

That's $0 and 2 hours vs. a week of guessing.`,
    cta: "Try free → prepfile.co",
    hashtags: ["#Amazon", "#InterviewPrep", "#TPM"],
    targetUrl: "https://prepfile.co",
  },
];
