import { useEffect } from "react";
import { Nav } from "./Nav";
import { content } from "../marketing/content/recruiting-agencies-landing";

export function RecruitingAgenciesPage() {
  useEffect(() => {
    const url = "https://prepfile.work/for/recruiting-agencies";
    document.title = content.metaTitle;

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

    setMeta("description", content.metaDescription, true);
    setMeta("og:title", content.metaTitle);
    setMeta("og:description", content.metaDescription);
    setMeta("og:url", url);
    setMeta("twitter:title", content.metaTitle, true);
    setMeta("twitter:description", content.metaDescription, true);

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
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <Nav />

      <main className="max-w-3xl mx-auto px-6 py-14">
        {/* Hero */}
        <div className="mb-14">
          <div className="inline-block text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-4">
            For Recruiting Agencies
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-4 leading-snug">
            {content.headline}
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed mb-8">{content.subhead}</p>
          <a
            href={content.cta.href}
            className="inline-block px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-500 transition-colors"
          >
            {content.cta.label}
          </a>
          <p className="mt-3 text-xs text-zinc-400">{content.cta.subtext}</p>
        </div>

        {/* Value Props */}
        <div className="mb-14">
          <h2 className="text-lg font-semibold text-zinc-900 mb-6">Why recruiting agencies use PrepFile</h2>
          <div className="grid gap-5">
            {content.valueProps.map((vp) => (
              <div key={vp.heading} className="bg-white border border-zinc-200 rounded-2xl px-6 py-5">
                <h3 className="text-sm font-semibold text-zinc-900 mb-2">{vp.heading}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{vp.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-14">
          <h2 className="text-lg font-semibold text-zinc-900 mb-6">How it works</h2>
          <ol className="space-y-6">
            {content.howItWorks.map((item, i) => (
              <li key={i} className="flex gap-4">
                <div className="shrink-0 w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 mb-1">{item.step}</p>
                  <p className="text-sm text-zinc-600 leading-relaxed">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Pricing */}
        <div className="mb-14">
          <h2 className="text-lg font-semibold text-zinc-900 mb-6">{content.pricing.headline}</h2>

          {/* Monthly + Annual side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Monthly */}
            <div className="bg-white border border-zinc-200 rounded-2xl px-6 py-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{content.pricing.monthly.label}</span>
              <div className="flex items-baseline gap-2 mt-3 mb-2">
                <span className="text-3xl font-bold text-zinc-900">{content.pricing.monthly.price}</span>
                <span className="text-sm text-zinc-500">{content.pricing.monthly.unit}</span>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">{content.pricing.monthly.description}</p>
            </div>

            {/* Annual */}
            <div className="bg-white border-2 border-brand-600 rounded-2xl px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">{content.pricing.annual.label}</span>
                <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-full px-2 py-0.5">{content.pricing.annual.savings}</span>
              </div>
              <div className="flex items-baseline gap-2 mt-3 mb-2">
                <span className="text-3xl font-bold text-zinc-900">{content.pricing.annual.price}</span>
                <span className="text-sm text-zinc-500">{content.pricing.annual.unit}</span>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">{content.pricing.annual.description}</p>
            </div>
          </div>

          {/* Pilot */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-7 py-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">{content.pricing.pilot.label}</span>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">{content.pricing.pilot.description}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-zinc-200 pt-12 text-center">
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">Ready to increase your placement rate?</h2>
          <p className="text-sm text-zinc-500 mb-6">{content.cta.subtext}</p>
          <a
            href={content.cta.href}
            className="inline-block px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-500 transition-colors"
          >
            {content.cta.label}
          </a>
        </div>
      </main>
    </div>
  );
}
