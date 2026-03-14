import { useState, useEffect } from "react";

interface GeneratingStateProps {
  companyName: string;
}

const PHASES = [
  { message: "Researching", duration: 10000 },
  { message: "Analyzing role requirements", duration: 10000 },
  { message: "Building interview themes", duration: 15000 },
  { message: "Generating your prep brief", duration: 0 },
];

function SkeletonLine({ width = "w-full", height = "h-4" }: { width?: string; height?: string }) {
  return (
    <div
      className={`${width} ${height} rounded bg-zinc-200 animate-pulse`}
    />
  );
}

function SkeletonSection({ title, lines = 3 }: { title: string; lines?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-zinc-200 animate-pulse flex-shrink-0" />
        <span className="text-sm font-semibold text-zinc-300">{title}</span>
      </div>
      <div className="pl-7 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i}>
            <SkeletonLine
              width={i === lines - 1 ? "w-3/4" : "w-full"}
              height="h-3"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GeneratingState({ companyName }: GeneratingStateProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phaseIndex >= PHASES.length - 1) return;
    const timeout = setTimeout(() => {
      setPhaseIndex((prev) => Math.min(prev + 1, PHASES.length - 1));
    }, PHASES[phaseIndex].duration);
    return () => clearTimeout(timeout);
  }, [phaseIndex]);

  const phase = PHASES[phaseIndex];
  const progressPercent = Math.min((elapsed / 55000) * 100, 95);

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">{companyName}</h2>
            <p className="text-sm text-zinc-400 mt-0.5">
              {phase.message}{phaseIndex === 0 ? ` ${companyName}` : ""}...
            </p>
          </div>
          <svg
            className="animate-spin h-5 w-5 text-brand-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-zinc-400">This usually takes 30–60 seconds</p>
      </div>

      {/* Shimmer skeleton — preview of brief sections */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/60 overflow-hidden">
        {/* Skeleton header */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
          <SkeletonLine width="w-48" height="h-5" />
          <div className="mt-2">
            <SkeletonLine width="w-24" height="h-3" />
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Company Snapshot */}
          <div className="space-y-4">
            <SkeletonLine width="w-40" height="h-4" />
            <div className="space-y-2">
              <SkeletonLine width="w-full" height="h-3" />
              <SkeletonLine width="w-full" height="h-3" />
              <SkeletonLine width="w-4/5" height="h-3" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 rounded-lg bg-zinc-100 animate-pulse" />
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-100" />

          {/* Role Intelligence */}
          <div className="space-y-3">
            <SkeletonLine width="w-44" height="h-4" />
            <SkeletonLine width="w-full" height="h-3" />
            <SkeletonLine width="w-full" height="h-3" />
            <SkeletonLine width="w-3/5" height="h-3" />
            <div className="space-y-2 pt-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-4 h-4 mt-0.5 rounded-full bg-zinc-200 animate-pulse flex-shrink-0" />
                  <SkeletonLine width={i === 3 ? "w-2/3" : "w-full"} height="h-3" />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-100" />

          {/* Round Expectations */}
          <div className="space-y-3">
            <SkeletonLine width="w-48" height="h-4" />
            <SkeletonLine width="w-full" height="h-3" />
            <SkeletonLine width="w-4/5" height="h-3" />
            <div className="space-y-2 pt-1">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-4 h-4 mt-0.5 rounded-full bg-zinc-200 animate-pulse flex-shrink-0" />
                  <SkeletonLine width={i === 2 ? "w-3/4" : "w-full"} height="h-3" />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-100" />

          {/* Questions to Ask */}
          <SkeletonSection title="Questions to Ask" lines={4} />

          <div className="border-t border-zinc-100" />

          {/* Blind Spots */}
          <SkeletonSection title="Blind Spots" lines={3} />
        </div>
      </div>
    </div>
  );
}
