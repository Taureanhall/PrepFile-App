import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
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
        <PrepBrief data={selectedBrief} user={null} />
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
        <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm divide-y divide-zinc-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-40 bg-zinc-100 rounded animate-pulse" />
                <div className="h-3 w-28 bg-zinc-100 rounded animate-pulse" />
              </div>
              <div className="h-3 w-16 bg-zinc-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : briefs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-zinc-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-1">No briefs yet</h3>
          <p className="text-sm text-zinc-500 mb-6 max-w-xs mx-auto">
            Generate your first interview prep brief and it will be saved here for easy access.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors"
          >
            Generate Your First Brief
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
