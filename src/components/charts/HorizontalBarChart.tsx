import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE, SERIES_PALETTE } from "../../data/charts/chart-theme";
import { ChartCard } from "./ChartCard";

interface HorizontalBarChartProps {
  title: string;
  source?: string;
  data: Record<string, unknown>[];
  yKey: string;
  valueKey: string;
  color?: string;
  height?: number;
  unit?: string;
}

export function HorizontalBarChart({
  title,
  source,
  data,
  yKey,
  valueKey,
  color,
  height,
  unit,
}: HorizontalBarChartProps) {
  const h = height ?? Math.max(200, data.length * 40 + 40);
  return (
    <ChartCard title={title} source={source} height={h}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
          <CartesianGrid horizontal={false} {...GRID_STYLE} />
          <XAxis type="number" {...AXIS_STYLE} unit={unit} />
          <YAxis type="category" dataKey={yKey} {...AXIS_STYLE} width={120} />
          <Tooltip {...TOOLTIP_STYLE} />
          <Bar
            dataKey={valueKey}
            fill={color || SERIES_PALETTE[0]}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
