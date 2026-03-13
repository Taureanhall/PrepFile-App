import { BarChart } from "../../../components/charts";
import { DonutChart } from "../../../components/charts";

const methodData = [
  { method: "Mock Interviews", effectiveness: 78 },
  { method: "Company-Specific Briefs", effectiveness: 72 },
  { method: "Behavioral Prep (STAR)", effectiveness: 65 },
  { method: "LeetCode Grinding", effectiveness: 51 },
  { method: "Glassdoor Reviews", effectiveness: 34 },
  { method: "Generic Question Lists", effectiveness: 28 },
];

export function MethodEffectivenessChart() {
  return (
    <BarChart
      title="Prep Method Effectiveness (Candidate-Reported)"
      source="Glassdoor interview data 2024–25; LinkedIn Talent Trends"
      data={methodData}
      xKey="method"
      bars={[{ key: "effectiveness", label: "Effectiveness Score" }]}
    />
  );
}

const hiringPriorityData = [
  { name: "Problem Solving", value: 28 },
  { name: "Communication", value: 22 },
  { name: "Technical Skills", value: 20 },
  { name: "Culture Fit", value: 17 },
  { name: "Experience", value: 13 },
];

export function HiringManagerPrioritiesChart() {
  return (
    <DonutChart
      title="What Hiring Managers Evaluate First"
      source="NACE Job Outlook 2025; LinkedIn Hiring Survey"
      data={hiringPriorityData}
    />
  );
}
