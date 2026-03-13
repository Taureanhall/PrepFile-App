import { BarChart, RadarChart, DonutChart } from "../../../components/charts";
import { CHART_COLORS } from "../chart-theme";

const salaryData = [
  { company: "Google", base: 185, total: 310 },
  { company: "Meta", base: 180, total: 325 },
  { company: "Apple", base: 175, total: 290 },
  { company: "Amazon", base: 170, total: 265 },
  { company: "Microsoft", base: 172, total: 275 },
  { company: "Netflix", base: 270, total: 310 },
];

export function BigTechSalaryChart() {
  return (
    <BarChart
      title="Big Tech Compensation: Base vs. Total ($K, L5/Senior)"
      source="Glassdoor salary data 2025; BLS OES"
      data={salaryData}
      xKey="company"
      bars={[
        { key: "base", label: "Base Salary" },
        { key: "total", label: "Total Comp" },
      ]}
      unit="K"
    />
  );
}

const interviewRoundsData = [
  { name: "Phone Screen", value: 20 },
  { name: "Coding (2–3)", value: 35 },
  { name: "System Design", value: 20 },
  { name: "Behavioral", value: 15 },
  { name: "Hiring Committee", value: 10 },
];

export function BigTechRoundsChart() {
  return (
    <DonutChart
      title="Typical Big Tech Interview Round Distribution"
      source="Glassdoor interview data 2024–25"
      data={interviewRoundsData}
    />
  );
}

const cultureRadarData = [
  { trait: "Autonomy", google: 8, amazon: 6, meta: 9, netflix: 10, apple: 5 },
  { trait: "Work-Life Balance", google: 8, amazon: 5, meta: 7, netflix: 6, apple: 7 },
  { trait: "Innovation", google: 9, amazon: 8, meta: 8, netflix: 7, apple: 9 },
  { trait: "Comp & Benefits", google: 9, amazon: 7, meta: 10, netflix: 9, apple: 8 },
  { trait: "Career Growth", google: 8, amazon: 8, meta: 7, netflix: 6, apple: 7 },
  { trait: "Process/Structure", google: 7, amazon: 9, meta: 5, netflix: 3, apple: 8 },
];

export function BigTechCultureRadarChart() {
  return (
    <RadarChart
      title="Big Tech Culture Comparison (1–10 Scale)"
      source="Glassdoor company reviews; LinkedIn employer insights"
      data={cultureRadarData}
      angleKey="trait"
      radars={[
        { key: "google", label: "Google", color: CHART_COLORS.brand[600] },
        { key: "meta", label: "Meta", color: CHART_COLORS.accent[400] },
        { key: "amazon", label: "Amazon", color: CHART_COLORS.brand[300] },
      ]}
    />
  );
}
