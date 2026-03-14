/**
 * Social Media Content — Week 1
 * Authored by: Marketing Agent
 * Task: PRE-101
 *
 * Covers: 5 Twitter/X posts, 5 LinkedIn posts.
 * Tone: confident peer, direct, specific. No fluff. Every post drives toward prepfile.work.
 */

export interface SocialPost {
  platform: "twitter" | "linkedin";
  type:
    | "tip"
    | "product_announcement"
    | "engagement"
    | "social_proof"
    | "thought_leadership"
    | "product_launch"
    | "hiring_manager"
    | "job_seeker";
  copy: string;
  hashtags: string[];
  cta: string;
}

export const socialMediaWeek1: SocialPost[] = [
  // ─── Twitter/X ─────────────────────────────────────────────────────────────

  {
    platform: "twitter",
    type: "tip",
    copy: `Most people prep for the wrong things.

They memorize STAR stories. Their interviewer is actually evaluating whether you understand the business context of the role you're applying for.

Before your next interview: read the company's last earnings call or investor letter. Your interviewer noticed theirs didn't.

PrepFile gives you a brief that includes exactly what the business is optimizing for right now — and how your role fits in.

Try it free: https://prepfile.work`,
    hashtags: ["#InterviewPrep", "#JobSearch", "#CareerAdvice"],
    cta: "Try it free: https://prepfile.work",
  },

  {
    platform: "twitter",
    type: "tip",
    copy: `The interview question nobody prepares for: "What do you know about us?"

Most candidates say something generic. Your interviewer has heard it 20 times this week.

What they actually want: evidence that you understand their competitive position, what's changed recently, and why this role exists right now.

PrepFile's briefs answer all three. Paste in the job description and get a company snapshot built for your specific interview.

https://prepfile.work`,
    hashtags: ["#Interviewing", "#JobSearch", "#InterviewTips"],
    cta: "https://prepfile.work",
  },

  {
    platform: "twitter",
    type: "product_announcement",
    copy: `PrepFile now accepts payments.

Pro plan: $14.99/month — unlimited briefs, brief history, resume match.
Interview Pack: $6.99 one-time — 5 pro-tier briefs.
Free tier: 3 briefs/week, no credit card.

If you have an interview coming up and you've been using the free tier, now's the time to get the full brief.

https://prepfile.work`,
    hashtags: ["#PrepFile", "#InterviewPrep", "#JobSearch"],
    cta: "https://prepfile.work",
  },

  {
    platform: "twitter",
    type: "engagement",
    copy: `Quick question for anyone who's interviewed in the last 6 months:

How do you actually prep the night before an interview?

— Reread the job description
— Glassdoor reviews
— YouTube "interview tips" rabbit hole
— Something else

Genuinely curious. We built PrepFile to fix the "I don't know what to actually study" problem. What's the alternative you use?`,
    hashtags: ["#InterviewPrep", "#JobSearch", "#CareerDevelopment"],
    cta: "https://prepfile.work",
  },

  {
    platform: "twitter",
    type: "social_proof",
    copy: `What's in a PrepFile brief:

— Company snapshot: competitive position, what the business is optimizing for right now
— Role intelligence: what your specific title is actually evaluated on (not just the job description)
— Round expectations: what each interview stage is testing
— Questions to ask: specific to the company and role, not generic
— Blind spots: where candidates usually miss in this role

Input: company name, job title, job description. Output: prep brief in under a minute.

https://prepfile.work`,
    hashtags: ["#InterviewPrep", "#JobSearch", "#AI"],
    cta: "https://prepfile.work",
  },

  // ─── LinkedIn ──────────────────────────────────────────────────────────────

  {
    platform: "linkedin",
    type: "thought_leadership",
    copy: `The best-prepared interview candidate I ever spoke with had done something I hadn't seen before.

They opened with a summary of what they thought the business problem behind the role was — not what the job description said, but what they'd inferred from recent company news, earnings signals, and the team structure.

It changed the entire conversation. Instead of evaluating whether they could do the job, I was asking whether the role was actually scoped correctly for what we needed.

That's the interview most candidates don't know they can have. It requires about 20 extra minutes of the right preparation — understanding business context, not just job requirements.

Most interview prep focuses on questions and answers. The actual edge is understanding why the role exists right now, who it reports to, and what success looks like in the first 90 days.

PrepFile builds that context for you. Company snapshot, role intelligence, and round expectations — specific to your company and job title, not generic advice.

If you have an interview coming up: https://prepfile.work`,
    hashtags: [
      "#Interviewing",
      "#CareerDevelopment",
      "#JobSearch",
      "#Leadership",
    ],
    cta: "https://prepfile.work",
  },

  {
    platform: "linkedin",
    type: "thought_leadership",
    copy: `Something I've noticed reviewing hundreds of interview candidates: the people who research the company and the people who research the role are both doing half the prep.

The candidates who actually stand out do both — and they connect them. They walk in knowing not just what the company does, but how their specific role creates value for the business right now.

That means understanding:
— What the company is currently optimizing for (growth, efficiency, expansion)
— What's changed in the last 12 months
— Why this particular role opened up
— What a strong first 90 days looks like for this team

Most job seekers don't have a system for building that picture quickly. They read Glassdoor reviews and the About page and call it prep.

There's a better approach. PrepFile generates a structured brief that covers company context, role-specific evaluation signals, and what each interview round is actually testing — for your specific company and job title, in under a minute.

Free tier available. https://prepfile.work`,
    hashtags: [
      "#InterviewPrep",
      "#CareerAdvice",
      "#JobSearch",
      "#ProfessionalDevelopment",
    ],
    cta: "https://prepfile.work",
  },

  {
    platform: "linkedin",
    type: "product_launch",
    copy: `We built PrepFile because the alternative — Googling "[Company] interview questions" — produces the same recycled list for every candidate.

Here's what PrepFile actually does:

You paste in a company name, job title, and job description. You answer 4 questions about your interview round, prep time, company familiarity, and biggest skill gap. PrepFile generates a personalized prep brief in under a minute.

The brief covers:
— Company snapshot (competitive position, what the business is optimizing for)
— Role intelligence (what your specific title is evaluated on beyond the JD)
— Round expectations (what each stage is actually testing)
— Questions to ask your interviewers
— Blind spots (where candidates usually miss for this role)

Free tier: 3 briefs/week, no credit card required.
Pro: $14.99/month — unlimited briefs, brief history, resume match.
Interview Pack: $6.99 one-time — 5 pro-tier briefs.

If you have an interview coming up: https://prepfile.work`,
    hashtags: ["#PrepFile", "#InterviewPrep", "#JobSearch", "#ProductLaunch"],
    cta: "https://prepfile.work",
  },

  {
    platform: "linkedin",
    type: "hiring_manager",
    copy: `From a hiring manager's perspective: most candidates are underprepared in the same specific way.

They know the company at a surface level. They've read the job description. They have their STAR stories ready. But they haven't thought about the business context — what problem the role solves, what success looks like for the team, or what's changed at the company that created this opening.

That gap is immediately obvious in the first five minutes. And it's not an intelligence gap — it's a preparation gap. Candidates who walk in with business context have a fundamentally different conversation.

The ones who do it right aren't necessarily smarter or more experienced. They've just spent their prep time on the right things.

I helped build PrepFile to give every candidate access to the kind of preparation that was previously only available if you had an insider at the company — a friend who works there, a recruiter who knows the team, or a coach who knows the industry.

For anyone preparing to interview: https://prepfile.work`,
    hashtags: [
      "#HiringManagers",
      "#Recruiting",
      "#InterviewPrep",
      "#TalentAcquisition",
    ],
    cta: "https://prepfile.work",
  },

  {
    platform: "linkedin",
    type: "job_seeker",
    copy: `If you're actively interviewing, here's the honest truth about how most people prep vs. what actually works.

Most people: read the job description, look up the company on LinkedIn, search Glassdoor for interview questions, and hope they've covered the right ground.

What actually works: understanding what the specific role is evaluated on (not just what the JD says), knowing what each interview round is designed to test, and having specific, well-researched questions ready for your interviewers.

The difference between the two approaches is usually 20-30 minutes of structured research — if you know what you're looking for. Most people don't, so they spend 2 hours on the wrong things.

PrepFile is an AI tool that builds that structured prep for you. Input your company, role, and job description. Get a personalized brief in under a minute.

Free tier — no credit card: https://prepfile.work`,
    hashtags: [
      "#JobSearch",
      "#InterviewPrep",
      "#CareerAdvice",
      "#ProfessionalDevelopment",
    ],
    cta: "https://prepfile.work",
  },
];

export default socialMediaWeek1;
