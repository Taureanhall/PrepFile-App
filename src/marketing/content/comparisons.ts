/**
 * Competitor comparison pages — PrepFile vs ChatGPT, Interviewing.io, Pramp
 *
 * Targets high-intent "alternative to" and "vs" searches from candidates
 * already aware of interview prep tools.
 *
 * Each object matches CompanyData in InterviewPrepPage.tsx.
 * Sections are repurposed for comparison structure:
 *   culture   → What the competitor does / how it works
 *   hiring    → What PrepFile does instead
 *   lookFor   → Which to use and when
 */

// ---------------------------------------------------------------------------
// PrepFile vs ChatGPT
// ---------------------------------------------------------------------------

export const chatgptComparison = {
  slug: "prepfile-vs-chatgpt",
  name: "PrepFile vs ChatGPT",
  tagline: "PrepFile vs ChatGPT for Interview Prep",
  metaTitle: "PrepFile vs ChatGPT for Interview Prep | PrepFile",
  metaDescription:
    "ChatGPT gives generic interview advice. PrepFile generates a structured brief specific to your company, role, and round. Here's the difference — and when to use each.",
  intro:
    "Most candidates asking ChatGPT for interview help walk away with answers that sound right but aren't grounded in anything specific: not the company, not the role, not the interviewer's evaluation criteria. ChatGPT is a general-purpose tool. PrepFile was built for this one problem — knowing exactly what you're walking into before you step into a room.",
  culture: {
    heading: "What ChatGPT Does — and Where It Fails",
    body:
      "ChatGPT is a general-purpose language model. For interview prep, that means starting from scratch every session, prompting for advice that sounds plausible but lacks grounding. It doesn't know who's interviewing you, what an SWE-3 at this specific company actually requires versus the job description, or how hiring committees at that company score candidates this year. It hallucinates company details with the same confidence it states accurate ones. There's no structure: no round differentiation, no company-specific signals, no 'here's what candidates with your background typically miss.' You get a list of generic behavioral questions when what you need is context.",
  },
  hiring: {
    heading: "What PrepFile Does Instead",
    body:
      "PrepFile generates a structured prep brief from four inputs: company name, job title, job description, and four context questions about your interview round, company familiarity, prep time, and biggest skill gap. The output covers company snapshot (business model, culture signals, recent developments), role intelligence (what the JD requires versus what's actually weighted in evaluation), round expectations (what each interview stage evaluates specifically), questions to ask interviewers (differentiated by round and role level), and blind spots (common failure modes for your profile). The same 10 minutes of input produces a document you'd otherwise spend three hours writing — and still miss things.",
  },
  lookFor: {
    heading: "The Bottom Line",
    body:
      "If you're preparing for a specific interview at a specific company, generic AI is the wrong tool — not because AI is wrong, but because general-purpose AI is wrong for this. PrepFile uses Gemini with an analysis framework built specifically for interview research (Porter's Five Forces and Deming analysis applied to candidate positioning). ChatGPT is useful for practicing answers once you know what you're preparing for. PrepFile is useful for knowing what you're actually being evaluated on. The right sequence: PrepFile brief first, then practice with whatever tool you prefer.",
  },
  tips: [
    "Generate your PrepFile brief before using ChatGPT to practice — know what signals you're prepping for, then drill them",
    "Don't ask ChatGPT to 'prepare me for a Google SWE interview' — the output won't reflect Google's current evaluation criteria or your round-specific format",
    "PrepFile's MCQ inputs matter: accurate prep time, role familiarity level, and skill gap identification meaningfully change the brief output",
    "If ChatGPT gives you company-specific intel (leadership names, recent initiatives), verify it — hallucination risk is real",
    "Pro brief history lets you compare briefs across rounds as new information surfaces between interviews",
  ],
  ctaCompany: "PrepFile vs ChatGPT",
};

// ---------------------------------------------------------------------------
// PrepFile vs Interviewing.io
// ---------------------------------------------------------------------------

