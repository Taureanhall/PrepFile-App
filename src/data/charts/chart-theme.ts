/**
 * Chart color palette derived from the PrepFile brand + zinc + accent tokens.
 * Used by all Recharts components for consistent styling.
 */

export const CHART_COLORS = {
  brand: {
    600: "#2C4A5A",
    500: "#3a5d6f",
    400: "#4e7085",
    300: "#7a9aab",
    200: "#b0c4cf",
  },
  accent: {
    400: "#B8943E",
    500: "#9e7e34",
    300: "#cfb374",
    200: "#e0cda0",
  },
  zinc: {
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
  },
} as const;

/** Ordered palette for multi-series charts */
export const SERIES_PALETTE = [
  CHART_COLORS.brand[600],
  CHART_COLORS.accent[400],
  CHART_COLORS.brand[300],
  CHART_COLORS.accent[200],
  CHART_COLORS.brand[200],
  CHART_COLORS.zinc[400],
] as const;

/** Shared axis/grid styling props */
export const AXIS_STYLE = {
  tick: { fill: CHART_COLORS.zinc[500], fontSize: 12 },
  axisLine: { stroke: CHART_COLORS.zinc[200] },
  tickLine: false as const,
};

export const GRID_STYLE = {
  strokeDasharray: "3 3",
  stroke: CHART_COLORS.zinc[200],
};

export const TOOLTIP_STYLE = {
  contentStyle: {
    background: CHART_COLORS.zinc[900],
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 13,
    padding: "8px 12px",
  },
  itemStyle: { color: "#fff" },
  cursor: { fill: "rgba(0,0,0,0.04)" },
};
