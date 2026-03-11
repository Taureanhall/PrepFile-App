import { useEffect } from "react";
import { trackSeoPageViewed } from "../lib/analytics";
import { content as googleContent } from "../marketing/content/google";
import { content as amazonContent } from "../marketing/content/amazon";
import { content as metaContent } from "../marketing/content/meta";
import { content as appleContent } from "../marketing/content/apple";
import { content as microsoftContent } from "../marketing/content/microsoft";
import { content as airbnbContent } from "../marketing/content/airbnb";
import { content as spotifyContent } from "../marketing/content/spotify";
import { content as linkedinContent } from "../marketing/content/linkedin";
import { content as adobeContent } from "../marketing/content/adobe";
import { content as stripeContent } from "../marketing/content/stripe";
import { content as teslaContent } from "../marketing/content/tesla";
import { content as salesforceContent } from "../marketing/content/salesforce";
import { content as ibmContent } from "../marketing/content/ibm";
import { content as dataSciContent } from "../marketing/content/data-scientist";
import { content as marketingMgrContent } from "../marketing/content/marketing-manager";
import { content as productMgrContent } from "../marketing/content/product-manager";
import { content as softwareEngContent } from "../marketing/content/software-engineer";
import { content as uxDesignerContent } from "../marketing/content/ux-designer";
import { content as dataEngContent } from "../marketing/content/data-engineer";
import { content as bizAnalystContent } from "../marketing/content/business-analyst";
import { content as mgmtConsultContent } from "../marketing/content/management-consultant";
import { content as ibAnalystContent } from "../marketing/content/investment-banking-analyst";
import { content as devopsContent } from "../marketing/content/devops-sre-engineer";
import {
  chatgptComparison,
  interviewingIoComparison,
  prampComparison,
} from "../marketing/content/comparisons";

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
  google: googleContent,
  amazon: amazonContent,
  meta: metaContent,
  microsoft: microsoftContent,
  apple: appleContent,
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
  netflix: {
    name: "Netflix",
    slug: "netflix",
    tagline: "How to Prepare for a Netflix Interview",
    metaTitle: "How to Prepare for a Netflix Interview | PrepFile",
    metaDescription:
      "Netflix's hiring bar is uniquely high — and uniquely different. Culture alignment, autonomous decision-making, and system design depth matter more than LeetCode grinding. Here's what actually gets you hired.",
    intro:
      "Netflix runs one of the most distinct hiring processes in tech. The culture deck isn't a talking point — it's operationally enforced, and every interviewer is trained to assess it. Before you prep a single coding problem, understand that Netflix is evaluating whether you'd pass the keeper test from day one.",
    culture: {
      heading: "Netflix's Culture",
      body:
        "The Netflix culture memo has one central premise: extraordinary freedom in exchange for extraordinary accountability. There are no expense approval workflows, no strict process documentation, and no vacation policy. Managers give context, not directives. Employees are expected to act like owners — make the call, fix the problem, don't wait for permission. The keeper test defines the bar: Reed Hastings asks, \"Would I fight hard to keep this person if they said they were leaving?\" If the answer is no, letting that person go is considered a management obligation. Netflix only hires people who pass that test from day one.",
    },
    hiring: {
      heading: "The Hiring Process",
      body:
        "The loop starts with a 30-minute recruiter screen, followed by a 45-60 minute technical phone screen with medium-difficulty coding. The onsite consists of approximately 8 interviews, sometimes split across two days, and can be virtual or in-person depending on the team. Unlike most FAANG processes, unanimity is required — any single interviewer who votes no can block an offer. This makes every round consequential. Total timeline is typically 3-6 weeks from first contact to offer.",
    },
    lookFor: {
      heading: "What Netflix Looks For",
      body:
        "Netflix evaluates on three axes: culture alignment (freedom/responsibility, candor, self-discipline), functional excellence (operating autonomously at the required level), and systems thinking (reasoning about problems at Netflix's scale). System design carries the most weight for engineering roles. Questions are domain-specific: streaming infrastructure, recommendation systems, distributed data at 200M+ user scale. Behavioral rounds probe for evidence that you've made significant calls without manager input, delivered candid feedback upward, and owned failures with clear takeaways. Stories where the manager was the decision-maker, or that show reliance on approval chains, are rejection signals.",
    },
    tips: [
      "Invest more in system design than LeetCode — Netflix treats it as the most important technical signal for engineers",
      "For every behavioral story, ask: 'Was I the decision-maker here, or was my manager?' Netflix wants the former",
      "Study Netflix's actual domain (streaming, CDN, recommendation) — generic architecture prep misses the target",
      "Compensation is almost entirely base salary — no annual bonus, options instead of RSUs. Know this going into the negotiation",
      "One weak round can kill an offer due to the unanimity rule — treat every interview as if the outcome depends on it",
    ],
    ctaCompany: "Netflix",
  },
  jpmorgan: {
    name: "JPMorgan",
    slug: "jpmorgan",
    tagline: "How to Prepare for a JPMorgan Interview",
    metaTitle: "How to Prepare for a JPMorgan Interview | PrepFile",
    metaDescription:
      "JPMorgan's interview process starts with Pymetrics before any human sees your resume. Division matters — IB, S&T, AWM, and Tech each have distinct formats. Here's how to prep for each.",
    intro:
      "JPMorgan eliminates 60-80% of applicants through a Pymetrics assessment before a recruiter ever reads a resume. Most candidates miss this entirely. The process is also deeply division-specific — what gets you hired in Investment Banking, Sales & Trading, Asset Management, or Technology are meaningfully different skillsets.",
    culture: {
      heading: "JPMorgan's Culture",
      body:
        "JPMorgan has a notably hierarchical culture compared to most major banks. Excellence within established systems is valued over disrupting them. The firm rewards analytical rigor, commercial awareness, and collaborative drive — interviewers consistently probe for teamwork instincts and the ability to lead without authority. Behavioral questions reliably test resilience under pressure, self-awareness from failure, and genuine market curiosity. Candidates who arrive with an intent to disrupt established processes tend not to land well.",
    },
    hiring: {
      heading: "The Hiring Process",
      body:
        "The process runs in five stages: Pymetrics (gamified cognitive/emotional assessment, hardest filter), an online aptitude test with coding problems for tech roles, a HireVue video interview with AI-graded behavioral questions, a recruiter phone screen, and a Super Day of 3-5 back-to-back interviews. HireVue is assessed on pacing, camera eye contact, and energy — not just content. Offer rates post-Super Day run 10-20% in Investment Banking; the end-to-end process typically takes 4-8 weeks.",
    },
    lookFor: {
      heading: "What JPMorgan Looks For",
      body:
        "Division shapes everything. IB rounds are 70% technical: DCF mechanics, enterprise vs. equity value, merger accretion/dilution, LBO returns — interviewers probe until they find your ceiling. S&T candidates must know which desk they want before Super Day; JPMorgan interviews by desk, not general interest. AWM interviews are 50/50 behavioral and investment philosophy — bring a current, defensible investment idea. Tech roles test Java OOP, financial systems design, and LeetCode medium coding. Across all divisions, a specific, well-researched 'Why JPMorgan?' is the most-failed question.",
    },
    tips: [
      "Prep Pymetrics seriously — it eliminates 60-80% of applicants before any human review, yet most candidates treat it as a checkbox",
      "For IB: be able to walk a full DCF from EBITDA to equity value from memory, including why and how beta is relevered",
      "For S&T: decide which desk (rates, equities, credit, FX) before Super Day — JPMorgan interviews by desk, not by general interest",
      "Record your HireVue answers and watch them back — AI scores pacing and energy, and most people sound flatter on video than they feel",
      "Have a specific 'Why JPMorgan?' ready: reference a deal, a group's recent mandate, or a product area they lead in",
    ],
    ctaCompany: "JPMorgan",
  },
  bcg: {
    name: "BCG",
    slug: "bcg",
    tagline: "How to Prepare for a BCG Interview",
    metaTitle: "How to Prepare for a BCG Interview | PrepFile",
    metaDescription:
      "BCG case interviews are candidate-led, not interviewer-led. Understand the full process: online assessment, PEI, written case, and what evaluators score. Generate a personalized BCG prep brief in 10 minutes.",
    intro:
      "BCG is one of the three most selective consulting firms in the world, and their interview format has a defining characteristic most candidates miss: you drive the case, not the interviewer. Prepping for McKinsey-style interviewer-led cases and showing up to BCG is a reliable way to fail.",
    culture: {
      heading: "BCG's Culture",
      body:
        "BCG prizes intellectual curiosity, hypothesis-driven thinking, and collaborative problem-solving. The firm's core identity is built around asking hard questions and blazing new paths — not just applying standard frameworks. BCG consultants are expected to form a hypothesis early and test it rather than exhaustively structure every possible option. The culture is less hierarchical than McKinsey: junior consultants are expected to challenge analysis and push back with evidence. BCG also places significant weight on social impact and operating with integrity, and these values appear explicitly in PEI evaluation.",
    },
    hiring: {
      heading: "The Hiring Process",
      body:
        "BCG's process typically runs four stages. First, an online chatbot-based case assessment: a 25–30 minute tool with six to ten questions (multiple choice, short answer, data interpretation) followed by a 60–90 second recorded video recommendation. Second, a first-round interview with one case interview and a PEI segment (10 minutes of behavioral, 35 minutes of case). Third, a second-round interview with one to two more cases and a deeper PEI. Some US offices add a written case in second round — you'll receive a document set, have roughly two hours to analyze it, then present a 3–5 slide recommendation. BCG cases are candidate-led throughout: you structure the problem, drive the analysis, and synthesize the insight without being guided question by question.",
    },
    lookFor: {
      heading: "What BCG Evaluates",
      body:
        "Case rounds assess four things: problem structuring (can you build a MECE hypothesis tree quickly?), quantitative reasoning (accurate mental math, data interpretation under time pressure), insight generation (the \"so what\" behind the numbers), and communication (are recommendations clear and specific, not hedged?). The PEI probes for concrete examples of entrepreneurial drive, personal impact, and leadership — BCG uses the same three PEI dimensions as McKinsey. Stories must be first-person, involve real stakes, and show your specific decision-making, not team effort. The online assessment filters heavily on data interpretation and numerical reasoning before any human review.",
    },
    tips: [
      "Practice candidate-led cases from day one — BCG cases require you to define the structure and drive the analysis; passive listening fails here",
      "Form your hypothesis early and explicitly: say 'I think the issue is X because of Y — let me test that' rather than exhaustively mapping every branch",
      "PEI stories must be personal, specific, and show real stakes — generic leadership stories where the team succeeded are rejection signals",
      "If applying to US offices, prepare for the written case: practice synthesizing multi-document sets into a 3-slide recommendation under time pressure",
    ],
    ctaCompany: "BCG",
  },
  uber: {
    name: "Uber",
    slug: "uber",
    tagline: "How to Prepare for an Uber Interview",
    metaTitle: "How to Prepare for an Uber Interview | PrepFile",
    metaDescription:
      "Uber's system design rounds are domain-specific: ride matching, surge pricing, real-time geo at scale. Here's the full loop, what interviewers score, and how to prep for each round.",
    intro:
      "Uber's engineering interview is more domain-grounded than most big tech processes. The system design rounds aren't generic distributed systems questions — they map directly to Uber's marketplace problems, and generic answers land poorly. Understanding Uber's actual systems is part of the prep.",
    culture: {
      heading: "Uber's Culture",
      body:
        "Uber operates on a set of cultural norms anchored by customer obsession and acting like owners. 'Act like an owner' is not a slogan — interviewers specifically probe for candidates who identify problems beyond their defined scope and drive them to resolution without being asked. Uber rewards execution speed and bias for action: finishing what you start and building for the long term, not just shipping incrementally. The culture values directness and candor, and behavioral interviewers are trained to distinguish candidates who influenced outcomes from those who participated in them.",
    },
    hiring: {
      heading: "The Hiring Process",
      body:
        "The loop typically runs in four stages. A recruiter screen (30 minutes, no technical content). A phone screen (45–60 minutes, one coding problem on data structures and algorithms). A full virtual onsite of four to six rounds: two to three coding rounds, one system design round, one behavioral round, and sometimes a hiring manager round for senior levels. Coding rounds are 30–40 minutes each with one problem per round. System design runs 45–60 minutes. Behavioral rounds focus on ownership, ambiguity, and cross-functional influence.",
    },
    lookFor: {
      heading: "What Uber Looks For",
      body:
        "Coding rounds cover core data structures and algorithms — arrays, trees, graphs, and recursion — at medium to hard difficulty. Correctness and complexity analysis are both evaluated; partial credit for an O(n²) solution that you can optimize is fine, but unexplained inefficiency is not. System design rounds are domain-anchored: expect ride-matching algorithms, surge pricing systems, real-time location tracking, or map routing at city-and-region scale. Interviewers want you to reason about geographic distribution, load variability, consistency trade-offs, and failure modes — not just draw a generic microservices diagram. Behavioral rounds use STAR format and probe specifically for ownership signals: moments you identified and resolved a problem that wasn't yours to own.",
    },
    tips: [
      "Study Uber's actual domains before system design: ride matching, surge pricing, real-time geo — generic distributed systems prep misses the target",
      "For coding rounds, state your complexity analysis before you finish — correctness and efficiency are both scored, and interviewers notice when you skip it",
      "Behavioral stories should show you as the decision-maker, not a participant — 'the team decided' is a weak signal at Uber",
      "Prepare a specific 'Why Uber?' answer grounded in a product or market problem you find compelling — ambiguity about why Uber over other big tech reads poorly",
    ],
    ctaCompany: "Uber",
  },
  deloitte: {
    name: "Deloitte",
    slug: "deloitte",
    tagline: "How to Prepare for a Deloitte Interview",
    metaTitle: "How to Prepare for a Deloitte Interview | PrepFile",
    metaDescription:
      "Deloitte's case interviews are candidate-led, not interviewer-led — the opposite of McKinsey. The group exercise is real and evaluated. Here's what the process actually looks like across Consulting, Advisory, and Audit.",
    intro:
      "Deloitte is not one interview process — it's several. Consulting, Advisory, and Audit all run distinct formats, and prepping generically is a reliable way to get cut. The case interview is candidate-led (not McKinsey-style), and the group case exercise in Round 2 is an active evaluation, not filler.",
    culture: {
      heading: "Deloitte's Culture",
      body:
        "Deloitte's stated purpose is \"make an impact that matters\" — and they mean it structurally, not as a slogan. The phrase \"lead at every level\" signals that positional authority is not required to demonstrate leadership; interviewers look for initiative on team projects, not just managerial responsibility. Collaboration signals matter more here than at MBB: being analytically strong but poor at group dynamics is a disqualifying profile. The five official values — lead the way, serve with integrity, take care of each other, foster inclusion, collaborate for measurable impact — show up in behavioral assessment, particularly in the group case and partner round.",
    },
    hiring: {
      heading: "The Hiring Process",
      body:
        "The pipeline: an immersive online assessment (multimedia-based, ~80-100 minutes, blending numerical reasoning, verbal reasoning, and situational judgment — not a standard SHL test), a recruiter phone screen, Round 1 interviews (behavioral + case for consulting; scenario-based for audit), and a Round 2 or assessment center that adds a group case exercise and a presentation round for graduate tracks. The final partner interview runs 40-90 minutes with no fixed structure — the partner is asking: \"Would I bring this person to a client meeting tomorrow?\" For audit/assurance roles, cases are replaced by Deloitte's Scenario Interview Tool, which covers audit judgment calls and financial statement interpretation.",
    },
    lookFor: {
      heading: "What Deloitte Looks For",
      body:
        "Deloitte cases are candidate-led — you define the problem, structure the approach, and drive the analysis. Waiting to be guided is the most common case failure. Deloitte uses the SOAR behavioral framework (Situation, Obstacle, Action, Result), not just STAR — the Obstacle component surfaces real friction and judgment rather than polished success stories. In the group case, both dominating the room and going silent are evaluated negatively; Deloitte observes whether you draw in quieter participants. A specific, practice-referenced 'Why Deloitte?' is essential at the partner stage — generic Big 4 answers are the most-cited partner-round rejection reason.",
    },
    tips: [
      "Practice candidate-led cases — Deloitte cases require you to drive the structure; McKinsey-only prep will fail you here",
      "Use SOAR (Situation, Obstacle, Action, Result) for behavioral stories — they specifically want to hear about real friction, not clean wins",
      "In the group case, focus on collaborative signals: build on others' ideas and draw in quieter participants — Deloitte observes this directly",
      "Prepare for the immersive assessment with mixed-mode practice, not standard SHL banks — the format shifts cognitive modes frequently",
      "Have a specific 'Why Deloitte?' answer that references a practice area or recent client work — 'great culture and training' gets you cut at the partner round",
    ],
    ctaCompany: "Deloitte",
  },
  airbnb: airbnbContent,
  spotify: spotifyContent,
  linkedin: linkedinContent,
  adobe: adobeContent,
  stripe: stripeContent,
  tesla: teslaContent,
  salesforce: salesforceContent,
  ibm: ibmContent,
  "data-scientist": dataSciContent,
  "marketing-manager": marketingMgrContent,
  "product-manager": productMgrContent,
  "software-engineer": softwareEngContent,
  "ux-designer": uxDesignerContent,
  "data-engineer": dataEngContent,
  "business-analyst": bizAnalystContent,
  "management-consultant": mgmtConsultContent,
  "investment-banking-analyst": ibAnalystContent,
  "devops-sre-engineer": devopsContent,
  "prepfile-vs-chatgpt": chatgptComparison,
  "prepfile-vs-interviewing-io": interviewingIoComparison,
  "prepfile-vs-pramp": prampComparison,
};

interface InterviewPrepPageProps {
  slug: string;
}

export function InterviewPrepPage({ slug }: InterviewPrepPageProps) {
  const data = COMPANIES[slug];

  useEffect(() => {
    if (!data) return;

    // Determine page type: comparison pages have "prepfile-vs-" prefix
    const pageType = slug.startsWith("prepfile-vs-") ? "comparison" : (
      ["data-scientist", "marketing-manager", "product-manager", "software-engineer",
       "ux-designer", "data-engineer", "business-analyst", "management-consultant",
       "investment-banking-analyst", "devops-sre-engineer"].includes(slug) ? "role" : "company"
    );
    trackSeoPageViewed(slug, pageType);

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
        <a href="/interview-prep" className="hover:text-zinc-600 transition-colors">Interview Prep</a>
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
