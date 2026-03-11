export const content = {
  slug: "google",
  name: "Google",
  tagline: "How to Prepare for a Google Interview",
  metaTitle: "How to Prepare for a Google Interview | PrepFile",
  metaDescription:
    "Everything you need to know about Google's interview process: culture, hiring rounds, coding expectations, and system design. Generate a personalized Google prep brief in 10 minutes.",
  intro:
    "Google receives millions of applications each year and runs one of the most rigorous technical hiring processes in the industry. The company's hiring committee model means your written interview feedback — not just the live impression — determines whether you get an offer. How you communicate your thinking matters as much as whether you reach the correct solution.",
  culture: {
    heading: "Google's Culture",
    body:
      "Google values intellectual curiosity, comfort with ambiguity, and what they call 'Googleyness' — a mix of passion, humility, and collaborative drive. The company is genuinely data-driven: decisions from product design to headcount are backed by analysis. Interviewers are trained to assess whether candidates reason from first principles or rely on pattern-matching. Psychological safety is operationally real at Google; showing how you handle being wrong, how you give and receive feedback, and how you collaborate under ambiguity are active evaluation signals. The candidate who walks in confident they know the answer before understanding the problem scores poorly. The candidate who asks clarifying questions, forms a hypothesis, tests it, and adjusts — scores well.",
  },
  hiring: {
    heading: "The Hiring Process",
    body:
      "The loop begins with a recruiter screen (30 minutes, no technical content), followed by one or two technical phone screens on Google Meet with a shared doc or Google Docs. The full loop — usually virtual — consists of four to five interviews: two to three coding rounds, one system design round, and one Googleyness/behavioral round. A hiring committee, separate from your interviewers, makes the final call based on written scorecards submitted by each interviewer. This means an interviewer who liked you personally can still submit a 'No Hire' if the feedback document is weak. Your role is to give interviewers material to write strong scorecards — that means thinking aloud, explaining trade-offs, and flagging edge cases explicitly.",
  },
  lookFor: {
    heading: "What Google Looks For",
    body:
      "Coding rounds focus on LeetCode-style algorithmic problems: arrays, hashmaps, trees, graphs, and dynamic programming at medium-to-hard difficulty. Interviewers expect you to handle edge cases, analyze time and space complexity, and optimize your initial solution when prompted. System design rounds test distributed systems thinking at Google scale — expect questions about crawlers, search indexing, messaging systems, or YouTube. The best answers quantify scale requirements before designing, reason explicitly about bottlenecks, and discuss consistency vs. availability trade-offs. Behavioral rounds probe for genuine collaboration examples, cross-functional influence, and situations where you took ownership without being assigned responsibility.",
  },
  tips: [
    "Practice explaining your thought process aloud before writing code — interviewers are scoring your reasoning, not just the output",
    "For system design: start with clarifying scale requirements, then estimate capacity, then design — never draw boxes before you understand the problem",
    "Your hiring committee scorecard is built from written feedback, not impressions — give interviewers specific, quotable moments to work with",
    "Prepare two or three behavioral stories where you drove impact across teams or took initiative outside your defined scope",
    "Optimize your solution after reaching a working answer — interviewers expect you to iterate, not stop at the first correct answer",
  ],
  ctaCompany: "Google",
};