export const interviewingIoComparison = {
  slug: "prepfile-vs-interviewing-io",
  name: "PrepFile vs Interviewing.io",
  tagline: "PrepFile vs Interviewing.io for Interview Prep",
  metaTitle: "PrepFile vs Interviewing.io | PrepFile",
  metaDescription:
    "Interviewing.io is mock interview practice. PrepFile is company research and prep intelligence. Here's how they work together — and which to use first.",
  intro:
    "Interviewing.io and PrepFile solve different problems. One is practice. One is research. If you're preparing for a FAANG or top-tier company loop, you probably need both — and the order matters more than most candidates realize.",
  culture: {
    heading: "What Interviewing.io Does",
    body:
      "Interviewing.io connects candidates with engineers from top companies (Google, Meta, Amazon, and others) for anonymous mock interviews. Sessions are recorded, and you receive structured feedback from someone who actually conducts real interviews at those companies. It's the highest-fidelity practice environment available outside of an actual interview loop. Premium sessions run $150–300 and simulate live technical rounds, system design, and behavioral formats with realistic pressure. The feedback is real, but it's interview-format feedback — not company-specific intelligence about what the company evaluates or how your background maps to the role.",
  },
  hiring: {
    heading: "What PrepFile Does",
    body:
      "PrepFile is not a practice platform. It's an intelligence layer: before you enter any mock or real interview, PrepFile gives you a structured brief covering what the specific company and role actually require, what each round evaluates, what questions will differentiate you, and what blind spots candidates with your background typically hit. What does Meta's system design round actually weight for a senior IC versus a staff candidate? What do Googlers mean by Googleyness in a behavioral signal and how does it show up in scorecards? These aren't things that emerge from practice reps alone — they require company-specific research, synthesized fast.",
  },
  lookFor: {
    heading: "Which Tool for Which Moment",
    body:
      "The natural order: generate your PrepFile brief first (10 minutes), understand what you're actually being evaluated on, then book your Interviewing.io session with that context loaded. You'll practice more effectively when you know what the interviewer is scoring. PrepFile surfaces the strategic layer — company signals, round expectations, evaluation criteria. Interviewing.io gives you execution practice under real pressure. The combination covers both: strategy and reps. Either alone leaves a gap.",
  },
  tips: [
    "Generate your PrepFile brief before your first mock session, not after — enter the practice room knowing what the evaluator is looking for",
    "Use the 'round expectations' section of your PrepFile brief to set the agenda for your Interviewing.io mock",
    "Interviewing.io feedback will be more actionable when you can map it against PrepFile's evaluation criteria for that company",
    "For system design rounds: PrepFile surfaces scale, domain context, and what the company optimizes for — Interviewing.io gives the execution reps",
    "Share your PrepFile brief link via /b/:id with a study partner or coach for coordinated prep",
  ],
  ctaCompany: "PrepFile",
};

// ---------------------------------------------------------------------------
// PrepFile vs Pramp
// ---------------------------------------------------------------------------

export const prampComparison = {
  slug: "prepfile-vs-pramp",
  name: "PrepFile vs Pramp",
  tagline: "PrepFile vs Pramp for Interview Prep",
  metaTitle: "PrepFile vs Pramp | PrepFile",
  metaDescription:
    "Pramp gives peer mock interview reps. PrepFile gives company-specific research briefs. Use them in sequence — PrepFile first, then Pramp — for the best result.",
  intro:
    "Pramp and PrepFile are not in competition. They're different steps in the same workflow. The problem is that most candidates use Pramp before doing their company research — which means they're practicing without knowing what they're actually being evaluated on.",
  culture: {
    heading: "What Pramp Does",
    body:
      "Pramp matches job seekers for 1:1 peer mock interview sessions, alternating interviewer and interviewee roles. It covers coding, behavioral, product management, and data science rounds — all free. You can get dozens of practice reps in before an interview loop, which matters: execution under pressure improves with repetition. The limitation is inherent to the peer model — your mock interviewer is another job-seeker, not someone who works at the company you're targeting. The feedback is structural (did you explain your approach, did you handle edge cases) rather than company-specific (does this answer reflect what this company actually evaluates in this round).",
  },
  hiring: {
    heading: "Where PrepFile Fits",
    body:
      "PrepFile generates a company-specific brief: what this particular company's interviewers weight, what the role requires beyond the job description, what questions will differentiate you in each round, and what blind spots candidates with your background typically miss. None of this comes out of a Pramp session, because Pramp doesn't have access to it — it depends on your mock partner's experience, which is variable. PrepFile is the research layer that makes your practice reps count. It answers 'what should I be practicing for' before you start practicing.",
  },
  lookFor: {
    heading: "The Workflow That Actually Works",
    body:
      "Use PrepFile first: understand what the company evaluates, what each round covers, and what your specific blind spots are for this role. Then use Pramp to build reps against those specific targets. Generic interview practice without company context is like training for a marathon without knowing the course — you'll be fit but unprepared. The combination of PrepFile's research layer and Pramp's execution reps covers what neither can do alone.",
  },
  tips: [
    "PrepFile's 'questions to ask interviewers' section gives your Pramp partner role-specific questions to practice responding to",
    "Pramp's behavioral rounds are generic; PrepFile surfaces what specific companies actually probe for in behavioral evaluation at that company",
    "Free tier gives 3 briefs per week — enough to prepare briefs for multiple interview rounds at the same company as they progress",
    "Resume match (Pro) adds a layer Pramp can't: how your specific background maps to what the role actually requires",
    "Share your PrepFile brief link with your Pramp partner so they can give round-specific, role-grounded feedback",
  ],
  ctaCompany: "PrepFile",
};
