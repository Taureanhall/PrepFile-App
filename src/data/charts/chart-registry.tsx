import type { ReactNode } from "react";

// Blog charts
import { PrepTimeVsSuccessChart, SkippedPrepStepsChart } from "./blog/prep-effectiveness";
import { MethodEffectivenessChart, HiringManagerPrioritiesChart } from "./blog/method-effectiveness";
import { InterviewStageBreakdownChart, SalaryNegotiationImpactChart } from "./blog/interview-stages";
import { BehavioralQuestionFrequencyChart, STARScoringRadarChart } from "./blog/behavioral-questions";
import { ChecklistCompletionChart, RoleDemandTrendChart } from "./blog/checklist-data";
import { SalaryTrendChart, TechVsNonTechSalaryChart } from "./blog/salary-trends";

// Company/category charts
import { BigTechSalaryChart, BigTechRoundsChart, BigTechCultureRadarChart } from "./companies/big-tech";
import { FinanceSelectivityChart, CaseInterviewTypesChart, IBProcessBreakdownChart } from "./companies/finance";
import { GrowthTechSalaryChart, GrowthTechCultureRadarChart } from "./companies/growth-tech";
import { RoleDemandTrendsChart, AvgInterviewRoundsChart } from "./companies/roles";

/**
 * Central chart registry. Maps a chartId string to a React element.
 * Used by BlogPage renderMarkdown ({{chart:id}} tokens) and
 * InterviewPrepPage ("Data Snapshot" section).
 */
const CHART_REGISTRY: Record<string, ReactNode> = {
  // Blog: prep effectiveness
  "prep-time-vs-success": <PrepTimeVsSuccessChart />,
  "skipped-prep-steps": <SkippedPrepStepsChart />,

  // Blog: method effectiveness
  "method-effectiveness": <MethodEffectivenessChart />,
  "hiring-manager-priorities": <HiringManagerPrioritiesChart />,

  // Blog: interview stages
  "interview-stage-breakdown": <InterviewStageBreakdownChart />,
  "salary-negotiation-impact": <SalaryNegotiationImpactChart />,

  // Blog: behavioral questions
  "behavioral-question-frequency": <BehavioralQuestionFrequencyChart />,
  "star-scoring-radar": <STARScoringRadarChart />,

  // Blog: checklist / demand
  "checklist-completion": <ChecklistCompletionChart />,
  "role-demand-trend": <RoleDemandTrendChart />,

  // Blog: salary
  "salary-trends": <SalaryTrendChart />,
  "tech-vs-nontech-salary": <TechVsNonTechSalaryChart />,

  // Companies: big tech
  "big-tech-salary-ranges": <BigTechSalaryChart />,
  "big-tech-interview-rounds": <BigTechRoundsChart />,
  "big-tech-culture-radar": <BigTechCultureRadarChart />,

  // Companies: finance
  "finance-selectivity": <FinanceSelectivityChart />,
  "case-interview-types": <CaseInterviewTypesChart />,
  "ib-process-breakdown": <IBProcessBreakdownChart />,

  // Companies: growth tech
  "growth-tech-salary": <GrowthTechSalaryChart />,
  "growth-tech-culture-radar": <GrowthTechCultureRadarChart />,

  // Companies: roles
  "role-demand-trends": <RoleDemandTrendsChart />,
  "avg-interview-rounds": <AvgInterviewRoundsChart />,
};

export function getChart(chartId: string): ReactNode | null {
  return CHART_REGISTRY[chartId] ?? null;
}

export { CHART_REGISTRY };
