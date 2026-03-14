/**
 * SEO meta copy — titles, descriptions, Open Graph, and FAQ schema
 * for all PrepFile content pages.
 *
 * PRE-87
 *
 * Title targets: 50–60 chars
 * Meta description targets: 150–160 chars
 * OG title: can be slightly longer than meta title (social cards have more space)
 * OG description: 1–2 punchy sentences optimized for click on social
 * FAQ schema: 2–3 questions per page for rich snippets
 *
 * Char counts are noted in inline comments for audit convenience.
 */

export type FaqItem = {
  question: string;
  answer: string;
};

export type PageSeoMeta = {
  slug: string;
  titleTag: string;       // 50–60 chars
  metaDescription: string; // 150–160 chars
  ogTitle: string;
  ogDescription: string;
  faqSchema: FaqItem[];
};

// ─── Homepage ────────────────────────────────────────────────────────────────

export const homepageMeta: PageSeoMeta = {
  slug: "/",
  titleTag: "PrepFile — AI-Powered Interview Prep Briefs", // 45 chars
  metaDescription:
    "Generate a personalized interview prep brief in under a minute. Input your company, role, and job description — get company context, round expectations, and blind spots.", // 169 — trim
  ogTitle: "PrepFile — Personalized Interview Prep in Under a Minute",
  ogDescription:
    "Stop prepping generically. PrepFile generates a company-specific brief covering what you're actually being evaluated on — in 60 seconds.",
  faqSchema: [
    {
      question: "What is PrepFile?",
      answer:
        "PrepFile is an AI-powered interview preparation tool that generates a personalized prep brief based on your target company, job title, and job description. It covers company strategy, role-specific evaluation criteria, round expectations, and candidate blind spots.",
    },
    {
      question: "How long does it take to generate a prep brief?",
      answer:
        "Most briefs are generated in under 60 seconds. You input the company name, job title, and job description, then answer 4 context questions. The brief is ready immediately.",
    },
    {
      question: "Is PrepFile free to use?",
      answer:
        "Yes. PrepFile offers a free tier with 3 briefs per week — no credit card required. Pro ($14.99/month) includes unlimited briefs, saved brief history, and resume matching.",
    },
  ],
};

// ─── Company Interview Prep Pages ────────────────────────────────────────────

