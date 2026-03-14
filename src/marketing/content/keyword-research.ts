/**
 * PrepFile — Keyword Research: Top 20 Interview Prep Search Terms
 *
 * Purpose: Strategic input for the CEO — informs which company and role pages to
 * build next, and where PrepFile's value prop has the strongest search-intent match.
 *
 * Methodology: Public autocomplete signals, competitor content analysis (Glassdoor,
 * IGotAnOffer, TryExponent, InterviewQuery), Google Trends patterns, and PrepFile's
 * existing content gaps. Volume estimates are reasoned approximations using public
 * data — treat as directional, not precise.
 *
 * Key finding: "[Company] interview questions" terms are dominated by Glassdoor,
 * LeetCode, and LeetCode-adjacent sites. PrepFile's best attack vector is
 * "how to prepare for [Company] interview" — higher conversion intent, less
 * crowded, and a natural CTA fit for generating a brief.
 */

export type KeywordEntry = {
  rank: number;
  term: string;
  estimatedMonthlySearches: string; // directional bucket
  competition: "high" | "medium" | "low";
  intent: "informational" | "navigational" | "commercial";
  contentOpportunity: string;
  prepfileContentType: "company-page" | "role-page" | "guide-page" | "landing-page";
  existingContent: boolean; // already live in PrepFile
  notes: string;
};

