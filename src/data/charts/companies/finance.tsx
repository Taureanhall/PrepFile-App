import { BarChart, HorizontalBarChart, DonutChart } from "../../../components/charts";
import { CHART_COLORS } from "../chart-theme";

const selectivityData = [
  { firm: "Goldman Sachs", rate: 3 },
  { firm: "JPMorgan IB", rate: 5 },
  { firm: "McKinsey", rate: 1 },
  { firm: "BCG", rate: 2 },
  { firm: "Deloitte Consulting", rate: 8 },
];

export function FinanceSelectivityChart() {
  return (
    <BarChart
      title="Offer Rate by Firm (% of Applicants)"
      source="NACE Recruiting Benchmarks; Glassdoor interview data"
      data={selectivityData}
      xKey="firm"
      bars={[{ key: "rate", label: "Offer Rate (%)", color: CHART_COLORS.brand[600] }]}
      unit="%"
    />
  );
}

const caseTypeData = [
  { type: "Profitability", pct: 32 },
  { type: "Market Entry", pct: 24 },
  { type: "M&A / Due Diligence", pct: 18 },
  { type: "Pricing", pct: 14 },
  { type: "Operations", pct: 12 },
];

export function CaseInterviewTypesChart() {
  return (
    <HorizontalBarChart
      title="Most Common Case Interview Types (Consulting)"
      source="NACE; PrepFile internal data"
      data={caseTypeData}
      yKey="type"
      valueKey="pct"
      color={CHART_COLORS.accent[400]}
      unit="%"
    />
  );
}

const ibProcessData = [
  { name: "HireVue / Video", value: 25 },
  { name: "Phone Screen", value: 15 },
  { name: "Super Day", value: 40 },
  { name: "Final / MD Round", value: 20 },
];

export function IBProcessBreakdownChart() {
  return (
    <DonutChart
      title="Investment Banking Interview Process (Time Weight)"
      source="Glassdoor IB interview data 2024–25"
      data={ibProcessData}
    />
  );
}