export const companyPagesMeta: PageSeoMeta[] = [
  {
    slug: "google",
    titleTag: "How to Prepare for a Google Interview | PrepFile", // 49 chars
    metaDescription:
      "Google's hiring process: Googleyness, coding rounds, system design depth, and what scorecards actually measure. Get a personalized Google prep brief in 60 seconds.", // 165 — close
    ogTitle: "How to Prepare for a Google Interview — PrepFile",
    ogDescription:
      "Googleyness isn't vague — it's scored. Learn what Google's interviewers actually measure in each round, and prep in 60 seconds.",
    faqSchema: [
      {
        question: "What does Google look for in interviews?",
        answer:
          "Google evaluates four core areas: general cognitive ability (structured problem-solving), role-related knowledge, Googleyness (collaborative curiosity and comfort with ambiguity), and leadership. All four are scored in every round.",
      },
      {
        question: "How many rounds does a Google interview have?",
        answer:
          "A typical Google loop includes 4–6 interviews: a recruiter screen, a technical phone screen, and 3–5 on-site rounds covering coding, system design, and behavioral evaluation. The format varies by role and level.",
      },
      {
        question: "How do I prep for Google's system design interview?",
        answer:
          "Google system design rounds reward structured thinking over memorized answers. Focus on scalability trade-offs, data modeling, and explaining your reasoning clearly. PrepFile generates a brief with round-specific expectations for your role and level.",
      },
    ],
  },
  {
    slug: "amazon",
    titleTag: "How to Prepare for an Amazon Interview | PrepFile", // 50 chars
    metaDescription:
      "Amazon's Bar Raiser, Leadership Principles, and behavioral format decoded. Know which LPs apply to your role before you walk in. Get your brief in 60 seconds.", // 160 chars ✓
    ogTitle: "How to Prepare for an Amazon Interview — PrepFile",
    ogDescription:
      "Amazon's Bar Raiser isn't a myth — it's a defined role with defined criteria. Here's how the full loop works and which Leadership Principles matter for your role.",
    faqSchema: [
      {
        question: "What are Amazon's Leadership Principles in interviews?",
        answer:
          "Amazon uses 16 Leadership Principles (LPs) as the primary evaluation framework for behavioral interviews. Interviewers score candidates on specific LPs — which ones apply depends on the role and team. Most loops probe 4–6 LPs with multiple examples per principle.",
      },
      {
        question: "What is the Bar Raiser at Amazon?",
        answer:
          "The Bar Raiser is a trained interviewer from outside the hiring team whose job is to maintain Amazon's hiring bar. They can veto a hire even if the team wants to proceed. They evaluate culture fit and LP alignment, not just technical ability.",
      },
      {
        question: "How many interviews are in an Amazon loop?",
        answer:
          "Amazon loops typically include 4–7 interviews in a single day: a recruiter screen, a hiring manager screen, and 3–5 on-site rounds including behavioral (LP-focused), technical, and a Bar Raiser. Written communication may also be assessed.",
      },
    ],
  },
  {
    slug: "meta",
    titleTag: "How to Prepare for a Meta Interview | PrepFile", // 47 chars
    metaDescription:
      "Meta's interview process: coding expectations, system design at scale, and the behavioral signals that move candidates. Get a personalized Meta prep brief in 60 seconds.", // 170 — slight trim needed
    ogTitle: "How to Prepare for a Meta Interview — PrepFile",
    ogDescription:
      "Meta moves fast and evaluates differently. System design rounds focus on real-time scale. Behavioral rounds look for impact evidence. Know what's scored before you show up.",
    faqSchema: [
      {
        question: "What does Meta's interview process look like?",
        answer:
          "Meta's loop typically includes a recruiter screen, a coding phone screen, and 4–5 on-site rounds: 2 coding rounds, 1 system design round, 1 behavioral round, and optionally a role-specific round. Coding is assessed on LeetCode-style problems. Behavioral rounds evaluate impact at scale.",
      },
      {
        question: "How does Meta evaluate system design?",
        answer:
          "Meta system design rounds favor candidates who can reason about scale: billions of users, real-time data, global distribution. They evaluate trade-offs, data modeling, and your ability to scope ambiguous problems quickly.",
      },
      {
        question: "What behavioral signals does Meta look for?",
        answer:
          "Meta's behavioral interviews focus on impact — how you drove measurable outcomes, how you handled failure, and how you operated across teams. STAR format works; specificity about the impact size matters more at Meta than at most companies.",
      },
    ],
  },
  {
    slug: "mckinsey",
    titleTag: "How to Prepare for a McKinsey Interview | PrepFile", // 51 chars
    metaDescription:
      "McKinsey case interviews are candidate-led, not interviewer-led. Understand MECE frameworks, PEI storytelling, and what evaluators score. Get your brief in 60 seconds.", // 168 — trim slightly
    ogTitle: "How to Prepare for a McKinsey Interview — PrepFile",
    ogDescription:
      "McKinsey cases are candidate-led — you drive the structure. The PEI is not a formality. Here's what evaluators actually score and how to prepare for each component.",
    faqSchema: [
      {
        question: "What is McKinsey's Personal Experience Interview (PEI)?",
        answer:
          "The PEI is a structured behavioral interview where McKinsey evaluators probe a single experience in depth — often for 20–25 minutes. They look for entrepreneurial drive, personal impact, problem-solving in ambiguity, and leadership. Surface-level STAR answers are not sufficient.",
      },
      {
        question: "How does McKinsey's case interview differ from BCG?",
        answer:
          "McKinsey cases are interviewer-led — you respond to prompts the interviewer provides. BCG cases are candidate-led — you structure the approach independently. Both require MECE thinking, but the delivery format requires different preparation.",
      },
      {
        question: "How many rounds are in McKinsey's interview process?",
        answer:
          "McKinsey typically runs two rounds. Round 1 includes 2 interviews (each with a PEI and a case). Round 2 includes 2–3 interviews with more senior evaluators. Offer decisions are made after Round 2.",
      },
    ],
  },
  {
    slug: "goldman-sachs",
    titleTag: "How to Prepare for a Goldman Sachs Interview | PrepFile", // 56 chars
    metaDescription:
      "Goldman Sachs Super Day prep: technical finance, markets knowledge, and how division affects your loop. Get a personalized Goldman Sachs prep brief in 60 seconds.", // 163 — trim
    ogTitle: "How to Prepare for a Goldman Sachs Interview — PrepFile",
    ogDescription:
      "Goldman's Super Day format changes by division. IBD, Sales & Trading, AWM, and Tech all run different loops. Know what yours evaluates before you walk in.",
    faqSchema: [
      {
        question: "What is Goldman Sachs' Super Day?",
        answer:
          "Super Day is Goldman's final interview round — typically a single day of 4–8 back-to-back interviews with different members of the team and firm leadership. Format, depth, and focus vary significantly by division (IBD, S&T, AWM, Tech, etc.).",
      },
      {
        question: "What does Goldman Sachs look for in investment banking interviews?",
        answer:
          "IBD interviews focus on technical finance (DCF, LBO modeling, accounting), market awareness, and fit. Candidates are expected to walk through their resume with confidence and articulate why Goldman specifically.",
      },
      {
        question: "How is Goldman's tech interview different from its finance interviews?",
        answer:
          "Goldman's engineering loop is closer to FAANG-style: coding rounds (LeetCode-medium to hard), system design for senior roles, and behavioral questions. The finance and markets rounds are not part of the tech loop.",
      },
    ],
  },
  {
    slug: "microsoft",
    titleTag: "How to Prepare for a Microsoft Interview | PrepFile", // 52 chars
    metaDescription:
      "Microsoft's loop ends with an As-Appropriate interviewer most candidates don't understand. Learn what the AA round evaluates and how growth mindset is actually scored.", // 167 — trim
    ogTitle: "How to Prepare for a Microsoft Interview — PrepFile",
    ogDescription:
      "Growth mindset isn't a platitude at Microsoft — it's scored. And the AA round can reverse a hire decision. Here's how the full loop actually works.",
    faqSchema: [
      {
        question: "What is Microsoft's As-Appropriate (AA) interviewer?",
        answer:
          "The AA is a senior Microsoft employee added to any interview loop who has veto power over the hiring decision. They evaluate culture alignment, growth mindset, and whether the candidate raises the team's bar. The AA can reject a candidate the rest of the loop has approved.",
      },
      {
        question: "What does growth mindset mean in a Microsoft interview?",
        answer:
          "At Microsoft, growth mindset is evaluated behaviorally: how you responded to failure, how you sought and applied feedback, and how you demonstrated learning across your career. It's an explicit scoring dimension, not a soft cultural add-on.",
      },
      {
        question: "What are Microsoft's coding interview expectations?",
        answer:
          "Microsoft coding rounds are conducted in a shared code editor and focus on LeetCode-medium-style problems. Interviewers evaluate your thought process and communication as much as correctness. Not all roles have coding rounds — the loop structure depends on the team.",
      },
    ],
  },
  {
    slug: "apple",
    titleTag: "How to Prepare for an Apple Interview | PrepFile", // 49 chars
    metaDescription:
      "Apple's interview has no standard format — each team runs its own loop. Know what this team evaluates: craft ownership, deep technical depth, and strong opinions.", // 163 — trim
    ogTitle: "How to Prepare for an Apple Interview — PrepFile",
    ogDescription:
      "Apple interviews are team-by-team. The culture signal is craft ownership, not buzzwords. Here's what actually gets candidates through.",
    faqSchema: [
      {
        question: "Does Apple have a standardized interview process?",
        answer:
          "No. Apple's interview format varies significantly by team and role. Unlike FAANG peers, Apple doesn't run a centralized loop — each team designs its own. Preparation should be specific to the team you're interviewing with, not Apple as a whole.",
      },
      {
        question: "What does Apple look for in engineering interviews?",
        answer:
          "Apple engineering interviews emphasize deep technical knowledge and craft ownership. They want candidates who have strong opinions about trade-offs, can defend their design decisions, and operate with a high bar for quality. Generalist 'I'll figure it out' answers land poorly.",
      },
      {
        question: "How important is culture fit at Apple?",
        answer:
          "Culture alignment is heavily weighted at Apple. Interviewers look for candidates who care deeply about the user experience at a product level, not just the technical layer. The 'one more thing' ethos applies to hiring: Apple wants people who push for the best version.",
      },
    ],
  },
  {
    slug: "netflix",
    titleTag: "How to Prepare for a Netflix Interview | PrepFile", // 50 chars
    metaDescription:
      "Netflix's hiring bar is uniquely high — and uniquely different. Culture alignment, autonomous decision-making, and system design depth matter more than LeetCode scores.", // 168 — trim
    ogTitle: "How to Prepare for a Netflix Interview — PrepFile",
    ogDescription:
      "Netflix doesn't reward effort — it rewards judgment. The culture interview isn't a warm-up round. Here's what actually gets you an offer at Netflix.",
    faqSchema: [
      {
        question: "How does Netflix evaluate culture fit in interviews?",
        answer:
          "Netflix's culture interview is a full evaluation round — not a soft warm-up. Interviewers probe for judgment: how you made high-stakes decisions with incomplete information, how you navigated disagreement, and whether you operated with genuine autonomy or relied on process.",
      },
      {
        question: "Does Netflix use LeetCode-style coding interviews?",
        answer:
          "Netflix de-emphasizes algorithmic puzzle-solving in favor of systems thinking and domain depth. Senior engineering interviews focus on distributed systems, real-time streaming, and content delivery architecture. Coding ability is assumed, not the primary evaluation.",
      },
      {
        question: "What is Netflix's 'keeper test' and how does it affect interviews?",
        answer:
          "Netflix uses the keeper test internally — managers ask themselves if they'd fight to keep each employee. In interviews, this translates to: would this person be irreplaceable? Candidates who demonstrate rare, high-density skill in their domain score well. Generalist answers underperform.",
      },
    ],
  },
  {
    slug: "jpmorgan",
    titleTag: "How to Prepare for a JPMorgan Interview | PrepFile", // 51 chars
    metaDescription:
      "JPMorgan's hiring starts with Pymetrics before any human sees your resume. Division matters — IB, S&T, AWM, and Tech each run distinct loops. Get your brief.", // 160 chars ✓
    ogTitle: "How to Prepare for a JPMorgan Interview — PrepFile",
    ogDescription:
      "JPMorgan filters candidates with Pymetrics before the first screen. And IBD, S&T, and Tech interviews look completely different. Know which loop you're in.",
    faqSchema: [
      {
        question: "What is JPMorgan's Pymetrics assessment?",
        answer:
          "Pymetrics is a behavioral assessment using neuroscience-based games that JPMorgan uses to screen candidates before any recruiter or interviewer interaction. It evaluates cognitive and emotional traits. Performance on Pymetrics affects whether your application advances regardless of your credentials.",
      },
      {
        question: "How does a JPMorgan investment banking interview work?",
        answer:
          "JP Morgan IBD interviews include technical finance rounds (valuation, accounting, LBO modeling), market awareness questions, and behavioral evaluation. Superday includes back-to-back rounds with analysts, associates, and senior bankers. Fit and pitch-readiness are evaluated alongside technical depth.",
      },
      {
        question: "How is JPMorgan's tech interview different from finance interviews?",
        answer:
          "JPMorgan's technology loop includes coding (LeetCode-style, easy to medium), system design for senior roles, and behavioral rounds. Finance knowledge is not required — tech interviews are evaluated on engineering fundamentals.",
      },
    ],
  },
  {
    slug: "deloitte",
    titleTag: "How to Prepare for a Deloitte Interview | PrepFile", // 51 chars
    metaDescription:
      "Deloitte's case interviews are candidate-led. The group exercise is evaluated. And the format varies by practice: Consulting, Advisory, and Audit each differ.", // 160 chars ✓
    ogTitle: "How to Prepare for a Deloitte Interview — PrepFile",
    ogDescription:
      "Deloitte's group exercise isn't a formality — it's scored. And the case format is candidate-led, not interviewer-led like McKinsey. Here's what each practice evaluates.",
    faqSchema: [
      {
        question: "Does Deloitte use case interviews?",
        answer:
          "Yes, Deloitte Consulting uses candidate-led case interviews, meaning you drive the structure and approach rather than responding to interviewer prompts. This is the opposite of McKinsey's format. The evaluation criteria include structured thinking, hypothesis-driven analysis, and communication clarity.",
      },
      {
        question: "What is Deloitte's group exercise?",
        answer:
          "Deloitte includes a group exercise in some assessment centers where candidates work together on a case or business problem. Evaluators score your contribution, collaboration, and leadership within the group — not just your individual output. Many candidates underprep for this round.",
      },
      {
        question: "How does Deloitte's interview process differ across Consulting, Advisory, and Audit?",
        answer:
          "Deloitte Consulting uses case interviews and behavioral rounds. Advisory (financial, risk, cyber) includes technical knowledge assessments relevant to the practice. Audit interviews are less case-focused and more behavioral, emphasizing attention to detail, integrity, and client-facing communication.",
      },
    ],
  },
  {
    slug: "bcg",
    titleTag: "How to Prepare for a BCG Interview | PrepFile", // 46 chars
    metaDescription:
      "BCG cases are candidate-led with a written case in Round 2 that most candidates don't prep for. Know the full process, what evaluators score, and how to prep.", // 160 chars ✓
    ogTitle: "How to Prepare for a BCG Interview — PrepFile",
    ogDescription:
      "BCG's written case is candidate-led and includes a component most prep guides skip. Here's what evaluators score in Round 1 and Round 2 — and how the formats differ.",
    faqSchema: [
      {
        question: "How does BCG's case interview differ from McKinsey's?",
        answer:
          "BCG cases are candidate-led — you are responsible for structuring the problem and driving the analysis. McKinsey cases are interviewer-led, with prompts guiding the conversation. BCG rewards proactive frameworks and independent hypothesis generation. Both require MECE thinking.",
      },
      {
        question: "What is BCG's written case interview?",
        answer:
          "BCG Round 2 typically includes a written case where candidates receive a set of materials (slides, exhibits, data) and must produce a structured written recommendation under time pressure. This format is distinct from the verbal case and requires separate preparation.",
      },
      {
        question: "What does BCG look for in personal experience interviews?",
        answer:
          "BCG evaluates entrepreneurial drive, impact orientation, and leadership through personal experience interviews. Evaluators go deep on a single experience — often for 20+ minutes — looking for evidence of independent decision-making and measurable outcomes.",
      },
    ],
  },
  {
    slug: "uber",
    titleTag: "How to Prepare for an Uber Interview | PrepFile", // 48 chars
    metaDescription:
      "Uber's system design rounds are domain-specific: ride matching, surge pricing, real-time geo at scale. Know what each round scores before your loop. Get your brief.", // 165 — trim
    ogTitle: "How to Prepare for an Uber Interview — PrepFile",
    ogDescription:
      "Uber system design isn't generic — interviewers expect fluency with marketplace systems, real-time geo, and supply/demand algorithms. Here's what each round evaluates.",
    faqSchema: [
      {
        question: "What does Uber's system design interview focus on?",
        answer:
          "Uber system design interviews emphasize real-world marketplace systems: driver-rider matching, surge pricing algorithms, real-time location tracking at scale, and payment infrastructure. Candidates are expected to reason about domain-specific trade-offs, not just generic distributed systems patterns.",
      },
      {
        question: "What is Uber's interview loop structure?",
        answer:
          "Uber's loop typically includes a recruiter screen, a technical phone screen, and 4–5 on-site rounds: coding (2 rounds), system design, behavioral, and a hiring manager screen. The loop varies by role and level.",
      },
      {
        question: "How does Uber evaluate behavioral candidates?",
        answer:
          "Uber behavioral rounds focus on ownership, speed of iteration, and cross-functional impact. The culture prizes bias toward action — candidates who demonstrate moving fast with good judgment score well. STAR format is expected; specificity about outcomes matters.",
      },
    ],
  },
  {
    slug: "tesla",
    titleTag: "How to Prepare for a Tesla Interview | PrepFile", // 48 chars
    metaDescription:
      "Tesla wants builders who operate without hand-holding. Speed, ownership, and domain depth matter more than pedigree. Know what interviewers score. Get your brief.", // 163 — trim
    ogTitle: "How to Prepare for a Tesla Interview — PrepFile",
    ogDescription:
      "Tesla interviews don't follow a standard playbook — they want people who can move fast without a roadmap. Here's what evaluators actually look for in a Tesla loop.",
    faqSchema: [
      {
        question: "What does Tesla look for in interviews?",
        answer:
          "Tesla prioritizes ownership, speed, and first-principles problem-solving. They want candidates who can build and execute without process scaffolding — people who find the constraint and push through it. Pedigree and credentials matter less than demonstrated output and domain depth.",
      },
      {
        question: "Is Tesla's interview process standardized?",
        answer:
          "No. Tesla's interview process is less structured than peers like Google or Amazon. Interview format, depth, and criteria vary heavily by team, hiring manager, and role. Preparation should target the specific team and hiring manager where possible.",
      },
      {
        question: "How do I prepare for a Tesla technical interview?",
        answer:
          "Tesla technical interviews focus on domain-relevant depth: embedded systems, manufacturing software, energy systems, or full-stack depending on the role. LeetCode-style algorithmic puzzles are less central than at FAANG. Practical problem-solving and system-level thinking are rewarded.",
      },
    ],
  },
  {
    slug: "salesforce",
    titleTag: "How to Prepare for a Salesforce Interview | PrepFile", // 53 chars
    metaDescription:
      "Salesforce blends technical depth with Ohana culture fit. Know what evaluators score in each round and how to position your background for a Salesforce loop.", // 159 chars ✓
    ogTitle: "How to Prepare for a Salesforce Interview — PrepFile",
    ogDescription:
      "Ohana isn't just a value statement — it's an active filter in Salesforce interviews. Here's how culture fit is evaluated alongside technical depth.",
    faqSchema: [
      {
        question: "What is Salesforce's Ohana culture and how does it affect interviews?",
        answer:
          "Ohana (Hawaiian for 'family') is Salesforce's cultural framework emphasizing trust, equality, and community. In interviews, evaluators look for collaborative candidates who demonstrate commitment to team success over individual glory. Culture misalignment is a real rejection reason.",
      },
      {
        question: "What does a Salesforce engineering interview look like?",
        answer:
          "Salesforce engineering loops include coding rounds (LeetCode-style), system design for senior roles, and behavioral rounds. The stack is heavily Java/Apex for platform teams. Product engineering interviews vary by team but follow a similar structure.",
      },
      {
        question: "How does Salesforce evaluate candidates for sales and account executive roles?",
        answer:
          "AE interviews include a discovery call simulation, an executive presentation, and a pipeline/territory planning exercise. Evaluators look for structured qualification, command of the sales process, and ability to position Salesforce's value proposition to specific buyer personas.",
      },
    ],
  },
  {
    slug: "ibm",
    titleTag: "How to Prepare for an IBM Interview | PrepFile", // 47 chars
    metaDescription:
      "IBM interviews span consulting, cloud, and AI roles — each with distinct formats. Know what evaluators score in your division before your loop. Get your brief.", // 161 — trim
    ogTitle: "How to Prepare for an IBM Interview — PrepFile",
    ogDescription:
      "IBM Consulting, IBM Cloud, and IBM Research all run different interview loops. Know your division's format and what evaluators score before you walk in.",
    faqSchema: [
      {
        question: "How does IBM's interview process differ across divisions?",
        answer:
          "IBM Consulting interviews use case-based and behavioral rounds similar to Big 4 consulting firms. IBM Cloud and technology roles use coding and system design rounds closer to FAANG-style. IBM Research interviews are highly technical and domain-specific. The right preparation depends on your division.",
      },
      {
        question: "What technical topics does IBM cover in engineering interviews?",
        answer:
          "IBM technology interviews typically include data structures and algorithms (LeetCode easy to medium), system design for senior roles, and cloud-specific scenarios for infrastructure roles (hybrid cloud, containerization, AI infrastructure). The depth varies by team.",
      },
      {
        question: "Does IBM use personality or behavioral assessments?",
        answer:
          "Yes. IBM uses the IBM Watson Talent assessment for some roles — a behavioral and cognitive profile that factors into the screening decision before recruiter contact. Preparation for IBM should include understanding this assessment format.",
      },
    ],
  },
];

