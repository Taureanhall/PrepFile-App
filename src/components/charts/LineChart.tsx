import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE, SERIES_PALETTE } from "../../data/charts/chart-theme";
import { ChartCard } from "./ChartCard";

interface LineChartProps {
  title: string;
  source?: string;
  data: Record<string, unknown>[];
  xKey: string;
  lines: { key: string; label: string; color?: string }[];
  height?: number;
  unit?: string;
}

export function LineChart({ title, source, data, xKey, lines, height = 300, unit }: LineChartProps) {
  return (
    <ChartCard title={title} source={source} height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey={xKey} {...AXIS_STYLE} />
          <YAxis {...AXIS_STYLE} unit={unit} />
          <Tooltip {...TOOLTIP_STYLE} />
          {lines.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {lines.map((line, i) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.label}
              stroke={line.color || SERIES_PALETTE[i % SERIES_PALETTE.length]}
              strokeWidth={2}
              dot={{ r: 3, fill: line.color || SERIES_PALETTE[i % SERIES_PALETTE.length] }}
              activeDot={{ r: 5 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
