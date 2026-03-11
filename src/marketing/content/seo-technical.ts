/**
 * SEO Technical Assets
 * Robots.txt content, JSON-LD structured data, and supplemental meta descriptions.
 * Used by server.ts to inject structured data into interview-prep and blog pages.
 */

// ---------------------------------------------------------------------------
// 1. Robots.txt content block
// ---------------------------------------------------------------------------
// Paste this as the full content of /public/robots.txt (or serve it dynamically).
// Allows all SEO pages; disallows admin and API routes.
export const ROBOTS_TXT = `User-agent: *
Allow: /
Allow: /interview-prep/
Allow: /blog/
Disallow: /api/
Disallow: /admin/
Disallow: /_/

Sitemap: https://prepfile-production.up.railway.app/sitemap.xml
`;

// ---------------------------------------------------------------------------
// 2. JSON-LD structured data — Organization (site-wide)
// ---------------------------------------------------------------------------
// Inject once in the root <head> or in every page's server-rendered HTML.
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PrepFile",
  url: "https://prepfile-production.up.railway.app",
  description:
    "PrepFile generates AI-powered interview prep briefs tailored to your company, role, and job description in under a minute.",
  sameAs: [],
};

// ---------------------------------------------------------------------------
// 3. JSON-LD structured data — FAQPage snippets per company
// ---------------------------------------------------------------------------
// Each entry maps to /interview-prep/:slug.
// Server.ts can import this and inject the matching schema into the page <head>.
export const COMPANY_FAQ_SCHEMAS: Record<
  string,
  { "@context": string; "@type": string; mainEntity: { "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }[] }
> = {
  google: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many rounds does a Google interview have?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Google typically has 4–6 rounds: a phone screen, a technical phone interview, and 4–5 onsite rounds covering coding, system design, and Googleyness/behavioral questions.",
        },
      },
      {
        "@type": "Question",
        name: "Does Google use LeetCode-style coding questions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Google coding rounds focus on algorithms and data structures at medium-to-hard difficulty. Graph traversal, dynamic programming, and string manipulation are common.",
        },
      },
      {
        "@type": "Question",
        name: "What is Googleyness in a Google interview?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Googleyness assesses cultural alignment: intellectual humility, comfort with ambiguity, collaborative instincts, and a genuine enthusiasm for Google's mission.",
        },
      },
    ],
  },
  amazon: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are Amazon's Leadership Principles?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Amazon has 16 Leadership Principles including Customer Obsession, Ownership, Invent and Simplify, and Bias for Action. Every behavioral question maps to one or more of these principles.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Bar Raiser at Amazon?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Bar Raiser is a trained interviewer from outside the hiring team who has veto power over offers. Their job is to ensure each hire raises the overall talent bar.",
        },
      },
      {
        "@type": "Question",
        name: "How many interview rounds does Amazon have?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Amazon typically has a phone screen, one or two technical phone interviews, and a 5–7 round virtual onsite including the Bar Raiser interview.",
        },
      },
    ],
  },
  meta: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What coding questions does Meta ask?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Meta focuses on arrays, strings, trees, graphs, and dynamic programming. They prefer clean, optimal solutions over brute force, and expect candidates to explain trade-offs.",
        },
      },
      {
        "@type": "Question",
        name: "Does Meta ask system design questions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Meta system design rounds test distributed systems knowledge at scale — news feed design, messaging systems, and content ranking are representative examples.",
        },
      },
      {
        "@type": "Question",
        name: "What are Meta's core values in interviews?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Meta evaluates candidates on impact, speed of execution, and move fast culture. Behavioral rounds assess how you prioritize ruthlessly and ship with urgency.",
        },
      },
    ],
  },
  microsoft: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the As-Appropriate interview at Microsoft?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The As-Appropriate (AA) interview is a final round with a senior leader outside the hiring team. An AA interview means you are a serious candidate; how it goes can determine your offer level.",
        },
      },
      {
        "@type": "Question",
        name: "What does growth mindset mean at Microsoft interviews?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Growth mindset at Microsoft means demonstrating that you learn from failure, seek feedback, and improve continuously. Interviewers look for specific examples — not platitudes.",
        },
      },
    ],
  },
  mckinsey: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the McKinsey case interview format?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "McKinsey uses candidate-led case interviews. You drive the structure, hypothesis, and analysis. Interviewers assess structured thinking, quantitative reasoning, and communication clarity.",
        },
      },
      {
        "@type": "Question",
        name: "What is the PEI at McKinsey?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Personal Experience Interview (PEI) probes three dimensions: personal impact, entrepreneurial drive, and inclusive leadership. Each requires a specific, detailed story — not a summary.",
        },
      },
    ],
  },
  "goldman-sachs": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Super Day at Goldman Sachs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Super Day is Goldman's final round — a full day of back-to-back interviews with analysts, associates, VPs, and MDs. It tests technical finance knowledge, markets awareness, and cultural fit.",
        },
      },
      {
        "@type": "Question",
        name: "What technical questions does Goldman Sachs ask?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Goldman asks division-specific questions: IB roles focus on valuation, DCF, and deal mechanics; S&T roles test markets knowledge and mental math; Tech roles ask standard coding and system design.",
        },
      },
    ],
  },
  stripe: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the API design round at Stripe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Stripe's API design round asks you to design a developer-facing API from scratch — endpoints, request/response structures, error handling, and versioning strategy. It reflects Stripe's core product focus.",
        },
      },
      {
        "@type": "Question",
        name: "Does Stripe evaluate written communication?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Stripe is a writing-heavy culture. Some interview steps include a written exercise, and interviewers assess clarity, precision, and how well you communicate complex ideas in text.",
        },
      },
    ],
  },
  netflix: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does Netflix look for in interviews?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Netflix prioritizes culture alignment (Keeper Test, high performance), autonomous decision-making, and system design depth. Culture fit is weighted more heavily than at most tech companies.",
        },
      },
      {
        "@type": "Question",
        name: "Is LeetCode important for Netflix interviews?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Less so than at FAANG peers. Netflix values system design and architectural thinking over algorithmic grinding. That said, coding fundamentals are still assessed.",
        },
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 4. Supplemental meta descriptions
// ---------------------------------------------------------------------------
// Pages in INTERVIEW_PREP_PAGES that needed clearer or more specific descriptions.
// These are reference copies — server.ts is the source of truth for injected meta.
export const SUPPLEMENTAL_META: Record<string, { metaTitle: string; metaDescription: string }> = {
  bcg: {
    metaTitle: "How to Prepare for a BCG Interview | PrepFile",
    metaDescription:
      "BCG case interviews are candidate-led, not interviewer-led. Understand the full process: online assessment, PEI, written case, and what evaluators score. Get a personalized BCG prep brief in 10 minutes.",
  },
  uber: {
    metaTitle: "How to Prepare for an Uber Interview | PrepFile",
    metaDescription:
      "Uber system design rounds are domain-specific: ride matching, surge pricing, real-time geo at scale. Here's the full loop, what interviewers score, and how to prep for each round.",
  },
  tesla: {
    metaTitle: "How to Prepare for a Tesla Interview | PrepFile",
    metaDescription:
      "Tesla's hiring bar is speed and ownership: they want builders who operate without hand-holding. Here's the full process, what interviewers score, and how to stand out in a Tesla loop.",
  },
  airbnb: {
    metaTitle: "How to Prepare for an Airbnb Interview | PrepFile",
    metaDescription:
      "Airbnb Core Values are an active evaluation rubric, not marketing copy. Understand the Experience round, marketplace system design, and how to prep for Airbnb's product-specific coding problems.",
  },
  spotify: {
    metaTitle: "How to Prepare for a Spotify Interview | PrepFile",
    metaDescription:
      "Spotify's Squad model shapes how they hire: autonomous operation, mission alignment, and ambiguity tolerance are scored signals. Here's the full loop and how to prep for domain-specific technical rounds.",
  },
};
