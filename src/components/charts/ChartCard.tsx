import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  source?: string;
  children: ReactNode;
  height?: number;
}

export function ChartCard({ title, source, children, height = 300 }: ChartCardProps) {
  return (
    <div className="my-8 bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <div className="px-5 pt-4 pb-2">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      </div>
      <div className="px-2 pb-2" style={{ height }}>
        {children}
      </div>
      {source && (
        <div className="px-5 pb-3">
          <p className="text-[11px] text-zinc-400">Source: {source}</p>
        </div>
      )}
    </div>
  );
}
