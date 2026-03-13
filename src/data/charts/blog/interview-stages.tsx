import { DonutChart } from "../../../components/charts";
import { BarChart } from "../../../components/charts";
import { CHART_COLORS } from "../chart-theme";

const stageBreakdownData = [
  { name: "Phone Screen", value: 30 },
  { name: "Technical Round", value: 25 },
  { name: "Behavioral Round", value: 20 },
  { name: "System Design", value: 15 },
  { name: "Hiring Manager", value: 10 },
];

export function InterviewStageBreakdownChart() {
  return (
    <DonutChart
      title="Typical Interview Process: Round Distribution"
      source="Glassdoor public interview data 2024–25"
      data={stageBreakdownData}
    />
  );
}

const negotiationData = [
  { scenario: "No Negotiation", salary: 95000 },
  { scenario: "Counter Once", salary: 103000 },
  { scenario: "Data-Backed Ask", salary: 112000 },
  { scenario: "Competing Offer", salary: 121000 },
];

export function SalaryNegotiationImpactChart() {
  return (
    <BarChart
      title="Average Offer Outcome by Negotiation Strategy"
      source="BLS Occupational Employment Statistics; Glassdoor salary data"
      data={negotiationData}
      xKey="scenario"
      bars={[{ key: "salary", label: "Avg. Salary ($)", color: CHART_COLORS.brand[600] }]}
      unit=""
    />
  );
}
