import { useEffect } from "react";
import { Nav } from "./Nav";

interface SegmentData {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subhead: string;
  valueProp: string;
  painPoints: string[];
  ctaLabel: string;
}

const SEGMENTS: Record<string, SegmentData> = {
  "new-grads": {
    slug: "new-grads",
    metaTitle: "Interview Prep for New Graduates | PrepFile",
    metaDescription:
      "Walk into your first interview knowing exactly what they're looking for. PrepFile generates a personalized brief covering company culture, interview format, and what skills they'll probe — in 10 minutes.",
    headline: "Walk into your first interview knowing exactly what they're looking for.",
    subhead:
      "PrepFile generates a personalized brief covering company culture, interview format, and the exact skills they'll probe — in 10 minutes.",
    valueProp:
      "PrepFile levels the playing field. You get the same intel a 5-year industry vet would piece together from their network — company culture, likely interview format, red flags, and smart questions to ask — in under 10 minutes.",
    painPoints: [
      "Interviewing for the first time with no frame of reference for what companies actually want",
      "Spending hours reading Glassdoor reviews without knowing which signals matter",
      "Generic \"tell me about yourself\" prep doesn't help when you don't know the company's culture",
      "Anxious about being underqualified — don't know what gaps to close vs. what to downplay",
    ],
    ctaLabel: "Get your first brief — free",
  },
  "career-changers": {
    slug: "career-changers",
    metaTitle: "Interview Prep for Career Changers | PrepFile",
    metaDescription:
      "Switching industries? PrepFile maps your background to what your target company actually looks for — and closes the gaps before your interview. Stop explaining your pivot. Start owning it.",
    headline: "Your experience matters. PrepFile helps you prove it in the right language.",
    subhead:
      "Switching industries doesn't mean starting over. PrepFile maps your background to what your target company actually looks for — and closes the gaps before your interview.",
    valueProp:
      "You're not starting from zero — you're translating. PrepFile analyzes the specific role and company to show you exactly how your existing skills map, which gaps are dealbreakers vs. okay to acknowledge, and how to frame your pivot confidently.",
    painPoints: [
      "Strong professional background that doesn't map cleanly to the new field",
      "Constant anxiety: \"They'll see right through me\"",
      "Don't know which transferable skills to emphasize vs. which to stay quiet about",
      "Generic prep content is written for people who already have domain experience",
    ],
    ctaLabel: "Build your transition brief",
  },
  "experienced": {
    slug: "experienced",
    metaTitle: "Interview Prep for Experienced Professionals | PrepFile",
    metaDescription:
      "10 minutes of prep that makes you the best-informed person in the room. PrepFile generates a complete briefing on the company, role, and interview format — so you walk into senior interviews as a peer, not a candidate.",
    headline: "10 minutes of prep that makes you the best-informed person in the room.",
    subhead:
      "PrepFile generates a complete briefing on the company, role, and interview format — so you walk into senior interviews as a peer, not a candidate.",
    valueProp:
      "PrepFile is your pre-read before the call. It gives you the competitive landscape, the internal culture signals, the likely round structure, and the questions that separate candidates at your level — so you spend 10 minutes prepping, not 3 hours researching.",
    painPoints: [
      "Too busy to do deep research on every company in a multi-round process",
      "Know how to interview, but each new company is a different game",
      "Want to come in as a peer, not a candidate — which requires knowing their business context cold",
      "Stakes are high (senior comp, title change) — one bad interview costs significantly",
    ],
    ctaLabel: "Generate your brief",
  },
};

interface SegmentPageProps {
  slug: string;
}

export function SegmentPage({ slug }: SegmentPageProps) {
  const segment = SEGMENTS[slug];

  useEffect(() => {
    if (!segment) return;

    const url = `https://prepfile.app/for/${segment.slug}`;
    document.title = segment.metaTitle;

    const setMeta = (attr: string, val: string, isName = false) => {
      const sel = isName ? `meta[name="${attr}"]` : `meta[property="${attr}"]`;
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        isName ? el.setAttribute("name", attr) : el.setAttribute("property", attr);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    setMeta("description", segment.metaDescription, true);
    setMeta("og:title", segment.metaTitle);
    setMeta("og:description", segment.metaDescription);
    setMeta("og:url", url);
    setMeta("twitter:title", segment.metaTitle, true);
    setMeta("twitter:description", segment.metaDescription, true);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    return () => {
      document.title = "PrepFile";
    };
  }, [segment]);

  if (!segment) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Page not found</h1>
          <a href="/" className="text-sm text-zinc-600 underline">
            Go to PrepFile
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <Nav />

      <main className="max-w-3xl mx-auto px-6 py-14">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-zinc-900 mb-4 leading-snug">
            {segment.headline}
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed mb-8">{segment.subhead}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-700 transition-colors"
          >
            {segment.ctaLabel}
          </a>
          <p className="mt-3 text-xs text-zinc-400">Free — 3 briefs per week, no credit card required.</p>
        </div>

        {/* Pain points */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">The problem</h2>
          <ul className="space-y-3">
            {segment.painPoints.map((point) => (
              <li key={point} className="flex gap-3 text-sm text-zinc-600 leading-relaxed">
                <span className="shrink-0 mt-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Value prop */}
        <div className="mb-12 bg-zinc-50 border border-zinc-200 rounded-2xl px-7 py-7">
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">How PrepFile helps</h2>
          <p className="text-sm text-zinc-600 leading-relaxed">{segment.valueProp}</p>
        </div>

        {/* CTA */}
        <div className="border-t border-zinc-200 pt-12 text-center">
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">Ready to walk in prepared?</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Generate a brief for any company and role in under 10 minutes.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-700 transition-colors"
          >
            {segment.ctaLabel}
          </a>
        </div>
      </main>
    </div>
  );
}
