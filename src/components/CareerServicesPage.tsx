import { useEffect } from "react";
import { Nav } from "./Nav";
import { content } from "../marketing/content/career-services-landing";

export function CareerServicesPage() {
  useEffect(() => {
    const url = "https://prepfile.work/for/career-services";
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
            For Career Services &amp; Bootcamps
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
          <h2 className="text-lg font-semibold text-zinc-900 mb-6">Why career services teams use PrepFile</h2>
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
        <div className="mb-14 bg-white border border-zinc-200 rounded-2xl px-7 py-7">
          <h2 className="text-lg font-semibold text-zinc-900 mb-1">{content.pricing.headline}</h2>
          <div className="flex items-baseline gap-2 mt-4 mb-1">
            <span className="text-4xl font-bold text-zinc-900">{content.pricing.price}</span>
            <span className="text-sm text-zinc-500">{content.pricing.unit}</span>
          </div>
          <p className="text-xs text-amber-600 font-medium mb-4">{content.pricing.minimum}</p>
          <p className="text-sm text-zinc-600 leading-relaxed">{content.pricing.body}</p>
        </div>

        {/* CTA */}
        <div className="border-t border-zinc-200 pt-12 text-center">
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">Ready to scale your placement outcomes?</h2>
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