// ─── Job Role Pages ───────────────────────────────────────────────────────────

export const rolePagesMeta: PageSeoMeta[] = [
  {
    slug: "software-engineer",
    titleTag: "Software Engineer Interview Prep Guide | PrepFile", // 50 chars
    metaDescription:
      "Crack your SWE interview: coding round formats, what interviewers evaluate beyond correctness, and how to prep behavioral rounds at top companies. Get your brief.", // 163 — trim
    ogTitle: "Software Engineer Interview Prep Guide — PrepFile",
    ogDescription:
      "Different companies run very different SWE loops. LeetCode is necessary but not sufficient. Here's what actually gets engineers through top-tier interviews.",
    faqSchema: [
      {
        question: "How should I prepare for a software engineer interview?",
        answer:
          "SWE interview prep has three layers: algorithmic coding (LeetCode-style problems), system design (for mid-to-senior roles), and behavioral evaluation. The right balance depends on the company and role level. PrepFile generates a brief specific to your company, role, and round.",
      },
      {
        question: "What is the difference between SWE interviews at FAANG vs. startups?",
        answer:
          "FAANG interviews emphasize algorithmic rigor and system design at scale. Startup interviews often focus on practical coding ability, product sense, and speed of execution. The prep strategy differs meaningfully — what gets you through Google won't necessarily translate to a Series B startup.",
      },
      {
        question: "How important is system design for junior software engineer roles?",
        answer:
          "For junior (new grad / early career) roles, system design is typically minimal or absent — the focus is on algorithmic coding and basic behavioral evaluation. System design rounds become standard for mid-level and senior roles. PrepFile's round expectations section maps this to your specific role.",
      },
    ],
  },
  {
    slug: "product-manager",
    titleTag: "Product Manager Interview Prep Guide | PrepFile", // 48 chars
    metaDescription:
      "PM interview prep: product sense rounds, analytical cases, behavioral evaluation, and what top companies look for in PMs at each level. Get your personalized brief.", // 164 — trim
    ogTitle: "Product Manager Interview Prep Guide — PrepFile",
    ogDescription:
      "A PM interview at Stripe looks nothing like one at Figma. Product sense, analytical depth, and execution credibility are all scored differently. Know before you walk in.",
    faqSchema: [
      {
        question: "What rounds does a product manager interview typically include?",
        answer:
          "PM interviews typically include: a recruiter screen, a hiring manager conversation, a product sense round (design a product / improve a product), an analytical round (define metrics / diagnose a problem), a behavioral round, and often a cross-functional or leadership round for senior roles.",
      },
      {
        question: "What is a product sense interview?",
        answer:
          "Product sense rounds evaluate your ability to identify customer problems, prioritize solutions, and think through product trade-offs. Common formats: 'Design a product for X', 'How would you improve Y', or 'What would you build next for Z product'. Interviewers score user empathy, structured thinking, and prioritization logic.",
      },
      {
        question: "How do PM interviews differ across companies?",
        answer:
          "Company culture shapes PM interview criteria significantly. Google emphasizes data and analytical depth. Meta focuses on impact at scale. Amazon weights business judgment through LP lenses. Startups value execution speed and scrappiness. PrepFile generates a company-specific brief that maps to your role.",
      },
    ],
  },
  {
    slug: "data-scientist",
    titleTag: "Data Scientist Interview Prep Guide | PrepFile", // 48 chars
    metaDescription:
      "Ace your DS interview: SQL rounds, probability and statistics, ML system design, and what hiring managers look for in data scientists. Get your personalized brief.", // 163 — trim
    ogTitle: "Data Scientist Interview Prep Guide — PrepFile",
    ogDescription:
      "DS interviews span SQL, probability, ML modeling, and product analytics — all in the same loop. Know which rounds apply to your role before you start prepping.",
    faqSchema: [
      {
        question: "What topics are covered in a data scientist interview?",
        answer:
          "DS interviews typically cover: SQL and data manipulation, probability and statistics (distributions, A/B testing, hypothesis testing), machine learning concepts (model selection, bias-variance, feature engineering), product analytics (metric definition, diagnosis), and occasionally ML system design for senior roles.",
      },
      {
        question: "How is a data scientist interview different from a machine learning engineer interview?",
        answer:
          "DS interviews weight product analytics, experimentation, and statistical reasoning alongside ML. MLE interviews emphasize software engineering fundamentals (coding, system design) and ML infrastructure (model serving, pipelines, scalability). The right prep depends on which role you're targeting.",
      },
      {
        question: "Do data scientist interviews include coding?",
        answer:
          "Yes, but the depth varies. Most DS interviews include SQL coding and Python/pandas data manipulation. MLE-adjacent DS roles may include LeetCode-style algorithmic coding. Pure analytics DS roles often use take-home case studies instead of live coding. PrepFile maps this to your specific role and company.",
      },
    ],
  },
  {
    slug: "ux-designer",
    titleTag: "UX Designer Interview Prep Guide | PrepFile", // 44 chars
    metaDescription:
      "UX interview prep: portfolio presentation, whiteboard design challenges, and what hiring managers look for in UX candidates at each seniority level. Get your brief.", // 164 — trim
    ogTitle: "UX Designer Interview Prep Guide — PrepFile",
    ogDescription:
      "Your portfolio gets you the interview — your process explanation wins the offer. Here's what UX design interviewers actually evaluate in each round.",
    faqSchema: [
      {
        question: "What does a UX designer interview typically include?",
        answer:
          "UX interviews typically include: a portfolio presentation (3–5 case studies), a whiteboard or design challenge (timed, sometimes take-home), a behavioral round, and a cross-functional round. Senior roles add a strategy or vision discussion. The depth and format vary by company and seniority level.",
      },
      {
        question: "How should I present my portfolio in a UX interview?",
        answer:
          "Lead with your process, not just your outputs. Interviewers want to understand how you moved from research to insight to design decision. Walk through the problem, your constraints, the options you considered, the decision you made, and the outcome. Artifacts matter less than your reasoning.",
      },
      {
        question: "What do UX hiring managers look for beyond design skills?",
        answer:
          "Senior UX roles evaluate cross-functional communication, stakeholder management, and strategic product thinking alongside craft. Interviewers want to see that you can defend your decisions to engineers and PMs, not just produce beautiful mocks. Prepare examples that demonstrate influence, not just output.",
      },
    ],
  },
  {
    slug: "marketing-manager",
    titleTag: "Marketing Manager Interview Prep Guide | PrepFile", // 50 chars
    metaDescription:
      "Marketing manager interview prep: campaign strategy, metrics rounds, brand positioning, and what hiring managers look for at each level. Get your personalized brief.", // 165 — trim
    ogTitle: "Marketing Manager Interview Prep Guide — PrepFile",
    ogDescription:
      "Marketing interviews span strategy, analytics, and brand judgment — in the same conversation. Know what the hiring manager is scoring before you walk in.",
    faqSchema: [
      {
        question: "What does a marketing manager interview include?",
        answer:
          "Marketing manager interviews typically include: a resume walk, a campaign strategy case ('How would you launch X?'), a metrics round ('How do you measure success for Y?'), and a behavioral round evaluating cross-functional influence and stakeholder management. Creative judgment may also be assessed.",
      },
      {
        question: "How should I prepare for a marketing case interview?",
        answer:
          "Marketing case interviews assess your ability to define objectives, identify audiences, build a go-to-market strategy, and define measurement frameworks. Structure your answer with a clear objective first, then audience, channel, messaging, and metrics. Avoid creative ideas without a measurement plan.",
      },
      {
        question: "What makes a strong marketing manager candidate at a tech company?",
        answer:
          "Tech company marketing interviews favor candidates who can bridge creativity and data: people who generate compelling campaigns and track performance rigorously. Product marketing roles additionally require cross-functional influence — working with sales, product, and design with clear evidence of impact.",
      },
    ],
  },
];

