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
  roundExpectations: {
    overview: string;
    whatTripsPeopleUp: string[];
    howToShowUpStrong: string[];
  };
  questionsToAsk: string[];
  blindSpots: string[];
}
