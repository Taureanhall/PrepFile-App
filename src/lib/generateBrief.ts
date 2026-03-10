import { GoogleGenAI, Type } from "@google/genai";

export async function generateBrief(inputs: {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  round: string;
  familiarity: string;
  timeToPrep: string;
  biggestGap: string;
}) {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an elite executive recruiter and strategic advisor. You think using rigorous business frameworks but always translate them into ground-level, role-specific reality.
    Your goal is to create a highly strategic interview prep brief for a candidate.

    CANDIDATE CONTEXT:
    - Company: ${inputs.companyName}
    - Job Title: ${inputs.jobTitle}
    - Interview Round: ${inputs.round}
    - Familiarity with Company: ${inputs.familiarity}
    - Prep Time Available: ${inputs.timeToPrep}
    - Self-Identified Gap: ${inputs.biggestGap}

    JOB DESCRIPTION:
    ${inputs.jobDescription}

    SPECIFICITY MANDATE:
    Every question, insight, and recommendation must be anchored to ${inputs.companyName} and the ${inputs.jobTitle} role specifically.
    Generic interview advice (e.g., "Tell me about a time you led a team") is forbidden.
    Every interview question must reflect something a ${inputs.companyName} interviewer would actually ask given their specific competitive pressures, operational realities, and this role's actual responsibilities.
    Do not produce generic industry observations. If you don't have enough data on the company, say so in blindSpots — but do not pad the output with generic advice.

    INSTRUCTIONS & CHAIN OF THOUGHT:
    Work through the following four lenses in the '_internalStrategicAnalysis' object before writing anything visible to the candidate.

    LENS 1 — PORTER'S COMPETITIVE POSITION (from Competitive Advantage & Competitive Strategy):
    - Generic Strategy: Cost Leadership, Differentiation, or Focus — and how purely are they executing it?
    - Dominant Five Forces threat: which single force is most likely to erode their margins or position right now?
    - Strategic Group: who do they actually compete with, and what dimensions define the competition (price, service, geography, segment)?
    - Value Chain: which primary activities (inbound logistics, operations, outbound logistics, marketing/sales, service) and which support activities (HR, technology, procurement, firm infrastructure) are the primary sources of their competitive advantage? Where does this role sit in that value chain?
    - Activity System fit: are their key competitive activities mutually reinforcing (tight fit = durable advantage) or loosely connected (fragile, easy to copy)?

    LENS 2 — DEMING'S SYSTEM DIAGNOSIS (from Out of the Crisis):
    - System vs. blame culture: does available evidence suggest this company treats problems as systemic/process failures (Deming) or as individual failures (blame culture)? Look for signals like how they talk about quality, how they handle mistakes publicly, layoff patterns, leadership language.
    - Variation and data: do they appear to manage by data and process metrics, or by gut, quotas, and short-term financial pressure? Management-by-quotas destroys quality; note if this is present.
    - Barriers and silos: are there signals of broken handoffs between departments (sales overpromises ops, engineering ignores customer feedback)? This affects how cross-functional this role will actually need to be.
    - Implication for the role: given the Deming diagnosis, what systemic forces will this person be swimming against or with?

    LENS 3 — ROLE TRANSLATION:
    Synthesize lenses 1-2 into a single clear statement of what this role is REALLY for — the unstated strategic mandate behind the job description.

    CRITICAL TRANSLATION RULE: NEVER use academic terms (Porter, Deming, Five Forces, Value Chain, Generic Strategy, etc.) in the visible output sections. Translate everything into the plain language of the candidate's role and industry.

    GOOD TRANSLATION EXAMPLES:
    - Engineering: "They win on product differentiation but their activity system is fragile — engineering, design, and product operate in silos. Your real job is building features fast enough to stay ahead while quietly fixing the coordination failures that slow everything down."
    - Operations/Manufacturing: "They compete on cost but manage by shifting blame when targets are missed rather than fixing the processes that cause misses. Expect quotas that ignore variation. Your leverage is introducing data-driven process controls that make the numbers move without the firefighting."
    - Sales: "Their competitive advantage is relationship depth in mid-market, but sales and delivery don't talk. Deals get closed that ops can't fulfill. You'll need to self-manage that handoff or your numbers will suffer for someone else's failure."
    - HR/People Ops: "Retention is their core operational risk — high turnover destroys the institutional knowledge that protects their margins. But they're likely managing it reactively (exit interviews, counter-offers) rather than systematically. Your job is to shift that."

    Now generate the final structured JSON with the following visible sections:

    COMPANY SNAPSHOT:
    - overview: What the company is actually optimizing for right now, based on the full strategic analysis. Not a Wikipedia summary — a strategic read.
    - keyMetrics: Use Google Search to find 2-4 hard, current, quantitative metrics (revenue, AUM, funding, headcount, growth rate, market share). Exact numbers for public/large companies. Omit if unreliable.
    - recentSignals: 2-4 recent developments that reveal strategic direction or pressure (hiring patterns, product launches, leadership changes, earnings signals, press).
    - risksAndUnknowns: 2-4 honest risks — market threats, execution risks, cultural signals, unknowns in the JD.

    ROLE INTELLIGENCE:
    - coreMandate: The real job behind the job description — synthesized from all lenses. What problem does this role exist to solve at the system level?
    - success90Days: 3-4 concrete, measurable things that would make this hire look like a home run in the first 90 days.
    - commonFailureModes: 3-4 specific ways people fail in this exact role at this type of company — not generic advice.

    LIKELY INTERVIEW THEMES (Porter-derived):
    Generate 3-4 interview themes directly derived from the competitive analysis. Each theme must be specific to ${inputs.companyName}'s actual strategic situation — not generic industry themes.
    For each theme:
    - theme: A specific, named theme tied to this company's real pressures (e.g., "Winning accounts while AWS commoditizes the infrastructure layer" — not just "Competition")
    - whyItMatters: Why this theme is live RIGHT NOW at ${inputs.companyName} based on the strategic analysis — 1-2 sentences, no jargon
    - questions: 3-5 concrete interview questions a ${inputs.companyName} interviewer would likely ask about this theme for the ${inputs.jobTitle} role. Phrased as the interviewer would ask them. These are strategic/situational questions, not behavioral STAR prompts.

    PROCESS & OPERATIONAL QUESTIONS (Deming-derived):
    Based on the operational/systems analysis of ${inputs.companyName}:
    - context: How this company actually manages processes, quality, and failure — and what that means for how the ${inputs.jobTitle} role will be evaluated. No jargon. 2-3 sentences.
    - questions: 4-6 specific process/operational questions the interviewer will likely ask for this role, derived from how ${inputs.companyName} actually operates. These should reveal the interviewer's real concerns about process maturity, cross-functional execution, and operational discipline.

    BEHAVIORAL QUESTION BANK:
    Identify 3-4 core competencies that the ${inputs.jobTitle} role at ${inputs.companyName} actually tests — based on the JD and what the strategic analysis reveals about how they operate.
    For each:
    - competency: The specific competency (tied to what ${inputs.companyName} actually values — e.g., "Influencing roadmap without direct authority in a matrix org" not just "Leadership")
    - questions: 2-3 behavioral questions a ${inputs.companyName} interviewer would actually ask to probe this competency. Phrased in STAR format prompts. Make them specific — reference the type of situation this candidate will face at this company.

    ROUND EXPECTATIONS:
    - overview: What this specific round (${inputs.round}) is actually evaluating at ${inputs.companyName}, and what format to expect.
    - whatTripsPeopleUp: 3 specific mistakes candidates make in this round at this type of company.
    - howToShowUpStrong: 3 specific things that make candidates stand out in this round.

    QUESTIONS TO ASK: 5 sharp questions for the candidate to ask the interviewer that signal they've thought deeply about ${inputs.companyName}'s real strategic situation. At least one must probe the system/process maturity of the organization. At least one must probe the coherence between stated and revealed strategy. All must be translated into the natural language of the role — no MBA jargon.

    RECOMMENDED READING:
    3-5 specific resources that would give the candidate genuine insight into ${inputs.companyName}'s current strategic situation. Use Google Search to find actual recent articles, earnings call transcripts, press releases, or industry reports. For each:
    - title: The specific resource (article title, report name, or precise description if exact title unknown)
    - why: Why this specific resource matters for this interview — what insight it gives that generic research won't. 1-2 sentences.

    BLIND SPOTS: 1-3 honest flags about where data was thin, the JD was vague, or the analysis is speculative.

    Keep the tone direct, specific, and confident. Cut all filler. Every sentence should be load-bearing.

    FORMATTING RULES: Do not use inline citation numbers, footnotes, or reference markers (e.g. [1], [2], (1)) anywhere in the output. Write in clean prose and bullet points only.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          _internalStrategicAnalysis: {
            type: Type.OBJECT,
            properties: {
              genericStrategy: { type: Type.STRING },
              dominantPorterForce: { type: Type.STRING },
              strategicGroup: { type: Type.STRING },
              valueChainPosition: { type: Type.STRING },
              activitySystemFit: { type: Type.STRING },
              demingDiagnosis: { type: Type.STRING },
              roleRealMandate: { type: Type.STRING },
            },
          },
          companySnapshot: {
            type: Type.OBJECT,
            properties: {
              overview: { type: Type.STRING },
              keyMetrics: { type: Type.ARRAY, items: { type: Type.STRING } },
              recentSignals: { type: Type.ARRAY, items: { type: Type.STRING } },
              risksAndUnknowns: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["overview", "recentSignals", "risksAndUnknowns"],
          },
          roleIntelligence: {
            type: Type.OBJECT,
            properties: {
              coreMandate: { type: Type.STRING },
              success90Days: { type: Type.ARRAY, items: { type: Type.STRING } },
              commonFailureModes: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["coreMandate", "success90Days", "commonFailureModes"],
          },
          interviewThemes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                theme: { type: Type.STRING },
                whyItMatters: { type: Type.STRING },
                questions: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["theme", "whyItMatters", "questions"],
            },
          },
          processOperationalQuestions: {
            type: Type.OBJECT,
            properties: {
              context: { type: Type.STRING },
              questions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["context", "questions"],
          },
          behavioralQuestionBank: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                competency: { type: Type.STRING },
                questions: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["competency", "questions"],
            },
          },
          roundExpectations: {
            type: Type.OBJECT,
            properties: {
              overview: { type: Type.STRING },
              whatTripsPeopleUp: { type: Type.ARRAY, items: { type: Type.STRING } },
              howToShowUpStrong: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["overview", "whatTripsPeopleUp", "howToShowUpStrong"],
          },
          questionsToAsk: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          recommendedReading: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                why: { type: Type.STRING },
              },
              required: ["title", "why"],
            },
          },
          blindSpots: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          "companySnapshot",
          "roleIntelligence",
          "interviewThemes",
          "processOperationalQuestions",
          "behavioralQuestionBank",
          "roundExpectations",
          "questionsToAsk",
          "recommendedReading",
          "blindSpots",
        ],
      },
    },
  });

  let parsed: any;
  try {
    parsed = JSON.parse(response.text || "{}");
  } catch {
    throw new Error("Gemini returned malformed JSON: " + (response.text?.slice(0, 200) ?? ""));
  }
  const required = ["companySnapshot", "roleIntelligence", "interviewThemes", "processOperationalQuestions", "behavioralQuestionBank", "roundExpectations", "questionsToAsk", "recommendedReading"];
  for (const key of required) {
    if (!parsed[key]) throw new Error("Gemini response missing required field: " + key);
  }
  return stripCitations(parsed);
}

function stripCitations(obj: any): any {
  if (typeof obj === "string") {
    return obj.replace(/\s*\[\d+(?:\.\d+)?\]\s*/g, " ").replace(/\s+/g, " ").trim();
  }
  if (Array.isArray(obj)) return obj.map(stripCitations);
  if (obj && typeof obj === "object") {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, stripCitations(v)]));
  }
  return obj;
}
