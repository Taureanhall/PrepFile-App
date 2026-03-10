import React, { useState, useEffect } from "react";
import { PrepBrief } from "./PrepBrief";
import type { PrepBriefData } from "../types";

interface BriefSummary {
  id: string;
  company_name: string;
  job_title: string;
  created_at: string;
}

interface MyBriefsProps {
  onBack: () => void;
}

export function MyBriefs({ onBack }: MyBriefsProps) {
  const [briefs, setBriefs] = useState<BriefSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrief, setSelectedBrief] = useState<PrepBriefData | null>(null);
  const [selectedMeta, setSelectedMeta] = useState<BriefSummary | null>(null);
  const [loadingBrief, setLoadingBrief] = useState(false);

  useEffect(() => {
    fetch("/api/briefs")
      .then((r) => r.json())
      .then((d) => setBriefs(d.briefs || []))
      .catch(() => setBriefs([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectBrief = async (summary: BriefSummary) => {
    setLoadingBrief(true);
    try {
      const res = await fetch(`/api/briefs/${summary.id}`);
      const data = await res.json();
      setSelectedBrief(data.brief_data);
      setSelectedMeta(summary);
    } catch {
      alert("Failed to load brief.");
    } finally {
      setLoadingBrief(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (selectedBrief && selectedMeta) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSelectedBrief(null); setSelectedMeta(null); }}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            My Briefs
          </button>
          <span className="text-zinc-300">/</span>
          <span className="text-sm text-zinc-700">{selectedMeta.company_name} — {selectedMeta.job_title}</span>
        </div>
        <PrepBrief data={selectedBrief} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>
        <h2 className="text-xl font-semibold text-zinc-900">My Briefs</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-6 w-6 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : briefs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-12 text-center">
          <p className="text-zinc-500">No saved briefs yet.</p>
          <p className="text-sm text-zinc-400 mt-1">Generate a brief and it will appear here.</p>
          <button
            onClick={onBack}
            className="mt-6 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Generate a Brief
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm divide-y divide-zinc-100">
          {briefs.map((brief) => (
            <button
              key={brief.id}
              onClick={() => handleSelectBrief(brief)}
              disabled={loadingBrief}
              className="w-full text-left px-6 py-4 hover:bg-zinc-50 transition-colors flex items-center justify-between group disabled:opacity-50"
            >
              <div>
                <p className="font-medium text-zinc-900 group-hover:text-zinc-700">{brief.company_name}</p>
                <p className="text-sm text-zinc-500">{brief.job_title}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400">{formatDate(brief.created_at)}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 group-hover:text-zinc-500 transition-colors"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
