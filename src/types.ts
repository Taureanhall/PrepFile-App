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

export interface PrepBriefData {
  companySnapshot: {
    overview: string;
    keyMetrics?: string[];
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
  };
  questionsToAsk: string[];
  recommendedReading: RecommendedReading[];
  blindSpots: string[];
}
