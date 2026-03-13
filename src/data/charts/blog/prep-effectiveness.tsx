import { BarChart } from "../../../components/charts";
import { HorizontalBarChart } from "../../../components/charts";
import { CHART_COLORS } from "../chart-theme";

const prepTimeData = [
  { hours: "0–2 hrs", rate: 22 },
  { hours: "3–5 hrs", rate: 38 },
  { hours: "6–10 hrs", rate: 54 },
  { hours: "11–20 hrs", rate: 67 },
  { hours: "20+ hrs", rate: 72 },
];

export function PrepTimeVsSuccessChart() {
  return (
    <BarChart
      title="Interview Success Rate by Prep Time"
      source="NACE Recruiting Benchmarks 2025; Glassdoor interview data"
      data={prepTimeData}
      xKey="hours"
      bars={[{ key: "rate", label: "Success Rate (%)", color: CHART_COLORS.brand[600] }]}
      unit="%"
    />
  );
}

const skippedStepsData = [
  { step: "Company Research", pct: 61 },
  { step: "Mock Interviews", pct: 58 },
  { step: "Questions for Interviewer", pct: 52 },
  { step: "Salary Research", pct: 47 },
  { step: "Role-Specific Prep", pct: 39 },
  { step: "Review Job Description", pct: 18 },
];

export function SkippedPrepStepsChart() {
  return (
    <HorizontalBarChart
      title="Most Commonly Skipped Prep Steps"
      source="LinkedIn Global Talent Trends 2025; NACE survey data"
      data={skippedStepsData}
      yKey="step"
      valueKey="pct"
      color={CHART_COLORS.accent[400]}
      unit="%"
    />
  );
}
