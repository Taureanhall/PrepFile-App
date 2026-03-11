export const content = {
  slug: "uber",
  name: "Uber",
  tagline: "How to Prepare for an Uber Interview",
  metaTitle: "How to Prepare for an Uber Interview | PrepFile",
  metaDescription:
    "Uber's system design rounds are domain-specific: ride matching, surge pricing, real-time geo at scale. Here's the full loop, what interviewers score, and how to prep for each round.",
  intro:
    "Uber operates at a scale that shapes its hiring bar in specific ways — the engineering and product problems they ask about aren't hypothetical, they're drawn from real infrastructure that processes millions of trips daily. Understanding the actual technical constraints of a ride-hailing platform at global scale isn't optional context for Uber interviews: it's the content of the interview.",
  culture: {
    heading: "Uber's Culture",
    body:
      "Uber's cultural reset after 2017 replaced the original 'toe-stepping' values with eight norms built around 'Do the Right Thing' as a first principle. The current culture emphasizes customer obsession, big bets, and making the move — acting decisively with incomplete information. The company is genuinely data-driven: product decisions, operations decisions, and engineering trade-offs are all expected to be grounded in metrics and evidence. Interviewers evaluate whether candidates default to intuition or structured analysis when pushed. Uber also values cross-functional collaboration — the company's core business involves real-time coordination between drivers, riders, operations, pricing, and engineering, so siloed thinking is a red flag.",
  },
  hiring: {
    heading: "The Hiring Process",
    body:
      "The Uber loop begins with a recruiter screen (30 minutes, fit and background), followed by one or two technical phone screens depending on the role. For engineering roles, phone screens cover coding in a shared environment — typically medium-to-hard LeetCode-style problems. The full onsite consists of four to five rounds: coding, system design, behavioral (using Uber's STAR-based format), and a team/fit round with the hiring manager. For senior roles, a second system design round is common. Product manager loops add product sense and analytical rounds instead of or alongside the technical content. Uber interviewers complete written scorecards that a hiring committee reviews — same structure as Google, different evaluation criteria.",
  },
  lookFor: {
    heading: "What Uber Looks For",
    body:
      "Uber's system design rounds are domain-specific in a way most FAANG design rounds are not. Expect questions that map directly to Uber's product: real-time driver-rider matching at scale, geospatial indexing, surge pricing algorithms, trip tracking and ETA systems, or notification infrastructure for millions of concurrent users. The best answers quantify the scale requirements first (trips per second, geo precision, latency SLAs), then design for the bottlenecks specific to that problem. Coding rounds prioritize problem-solving efficiency over memorized solutions — interviewers want to see how you decompose unfamiliar problems. Behavioral rounds probe ownership, cross-functional impact, and how you've operated under ambiguity or organizational friction.",
  },
  tips: [
    "Study Uber's engineering blog before your system design round — they've published deep technical posts on geospatial indexing, surge pricing, and real-time matching that directly preview interview content",
    "For coding rounds, practice explaining your approach before writing — Uber interviewers score your decomposition process as much as the final solution",
    "Behavioral questions at Uber emphasize 'big bets' — prepare a story where you advocated for or executed a high-risk, high-reward initiative with measurable outcome",
    "Know Uber's current business context: rideshare, Uber Eats, Freight, and the interplay between these verticals — interviewers test whether candidates understand the actual product",
    "For system design, always establish scale requirements and latency constraints before drawing any architecture — Uber's systems operate under hard real-time constraints that shape every design decision",
  ],
  ctaCompany: "Uber",
};
