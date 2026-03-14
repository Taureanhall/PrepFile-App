export interface InterviewTheme {
  theme: string;
  whyItMatters: string;
  questions: string[];
}

export interface BehavioralQuestion {
  competency: string;
  questions: string[];
}

export interface RecommendedReading {
  title: string;
  why: string;
}

export interface MandateBridge {
  mandate: string;
  resumeEvidence: string;
  bridge: string;
}

export interface BridgingAnalysis {
  mandateBridges: MandateBridge[];
  howToShowUpStrong: string[];  // replaces roundExpectations.howToShowUpStrong
  blindSpots: string[];         // replaces PrepBriefData.blindSpots
}

export interface CompetitivePositioning {
  dimension: string;
  score: number;
}

export interface InterviewStage {
  stage: string;
  durationMinutes: number;
  focus: string;
  order: number;
}

export interface GapAnalysis {
  dimension: string;
  roleRequirement: number;
  candidateTypical: number;
}

export interface PrepBriefData {
  companySnapshot: {
    overview: string;
    keyMetrics?: string[];
    competitivePositioning?: CompetitivePositioning[];
    recentSignals: string[];
    risksAndUnknowns: string[];
  };
  roleIntelligence: {
    coreMandate: string;
    success90Days: string[];
    commonFailureModes: string[];
  };
  interviewThemes: InterviewTheme[];
  processOperationalQuestions: {
    context: string;
    questions: string[];
  };
  behavioralQuestionBank: BehavioralQuestion[];
  roundExpectations: {
    overview: string;
    whatTripsPeopleUp: string[];
    howToShowUpStrong: string[];
    interviewStages?: InterviewStage[];
  };
  questionsToAsk: string[];
  recommendedReading: RecommendedReading[];
  blindSpots: string[];
  gapAnalysis?: GapAnalysis[];
}
