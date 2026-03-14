import { useState, useRef, type ReactNode, type FormEvent, type ChangeEvent } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  ResponsiveContainer, Tooltip,
} from "recharts";
import type { PrepBriefData, BridgingAnalysis, BrandAssets } from "../types";

interface AgencyBranding {
  agencyName: string;
  agencyLogoUrl?: string;
}

interface PrepBriefProps {
  data: PrepBriefData;
  user: { id: string; email: string } | null;
  userPlan?: "free" | "pro" | "pack";
  briefId?: string | null;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onUpgradeClick?: () => void;
  totalBriefs?: number | null;
  agencyBranding?: AgencyBranding;
}

function LockIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function LockedSection({ label, onUpgrade, children }: { label: string; onUpgrade?: () => void; children: ReactNode }) {
  return (
    <div className="mt-3">
      <div className="select-none pointer-events-none" aria-hidden="true">
        {children}
      </div>
      <div className="mt-2 pt-2 border-t border-zinc-100">
        <button
          onClick={onUpgrade}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-brand-600 transition-colors pointer-events-auto"
        >
          <LockIcon className="w-3 h-3" />
          {label}
        </button>
      </div>
    </div>
  );
}

const BRAND_600 = "#2C4A5A";
const ACCENT_500 = "#D97706";

