import { LineChart } from "../../../components/charts";
import { BarChart } from "../../../components/charts";

const salaryTrendData = [
  { year: "2020", swe: 115, pm: 120, ds: 110, tic: 95 },
  { year: "2021", swe: 125, pm: 130, ds: 118, tic: 100 },
  { year: "2022", swe: 145, pm: 148, ds: 135, tic: 110 },
  { year: "2023", swe: 155, pm: 158, ds: 148, tic: 118 },
  { year: "2024", swe: 162, pm: 165, ds: 158, tic: 124 },
  { year: "2025", swe: 168, pm: 170, ds: 165, tic: 130 },
];

export function SalaryTrendChart() {
  return (
    <LineChart
      title="Median Total Compensation Trends ($K)"
      source="BLS Occupational Employment Statistics 2020–25; Glassdoor salary data"
      data={salaryTrendData}
      xKey="year"
      lines={[
        { key: "swe", label: "Software Engineer" },
        { key: "pm", label: "Product Manager" },
        { key: "ds", label: "Data Scientist" },
        { key: "tic", label: "Tech IC (Avg)" },
      ]}
      unit="K"
    />
  );
}

const techVsNonTechData = [
  { role: "SWE", tech: 168, nonTech: 125 },
  { role: "PM", tech: 170, nonTech: 130 },
  { role: "Data Scientist", tech: 165, nonTech: 120 },
  { role: "UX Designer", tech: 135, nonTech: 100 },
];

export function TechVsNonTechSalaryChart() {
  return (
    <BarChart
      title="Tech vs. Non-Tech Company Compensation ($K)"
      source="BLS OES; Glassdoor salary data 2025"
      data={techVsNonTechData}
      xKey="role"
      bars={[
        { key: "tech", label: "Big Tech" },
        { key: "nonTech", label: "Non-Tech" },
      ]}
      unit="K"
    />
  );
}
