import { useEffect } from "react";

interface CompanyData {
  name: string;
  slug: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  culture: { heading: string; body: string };
  hiring: { heading: string; body: string };
  lookFor: { heading: string; body: string };
  tips: string[];
  ctaCompany: string;
}

const COMPANIES: Record<string, CompanyData> = {
  google: {
    name: "Google",
    slug: "google",
    tagline: "How to Prepare for a Google Interview",
    metaTitle: "How to Prepare for a Google Interview | PrepFile",
    metaDescription:
      "Everything you need to know about Google's interview process: culture, hiring rounds, coding expectations, and system design. Generate a personalized Google prep brief in 10 minutes.",
    intro:
      "Google receives millions of applications each year and runs one of the most rigorous technical hiring processes in the industry. Preparation isn't optional — it's the difference between an offer and a rejection.",
    culture: {
      heading: "Google's Culture",
      body:
        "Google values intellectual curiosity, comfort with ambiguity, and what they call \"Googleyness\" — a mix of passion, humility, and collaborative drive. Data-driven decision-making is deeply embedded: interviewers expect you to reason from first principles and back hypotheses with structure. Psychological safety is valued; showing how you handle being wrong is as important as being right.",
    },
    hiring: {
      heading: "The Hiring Process",
      body:
        "Google's interview loop typically involves a recruiter screen, one or two technical phone screens, and a full onsite (now often virtual) with four to five interviews. Rounds include coding (two to three), system design (one), and behavioral (one or two). The hiring committee, not just your interviewer panel, makes the final call — your written feedback packet matters as much as the live impression.",
    },
    lookFor: {
      heading: "What Google Looks For",
      body:
        "Coding rounds focus on LeetCode-style algorithmic problems: arrays, graphs, dynamic programming, and search. System design rounds test your ability to design scalable distributed systems at Google scale (think: YouTube search, Gmail storage). Behavioral questions follow a loose STAR format with emphasis on impact and collaboration. Interviewers also look for clear communication — thinking out loud is expected, not optional.",
    },
    tips: [
      "Practice explaining your thought process before writing any code",
      "For system design, start with requirements, then capacity, then architecture",
      "Prepare two or three strong examples of large-scope impact for behavioral rounds",
      "Ask clarifying questions — rushing to a solution before understanding the problem is a red flag",
    ],
    ctaCompany: "Google",
  },
  amazon: {
    name: "Amazon",
    slug: "amazon",
    tagline: "How to Prepare for an Amazon Interview",
    metaTitle: "How to Prepare for an Amazon Interview | PrepFile",
    metaDescription:
      "Master Amazon's Leadership Principles, Bar Raiser process, and behavioral interview format. Generate a personalized Amazon prep brief with specific LP examples in 10 minutes.",
    intro:
      "Amazon's interview process is unlike any other. Before you practice a single LeetCode problem, you need to understand the Leadership Principles — they are the lens through which every decision, story, and answer is evaluated.",
    culture: {
      heading: "Amazon's Culture",
      body:
        "Amazon runs on 16 Leadership Principles (LPs), from Customer Obsession and Bias for Action to Frugality and Earn Trust. These aren't corporate slogans — interviewers are explicitly trained to assess each LP during the loop. Decisions are justified by connecting them to one or more LPs. Amazon's culture is intensely data-driven, fast-moving, and comfortable with a high degree of ownership at every level.",
    },
    hiring: {
      heading: "The Hiring Process",
      body:
        "The process typically includes a recruiter screen, an online assessment (OA) for technical roles, one or two phone screens, and a full loop of four to seven interviews. One interviewer in every loop is the Bar Raiser — an independent evaluator with veto power whose job is to raise the overall hiring bar. Bar Raisers often focus on behavioral depth and LP consistency. Decisions are made by consensus, but a Bar Raiser objection can block an offer.",
    },
    lookFor: {
      heading: "What Amazon Looks For",
      body:
        "Behavioral interviews at Amazon are structured around the STAR format (Situation, Task, Action, Result), and you should have two to three distinct stories prepared for each LP. Interviewers will probe for specificity: vague answers fail. Technical rounds cover coding (arrays, trees, graphs) and for senior roles, system design at Amazon scale. Ownership signals — moments where you took initiative beyond your defined scope — are heavily weighted.",
    },
    tips: [
      "Prepare at least two STAR stories for Customer Obsession, Ownership, Deliver Results, and Bias for Action",
      "Use real numbers in your stories — \"reduced latency by 40%\" beats \"improved performance\"",
      "For system design, discuss trade-offs explicitly; Amazon values frugality in architecture decisions",
      "The Bar Raiser will push back — practice holding your position with data, not capitulating under pressure",
    ],
    ctaCompany: "Amazon",
  },
  meta: {
    name: "Meta",
    slug: "meta",
    tagline: "How to Prepare for a Meta Interview",
    metaTitle: "How to Prepare for a Meta Interview | PrepFile",
    metaDescription:
      "Meta's interview process decoded: coding expectations, system design at scale, and behavioral format. Generate a personalized Meta prep brief with round-by-round strategy in 10 minutes.",
    intro:
      "Meta moves fast and expects engineers who can keep up. The interview process is technically demanding, but what sets Meta apart is the emphasis on cross-functional collaboration and product sense — even in engineering roles.",
    culture: {
      heading: "Meta's Culture",
      body:
        "Meta's operating principles center on moving fast, building for impact, and being direct. The company has a famously flat organizational structure and rewards engineers who ship, not those who plan endlessly. Data drives all major product decisions, and a bias toward building fast — even at the risk of breaking things — remains core to how teams operate. Engineers are expected to have opinions on product direction, not just technical execution.",
    },
    hiring: {
      heading: "The Hiring Process",
      body:
        "Meta's loop includes a recruiter screen, one or two coding phone screens, and a full virtual onsite of four to five interviews: two coding rounds, one system design round, one behavioral round, and sometimes a product sense or cross-functional round for senior candidates. The process is relatively standardized and moves quickly once the loop begins — Meta typically closes within two weeks of the full loop.",
    },
    lookFor: {
      heading: "What Meta Looks For",
      body:
        "Coding rounds at Meta are LeetCode-hard in difficulty and emphasize clean, production-quality code — not just a working solution. System design questions focus on large-scale distributed systems (news feed, messaging at billions of users) with explicit trade-off discussion. Behavioral rounds use a modified STAR format and probe for collaboration, cross-functional influence, and specific examples of impact. Meta interviewers respond well to candidates who show strong engineering judgment, not just pattern matching.",
    },
    tips: [
      "Practice LeetCode hard problems, especially graphs, dynamic programming, and sliding window patterns",
      "For system design, always quantify scale (DAUs, QPS) before diving into architecture",
      "Prepare examples of working through disagreement with another team or function",
      "Show product thinking: why does this feature matter, who does it serve, what's the trade-off?",
    ],
    ctaCompany: "Meta",
  },
  mckinsey: {
    name: "McKinsey",
    slug: "mckinsey",
    tagline: "How to Prepare for a McKinsey Interview",
    metaTitle: "How to Prepare for a McKinsey Interview | PrepFile",
    metaDescription:
      "McKinsey case interview preparation: structured thinking, MECE frameworks, and PEI storytelling. Generate a personalized McKinsey prep brief tailored to your background in 10 minutes.",
    intro:
      "McKinsey is one of the most selective employers in the world. Their interview process is also one of the most distinctive — it is not behavioral-first or technical-first. It is case-first. If you cannot structure an ambiguous business problem clearly and quickly, the rest of your preparation does not matter.",
    culture: {
      heading: "McKinsey's Culture",
      body:
        "McKinsey operates on a strict up-or-out meritocracy. The firm prizes structured problem-solving, client service excellence, and the ability to deliver difficult insights diplomatically. Intellectual curiosity and analytical rigor are table stakes. What differentiates top performers is their ability to synthesize complexity into clear, actionable recommendations — and to do it in front of skeptical C-suite clients.",
    },
    hiring: {
      heading: "The Hiring Process",
      body:
        "McKinsey's process typically includes the McKinsey Problem Solving Game (Imbellus), a first-round interview with one to two case interviews plus a Personal Experience Interview (PEI), and a final round with two to three case interviews. Every round includes both a business case and a PEI component. Cases are interviewer-led at McKinsey — you respond to questions rather than driving the case structure yourself, which requires active listening and responsive structuring.",
    },
    lookFor: {
      heading: "What McKinsey Looks For",
      body:
        "Interviewers evaluate problem structuring (MECE issue trees, logical decomposition), quantitative reasoning (mental math, estimation, data interpretation), and insight generation (not just analysis — the \"so what\"). The PEI probes for three core qualities: personal impact, entrepreneurial drive, and inclusive leadership. PEI stories must be specific, first-person, and involve real stakes. Generic leadership stories that could apply to anyone will fail.",
    },
    tips: [
      "Practice issue trees for market entry, profitability, and M&A cases until structuring feels automatic",
      "Never skip the synthesis: always answer \"so what\" before closing a case",
      "PEI stories should demonstrate your personal decision-making, not team success",
      "For the Imbellus game, practice sustained attention and pattern recognition under time pressure",
    ],
    ctaCompany: "McKinsey",
  },
  "goldman-sachs": {
    name: "Goldman Sachs",
    slug: "goldman-sachs",
    tagline: "How to Prepare for a Goldman Sachs Interview",
    metaTitle: "How to Prepare for a Goldman Sachs Interview | PrepFile",
    metaDescription:
      "Goldman Sachs interview prep: technical finance, markets knowledge, and Super Day strategy. Generate a personalized Goldman Sachs prep brief for your division in 10 minutes.",
    intro:
      "Goldman Sachs holds itself to a standard it calls \"client franchise first.\" To interview well, you need to demonstrate not just technical finance skills, but genuine engagement with markets and a clear understanding of why Goldman — not just why finance.",
    culture: {
      heading: "Goldman's Culture",
      body:
        "Goldman Sachs is built around the partnership model even as a public company. The culture prizes excellence, integrity, and commercial instinct. It is intensely client-focused: decisions are made through the lens of long-term client relationships, not short-term fees. The firm values intellectual rigor and candor — junior employees are expected to push back with data and sound reasoning, not deference.",
    },
    hiring: {
      heading: "The Hiring Process",
      body:
        "The process typically begins with a HireVue video interview, followed by a first-round phone screen with HR and a division representative. The final stage is a Super Day — a series of five to eight back-to-back interviews with analysts, associates, VPs, and sometimes MDs. Super Days are marathon events that test both your technical depth and your ability to stay sharp under sustained pressure. Investment Banking and Securities divisions run the most rigorous technical rounds.",
    },
    lookFor: {
      heading: "What Goldman Looks For",
      body:
        "Technical rounds test financial modeling fundamentals: DCF, LBO mechanics, comparable company analysis, and accounting (three-statement linkages). Markets-focused roles (Sales & Trading, Global Markets) add current events and market color — you should know recent macro moves and be able to discuss their implications. Behavioral questions are sharp and specific: interviewers push on \"why Goldman\" and \"why this division\" harder than at most firms. Superficial answers are immediately apparent.",
    },
    tips: [
      "Know your story cold: why finance, why Goldman, why this division — in under two minutes",
      "For IB: nail the three financial statements and how they connect; model a simple LBO from scratch",
      "For markets: track a specific sector, a recent macro event, and have a trade idea ready",
      "Super Day stamina matters — practice five back-to-back mock interviews in a single session",
    ],
    ctaCompany: "Goldman Sachs",
  },
};

