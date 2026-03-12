import { useState, useEffect } from "react";
import type { PrepBriefData } from "../types";

interface PublicBriefProps {
  briefId: string;
}

interface PublicBriefData {
  id: string;
  company_name: string;
  job_title: string;
  brief_data: PrepBriefData;
  created_at: string;
}

export function PublicBrief({ briefId }: PublicBriefProps) {
  const [brief, setBrief] = useState<PublicBriefData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    fetch(`/api/public/briefs/${briefId}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        if (!r.ok) throw new Error("Failed to load brief");
        return r.json();
      })
      .then((d) => { if (d) setBrief(d); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [briefId]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-zinc-50">
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-6 animate-pulse">
          <div className="h-8 w-48 bg-zinc-200 rounded" />
          <div className="h-4 w-32 bg-zinc-100 rounded" />
          <div className="space-y-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-zinc-200/60 p-6 space-y-3">
                <div className="h-5 w-40 bg-zinc-200 rounded" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-zinc-100 rounded" />
                  <div className="h-3 w-3/4 bg-zinc-100 rounded" />
                  <div className="h-3 w-5/6 bg-zinc-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !brief) {
    return (
      <div className="min-h-[100dvh] bg-zinc-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-3">Brief not found</h1>
          <p className="text-zinc-500 mb-6">This brief is private or no longer exists.</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Generate your own brief
          </a>
        </div>
      </div>
    );
  }

  const data = brief.brief_data;

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans pb-32">
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium px-2 py-1 bg-zinc-100 text-zinc-500 rounded-full">Interview Prep Brief</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-1">
            {brief.company_name}
          </h1>
          <p className="text-xl text-zinc-500">{brief.job_title}</p>
        </header>

        <div className="bg-white p-5 md:p-8 lg:p-12 rounded-2xl shadow-sm border border-zinc-200/60 space-y-12">

          {/* Blind Spots */}
          {data.blindSpots && data.blindSpots.length > 0 && (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
              <h3 className="text-amber-800 font-semibold flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                Blind Spots
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-amber-900/80 text-sm">
                {data.blindSpots.map((spot, i) => <li key={i}>{spot}</li>)}
              </ul>
            </div>
          )}

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
              <p className="text-zinc-700 leading-relaxed">
                <span className="font-semibold text-zinc-900">Core Mandate:</span> {data.roleIntelligence?.coreMandate}
              </p>

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

              {data.roundExpectations?.howToShowUpStrong?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-2 text-sm">How to Show Up Strong</h4>
                  <ul className="space-y-2">
                    {data.roundExpectations.howToShowUpStrong.map((point, i) => (
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
      </main>

      {/* Sticky CTA Banner */}
      {!bannerDismissed && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-zinc-900 text-white shadow-2xl border-t border-zinc-700">
          <div className="max-w-3xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Preparing for YOUR interview?</p>
              <p className="text-zinc-400 text-sm">Generate a personalized brief for your exact role and company.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-100 transition-colors whitespace-nowrap"
              >
                Generate my own brief
              </a>
              <button
                onClick={() => setBannerDismissed(true)}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="Dismiss banner"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
