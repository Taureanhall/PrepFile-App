import { HorizontalBarChart } from "../../../components/charts";
import { RadarChart } from "../../../components/charts";
import { CHART_COLORS } from "../chart-theme";

const questionFrequencyData = [
  { category: "Tell Me About Yourself", pct: 89 },
  { category: "Conflict Resolution", pct: 76 },
  { category: "Leadership Example", pct: 71 },
  { category: "Biggest Failure", pct: 64 },
  { category: "Why This Company?", pct: 62 },
  { category: "Strengths/Weaknesses", pct: 58 },
  { category: "Teamwork Scenario", pct: 55 },
  { category: "Problem You Solved", pct: 48 },
];

export function BehavioralQuestionFrequencyChart() {
  return (
    <HorizontalBarChart
      title="Most Common Behavioral Interview Questions"
      source="Glassdoor interview reviews 2023–25; NACE survey data"
      data={questionFrequencyData}
      yKey="category"
      valueKey="pct"
      color={CHART_COLORS.brand[500]}
      unit="%"
      height={340}
    />
  );
}

const starScoringData = [
  { dimension: "Situation Clarity", strong: 9, weak: 4 },
  { dimension: "Task Specificity", strong: 8, weak: 3 },
  { dimension: "Action Detail", strong: 9, weak: 5 },
  { dimension: "Result Impact", strong: 9, weak: 3 },
  { dimension: "Self-Awareness", strong: 8, weak: 4 },
  { dimension: "Relevance", strong: 9, weak: 5 },
];

export function STARScoringRadarChart() {
  return (
    <RadarChart
      title="STAR Response Quality: Strong vs. Weak Answers"
      source="NACE interview evaluator rubrics; PrepFile internal analysis"
      data={starScoringData}
      angleKey="dimension"
      radars={[
        { key: "strong", label: "Strong Answer", color: CHART_COLORS.brand[600] },
        { key: "weak", label: "Weak Answer", color: CHART_COLORS.accent[400] },
      ]}
    />
  );
}
