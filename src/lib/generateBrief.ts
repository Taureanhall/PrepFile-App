import { GoogleGenAI, Type } from "@google/genai";
import type { PrepBriefData, BridgingAnalysis } from "../types.js";

export async function generateBrief(inputs: {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  round: string;
  familiarity: string;
  timeToPrep: string;
  biggestGap: string;
}, tier: "free" | "pro" = "pro") {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `<documents>
<document index="1">
<source>candidate_context</source>
<document_content>
Company: ${inputs.companyName}
Job Title: ${inputs.jobTitle}
Interview Round: ${inputs.round}
Familiarity with Company: ${inputs.familiarity}
Prep Time Available: ${inputs.timeToPrep}
Self-Identified Gap: ${inputs.biggestGap}
</document_content>
</document>
<document index="2">
<source>job_description</source>
<document_content>
${inputs.jobDescription}
</document_content>
</document>
</documents>

<instructions>
You are an elite executive recruiter and strategic advisor. You think using rigorous business frameworks but always translate them into ground-level, role-specific reality.

<constraint name="specificity">
Every question, insight, and recommendation must be anchored to ${inputs.companyName} and the ${inputs.jobTitle} role specifically.
Generic interview advice (e.g., "Tell me about a time you led a team") is forbidden.
Every interview question must reflect something a ${inputs.companyName} interviewer would actually ask given their specific competitive pressures, operational realities, and this role's actual responsibilities.
Do not produce generic industry observations. If you don't have enough data on the company, say so in blindSpots — but do not pad the output with generic advice.
</constraint>

<constraint name="formatting">
Do not use inline citation numbers, footnotes, or reference markers (e.g. [1], [2], (1)) anywhere in the output. Write in clean prose and bullet points only.
Keep the tone direct, specific, and confident. Cut all filler. Every sentence should be load-bearing.
</constraint>

<constraint name="translation">
NEVER use academic terms (Porter, Deming, Five Forces, Value Chain, Generic Strategy, etc.) in the visible output sections. Translate everything into the plain language of the candidate's role and industry.
</constraint>

<chain_of_thought>
Work through these lenses in the '_internalStrategicAnalysis' object before writing anything visible to the candidate.

LENS 1 — COMPETITIVE POSITION:
- Generic Strategy: Cost Leadership, Differentiation, or Focus — and how purely are they executing it?
- Dominant threat: which single force is most likely to erode their margins or position right now?
- Strategic Group: who do they actually compete with, and what dimensions define the competition?
- Value Chain: which activities are the primary sources of their competitive advantage? Where does this role sit?
- Activity System fit: are their key competitive activities mutually reinforcing (durable) or loosely connected (fragile)?

LENS 2 — SYSTEM DIAGNOSIS:
- System vs. blame culture: does evidence suggest they treat problems as systemic/process failures or individual failures?
- Variation and data: do they manage by data and process metrics, or by gut, quotas, and short-term financial pressure?
- Barriers and silos: signals of broken handoffs between departments?
- Implication for the role: what systemic forces will this person be swimming against or with?

LENS 3 — ROLE TRANSLATION:
Synthesize lenses 1-2 into a single clear statement of what this role is REALLY for — the unstated strategic mandate behind the job description.
</chain_of_thought>

<examples>
<example name="engineering_translation">
"They win on product differentiation but their activity system is fragile — engineering, design, and product operate in silos. Your real job is building features fast enough to stay ahead while quietly fixing the coordination failures that slow everything down."
</example>
<example name="operations_translation">
"They compete on cost but manage by shifting blame when targets are missed rather than fixing the processes that cause misses. Expect quotas that ignore variation. Your leverage is introducing data-driven process controls that make the numbers move without the firefighting."
</example>
<example name="sales_translation">
"Their competitive advantage is relationship depth in mid-market, but sales and delivery don't talk. Deals get closed that ops can't fulfill. You'll need to self-manage that handoff or your numbers will suffer for someone else's failure."
</example>
<example name="hr_translation">
"Retention is their core operational risk — high turnover destroys the institutional knowledge that protects their margins. But they're likely managing it reactively (exit interviews, counter-offers) rather than systematically. Your job is to shift that."
</example>
</examples>

<output_sections>
COMPANY SNAPSHOT:
- overview: What the company is actually optimizing for right now, based on the full strategic analysis. Not a Wikipedia summary — a strategic read.
${tier === "free"
  ? `- recentSignals: Exactly 2 recent developments that reveal strategic direction or pressure. Return exactly 2 items, no more.
- Do NOT include keyMetrics, risksAndUnknowns, or competitivePositioning.`
  : `- keyMetrics: Use Google Search to find 2-4 hard, current, quantitative metrics (revenue, AUM, funding, headcount, growth rate, market share). Exact numbers for public/large companies. Omit if unreliable.
- competitivePositioning: Rate this company on a 1-10 scale across exactly these 5 dimensions: "Growth", "Culture", "Compensation", "Prestige", "Work-Life Balance". Base on Glassdoor, compensation data, growth trajectory, brand reputation. Return as [{dimension, score}].
- recentSignals: 2-4 recent developments that reveal strategic direction or pressure.
- risksAndUnknowns: 2-4 honest risks — market threats, execution risks, cultural signals, unknowns in the JD.`}

ROLE INTELLIGENCE:
- coreMandate: The real job behind the job description — synthesized from all lenses. What problem does this role exist to solve at the system level?
- success90Days: 3-4 concrete, measurable things that would make this hire look like a home run in the first 90 days.
- commonFailureModes: 3-4 specific ways people fail in this exact role at this type of company — not generic advice.

LIKELY INTERVIEW THEMES:
Generate 3-4 interview themes directly derived from the competitive analysis. Each must be specific to ${inputs.companyName}'s actual strategic situation.
For each theme:
- theme: A specific, named theme tied to this company's real pressures (e.g., "Winning accounts while AWS commoditizes the infrastructure layer" — not just "Competition")
- whyItMatters: Why this theme is live RIGHT NOW at ${inputs.companyName} — 1-2 sentences, no jargon
- questions: 3-5 concrete interview questions a ${inputs.companyName} interviewer would likely ask about this theme for the ${inputs.jobTitle} role. Strategic/situational, not behavioral STAR prompts.

PROCESS & OPERATIONAL QUESTIONS:
Based on the operational/systems analysis of ${inputs.companyName}:
- context: How this company actually manages processes, quality, and failure — and what that means for how the ${inputs.jobTitle} role will be evaluated. No jargon. 2-3 sentences.
- questions: 4-6 specific process/operational questions derived from how ${inputs.companyName} actually operates.

BEHAVIORAL QUESTION BANK:
Identify 3-4 core competencies that the ${inputs.jobTitle} role at ${inputs.companyName} actually tests.
For each:
- competency: Specific to what ${inputs.companyName} actually values (e.g., "Influencing roadmap without direct authority in a matrix org" not just "Leadership")
- questions: 2-3 behavioral questions in STAR format. Make them specific to situations this candidate will face at this company.

${tier === "pro" ? `ROUND EXPECTATIONS:
- overview: What this specific round (${inputs.round}) is actually evaluating at ${inputs.companyName}, and what format to expect.
- whatTripsPeopleUp: 3 specific mistakes candidates make in this round at this type of company.
- howToShowUpStrong: 3 specific things that make candidates stand out in this round.
- interviewStages: The full interview process as 3-6 stages. For each: stage, durationMinutes, focus, order (1-based).` : "Do NOT include a roundExpectations section."}

QUESTIONS TO ASK: 5 sharp questions that signal deep thinking about ${inputs.companyName}'s real strategic situation. At least one must probe process maturity. At least one must probe coherence between stated and revealed strategy. No MBA jargon.

${tier === "pro" ? `RECOMMENDED READING:
3-5 specific resources for genuine insight into ${inputs.companyName}'s current situation. Use Google Search to find actual recent articles, earnings calls, press releases, or industry reports.
For each: title (specific) and why (what insight it gives that generic research won't, 1-2 sentences).` : "Do NOT include recommendedReading."}

${tier === "pro" ? `GAP ANALYSIS:
Rate 5-6 key competency dimensions for this role. For each:
- dimension, roleRequirement (1-10), candidateTypical (1-10).
The gap reveals where preparation matters most.` : "Do NOT include gapAnalysis."}

BLIND SPOTS: 1-3 honest flags about where data was thin, the JD was vague, or the analysis is speculative.
</output_sections>
</instructions>

<task>
Generate a strategic interview prep brief for a ${inputs.jobTitle} candidate interviewing at ${inputs.companyName}. Return valid JSON matching the schema.
</task>`;

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
              ...(tier === "pro" ? {
                keyMetrics: { type: Type.ARRAY, items: { type: Type.STRING } },
                competitivePositioning: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      dimension: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                    },
                    required: ["dimension", "score"],
                  },
                },
              } : {}),
              recentSignals: { type: Type.ARRAY, items: { type: Type.STRING } },
              ...(tier === "pro" ? { risksAndUnknowns: { type: Type.ARRAY, items: { type: Type.STRING } } } : {}),
            },
            required: tier === "pro" ? ["overview", "recentSignals", "risksAndUnknowns"] : ["overview", "recentSignals"],
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
          ...(tier === "pro" ? {
            roundExpectations: {
              type: Type.OBJECT,
              properties: {
                overview: { type: Type.STRING },
                whatTripsPeopleUp: { type: Type.ARRAY, items: { type: Type.STRING } },
                howToShowUpStrong: { type: Type.ARRAY, items: { type: Type.STRING } },
                interviewStages: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stage: { type: Type.STRING },
                      durationMinutes: { type: Type.NUMBER },
                      focus: { type: Type.STRING },
                      order: { type: Type.NUMBER },
                    },
                    required: ["stage", "durationMinutes", "focus", "order"],
                  },
                },
              },
              required: ["overview", "whatTripsPeopleUp", "howToShowUpStrong", "interviewStages"],
            },
            gapAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dimension: { type: Type.STRING },
                  roleRequirement: { type: Type.NUMBER },
                  candidateTypical: { type: Type.NUMBER },
                },
                required: ["dimension", "roleRequirement", "candidateTypical"],
              },
            },
          } : {}),
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
          ...(tier === "pro" ? ["roundExpectations", "gapAnalysis"] : []),
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
  const required = tier === "pro"
    ? ["companySnapshot", "roleIntelligence", "interviewThemes", "processOperationalQuestions", "behavioralQuestionBank", "roundExpectations", "questionsToAsk", "recommendedReading"]
    : ["companySnapshot", "roleIntelligence", "interviewThemes", "processOperationalQuestions", "behavioralQuestionBank", "questionsToAsk"];
  for (const key of required) {
    if (!parsed[key]) throw new Error("Gemini response missing required field: " + key);
  }

  // Enforce free tier gating server-side regardless of what Gemini returned
  if (tier === "free") {
    delete parsed.roundExpectations;
    delete parsed.gapAnalysis;
    if (parsed.companySnapshot) {
      delete parsed.companySnapshot.keyMetrics;
      delete parsed.companySnapshot.competitivePositioning;
      delete parsed.companySnapshot.risksAndUnknowns;
      if (Array.isArray(parsed.companySnapshot.recentSignals) && parsed.companySnapshot.recentSignals.length > 2) {
        parsed.companySnapshot.recentSignals = parsed.companySnapshot.recentSignals.slice(0, 2);
      }
    }
    // Trim interview themes to 2 (from typically 4-5)
    if (Array.isArray(parsed.interviewThemes) && parsed.interviewThemes.length > 2) {
      parsed.interviewThemes = parsed.interviewThemes.slice(0, 2);
    }
    // Trim behavioral bank to 2 competencies
    if (Array.isArray(parsed.behavioralQuestionBank) && parsed.behavioralQuestionBank.length > 2) {
      parsed.behavioralQuestionBank = parsed.behavioralQuestionBank.slice(0, 2);
    }
    // Trim questions to ask to 3
    if (Array.isArray(parsed.questionsToAsk) && parsed.questionsToAsk.length > 3) {
      parsed.questionsToAsk = parsed.questionsToAsk.slice(0, 3);
    }
    // Remove recommended reading for free tier
    delete parsed.recommendedReading;
  }

  return stripCitations(parsed);
}

/**
 * Quick brief — concise output using only company name and job title (no JD required).
 * Available to free-tier users as their primary brief type.
 */
export async function generateQuickBrief(inputs: {
  companyName: string;
  jobTitle: string;
}) {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an elite executive recruiter. Generate a concise, actionable interview prep snapshot for:

    Company: ${inputs.companyName}
    Role: ${inputs.jobTitle}

    No job description is available — use your knowledge and Google Search to research the company's current situation.

    Return a focused prep snapshot with:

    COMPANY SNAPSHOT:
    - overview: 2-3 sentences on what this company is actually optimizing for right now. Strategic, not Wikipedia.
    - recentSignals: Exactly 2 recent developments that reveal strategic direction (hiring patterns, product launches, leadership changes, earnings).

    ROLE INTELLIGENCE:
    - coreMandate: What this role is really for at this company — the unstated strategic mandate. 2-3 sentences.
    - success90Days: 2-3 concrete things that would make this hire look great in 90 days.

    INTERVIEW THEMES:
    2 likely interview themes specific to ${inputs.companyName}'s situation:
    - theme: Named theme tied to real company pressures
    - whyItMatters: Why this is live right now — 1-2 sentences
    - questions: 2-3 interview questions a ${inputs.companyName} interviewer would ask

    QUESTIONS TO ASK: 3 sharp questions for the candidate to ask the interviewer.

    BLIND SPOTS: 1-2 honest flags about where the analysis may be thin.

    Keep it concise and direct. Every sentence load-bearing. No filler. No academic jargon.
    Do not use inline citations or reference markers.
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
          companySnapshot: {
            type: Type.OBJECT,
            properties: {
              overview: { type: Type.STRING },
              recentSignals: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["overview", "recentSignals"],
          },
          roleIntelligence: {
            type: Type.OBJECT,
            properties: {
              coreMandate: { type: Type.STRING },
              success90Days: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["coreMandate", "success90Days"],
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
          questionsToAsk: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          blindSpots: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["companySnapshot", "roleIntelligence", "interviewThemes", "questionsToAsk", "blindSpots"],
      },
    },
  });

  let parsed: any;
  try {
    parsed = JSON.parse(response.text || "{}");
  } catch {
    throw new Error("Gemini returned malformed JSON: " + (response.text?.slice(0, 200) ?? ""));
  }

  for (const key of ["companySnapshot", "roleIntelligence", "interviewThemes", "questionsToAsk"]) {
    if (!parsed[key]) throw new Error("Gemini response missing required field: " + key);
  }

  // Enforce limits
  if (Array.isArray(parsed.companySnapshot?.recentSignals) && parsed.companySnapshot.recentSignals.length > 2) {
    parsed.companySnapshot.recentSignals = parsed.companySnapshot.recentSignals.slice(0, 2);
  }
  if (Array.isArray(parsed.roleIntelligence?.success90Days) && parsed.roleIntelligence.success90Days.length > 3) {
    parsed.roleIntelligence.success90Days = parsed.roleIntelligence.success90Days.slice(0, 3);
  }
  if (Array.isArray(parsed.interviewThemes) && parsed.interviewThemes.length > 2) {
    parsed.interviewThemes = parsed.interviewThemes.slice(0, 2);
  }
  if (Array.isArray(parsed.questionsToAsk) && parsed.questionsToAsk.length > 3) {
    parsed.questionsToAsk = parsed.questionsToAsk.slice(0, 3);
  }

  // Mark as quick brief for the UI
  parsed._briefType = "quick";

  return stripCitations(parsed);
}

export async function generateBridgingAnalysis(
  brief: PrepBriefData,
  resumeText: string
): Promise<BridgingAnalysis> {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `<documents>
<document index="1">
<source>company_intelligence_brief</source>
<document_content>
${JSON.stringify(brief, null, 2)}
</document_content>
</document>
<document index="2">
<source>candidate_resume</source>
<document_content>
${resumeText}
</document_content>
</document>
</documents>

<instructions>
You are a sharp industry analyst reviewing a candidate's resume against a company intelligence brief.

<constraint name="structural">
Every output item must reference BOTH:
(a) A specific piece of resume evidence (role title, project, metric, or outcome), AND
(b) A specific company or role need drawn directly from this brief.
Any item that references only one side is invalid output.
</constraint>

<constraint name="voice">
Write like a well-connected industry insider giving a friend the real read on their positioning — not a career coach, not a textbook. You understand why this company needs this role right now, what competitive pressures are driving the hire, and where the candidate's background gives them an edge (or doesn't). Never name academic frameworks.
</constraint>

<examples>
<example name="bad_career_coach">"Leverage your transferable skills in cross-functional environments."</example>
<example name="bad_framework_jargon">"This aligns with the threat of new entrants in the market."</example>
<example name="good_insider">"They're hiring this role because [competitor] just launched [X] and they're playing catch-up — your experience doing [Y] at [Company] means you've already solved the exact problem they're scrambling to staff for."</example>
<example name="good_dynamic">"The real reason this mandate matters: their clients can get this analysis from [alternative] now, so the bar for what counts as 'value-add' just went up. Your [specific work] is proof you operate above that bar."</example>
</examples>

<context name="competitive_dynamics_lens">
For each mandate bridge, think through (implicitly — never name these):
- Why does this company need this capability NOW? What competitive pressure, market shift, or client demand is driving it?
- What alternatives exist? (competitors, automation, in-house workarounds, clients doing it themselves)
- Who has leverage in this relationship — the company, their clients, their suppliers, or new players entering?
- What would happen if they DON'T fill this role well? What erodes?
- Is this a defend-the-moat hire or a capture-new-ground hire?
</context>
</instructions>

<task>
TASK 1 — MANDATE BRIDGES
For each of the following from the brief, find the closest matching experience in the resume:
- roleIntelligence.coreMandate
- Each item in roleIntelligence.success90Days

For each match, output:
- mandate: The specific item from the brief (quoted exactly)
- resumeEvidence: The single sharpest proof point — one specific metric, project name, or outcome. Max 25 words. Do NOT copy-paste a full resume bullet.
- bridge: "Your [X] at [Company] maps to their need for [Y] because [concrete reason rooted in competitive dynamics]."
- talkingPoint: One sentence, max 20 words, that the candidate can say OUT LOUD. First person. An actual utterance.
- matchStrength: "strong" (direct proven experience with measurable outcomes), "partial" (adjacent or thin evidence), "gap" (real stretch or nothing close)
- competitiveDynamic: One sentence on WHY this mandate exists from a business/competitive standpoint. Sound like someone who covers this industry.

TASK 2 — PERSONALIZED ROUND STRENGTHS
Write exactly 3 resume-grounded tactics replacing generic howToShowUpStrong. Each must:
- Name a specific resume experience
- Connect to what this round evaluates per the brief's roundExpectations
- Give a tactical instruction: what to open with, lead with, or say when a topic surfaces
- Reflect why the interviewer cares (what business pressure makes this important)

TASK 3 — CANDIDATE-SPECIFIC GAPS
Using roleIntelligence.commonFailureModes and roundExpectations.whatTripsPeopleUp as the lens, identify 1-3 gaps. For each:
- State plainly what the role needs that the resume doesn't demonstrate
- Explain the business reason this gap matters ("without X, the team can't do Y, which matters because Z")
- Give concrete interview mitigation: exact framing or story structure. Not "brush up on X." The actual words.

Return valid JSON matching the schema.
</task>`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mandateBridges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                mandate: { type: Type.STRING },
                resumeEvidence: { type: Type.STRING },
                bridge: { type: Type.STRING },
                talkingPoint: { type: Type.STRING },
                matchStrength: { type: Type.STRING, enum: ["strong", "partial", "gap"] },
                competitiveDynamic: { type: Type.STRING },
              },
              required: ["mandate", "resumeEvidence", "bridge", "talkingPoint", "matchStrength", "competitiveDynamic"],
            },
          },
          howToShowUpStrong: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 3,
            maxItems: 3,
          },
          blindSpots: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["mandateBridges", "howToShowUpStrong", "blindSpots"],
      },
    },
  });

  let parsed: any;
  try {
    parsed = JSON.parse(response.text || "{}");
  } catch {
    throw new Error("Gemini returned malformed JSON: " + (response.text?.slice(0, 200) ?? ""));
  }

  const required = ["mandateBridges", "howToShowUpStrong", "blindSpots"];
  for (const key of required) {
    if (!parsed[key]) throw new Error("Gemini response missing required field: " + key);
  }

  return stripCitations(parsed) as BridgingAnalysis;
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
