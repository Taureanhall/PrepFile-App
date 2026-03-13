import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE, SERIES_PALETTE } from "../../data/charts/chart-theme";
import { ChartCard } from "./ChartCard";

interface BarChartProps {
  title: string;
  source?: string;
  data: Record<string, unknown>[];
  xKey: string;
  bars: { key: string; label: string; color?: string }[];
  height?: number;
  unit?: string;
}

export function BarChart({ title, source, data, xKey, bars, height = 300, unit }: BarChartProps) {
  return (
    <ChartCard title={title} source={source} height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid vertical={false} {...GRID_STYLE} />
          <XAxis dataKey={xKey} {...AXIS_STYLE} />
          <YAxis {...AXIS_STYLE} unit={unit} />
          <Tooltip {...TOOLTIP_STYLE} />
          {bars.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {bars.map((bar, i) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.label}
              fill={bar.color || SERIES_PALETTE[i % SERIES_PALETTE.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