export const keywordResearch: {
  summary: string;
  strategicTakeaway: string;
  immediateTargets: string[];
  keywords: KeywordEntry[];
} = {
  summary:
    "Interview prep search volume is dominated by FAANG company + 'interview questions' terms. " +
    "These are high-volume but heavily contested by Glassdoor, LeetCode, and IGotAnOffer. " +
    "PrepFile's SEO wedge is the 'how to prepare' informational layer — higher conversion intent, " +
    "medium competition, and a direct bridge to brief generation.",

  strategicTakeaway:
    "Build 'How to Prepare for a [Company] Interview' pages for the next 10 highest-demand " +
    "companies not yet covered. Microsoft, Stripe, Goldman Sachs, Accenture, and Salesforce " +
    "represent the best volume + competition gap. Role-specific pages (PM, SWE, data analyst) " +
    "are a second-phase play once company pages are indexed and ranking.",

  immediateTargets: [
    "microsoft",
    "stripe",
    "goldman-sachs",
    "accenture",
    "salesforce",
    "capital-one",
    "airbnb",
    "bcg",
    "openai",
    "uber",
  ],

  keywords: [
    {
      rank: 1,
      term: "google interview questions",
      estimatedMonthlySearches: "60k–90k",
      competition: "high",
      intent: "informational",
      contentOpportunity:
        "Existing Google page targets this. Hard to outrank Glassdoor/LeetCode on the exact term — " +
        "optimize for 'how to prepare for a Google interview' as the pull-through variant.",
      prepfileContentType: "company-page",
      existingContent: true,
      notes:
        "Glassdoor has 25k+ Google reviews. IGotAnOffer ranks with long-form guides. " +
        "PrepFile should differentiate via role-specific subpages (Google PM, Google SWE, Google APM) " +
        "rather than competing head-on for the generic term.",
    },
    {
      rank: 2,
      term: "amazon interview questions",
      estimatedMonthlySearches: "50k–70k",
      competition: "high",
      intent: "informational",
      contentOpportunity:
        "Existing Amazon page targets this. Amazon's Leadership Principles make this term " +
        "particularly rich — a PrepFile page that maps LPs to behavioral question patterns " +
        "would be differentiated. High competition but strong search volume justifies investment.",
      prepfileContentType: "company-page",
      existingContent: true,
      notes:
        "Amazon behavioral interview questions is a strong sub-term (~8k/mo, medium competition). " +
        "Consider adding a dedicated behavioral section or sub-page for Amazon LP mapping.",
    },
    {
      rank: 3,
      term: "microsoft interview questions",
      estimatedMonthlySearches: "25k–40k",
      competition: "high",
      intent: "informational",
      contentOpportunity:
        "No PrepFile page yet. High volume makes this a priority. Microsoft's growth mindset " +
        "culture and structured behavioral rounds create specific, writeable content. " +
        "Target: 'How to Prepare for a Microsoft Interview' with emphasis on growth mindset signals.",
      prepfileContentType: "company-page",
      existingContent: false,
      notes:
        "Microsoft hires at scale across SWE, PM, data, and consulting-adjacent roles — " +
        "broad audience. Glassdoor has strong coverage but PrepFile can compete on specificity " +
        "of prep advice vs. raw question lists.",
    },
    {
      rank: 4,
      term: "how to prepare for google interview",
      estimatedMonthlySearches: "8k–15k",
      competition: "medium",
      intent: "informational",
      contentOpportunity:
        "Existing Google page. This is the ideal target variant — 'how to prepare' signals " +
        "pre-interview intent that converts to brief generation. Optimize existing page to " +
        "explicitly surface this term in H1/meta while keeping [Company] interview questions " +
        "as a secondary hook.",
      prepfileContentType: "company-page",
      existingContent: true,
      notes:
        "Google's 7-step process (screen → recruiter → phone → onsite → HC → team match → offer) " +
        "is well-documented. PrepFile's angle: role-specific prep for each stage.",
    },
    {
      rank: 5,
      term: "meta interview questions",
      estimatedMonthlySearches: "10k–20k",
      competition: "high",
      intent: "informational",
      contentOpportunity:
        "Existing Meta page. Meta's move fast / high bar culture and specific behavioral signals " +
        "(impact, collaboration) create differentiated content. Focus on the 'bootcamp to team ' " +
        "matching process, which most generic prep sites undercover.",
      prepfileContentType: "company-page",
      existingContent: true,
      notes:
        "Term volume fluctuates with Meta's hiring cycles. 2026 Meta is actively hiring again " +
        "after 2023-2024 freezes — good timing to rank this page.",
    },
    {
      rank: 6,
      term: "software engineer interview prep",
      estimatedMonthlySearches: "6k–10k",
      competition: "medium",
      intent: "informational",
      contentOpportunity:
        "No PrepFile role page yet. A 'How to Prepare for a Software Engineering Interview' guide " +
        "would rank across company-agnostic searches and funnel into company-specific brief generation. " +
        "PrepFile's CTA: 'Enter your company + role to get a personalized SWE brief.'",
      prepfileContentType: "role-page",
      existingContent: false,
      notes:
        "TryExponent and InterviewQuery own this space. PrepFile's angle is personalization — " +
        "a generic SWE guide page is medium-term play once company pages are indexed.",
    },
    {
      rank: 7,
      term: "stripe interview questions",
      estimatedMonthlySearches: "1.5k–3k",
      competition: "low",
      intent: "informational",
      contentOpportunity:
        "No PrepFile page. Stripe is a high-status employer with a small but intensely motivated " +
        "candidate pool. Low competition — PrepFile can likely rank a well-researched page within " +
        "3-6 months. Stripe's structured writing exercise and bar raiser rounds are distinct enough " +
        "to write original content.",
      prepfileContentType: "company-page",
      existingContent: false,
      notes:
        "Stripe candidates are generally senior SWE and finance/ops. High willingness to pay " +
        "for prep tools. Strong candidate for a Pro-tier CTA.",
    },
    {
      rank: 8,
      term: "goldman sachs interview prep",
      estimatedMonthlySearches: "2k–4k",
      competition: "low",
      intent: "informational",
      contentOpportunity:
        "No PrepFile page. Goldman's investment banking and engineering interview tracks are " +
        "distinct — both have strong search intent. Wall Street Oasis covers the finance side " +
        "but PrepFile can own the engineering + quant + ops tracks. Medium-term ranking opportunity.",
      prepfileContentType: "company-page",
      existingContent: false,
      notes:
        "Finance sector interview prep is underserved on the AI-brief side. Goldman, JPMorgan " +
        "(existing), Morgan Stanley, BlackRock — all viable targets. Goldman is the highest priority.",
    },
    {
      rank: 9,
      term: "amazon behavioral interview questions",
      estimatedMonthlySearches: "6k–10k",
      competition: "medium",
      intent: "informational",
      contentOpportunity:
        "Existing Amazon page partially addresses this. The Leadership Principles behavioral " +
        "map is a strong sub-topic. A dedicated section or blog post targeting this exact term " +
        "could capture a high-volume, high-intent sub-segment of Amazon job seekers.",
      prepfileContentType: "company-page",
      existingContent: true,
      notes:
        "Amazon LP behavioral is one of the most specific and searchable interview prep topics. " +
        "PrepFile brief already covers this — the content page should make this explicit.",
    },
    {
      rank: 10,
      term: "consulting interview prep",
      estimatedMonthlySearches: "2.5k–5k",
      competition: "medium",
      intent: "informational",
      contentOpportunity:
        "No PrepFile role page. A 'Consulting Interview Prep' guide covering case format, " +
        "behavioral signals, and firm-specific nuances (McKinsey, BCG, Bain) would rank across " +
        "consulting job seekers. Existing McKinsey and Deloitte company pages support this play.",
      prepfileContentType: "role-page",
      existingContent: false,
      notes:
        "PrepFile already has McKinsey and Deloitte pages. A consulting-role guide bridges " +
        "these into a cluster and improves their collective authority.",
    },
    {
      rank: 11,
      term: "product manager interview prep",
      estimatedMonthlySearches: "3k–6k",
      competition: "medium",
      intent: "informational",
      contentOpportunity:
        "No PrepFile role page. TryExponent and Product Alliance dominate this term. " +
        "PrepFile's angle is company-specific PM prep briefs — a role page can funnel to " +
        "Google PM brief, Meta PM brief, etc. Second-phase play after company pages are indexed.",
      prepfileContentType: "role-page",
      existingContent: false,
      notes:
        "PM candidates are high-intent and willing to pay. The Interview Pack ($6.99 for 5 briefs) " +
        "is a natural fit for PM candidates prepping for multiple companies.",
    },
    {
      rank: 12,
      term: "openai interview questions",
      estimatedMonthlySearches: "1k–2k",
      competition: "low",
      intent: "informational",
      contentOpportunity:
        "No PrepFile page. OpenAI is one of the most aspirational employers in tech right now. " +
        "Low competition because OpenAI is relatively new to high-volume hiring. A well-researched " +
        "page could rank quickly and captures a high-value, highly motivated candidate segment.",
      prepfileContentType: "company-page",
      existingContent: false,
      notes:
        "OpenAI's interview process emphasizes research fit, mission alignment, and rapid reasoning " +
        "under ambiguity. Distinct enough from FAANG to write original content. High-signal audience.",
    },
    {
      rank: 13,
      term: "data analyst interview questions",
      estimatedMonthlySearches: "12k–20k",
      competition: "high",
      intent: "informational",
      contentOpportunity:
        "No PrepFile role page. High volume but dominated by W3Schools, Glassdoor, and Simplilearn. " +
        "A role-level guide is competitive and late-phase. Prioritize company-specific data analyst " +
        "pages (Google data analyst, Amazon data analyst) over a generic role page.",
      prepfileContentType: "role-page",
      existingContent: false,
      notes:
        "Data analyst is one of the most searched role+interview combinations. High competition " +
        "means PrepFile needs strong topical authority (multiple company pages indexed) before " +
        "a role page can compete.",
    },
    {
      rank: 14,
      term: "how to prepare for amazon interview",
      estimatedMonthlySearches: "5k–8k",
      competition: "medium",
      intent: "informational",
      contentOpportunity:
        "Existing Amazon page. Same strategic insight as Google — 'how to prepare' intent is " +
        "higher-converting than 'interview questions.' Ensure existing Amazon page H1 and meta " +
        "explicitly targets this variant.",
      prepfileContentType: "company-page",
      existingContent: true,
      notes:
        "Amazon hiring volume is massive — this term spikes whenever Amazon announces hiring. " +
        "Time-sensitive optimization: refresh page after any Amazon headcount announcement.",
    },
    {
      rank: 15,
      term: "airbnb interview questions",
      estimatedMonthlySearches: "2k–4k",
      competition: "low",
      intent: "informational",
      contentOpportunity:
        "No PrepFile page. Airbnb's design-centric engineering culture and 'belong anywhere' " +
        "value system create specific, writeable prep content. Low competition — PrepFile can " +
        "rank within 3-6 months with a well-researched page.",
      prepfileContentType: "company-page",
      existingContent: false,
      notes:
        "Airbnb candidates skew product, design, and full-stack. Distinct culture signals " +
        "from pure FAANG. Good fit for PrepFile's brief model.",
    },
    {
      rank: 16,
      term: "accenture interview questions",
      estimatedMonthlySearches: "8k–15k",
      competition: "medium",
      intent: "informational",
      contentOpportunity:
        "No PrepFile page. Accenture hires at massive scale — millions of applications annually. " +
        "Most prep content is generic. PrepFile can rank with a role-specific angle: " +
        "'How to Prepare for an Accenture [Consulting/Tech/Strategy] Interview.'",
      prepfileContentType: "company-page",
      existingContent: false,
      notes:
        "Accenture's volume of candidates is far larger than FAANG but lower intent per candidate. " +
        "Good traffic volume, moderate conversion probability. Pairs well with a consulting-role page.",
    },
    {
      rank: 17,
      term: "salesforce interview questions",
      estimatedMonthlySearches: "4k–8k",
      competition: "medium",
      intent: "informational",
      contentOpportunity:
        "No PrepFile page. Salesforce's 'Ohana' culture and structured solution engineering " +
        "interview tracks are specific and underserved in quality prep content. " +
        "Medium competition, medium volume — good risk/reward.",
      prepfileContentType: "company-page",
      existingContent: false,
      notes:
        "Salesforce candidates include sales engineers, account executives, and software engineers — " +
        "all with distinct prep needs. A role-differentiated page would rank across multiple sub-terms.",
    },
    {
      rank: 18,
      term: "mckinsey interview prep",
      estimatedMonthlySearches: "3k–5k",
      competition: "medium",
      intent: "informational",
      contentOpportunity:
        "Existing McKinsey page. McKinsey's case interview and PEI (Personal Experience Interview) " +
        "structure are highly specific. The existing page should explicitly target 'McKinsey interview " +
        "prep' as a keyword variant alongside 'McKinsey interview questions.'",
      prepfileContentType: "company-page",
      existingContent: true,
      notes:
        "McKinsey candidates are high-intent, high-willingness-to-pay. PrepFile Pro/Pack CTA " +
        "should be prominent on this page.",
    },
    {
      rank: 19,
      term: "capital one interview questions",
      estimatedMonthlySearches: "3k–6k",
      competition: "low",
      intent: "informational",
      contentOpportunity:
        "No PrepFile page. Capital One's tech-forward culture and data-driven interview process " +
        "create distinct content. Low competition. Capital One's SWE and data science roles attract " +
        "candidates who value company-specific prep — strong PrepFile fit.",
      prepfileContentType: "company-page",
      existingContent: false,
      notes:
        "Capital One is a high-volume employer in the finance-tech hybrid space. " +
        "Distinct from Goldman/JPMorgan — more tech-forward, different question types.",
    },
    {
      rank: 20,
      term: "how to prepare for a job interview",
      estimatedMonthlySearches: "30k–50k",
      competition: "high",
      intent: "informational",
      contentOpportunity:
        "Generic prep guides dominate this (Indeed, LinkedIn, Forbes). PrepFile cannot compete " +
        "head-on on this term with current domain authority. However, it signals a massive " +
        "audience at the top of the funnel. Longer-term: a PrepFile 'Interview Prep Guide' " +
        "landing page could capture this traffic and funnel to company-specific briefs.",
      prepfileContentType: "guide-page",
      existingContent: false,
      notes:
        "Do not prioritize this now — it requires significant domain authority to compete. " +
        "Flag for Phase 4 (post-10 company pages indexed and ranking).",
    },
  ],
};

/**
 * PRIORITY MATRIX SUMMARY
 *
 * IMMEDIATE (next 30 days — write these company pages):
 *   microsoft, stripe, goldman-sachs, accenture, openai, airbnb, capital-one
 *
 * MEDIUM-TERM (days 31–90 — after above are indexed):
 *   salesforce, uber, bcg/bain, role pages (SWE, PM, consulting)
 *
 * LONG-TERM (phase 4 — after 15+ company pages indexed):
 *   data-analyst role page, generic interview prep guide, data-science role page
 *
 * NEVER (wrong audience or unwinnable competition at current DA):
 *   "interview questions" generic term, "how to pass an interview", "interview tips"
 */