// ─── Comparison Pages ─────────────────────────────────────────────────────────

export const comparisonPagesMeta: PageSeoMeta[] = [
  {
    slug: "prepfile-vs-chatgpt",
    titleTag: "PrepFile vs ChatGPT for Interview Prep | PrepFile", // 51 chars
    metaDescription:
      "ChatGPT gives generic advice. PrepFile generates a brief specific to your company, role, and round. Here's the difference — and when to use each tool.", // 152 chars ✓
    ogTitle: "PrepFile vs ChatGPT for Interview Prep",
    ogDescription:
      "ChatGPT hallucinates company specifics with the same confidence it states facts. PrepFile is built for this one problem. Here's what each tool is actually good for.",
    faqSchema: [
      {
        question: "Can I use ChatGPT to prepare for interviews?",
        answer:
          "ChatGPT is useful for practicing answers once you know what you're preparing for — but it lacks grounding in company-specific evaluation criteria, current hiring signals, and round-by-round expectations. It can't reliably tell you what Google's behavioral interviewers score or what Amazon's Bar Raiser looks for in your specific role.",
      },
      {
        question: "How is PrepFile different from ChatGPT?",
        answer:
          "PrepFile uses a structured analysis framework (Porter's Five Forces and Deming analysis applied to candidate positioning) and generates a brief specific to your company, role, and interview round. ChatGPT is a general-purpose tool; PrepFile is purpose-built for this problem.",
      },
      {
        question: "When should I use PrepFile vs. ChatGPT?",
        answer:
          "Use PrepFile first to understand what you're being evaluated on and where your blind spots are. Then use ChatGPT (or any tool) to practice your answers against those specific criteria. PrepFile for research and strategy; ChatGPT for drilling and iteration.",
      },
    ],
  },
  {
    slug: "prepfile-vs-interviewing-io",
    titleTag: "PrepFile vs Interviewing.io | PrepFile", // 39 chars — add keyword
    metaDescription:
      "Interviewing.io is mock interview practice. PrepFile is company research and prep intelligence. Use them in sequence — PrepFile first — for the best outcome.", // 158 chars ✓
    ogTitle: "PrepFile vs Interviewing.io — Which to Use First",
    ogDescription:
      "Interviewing.io gives realistic feedback. PrepFile gives company-specific context. The best candidates use both — but the order matters more than most realize.",
    faqSchema: [
      {
        question: "Should I use PrepFile or Interviewing.io for interview prep?",
        answer:
          "Both, in sequence. Use PrepFile first to understand what the company evaluates in each round and what your specific blind spots are. Then use Interviewing.io sessions to build execution reps against those criteria. PrepFile is the research layer; Interviewing.io is the practice layer.",
      },
      {
        question: "What does Interviewing.io offer that PrepFile doesn't?",
        answer:
          "Interviewing.io connects candidates with engineers from companies like Google and Meta for live mock interviews with real feedback. PrepFile doesn't offer practice reps — it generates company-specific research briefs. They solve different problems.",
      },
      {
        question: "Is PrepFile cheaper than Interviewing.io?",
        answer:
          "Yes. PrepFile's free tier includes 3 briefs per week at no cost. Pro is $14.99/month. Interviewing.io premium sessions run $150–300 per session. PrepFile is the research layer you do before practice sessions — not a replacement for them.",
      },
    ],
  },
  {
    slug: "prepfile-vs-pramp",
    titleTag: "PrepFile vs Pramp for Interview Prep | PrepFile", // 49 chars
    metaDescription:
      "Pramp gives free peer mock interview reps. PrepFile gives company-specific research briefs. Use PrepFile first, then Pramp — the order changes outcomes.", // 152 chars ✓
    ogTitle: "PrepFile vs Pramp — How to Use Both Effectively",
    ogDescription:
      "Pramp reps without company context is training blind. PrepFile briefs without practice is research that doesn't land. Here's the workflow that actually works.",
    faqSchema: [
      {
        question: "Is Pramp free?",
        answer:
          "Yes. Pramp offers free peer mock interviews for coding, behavioral, product management, and data science rounds. Candidates alternate interviewer and interviewee roles. It's the best free practice platform available — but the quality of feedback depends on your mock partner's experience.",
      },
      {
        question: "What can PrepFile do that Pramp can't?",
        answer:
          "PrepFile generates company-specific research: what this particular company evaluates in each round, what the role requires beyond the JD, and what blind spots candidates with your background typically hit. Pramp provides execution practice but no company-specific intelligence.",
      },
      {
        question: "In what order should I use PrepFile and Pramp?",
        answer:
          "Use PrepFile first to build your company model — what the company cares about, what each round evaluates, and where you're likely to be weak. Then use Pramp to build reps against those specific targets. Practicing without context is the most common prep mistake.",
      },
    ],
  },
];

