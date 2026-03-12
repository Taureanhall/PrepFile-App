import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface GeneratingStateProps {
  companyName: string;
}

const PHASES = [
  { message: "Researching", duration: 10000 },
  { message: "Analyzing role requirements", duration: 10000 },
  { message: "Building interview themes", duration: 15000 },
  { message: "Generating your prep brief", duration: 0 },
];

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
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-zinc-200/60 text-center space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-zinc-900">{companyName}</h2>
        <p className="text-zinc-400 text-sm">Building your interview prep brief</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm mx-auto">
        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Phase message */}
      <motion.p
        key={phaseIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-base font-medium text-zinc-700"
      >
        {phase.message}
        {phaseIndex === 0 ? ` ${companyName}` : ""}...
      </motion.p>

      <p className="text-xs text-zinc-400">This usually takes 30–60 seconds</p>
    </div>
  );
}
