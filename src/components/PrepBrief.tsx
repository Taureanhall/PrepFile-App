import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import type { PrepBriefData, BridgingAnalysis } from "../types";

interface PrepBriefProps {
  data: PrepBriefData;
  user: { id: string; email: string } | null;
  userPlan?: "free" | "pro" | "pack";
  briefId?: string | null;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onUpgradeClick?: () => void;
}

export function PrepBrief({ data, user, userPlan, briefId, onRegenerate, isRegenerating, onUpgradeClick }: PrepBriefProps) {
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
        <section>
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
            1. Company Snapshot
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
          </div>
        </section>

        {/* Section 2 — Role Intelligence */}
        <section>
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
            2. Role Intelligence
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
          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
              3. Likely Interview Themes
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
          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
              4. Process & Operational Questions
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
          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
              5. Behavioral Question Bank
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

        {/* Resume Enhancement CTA — placed above Round Expectations */}
        {!bridging ? (
          userPlan === "free" || (!user && !userPlan) ? (
            /* Free tier: upgrade callout instead of upload button */
            <div className="print:hidden rounded-xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-900 text-sm">Resume match is available on Pro and Pack</h3>
                  <p className="text-zinc-500 text-sm mt-0.5">
                    See how your resume stacks up against this role — tailored talking points, gap analysis, and personalized blind spots.
                  </p>
                </div>
                <button
                  onClick={onUpgradeClick}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors whitespace-nowrap"
                >
                  See plans
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
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
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
              {bridging.mandateBridges.map((bridge, i) => (
                <div key={i} className="bg-white rounded-lg border border-blue-100 p-4 space-y-2">
                  <p className="text-sm font-semibold text-zinc-900">{bridge.mandate}</p>
                  <p className="text-sm text-zinc-600"><span className="font-medium text-zinc-700">Your evidence:</span> {bridge.resumeEvidence}</p>
                  <p className="text-sm text-blue-700 italic">{bridge.bridge}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 6 — Round Expectations */}
        <section>
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
            6. Round Expectations
          </h2>
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">{data.roundExpectations?.overview}</p>

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

        {/* Section 7 — Questions to Ask */}
        <section>
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
            7. Questions to Ask Them
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
        {data.recommendedReading && data.recommendedReading.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100 uppercase tracking-wider text-sm">
              8. Recommended Reading
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
        )}

      </div>

      {/* Regenerate + Email Capture */}
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
            <p className="text-xs text-zinc-400 mt-2">Uses one of your daily briefs</p>
          </div>
        )}

        {/* Share Button — only for authenticated users with a saved brief */}
        {user && briefId && (
          <div className="text-center">
            <button
              onClick={handleShare}
              disabled={shareStatus === "loading"}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isPublic
                  ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
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
            <p className="text-xs text-zinc-400 mt-2">
              {isPublic ? `Shareable link: ${window.location.origin}/b/${briefId}` : "Creates a read-only link anyone can view"}
            </p>
          </div>
        )}

        {/* Email Capture */}
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">Save My Guide</h3>
          <p className="text-zinc-500 text-sm mb-6">
            Get a copy of this brief sent directly to your inbox so you can review it before the interview.
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
                className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors text-base sm:text-sm"
              />
              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="px-6 py-3 sm:py-2.5 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {status === "loading" ? "Sending..." : "Send to Me"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-red-600 text-sm mt-3">Failed to send. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
}
