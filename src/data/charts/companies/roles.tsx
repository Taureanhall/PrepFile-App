import { LineChart, HorizontalBarChart } from "../../../components/charts";
import { CHART_COLORS } from "../chart-theme";

const roleDemandData = [
  { year: "2021", swe: 100, pm: 100, ds: 100, ux: 100, de: 100 },
  { year: "2022", swe: 115, pm: 112, ds: 120, ux: 108, de: 125 },
  { year: "2023", swe: 108, pm: 118, ds: 132, ux: 105, de: 140 },
  { year: "2024", swe: 114, pm: 124, ds: 145, ux: 110, de: 155 },
  { year: "2025", swe: 120, pm: 130, ds: 158, ux: 115, de: 168 },
];

export function RoleDemandTrendsChart() {
  return (
    <LineChart
      title="Job Demand Index by Role (2021 = 100)"
      source="BLS Occupational Outlook Handbook; LinkedIn Economic Graph 2025"
      data={roleDemandData}
      xKey="year"
      lines={[
        { key: "swe", label: "Software Engineer" },
        { key: "pm", label: "Product Manager" },
        { key: "ds", label: "Data Scientist" },
        { key: "ux", label: "UX Designer" },
        { key: "de", label: "Data Engineer" },
      ]}
    />
  );
}

const avgRoundsData = [
  { role: "Software Engineer", rounds: 5.2 },
  { role: "Product Manager", rounds: 4.8 },
  { role: "Data Scientist", rounds: 4.5 },
  { role: "UX Designer", rounds: 4.0 },
  { role: "Data Engineer", rounds: 4.6 },
  { role: "Business Analyst", rounds: 3.8 },
  { role: "DevOps/SRE", rounds: 4.2 },
  { role: "Mgmt Consultant", rounds: 4.5 },
  { role: "IB Analyst", rounds: 5.5 },
];

export function AvgInterviewRoundsChart() {
  return (
    <HorizontalBarChart
      title="Average Number of Interview Rounds by Role"
      source="Glassdoor interview data 2024–25"
      data={avgRoundsData}
      yKey="role"
      valueKey="rounds"
      color={CHART_COLORS.brand[500]}
      height={380}
    />
  );
}