function CompetitiveRadar({ data: chartData, brandColor }: { data: { dimension: string; score: number }[]; brandColor?: string }) {
  const radarColor = brandColor || BRAND_600;
  return (
    <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4 print:hidden">
      <h4 className="font-semibold text-zinc-900 mb-3 text-sm">Competitive Positioning</h4>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e4e4e7" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: "#52525b", fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} axisLine={false} />
          <Radar dataKey="score" stroke={radarColor} fill={radarColor} fillOpacity={0.2} strokeWidth={2} />
          <Tooltip formatter={(v: number) => [`${v}/10`, "Score"]} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function GapRadar({ data: chartData }: { data: { dimension: string; roleRequirement: number; candidateTypical: number }[] }) {
  return (
    <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4 print:hidden">
      <h4 className="font-semibold text-zinc-900 mb-3 text-sm">Skills Gap Analysis</h4>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e4e4e7" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: "#52525b", fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} axisLine={false} />
          <Radar dataKey="roleRequirement" name="Role Requires" stroke={BRAND_600} fill={BRAND_600} fillOpacity={0.15} strokeWidth={2} />
          <Radar dataKey="candidateTypical" name="Typical Candidate" stroke={ACCENT_500} fill={ACCENT_500} fillOpacity={0.15} strokeWidth={2} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number, name: string) => [`${v}/10`, name]} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function InterviewTimeline({ stages }: { stages: { stage: string; durationMinutes: number; focus: string; order: number }[] }) {
  const sorted = [...stages].sort((a, b) => a.order - b.order);
  return (
    <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4 print:hidden">
      <h4 className="font-semibold text-zinc-900 mb-4 text-sm">Interview Process</h4>
      <div className="flex flex-col sm:flex-row items-stretch gap-0">
        {sorted.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col sm:flex-row items-center">
            <div className="flex flex-col items-center text-center flex-1 px-2">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center mb-2 shrink-0">
                {s.order}
              </div>
              <p className="text-sm font-semibold text-zinc-900 leading-tight">{s.stage}</p>
              <p className="text-xs text-zinc-500 mt-0.5">~{s.durationMinutes} min</p>
              <p className="text-xs text-zinc-400 mt-1 leading-snug max-w-[160px]">{s.focus}</p>
            </div>
            {i < sorted.length - 1 && (
              <div className="hidden sm:flex items-center px-1 self-start mt-5">
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                  <path d="M0 6h16M14 1l5 5-5 5" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            {i < sorted.length - 1 && (
              <div className="sm:hidden flex justify-center py-1">
                <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                  <path d="M6 0v16M1 14l5 5 5-5" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PrepBrief({ data, user, userPlan, briefId, onRegenerate, isRegenerating, onUpgradeClick, totalBriefs, agencyBranding }: PrepBriefProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Share state
  const [isPublic, setIsPublic] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "loading" | "copied">("idle");

  // Resume enhancement state
  const [bridging, setBridging] = useState<BridgingAnalysis | null>(null);
  const [enhanceStatus, setEnhanceStatus] = useState<"idle" | "loading" | "error">("idle");
  const [enhanceError, setEnhanceError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!data) return null;

  // Use bridging overrides when available
  const blindSpots = bridging ? bridging.blindSpots : data.blindSpots;
  const howToShowUpStrong = bridging ? bridging.howToShowUpStrong : data.roundExpectations?.howToShowUpStrong;

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch('/api/send-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, data }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Failed to save:", error);
      setStatus("error");
    }
  };

  const handleEnhanceClick = () => {
    if (!user) {
      setEnhanceError("Please sign in to enhance your brief with your resume.");
      return;
    }
    setEnhanceError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected after error
    e.target.value = "";

    // Client-side validation
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const allowedExts = [".pdf", ".docx"];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!allowedTypes.includes(file.type) || !allowedExts.includes(ext)) {
      setEnhanceError("Only PDF and DOCX files are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setEnhanceError("File must be 5MB or smaller.");
      return;
    }

    setEnhanceStatus("loading");
    setEnhanceError(null);

    try {
      const form = new FormData();
      form.append("briefData", JSON.stringify(data));
      form.append("resume", file);

      const res = await fetch("/api/enhance-brief", { method: "POST", body: form });

      if (res.status === 401) {
        setEnhanceStatus("error");
        setEnhanceError("Please sign in to enhance your brief.");
        return;
      }
      if (res.status === 403) {
        setEnhanceStatus("idle");
        onUpgradeClick?.();
        return;
      }
      if (res.status === 413) {
        setEnhanceStatus("error");
        setEnhanceError("File too large. Maximum size is 5MB.");
        return;
      }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to enhance brief");
      }

      const result: BridgingAnalysis = await res.json();
      setBridging(result);
      setEnhanceStatus("idle");
    } catch (err: any) {
      setEnhanceStatus("error");
      setEnhanceError(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleShare = async () => {
    if (!briefId || !user) return;
    setShareStatus("loading");
    const nextPublic = !isPublic;
    try {
      const res = await fetch(`/api/briefs/${briefId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: nextPublic }),
      });
      if (!res.ok) throw new Error("Failed to update share settings");
      setIsPublic(nextPublic);
      if (nextPublic) {
        const url = `${window.location.origin}/b/${briefId}`;
        await navigator.clipboard.writeText(url);
        setShareStatus("copied");
        setTimeout(() => setShareStatus("idle"), 2500);
      } else {
        setShareStatus("idle");
      }
    } catch {
      setShareStatus("idle");
    }
  };

  return (
    <div className="bg-white p-5 md:p-8 lg:p-12 rounded-2xl shadow-sm border border-zinc-200/60 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">

      {/* Agency branding header — shown when team has branding enabled */}
      {agencyBranding && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            {agencyBranding.agencyLogoUrl && (
              <img
                src={agencyBranding.agencyLogoUrl}
                alt={`${agencyBranding.agencyName} logo`}
                className="h-8 w-auto object-contain"
              />
            )}
            <span className="font-semibold text-zinc-800 text-sm">{agencyBranding.agencyName}</span>
          </div>
          <span className="text-xs text-zinc-400">Powered by PrepFile</span>
        </div>
      )}

      {/* Company brand header — logo + accent bar from OpenBrand extraction */}
      {data.brandAssets && (data.brandAssets.logoUrl || data.brandAssets.primaryColor) && (
        <div
          className="flex items-center gap-4 mb-6 pb-4 border-b"
          style={{ borderColor: data.brandAssets.primaryColor ? `${data.brandAssets.primaryColor}30` : undefined }}
        >
          {data.brandAssets.logoUrl && (
            <img
              src={data.brandAssets.logoUrl}
              alt="Company logo"
              className="h-10 w-auto object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          {data.brandAssets.primaryColor && (
            <div className="flex gap-1.5 ml-auto">
              {[data.brandAssets.primaryColor, data.brandAssets.secondaryColor, data.brandAssets.accentColor]
                .filter(Boolean)
                .map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full border border-zinc-200"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
            </div>
          )}
        </div>
      )}

      {/* Brief header — share button */}
      {user && briefId && (
        <div className="flex justify-end mb-4 print:hidden">
          <button
            onClick={handleShare}
            disabled={shareStatus === "loading"}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isPublic
                ? "border-brand-600 bg-brand-600 text-white hover:bg-brand-700"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300"
            }`}
          >
            {shareStatus === "loading" ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : shareStatus === "copied" ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                Link copied!
              </>
            ) : isPublic ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                Shared — make private
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share this brief
              </>
            )}
          </button>
          {isPublic && (
            <p className="text-xs text-zinc-400 mt-1 text-right hidden">
              {window.location.origin}/b/{briefId}
            </p>
          )}
        </div>
      )}

      {/* Social proof counter */}
      {totalBriefs && totalBriefs > 0 && (
        <div className="flex justify-center mb-4 print:hidden">
          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {totalBriefs.toLocaleString()} prep briefs generated
          </span>
        </div>
      )}

      {/* Jump nav — only shows sections that are actually rendered */}
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-zinc-100 -mx-5 md:-mx-8 lg:-mx-12 px-5 md:px-8 lg:px-12 py-2.5 mb-8 print:hidden overflow-x-auto">
        <div className="flex gap-5 text-xs font-medium text-zinc-400 whitespace-nowrap">
          {(() => {
            const sections: { id: string; label: string }[] = [
              { id: "company-snapshot", label: "Company Snapshot" },
              { id: "role-intelligence", label: "Role Intelligence" },
              { id: "interview-themes", label: "Interview Themes" },
            ];
            if (data.processOperationalQuestions) sections.push({ id: "process-questions", label: "Process Questions" });
            if (data.behavioralQuestionBank && data.behavioralQuestionBank.length > 0) sections.push({ id: "behavioral-bank", label: "Behavioral Bank" });
            if (data.roundExpectations || userPlan === "free") sections.push({ id: "round-expectations", label: "Round Expectations" });
            sections.push({ id: "questions-to-ask", label: "Questions to Ask" });
            if (data.recommendedReading && data.recommendedReading.length > 0 || userPlan === "free") sections.push({ id: "recommended-reading", label: "Reading" });
            return sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="hover:text-zinc-800 transition-colors">{s.label}</a>
            ));
          })()}
        </div>
      </nav>

      {/* Gap Analysis Radar — pro only */}
      {data.gapAnalysis && data.gapAnalysis.length > 0 ? (
        <div className="mb-6">
          <GapRadar data={data.gapAnalysis} />
        </div>
      ) : userPlan === "free" ? (
        <div className="mb-6">
          <LockedSection label="Unlock gap analysis chart" onUpgrade={onUpgradeClick}>
            <div className="blur-[8px]">
              <GapRadar data={[
                { dimension: "Technical Depth", roleRequirement: 9, candidateTypical: 6 },
                { dimension: "Leadership", roleRequirement: 7, candidateTypical: 5 },
                { dimension: "Domain Knowledge", roleRequirement: 8, candidateTypical: 4 },
                { dimension: "Communication", roleRequirement: 7, candidateTypical: 7 },
                { dimension: "Strategic Thinking", roleRequirement: 8, candidateTypical: 6 },
              ]} />
            </div>
          </LockedSection>
        </div>
      ) : null}

      {/* Blind Spots Callout */}
      {blindSpots && blindSpots.length > 0 && (
        <div className="mb-10 p-5 bg-amber-50 border border-amber-200 rounded-xl">
          <h3 className="text-amber-800 font-semibold flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            Blind Spots{bridging ? " (Personalized)" : ""}
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-amber-900/80 text-sm">
            {blindSpots.map((spot, i) => (
              <li key={i}>{spot}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-12">

        {/* Section 1 — Company Snapshot */}
        <section id="company-snapshot">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
            Company Snapshot
          </h2>
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">{data.companySnapshot?.overview}</p>

            {data.companySnapshot?.keyMetrics && data.companySnapshot.keyMetrics.length > 0 && (
              <div className="flex flex-wrap gap-2 my-4">
                {data.companySnapshot.keyMetrics.map((metric, i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                    {metric}
                  </span>
                ))}
              </div>
            )}

            {/* Competitive Positioning Radar — pro only */}
            {data.companySnapshot?.competitivePositioning && data.companySnapshot.competitivePositioning.length > 0 ? (
              <CompetitiveRadar data={data.companySnapshot.competitivePositioning} brandColor={data.brandAssets?.primaryColor} />
            ) : userPlan === "free" ? (
              <LockedSection label="Unlock competitive positioning chart" onUpgrade={onUpgradeClick}>
                <div className="blur-[8px]">
                  <CompetitiveRadar data={[
                    { dimension: "Growth", score: 7 },
                    { dimension: "Culture", score: 8 },
                    { dimension: "Compensation", score: 6 },
                    { dimension: "Prestige", score: 9 },
                    { dimension: "Work-Life Balance", score: 5 },
                  ]} />
                </div>
              </LockedSection>
            ) : null}

            {/* Key Metrics — locked teaser for free users */}
            {(!data.companySnapshot?.keyMetrics || data.companySnapshot.keyMetrics.length === 0) && userPlan === "free" && (
              <div>
                <h4 className="font-semibold text-zinc-900 mb-2 text-sm">Key Metrics</h4>
                <LockedSection label="Unlock key metrics" onUpgrade={onUpgradeClick}>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-400 border border-zinc-200 blur-[6px]">$42M Series C raised</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-400 border border-zinc-200 blur-[6px]">340 employees globally</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-400 border border-zinc-200 blur-[6px]">2.1x YoY revenue growth</span>
                  </div>
                </LockedSection>
              </div>
            )}

            {data.companySnapshot?.recentSignals?.length > 0 && (
              <div>
                <h4 className="font-semibold text-zinc-900 mb-2 text-sm">Recent Signals</h4>
                <ul className="space-y-2">
                  {data.companySnapshot.recentSignals.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-700">
                      <span className="text-zinc-400 mt-1.5 text-xs">■</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.companySnapshot?.risksAndUnknowns?.length > 0 && (
              <div>
                <h4 className="font-semibold text-zinc-900 mb-2 text-sm">Risks & Unknowns</h4>
                <ul className="space-y-2">
                  {data.companySnapshot.risksAndUnknowns.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-700">
                      <span className="text-zinc-400 mt-1.5 text-xs">■</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risks & Unknowns — locked teaser for free users */}
            {(!data.companySnapshot?.risksAndUnknowns || data.companySnapshot.risksAndUnknowns.length === 0) && userPlan === "free" && (
              <div>
                <h4 className="font-semibold text-zinc-900 mb-2 text-sm">Risks & Unknowns</h4>
                <LockedSection label="Unlock risks & unknowns" onUpgrade={onUpgradeClick}>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3 text-zinc-400 blur-[6px]">
                      <span className="mt-1.5 text-xs">■</span>
                      <span className="leading-relaxed">Recent leadership turnover in engineering may signal organizational instability or shifting priorities</span>
                    </li>
                    <li className="flex items-start gap-3 text-zinc-400 blur-[6px]">
                      <span className="mt-1.5 text-xs">■</span>
                      <span className="leading-relaxed">Runway unclear given current market conditions and limited public financial disclosures</span>
                    </li>
                  </ul>
                </LockedSection>
              </div>
            )}
          </div>
        </section>

        {/* Resume Enhancement CTA — moved to just below section 1 */}
        {!bridging ? (
          userPlan === "free" || (!user && !userPlan) ? (
            /* Free tier: upgrade callout instead of upload button */
            <div className="print:hidden rounded-xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-900 text-sm">See how your resume stacks up against this role</h3>
                  <p className="text-zinc-500 text-sm mt-0.5">
                    See how your resume stacks up against this role — tailored talking points, gap analysis, and personalized blind spots.
                  </p>
                </div>
                <button
                  onClick={onUpgradeClick}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors whitespace-nowrap"
                >
                  Unlock Resume Match
                </button>
              </div>
            </div>
          ) : (
            /* Pro/Pack: show upload button */
            <div className="print:hidden rounded-xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-900 text-sm">Personalize this brief with your resume</h3>
                  <p className="text-zinc-500 text-sm mt-0.5">
                    Upload your resume to get tailored talking points, bridging analysis, and personalized blind spots.
                  </p>
                </div>
                <button
                  onClick={handleEnhanceClick}
                  disabled={enhanceStatus === "loading"}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {enhanceStatus === "loading" ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing your resume...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Upload Resume
                    </>
                  )}
                </button>
              </div>
              {enhanceError && (
                <p className="mt-3 text-sm text-red-600">{enhanceError}</p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )
        ) : (
          /* Resume Match section — shown after successful enhancement */
          <section className="border-l-4 border-blue-400 pl-5 bg-blue-50/40 rounded-r-xl py-5 pr-5">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold text-zinc-900 pb-2 border-b border-blue-100 uppercase tracking-wider text-sm flex-1">
                Resume Match
              </h2>
              <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full shrink-0 mb-2">Personalized</span>
            </div>
            <div className="space-y-4">
              {[...bridging.mandateBridges]
                .sort((a, b) => {
                  const order = { gap: 0, partial: 1, strong: 2 };
                  return (order[a.matchStrength] ?? 1) - (order[b.matchStrength] ?? 1);
                })
                .map((bridge, i) => {
                  const strengthConfig = {
                    strong: { border: "border-emerald-200", bg: "bg-emerald-50/40", badge: "bg-emerald-100 text-emerald-700", label: "Strong match" },
                    partial: { border: "border-amber-200", bg: "bg-amber-50/40", badge: "bg-amber-100 text-amber-700", label: "Partial match" },
                    gap: { border: "border-red-200", bg: "bg-red-50/40", badge: "bg-red-100 text-red-700", label: "Prep needed" },
                  };
                  const config = strengthConfig[bridge.matchStrength] || strengthConfig.partial;
                  return (
                    <details key={i} className={`bg-white rounded-lg border ${config.border} overflow-hidden group`}>
                      <summary className="p-4 cursor-pointer list-none">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${config.badge} uppercase tracking-wide`}>{config.label}</span>
                            </div>
                            <p className="text-sm font-semibold text-zinc-900">{bridge.mandate}</p>
                            <p className="text-sm text-zinc-800">{bridge.talkingPoint}</p>
                          </div>
                          <svg className="w-4 h-4 text-zinc-400 shrink-0 mt-1 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </summary>
                      <div className={`px-4 pb-4 pt-2 ${config.bg} border-t ${config.border} space-y-2.5`}>
                        <p className="text-xs text-zinc-500 italic">{bridge.competitiveDynamic}</p>
                        <p className="text-sm text-zinc-600"><span className="font-medium text-zinc-700">Your proof:</span> {bridge.resumeEvidence}</p>
                        <p className="text-sm text-zinc-700">{bridge.bridge}</p>
                      </div>
                    </details>
                  );
                })}
            </div>
          </section>
        )}

        {/* Section 2 — Role Intelligence */}
        <section id="role-intelligence">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
            Role Intelligence
          </h2>
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed"><span className="font-semibold text-zinc-900">Core Mandate:</span> {data.roleIntelligence?.coreMandate}</p>

            {data.roleIntelligence?.success90Days?.length > 0 && (
              <div>
                <h4 className="font-semibold text-zinc-900 mb-2 text-sm">90-Day Success Metrics</h4>
                <ul className="space-y-2">
                  {data.roleIntelligence.success90Days.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-700">
                      <span className="text-zinc-400 mt-1.5 text-xs">■</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.roleIntelligence?.commonFailureModes?.length > 0 && (
              <div>
                <h4 className="font-semibold text-zinc-900 mb-2 text-sm">Common Failure Modes</h4>
                <ul className="space-y-2">
                  {data.roleIntelligence.commonFailureModes.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-700">
                      <span className="text-zinc-400 mt-1.5 text-xs">■</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Section 3 — Likely Interview Themes */}
        {data.interviewThemes && data.interviewThemes.length > 0 && (
          <section id="interview-themes">
            <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
              Likely Interview Themes
            </h2>
            <div className="space-y-8">
              {data.interviewThemes.map((theme, i) => (
                <div key={i} className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-zinc-900">{theme.theme}</h3>
                    <p className="text-zinc-500 text-sm mt-1">{theme.whyItMatters}</p>
                  </div>
                  <ul className="space-y-2">
                    {theme.questions.map((q, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="text-zinc-400 mt-1.5 shrink-0 text-xs font-medium">{j + 1}.</span>
                        <span className="text-zinc-700 leading-relaxed">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 4 — Process & Operational Questions */}
        {data.processOperationalQuestions && (
          <section id="process-questions">
            <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
              Process & Operational Questions
            </h2>
            <div className="space-y-4">
              <p className="text-zinc-600 text-sm leading-relaxed italic">{data.processOperationalQuestions.context}</p>
              <ul className="space-y-2">
                {data.processOperationalQuestions.questions.map((q, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-zinc-400 mt-1.5 shrink-0 text-xs font-medium">{i + 1}.</span>
                    <span className="text-zinc-700 leading-relaxed">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Section 5 — Behavioral Question Bank */}
        {data.behavioralQuestionBank && data.behavioralQuestionBank.length > 0 && (
          <section id="behavioral-bank">
            <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
              Behavioral Question Bank
            </h2>
            <div className="space-y-8">
              {data.behavioralQuestionBank.map((item, i) => (
                <div key={i} className="space-y-3">
                  <h3 className="font-semibold text-zinc-900">{item.competency}</h3>
                  <ul className="space-y-2">
                    {item.questions.map((q, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="text-zinc-400 mt-1.5 shrink-0 text-xs font-medium">{j + 1}.</span>
                        <span className="text-zinc-700 leading-relaxed">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 6 — Round Expectations (Pro/Pack only — hidden when data is absent) */}
        {data.roundExpectations && (data.roundExpectations.overview || data.roundExpectations.whatTripsPeopleUp?.length > 0 || howToShowUpStrong?.length > 0) ? (
        <section id="round-expectations">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
            Round Expectations
          </h2>
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">{data.roundExpectations?.overview}</p>

            {/* Interview Process Timeline */}
            {data.roundExpectations?.interviewStages && data.roundExpectations.interviewStages.length > 0 && (
              <InterviewTimeline stages={data.roundExpectations.interviewStages} />
            )}

            {data.roundExpectations?.whatTripsPeopleUp?.length > 0 && (
              <div>
                <h4 className="font-semibold text-zinc-900 mb-2 text-sm">What Trips People Up</h4>
                <ul className="space-y-2">
                  {data.roundExpectations.whatTripsPeopleUp.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-700">
                      <span className="text-zinc-400 mt-1.5 text-xs">■</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {howToShowUpStrong && howToShowUpStrong.length > 0 && (
              <div>
                <h4 className="font-semibold text-zinc-900 mb-2 text-sm">
                  How to Show Up Strong{bridging ? " (Personalized)" : ""}
                </h4>
                <ul className="space-y-2">
                  {howToShowUpStrong.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-700">
                      <span className="text-zinc-400 mt-1.5 text-xs">■</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
        ) : userPlan === "free" ? (
          /* Free tier: locked round expectations teaser with blurred preview */
          <section id="round-expectations" className="print:hidden">
            <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
              Round Expectations
            </h2>
            <div className="select-none pointer-events-none" aria-hidden="true">
              <p className="text-zinc-400 leading-relaxed blur-[6px] mb-4">
                This round typically involves a 45-minute conversation with the hiring manager focused on assessing your technical depth and leadership approach in cross-functional settings.
              </p>
              <div className="mb-3">
                <h4 className="font-semibold text-zinc-900 mb-2 text-sm blur-[6px]">What Trips People Up</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-zinc-400 blur-[6px]">
                    <span className="mt-1.5 text-xs">■</span>
                    <span className="leading-relaxed">Candidates often over-index on technical details without connecting solutions back to business impact</span>
                  </li>
                  <li className="flex items-start gap-3 text-zinc-400 blur-[6px]">
                    <span className="mt-1.5 text-xs">■</span>
                    <span className="leading-relaxed">Failing to demonstrate stakeholder management experience across engineering and product teams</span>
                  </li>
                  <li className="flex items-start gap-3 text-zinc-400 blur-[6px]">
                    <span className="mt-1.5 text-xs">■</span>
                    <span className="leading-relaxed">Not preparing concrete examples of navigating ambiguity in fast-paced environments</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-zinc-100">
              <button
                onClick={onUpgradeClick}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-zinc-700 rounded-lg hover:opacity-90 transition-opacity"
              >
                <LockIcon className="w-3.5 h-3.5" />
                See what trips people up in your round
              </button>
            </div>
          </section>
        ) : null}

        {/* Section 7 — Questions to Ask */}
        <section id="questions-to-ask">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
            Questions to Ask Them
          </h2>
          <ul className="space-y-3">
            {data.questionsToAsk?.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-zinc-700">
                <span className="text-zinc-400 mt-1.5 text-xs">■</span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 8 — Recommended Reading */}
        {data.recommendedReading && data.recommendedReading.length > 0 ? (
          <section id="recommended-reading">
            <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
              Recommended Reading
            </h2>
            <ul className="space-y-4">
              {data.recommendedReading.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-zinc-400 mt-1 shrink-0 text-xs">■</span>
                  <div>
                    <span className="font-medium text-zinc-900">{item.title}</span>
                    <p className="text-zinc-500 text-sm mt-0.5">{item.why}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : userPlan === "free" ? (
          <section id="recommended-reading" className="print:hidden">
            <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
              Recommended Reading
            </h2>
            <LockedSection label="Unlock recommended reading" onUpgrade={onUpgradeClick}>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-zinc-400 mt-1 shrink-0 text-xs blur-[6px]">■</span>
                  <div className="blur-[6px]">
                    <span className="font-medium text-zinc-400">Company Engineering Blog: Scaling Infrastructure at Growth Stage</span>
                    <p className="text-zinc-400 text-sm mt-0.5">Understand how the team thinks about architecture decisions and trade-offs in production systems</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-400 mt-1 shrink-0 text-xs blur-[6px]">■</span>
                  <div className="blur-[6px]">
                    <span className="font-medium text-zinc-400">CEO Interview on Product Vision and Market Strategy</span>
                    <p className="text-zinc-400 text-sm mt-0.5">Gives context on leadership priorities and where the company is heading over the next 12 months</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-400 mt-1 shrink-0 text-xs blur-[6px]">■</span>
                  <div className="blur-[6px]">
                    <span className="font-medium text-zinc-400">Glassdoor Interview Reviews for Senior Engineering Roles</span>
                    <p className="text-zinc-400 text-sm mt-0.5">See what past candidates experienced and how the process has evolved recently</p>
                  </div>
                </li>
              </ul>
            </LockedSection>
          </section>
        ) : null}

      </div>

      {/* Bottom actions — regenerate + email capture (unauthenticated only) */}
      <div className="mt-16 pt-10 border-t border-zinc-100 print:hidden space-y-10">

        {/* Regenerate */}
        {onRegenerate && (
          <div className="text-center">
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Regenerating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                  Regenerate Brief
                </>
              )}
            </button>
            <p className="text-xs text-zinc-400 mt-2">Uses one of your weekly briefs</p>
          </div>
        )}

        {/* Email Capture — only for unauthenticated users */}
        {!user && (
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Email Me This Brief</h3>
            <p className="text-zinc-500 text-sm mb-6">
              Save this brief. Review it the night before, share it with a mentor, or reference it during prep.
            </p>

            {status === "success" ? (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 flex flex-col items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                <span className="font-medium">Brief sent! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors text-base sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={status === "loading" || !email}
                  className="px-6 py-3 sm:py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {status === "loading" ? "Sending..." : "Send to Me"}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="text-red-600 text-sm mt-3">Failed to send. Please try again.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
