import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TOOLTIP_STYLE, SERIES_PALETTE } from "../../data/charts/chart-theme";
import { ChartCard } from "./ChartCard";

interface DonutChartProps {
  title: string;
  source?: string;
  data: { name: string; value: number }[];
  height?: number;
  colors?: string[];
}

export function DonutChart({ title, source, data, height = 300, colors }: DonutChartProps) {
  const palette = colors || SERIES_PALETTE;
  return (
    <ChartCard title={title} source={source} height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="72%"
            dataKey="value"
            nameKey="name"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={palette[i % palette.length]} />
            ))}
          </Pie>
          <Tooltip {...TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
