import { BarChart, RadarChart } from "../../../components/charts";
import { CHART_COLORS } from "../chart-theme";

const growthTechSalaryData = [
  { company: "Stripe", base: 185, total: 305 },
  { company: "Airbnb", base: 178, total: 295 },
  { company: "Uber", base: 175, total: 285 },
  { company: "Spotify", base: 165, total: 250 },
  { company: "LinkedIn", base: 172, total: 270 },
];

export function GrowthTechSalaryChart() {
  return (
    <BarChart
      title="Growth Tech Compensation: Base vs. Total ($K, Senior IC)"
      source="Glassdoor salary data 2025; BLS OES"
      data={growthTechSalaryData}
      xKey="company"
      bars={[
        { key: "base", label: "Base Salary" },
        { key: "total", label: "Total Comp" },
      ]}
      unit="K"
    />
  );
}

const growthCultureData = [
  { trait: "Autonomy", stripe: 9, airbnb: 8, uber: 7, spotify: 9 },
  { trait: "Work-Life Balance", stripe: 7, airbnb: 8, uber: 6, spotify: 9 },
  { trait: "Innovation", stripe: 9, airbnb: 8, uber: 8, spotify: 8 },
  { trait: "Comp & Benefits", stripe: 9, airbnb: 8, uber: 8, spotify: 7 },
  { trait: "Career Growth", stripe: 7, airbnb: 7, uber: 8, spotify: 7 },
  { trait: "Process/Structure", stripe: 7, airbnb: 6, uber: 7, spotify: 5 },
];

export function GrowthTechCultureRadarChart() {
  return (
    <RadarChart
      title="Growth Tech Culture Comparison (1–10 Scale)"
      source="Glassdoor company reviews; LinkedIn employer insights"
      data={growthCultureData}
      angleKey="trait"
      radars={[
        { key: "stripe", label: "Stripe", color: CHART_COLORS.brand[600] },
        { key: "airbnb", label: "Airbnb", color: CHART_COLORS.accent[400] },
        { key: "uber", label: "Uber", color: CHART_COLORS.brand[300] },
        { key: "spotify", label: "Spotify", color: CHART_COLORS.accent[200] },
      ]}
    />
  );
}
