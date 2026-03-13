import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Nav } from "./Nav";
import { AuthPanel } from "./AuthPanel";

export function PricingPage() {
  useEffect(() => {
    const title = "Pricing | PrepFile";
    const description = "Simple, honest pricing for PrepFile interview prep briefs. Start free, upgrade when you need more.";
    const canonicalUrl = "https://prepfile.app/pricing";
    document.title = title;
    const setMeta = (attr: string, val: string, isName = false) => {
      const sel = isName ? `meta[name="${attr}"]` : `meta[property="${attr}"]`;
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(isName ? "name" : "property", attr); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };
    setMeta("description", description, true);
    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:url", canonicalUrl);
    setMeta("twitter:title", title, true);
    setMeta("twitter:description", description, true);
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", canonicalUrl);
    return () => { document.title = "PrepFile — AI Interview Prep Briefs"; document.head.querySelector('link[rel="canonical"]')?.remove(); };
  }, []);
  const [loading, setLoading] = useState<"pro" | "pack" | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  async function startCheckout(product: "pro" | "pack") {
    setLoading(product);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err: any) {
      setCheckoutError(err.message || "Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans">
      <Nav />

      <div className="max-w-5xl mx-auto px-6 pt-6 text-sm text-zinc-400">
        <a href="/" className="hover:text-zinc-600 transition-colors">Home</a>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">Pricing</span>
      </div>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        <header className="pt-10 pb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-4">Simple, honest pricing</h1>
          <p className="text-lg text-zinc-500 leading-relaxed">Start free. Upgrade when you need more.</p>
        </header>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Free */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Free</div>
              <div className="text-xl font-bold text-zinc-900">PrepFile Free</div>
              <div className="text-3xl font-bold text-zinc-900 mt-2">$0<span className="text-base font-normal text-zinc-500">/mo</span></div>
            </div>
            <ul className="text-sm text-zinc-600 space-y-2 flex-1">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-400">✓</span>
                <span>3 quick briefs per week (company + title)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-400">✓</span>
                <span>1 full brief per week (with job description)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-400">✓</span>
                <span>Company snapshot &amp; role intelligence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-300">–</span>
                <span className="text-zinc-400">No resume match</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-300">–</span>
                <span className="text-zinc-400">No round expectations</span>
              </li>
            </ul>
            <button
              onClick={() => setShowAuth(true)}
              className="w-full py-2.5 text-center border border-zinc-200 text-zinc-600 text-sm font-medium rounded-lg hover:bg-zinc-50 transition-colors"
            >
              Get started free
            </button>
          </div>

          {/* Pro */}
          <div className="bg-white border-2 border-brand-600 rounded-2xl p-6 flex flex-col gap-4 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Most popular</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Monthly</div>
              <div className="text-xl font-bold text-zinc-900">PrepFile Pro</div>
              <div className="text-3xl font-bold text-zinc-900 mt-2">$9.99<span className="text-base font-normal text-zinc-500">/mo</span></div>
            </div>
            <ul className="text-sm text-zinc-600 space-y-2 flex-1">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-900">✓</span>
                <span>Unlimited full briefs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-900">✓</span>
                <span>Resume match &amp; personalized blind spots</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-900">✓</span>
                <span>Full round expectations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-900">✓</span>
                <span>Brief history saved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-900">✓</span>
                <span>Cancel anytime</span>
              </li>
            </ul>
            <button
              onClick={() => startCheckout("pro")}
              disabled={loading !== null}
              className="w-full py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              {loading === "pro" ? "Redirecting..." : "Get Pro"}
            </button>
          </div>

          {/* Pack */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">One-time</div>
              <div className="text-xl font-bold text-zinc-900">Interview Pack</div>
              <div className="text-3xl font-bold text-zinc-900 mt-2">$4.99<span className="text-base font-normal text-zinc-500"> once</span></div>
            </div>
            <ul className="text-sm text-zinc-600 space-y-2 flex-1">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-900">✓</span>
                <span>5 full briefs, never expire</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-900">✓</span>
                <span>Resume match &amp; personalized blind spots</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-900">✓</span>
                <span>Full round expectations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-900">✓</span>
                <span>Brief history saved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-zinc-900">✓</span>
                <span>No subscription</span>
              </li>
            </ul>
            <button
              onClick={() => startCheckout("pack")}
              disabled={loading !== null}
              className="w-full py-2.5 border border-zinc-200 text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-50 disabled:opacity-50 transition-colors"
            >
              {loading === "pack" ? "Redirecting..." : "Buy Pack"}
            </button>
          </div>
        </div>

        {checkoutError && (
          <p className="mt-6 text-sm text-red-600 text-center">{checkoutError}</p>
        )}

        {/* FAQ */}
        <div className="mt-16 max-w-xl mx-auto space-y-6">
          <h2 className="text-lg font-semibold text-zinc-900 text-center">Common questions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-zinc-800">What's the difference between quick and full briefs?</p>
              <p className="text-zinc-500 mt-1">Quick briefs use just the company name and job title to generate a concise prep snapshot — great for early research. Full briefs also use the job description for deeper analysis including behavioral questions, process questions, and (on Pro/Pack) round expectations and resume match.</p>
            </div>
            <div>
              <p className="font-medium text-zinc-800">Can I cancel anytime?</p>
              <p className="text-zinc-500 mt-1">Yes. Pro is month-to-month. Cancel from your account and you keep access until the end of the billing period.</p>
            </div>
            <div>
              <p className="font-medium text-zinc-800">Do Interview Pack briefs expire?</p>
              <p className="text-zinc-500 mt-1">Never. Your 5 briefs are yours to use whenever you need them.</p>
            </div>
            <div>
              <p className="font-medium text-zinc-800">What payment methods are accepted?</p>
              <p className="text-zinc-500 mt-1">All major credit and debit cards via Stripe. Payments are processed securely — we never see your card details.</p>
            </div>
          </div>
        </div>
      </main>

        <div className="pt-8 mt-8 border-t border-zinc-200 flex justify-between items-center text-sm text-zinc-400">
          <a href="/" className="hover:text-zinc-600 transition-colors">&larr; Back to PrepFile</a>
          <nav className="flex gap-4">
            <a href="/interview-prep" className="hover:text-zinc-600 transition-colors">Interview Guides</a>
            <a href="/blog" className="hover:text-zinc-600 transition-colors">Blog</a>
            <a href="/faq" className="hover:text-zinc-600 transition-colors">FAQ</a>
          </nav>
        </div>

      <AnimatePresence>
        {showAuth && <AuthPanel onDismiss={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  );
}
