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
    You are an elite executive recruiter and former McKinsey strategy partner.
    Your goal is to create a highly strategic, single-page interview prep brief for a candidate.

    CANDIDATE CONTEXT:
    - Company: ${inputs.companyName}
    - Job Title: ${inputs.jobTitle}
    - Interview Round: ${inputs.round}
    - Familiarity with Company: ${inputs.familiarity}
    - Prep Time Available: ${inputs.timeToPrep}
    - Self-Identified Gap: ${inputs.biggestGap}

    JOB DESCRIPTION:
    ${inputs.jobDescription}

    INSTRUCTIONS & CHAIN OF THOUGHT:
    1. First, conduct a deep strategic analysis of the company in the '_internalStrategicAnalysis' object. 
       - Identify their Generic Strategy (Cost Leadership, Differentiation, or Focus).
       - Identify the most pressing of Porter's Five Forces currently threatening them.
       - Identify their Strategic Group (who they actually compete with and how).
    
    2. CRITICAL TRANSLATION RULE: You must translate these high-level MBA concepts into the everyday reality of the candidate's specific role (${inputs.jobTitle}) and industry. 
       - DO NOT use academic terms like "Porter's Five Forces", "Cost Leader", or "Strategic Group" in the final visible sections. Make the strategy tangible to their daily work.
       - EXAMPLES OF GOOD TRANSLATION:
         * Engineering/Tech: "Because they win on product differentiation but face a high threat of substitutes, feature velocity and UX are prioritized over reducing technical debt."
         * Construction/Manufacturing: "Because they compete on cost in a low-margin environment, aggressive project bidding and supply chain reliability are their biggest bottlenecks."
         * Sales/GTM: "With high industry rivalry and commoditized products, your sales motion will rely heavily on relationship-building and stealing market share rather than educating net-new buyers."
         * Customer Success: "Since the company relies on high switching costs to retain revenue, your role is less about reactive support and more about driving deep, sticky product adoption."
         * HR/People Ops: "As a cost-leader, talent retention is critical because high turnover directly destroys the operational efficiency that protects their margins."
         * Healthcare/Regulated: "Operating in a highly regulated space, compliance isn't just a checkbox—it's the primary barrier to entry protecting their market share from new entrants."

    3. Generate the final structured JSON response with the hidden analysis and the four visible sections.
       - COMPANY SNAPSHOT: What the company actually cares about right now based on your strategic analysis. 
         * Provide an overview.
         * Provide 'keyMetrics': Use Google Search to find 2-4 hard, quantitative metrics about the company (e.g., AUM, Annual Revenue, Total Funding, Headcount, YoY Growth). If it's a public company or large firm, find exact numbers. If you cannot find reliable numbers, omit this.
         * Provide the most critical recent signals and risks/unknowns (use your judgment on the number of items, typically 2-4 based on what is actually important).
       - ROLE INTELLIGENCE: What the role is really solving for beyond what the JD says. How does this role defend against their biggest strategic threat? Include key 90-day success metrics and common failure modes (use your judgment on quantity).
       - ROUND EXPECTATIONS: What they are evaluating in this specific round (${inputs.round}), what format to expect. Include the most important things that trip people up and ways to show up strong.
       - QUESTIONS TO ASK: 4-5 specific, smart questions for this round that signal the candidate understands the company's underlying strategic challenges.
       - BLIND SPOTS: An array of 1-3 strings highlighting areas where company data is thin or the JD is vague.

    CRITICAL: The hidden strategic analysis MUST heavily influence the 'ROLE INTELLIGENCE' and 'QUESTIONS TO ASK' sections. 
    - In 'ROLE INTELLIGENCE', explicitly connect the role's daily tasks to defending against the dominant Porter's Force.
    - In 'QUESTIONS TO ASK', at least two questions MUST be directly about the company's Generic Strategy or Strategic Group, translated into the language of the role.

    Keep the tone professional, direct, and highly actionable. No fluff.
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
              roleSpecificTranslation: { type: Type.STRING },
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
          blindSpots: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          "companySnapshot",
          "roleIntelligence",
          "roundExpectations",
          "questionsToAsk",
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
  const required = ["companySnapshot", "roleIntelligence", "roundExpectations", "questionsToAsk"];
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