interface InterviewPrepPageProps {
  slug: string;
}

export function InterviewPrepPage({ slug }: InterviewPrepPageProps) {
  const data = COMPANIES[slug];

  useEffect(() => {
    if (!data) return;

    const canonicalUrl = `https://prepfile.app/interview-prep/${data.slug}`;

    document.title = data.metaTitle;

    const setMeta = (attr: string, val: string, isName = false) => {
      const sel = isName ? `meta[name="${attr}"]` : `meta[property="${attr}"]`;
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(isName ? "name" : "property", attr);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    setMeta("description", data.metaDescription, true);
    setMeta("og:title", data.metaTitle);
    setMeta("og:description", data.metaDescription);
    setMeta("og:url", canonicalUrl);
    setMeta("twitter:title", data.metaTitle, true);
    setMeta("twitter:description", data.metaDescription, true);

    // Inject canonical link
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // Inject HowTo schema markup
    const schemaId = "interview-prep-schema";
    let schemaEl = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!schemaEl) {
      schemaEl = document.createElement("script");
      schemaEl.id = schemaId;
      schemaEl.setAttribute("type", "application/ld+json");
      document.head.appendChild(schemaEl);
    }
    schemaEl.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: data.metaTitle,
      description: data.metaDescription,
      url: canonicalUrl,
      publisher: {
        "@type": "Organization",
        name: "PrepFile",
        url: "https://prepfile.app",
      },
      step: [
        { "@type": "HowToStep", name: data.culture.heading, text: data.culture.body },
        { "@type": "HowToStep", name: data.hiring.heading, text: data.hiring.body },
        { "@type": "HowToStep", name: data.lookFor.heading, text: data.lookFor.body },
        ...data.tips.map((tip, i) => ({ "@type": "HowToStep", name: `Tip ${i + 1}`, text: tip })),
      ],
    });

    return () => {
      document.title = "PrepFile — AI Interview Prep Briefs";
      document.getElementById(schemaId)?.remove();
      document.head.querySelector('link[rel="canonical"]')?.remove();
    };
  }, [slug, data]);

  if (!data) return null;

  const ctaUrl = `/?company=${encodeURIComponent(data.ctaCompany)}`;

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center border-b border-zinc-100">
        <a href="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
          PrepFile
        </a>
        <a
          href={ctaUrl}
          className="text-sm px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors"
        >
          Get your prep brief
        </a>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-6 pt-6 text-sm text-zinc-400">
        <a href="/" className="hover:text-zinc-600 transition-colors">Home</a>
        <span className="mx-2">/</span>
        <a href="/sitemap.xml" className="hover:text-zinc-600 transition-colors">Interview Prep</a>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">{data.name}</span>
      </div>

      {/* Hero */}
      <header className="max-w-3xl mx-auto px-6 pt-10 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-4">
          {data.tagline}
        </h1>
        <p className="text-lg text-zinc-500 leading-relaxed">{data.intro}</p>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 pb-12 space-y-8">
        {/* Culture */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">{data.culture.heading}</h2>
          <p className="text-zinc-600 leading-relaxed">{data.culture.body}</p>
        </section>

        {/* Hiring */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">{data.hiring.heading}</h2>
          <p className="text-zinc-600 leading-relaxed">{data.hiring.body}</p>
        </section>

        {/* What they look for */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">{data.lookFor.heading}</h2>
          <p className="text-zinc-600 leading-relaxed">{data.lookFor.body}</p>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">
            {data.name} Interview Tips
          </h2>
          <ul className="space-y-2">
            {data.tips.map((tip, i) => (
              <li key={i} className="flex gap-3 text-zinc-600">
                <span className="text-zinc-300 mt-0.5 shrink-0">—</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="bg-zinc-900 rounded-2xl px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Get a personalized {data.name} interview brief in 10 minutes
          </h2>
          <p className="text-zinc-400 mb-6 leading-relaxed max-w-xl mx-auto">
            PrepFile analyzes your job description and generates a precise prep brief: company signals,
            role intelligence, round expectations, and questions that show you've done your homework.
          </p>
          <a
            href={ctaUrl}
            className="inline-block px-6 py-3 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-100 transition-colors text-sm"
          >
            Generate my {data.name} brief →
          </a>
        </section>

        {/* Footer links */}
        <div className="pt-4 border-t border-zinc-200 text-sm text-zinc-400 flex flex-wrap gap-4">
          <a href="/" className="hover:text-zinc-600 transition-colors">← Back to PrepFile</a>
          <a href="/sitemap.xml" className="hover:text-zinc-600 transition-colors">Sitemap</a>
        </div>
      </main>
    </div>
  );
}

export { COMPANIES };
