import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TOOLTIP_STYLE, SERIES_PALETTE, CHART_COLORS } from "../../data/charts/chart-theme";
import { ChartCard } from "./ChartCard";

interface RadarChartProps {
  title: string;
  source?: string;
  data: Record<string, unknown>[];
  angleKey: string;
  radars: { key: string; label: string; color?: string }[];
  height?: number;
}

export function RadarChart({ title, source, data, angleKey, radars, height = 320 }: RadarChartProps) {
  return (
    <ChartCard title={title} source={source} height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke={CHART_COLORS.zinc[200]} />
          <PolarAngleAxis dataKey={angleKey} tick={{ fill: CHART_COLORS.zinc[600], fontSize: 11 }} />
          <PolarRadiusAxis tick={{ fill: CHART_COLORS.zinc[400], fontSize: 10 }} />
          <Tooltip {...TOOLTIP_STYLE} />
          {radars.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {radars.map((r, i) => (
            <Radar
              key={r.key}
              name={r.label}
              dataKey={r.key}
              stroke={r.color || SERIES_PALETTE[i % SERIES_PALETTE.length]}
              fill={r.color || SERIES_PALETTE[i % SERIES_PALETTE.length]}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