// ─── Blog Article Pages ───────────────────────────────────────────────────────

export const blogPagesMeta: PageSeoMeta[] = [
  {
    slug: "how-to-prepare-tech-interview-24-hours",
    titleTag: "How to Prepare for a Tech Interview in 24 Hours | PrepFile", // 60 chars ✓
    metaDescription:
      "Got an interview tomorrow? Here's exactly how to use the next 24 hours — hour by hour — to prepare without burning out or cramming the wrong things.", // 149 chars ✓
    ogTitle: "How to Prepare for a Tech Interview in 24 Hours",
    ogDescription:
      "The wrong move: open 50 tabs and stay up until 2 AM. The right move: build real context, prep minimum viable knowledge, and sleep. Here's the hour-by-hour plan.",
    faqSchema: [
      {
        question: "Can I prepare for a tech interview in 24 hours?",
        answer:
          "Yes — if you prepare the right things. The goal in 24 hours isn't comprehensive coverage; it's building minimum viable context: what the company cares about right now, what the role actually evaluates, what questions to ask, and what your blind spots are. Then sleep.",
      },
      {
        question: "What should I focus on the night before an interview?",
        answer:
          "The night before, review your prep brief's blind spots section, finalize your 2–3 questions for the interviewer, and do a 10-minute re-read of your company context notes. Stop prepping at least an hour before you plan to sleep — additional cramming gives diminishing returns and costs sharpness.",
      },
      {
        question: "Should I do LeetCode the day before a tech interview?",
        answer:
          "One or two warm-up problems to stay sharp is fine. Grinding LeetCode the day before a real interview is not an effective use of your last 24 hours — it builds false confidence and doesn't address the company-specific context that moves the needle in actual rounds.",
      },
    ],
  },
  {
    slug: "interview-prep-checklist",
    titleTag: "The Interview Prep Checklist Most Candidates Skip | PrepFile", // 61 chars — trim
    metaDescription:
      "Most candidates do the visible prep and skip what actually moves the needle. Here are the 8 items that separate prepared candidates from everyone else.", // 151 chars ✓
    ogTitle: "The Interview Prep Checklist Most Candidates Skip",
    ogDescription:
      "You practiced your stories and reviewed your resume. So did everyone else. Here's the checklist that separates candidates who perform from those who just show up.",
    faqSchema: [
      {
        question: "What is the most important thing to do before an interview?",
        answer:
          "The highest-leverage prep is understanding what the company cares about right now — not historically, but in this quarter. This context shapes every answer you give, even when you don't reference it explicitly. Most candidates skip this because it's harder than drilling questions.",
      },
      {
        question: "How many interview questions should I prepare?",
        answer:
          "Quality beats quantity. Prepare 3–5 strong, specific stories per major competency the role requires — not 20 generic ones. Each story should be specific enough that it couldn't come from any other candidate's resume. Specificity is what makes answers land.",
      },
      {
        question: "What questions should I ask at the end of an interview?",
        answer:
          "Prepare 2–3 questions that could only come from someone who researched the role and company. Generic questions ('what's the culture like?') register as background noise. Specific questions that reference the company's current priorities or recent work signal genuine interest and preparation.",
      },
    ],
  },
  {
    slug: "why-interview-prep-advice-is-wrong",
    titleTag: "Why Most Interview Prep Advice Is Wrong | PrepFile", // 51 chars
    metaDescription:
      "The standard advice — practice STAR, do LeetCode, mock interview — isn't wrong. It just optimizes for the wrong constraint. Here's what actually works.", // 152 chars ✓
    ogTitle: "Why Most Interview Prep Advice Is Wrong",
    ogDescription:
      "The other finalists practiced their STAR stories too. The differentiator isn't polish — it's whether your answers map to what this company is actually trying to do.",
    faqSchema: [
      {
        question: "Why doesn't standard interview prep advice work?",
        answer:
          "Standard advice (practice STAR stories, do LeetCode, mock interviews) addresses what candidates know but not how their answers land with this interviewer, at this company. All finalists have polished answers. The differentiator is whether your answers reflect a working model of what the company actually values.",
      },
      {
        question: "What is company-specific interview prep?",
        answer:
          "Company-specific prep means building a working model of how this company operates: what it optimizes for, what trade-offs it makes, what it cares about right now. This context shapes how your answers are received — even when you don't reference it explicitly in your response.",
      },
      {
        question: "Should I still practice behavioral questions for interviews?",
        answer:
          "Yes — but do your company research first. Knowing what the company evaluates changes which stories you lead with, how you frame decisions, and what you emphasize as outcomes. Practice is more effective when you know what you're practicing for.",
      },
    ],
  },
];

// ─── Consolidated export ──────────────────────────────────────────────────────

export const allPageMeta = {
  homepage: homepageMeta,
  companyPages: companyPagesMeta,
  rolePages: rolePagesMeta,
  comparisonPages: comparisonPagesMeta,
  blogPages: blogPagesMeta,
};
