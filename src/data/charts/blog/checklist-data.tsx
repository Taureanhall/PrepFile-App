import { HorizontalBarChart } from "../../../components/charts";
import { LineChart } from "../../../components/charts";
import { CHART_COLORS } from "../chart-theme";

const checklistCompletionData = [
  { item: "Company research", completion: 82 },
  { item: "Role requirements review", completion: 75 },
  { item: "Mock interview practice", completion: 42 },
  { item: "Prepare questions to ask", completion: 48 },
  { item: "Salary benchmarking", completion: 35 },
  { item: "Follow-up email drafted", completion: 28 },
];

export function ChecklistCompletionChart() {
  return (
    <HorizontalBarChart
      title="Prep Checklist Completion Rates Among Candidates"
      source="NACE Recruiting Benchmarks 2025; LinkedIn survey data"
      data={checklistCompletionData}
      yKey="item"
      valueKey="completion"
      color={CHART_COLORS.brand[400]}
      unit="%"
    />
  );
}

const demandTrendData = [
  { year: "2020", swe: 100, pm: 85, ds: 72, tic: 60 },
  { year: "2021", swe: 118, pm: 97, ds: 88, tic: 68 },
  { year: "2022", swe: 135, pm: 112, ds: 105, tic: 74 },
  { year: "2023", swe: 120, pm: 119, ds: 118, tic: 82 },
  { year: "2024", swe: 128, pm: 126, ds: 131, tic: 91 },
  { year: "2025", swe: 134, pm: 132, ds: 145, tic: 98 },
];

export function RoleDemandTrendChart() {
  return (
    <LineChart
      title="Job Posting Index by Role (2020 = 100)"
      source="BLS Occupational Outlook Handbook; LinkedIn Economic Graph"
      data={demandTrendData}
      xKey="year"
      lines={[
        { key: "swe", label: "Software Engineer" },
        { key: "pm", label: "Product Manager" },
        { key: "ds", label: "Data Scientist" },
        { key: "tic", label: "Tech IC (Avg)" },
      ]}
    />
  );
}
