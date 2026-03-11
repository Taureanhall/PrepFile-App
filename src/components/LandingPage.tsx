import { useEffect, useState } from "react";
import { landingBaseline, landingVariants, type LandingVariant } from "../marketing/content/landing-variants";
import { trackAbVariant, trackUpgradeClicked } from "../lib/analytics";

const AB_STORAGE_KEY = "prepfile_ab_landing_v1";
const ALL_VARIANTS: LandingVariant[] = [landingBaseline, ...landingVariants];

function pickVariant(): LandingVariant {
  try {
    const stored = localStorage.getItem(AB_STORAGE_KEY);
    if (stored) {
      const found = ALL_VARIANTS.find((v) => v.id === stored);
      if (found) return found;
    }
    const picked = ALL_VARIANTS[Math.floor(Math.random() * ALL_VARIANTS.length)];
    localStorage.setItem(AB_STORAGE_KEY, picked.id);
    return picked;
  } catch {
    return landingBaseline;
  }
}

interface LandingPageProps {
  onGetStarted: () => void;
}

async function startCheckout(product: "pro" | "pack") {
  trackUpgradeClicked("pricing_page", product);
  try {
    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product }),
    });
    const { url, error } = await res.json();
    if (error) throw new Error(error);
    window.location.href = url;
  } catch (err) {
    console.error("Checkout error:", err);
  }
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [variant, setVariant] = useState<LandingVariant>(landingBaseline);

  useEffect(() => {
    const v = pickVariant();
    setVariant(v);
    trackAbVariant(v.id);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans" data-ab-variant={variant.id}>
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
        <span className="text-lg font-bold tracking-tight">PrepFile</span>
        <button
          onClick={onGetStarted}
          className="text-sm px-4 py-3 border border-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full text-xs text-zinc-600 mb-8">
          {variant.badge}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
          {variant.headline}
        </h1>
        <p className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          {variant.subheadline}
        </p>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white font-medium text-base rounded-xl hover:bg-zinc-800 transition-colors shadow-sm"
        >
          {variant.cta}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
        <p className="mt-4 text-sm text-zinc-400">Free to try — no credit card required</p>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-zinc-100 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-zinc-900 mb-3">How it works</h2>
          <p className="text-center text-zinc-500 mb-14">Three steps. One brief. Walk in confident.</p>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "Paste the job description",
                desc: "Drop in any job posting. The more detail, the sharper your brief.",
              },
              {
                step: "2",
                title: "Answer 4 quick questions",
                desc: "Interview round, company familiarity, prep time, and your biggest gap.",
              },
              {
                step: "3",
                title: "Get your prep brief",
                desc: "PrepFile generates a structured brief covering the company's competitive position, what your interviewer is evaluating, and tailored talking points — in under a minute.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {step}
                </div>
                <h3 className="font-semibold text-zinc-900">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center text-zinc-900 mb-3">Pricing</h2>
        <p className="text-center text-zinc-500 mb-14">Free briefs to get started. Pro when an interview is on the line.</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col gap-4">
            <div>
              <div className="text-sm font-medium text-zinc-500 mb-1">Free</div>
              <div className="text-3xl font-bold text-zinc-900">$0</div>
              <div className="text-sm text-zinc-400 mt-1">3 briefs / week</div>
            </div>
            <ul className="text-sm text-zinc-600 space-y-2 flex-1">
              <li className="flex gap-2"><span className="text-zinc-400">✓</span> Company snapshot</li>
              <li className="flex gap-2"><span className="text-zinc-400">✓</span> Role intelligence</li>
              <li className="flex gap-2"><span className="text-zinc-400">✓</span> Questions to ask</li>
              <li className="flex gap-2"><span className="text-zinc-300">—</span> <span className="text-zinc-400">Resume match</span></li>
              <li className="flex gap-2"><span className="text-zinc-300">—</span> <span className="text-zinc-400">Brief history</span></li>
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-3 border border-zinc-200 text-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              Get started free
            </button>
          </div>

          {/* Interview Pack */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col gap-4">
            <div>
              <div className="text-sm font-medium text-zinc-500 mb-1">Interview Pack</div>
              <div className="text-3xl font-bold text-zinc-900">$4.99</div>
              <div className="text-sm text-zinc-400 mt-1">5 briefs, one-time</div>
            </div>
            <ul className="text-sm text-zinc-600 space-y-2 flex-1">
              <li className="flex gap-2"><span className="text-zinc-400">✓</span> Full comprehensive brief</li>
              <li className="flex gap-2"><span className="text-zinc-400">✓</span> Resume match & insights</li>
              <li className="flex gap-2"><span className="text-zinc-400">✓</span> Brief history saved</li>
              <li className="flex gap-2"><span className="text-zinc-400">✓</span> No subscription</li>
            </ul>
            <button
              onClick={() => startCheckout("pack")}
              className="w-full py-3 border border-zinc-200 text-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              Get 5 briefs
            </button>
          </div>

          {/* Pro */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-900 p-6 flex flex-col gap-4">
            <div>
              <div className="text-sm font-medium text-zinc-400 mb-1">Pro</div>
              <div className="text-3xl font-bold text-white">$9.99</div>
              <div className="text-sm text-zinc-400 mt-1">per month</div>
            </div>
            <ul className="text-sm text-zinc-300 space-y-2 flex-1">
              <li className="flex gap-2"><span className="text-zinc-500">✓</span> Unlimited briefs</li>
              <li className="flex gap-2"><span className="text-zinc-500">✓</span> Full comprehensive brief</li>
              <li className="flex gap-2"><span className="text-zinc-500">✓</span> Resume match & insights</li>
              <li className="flex gap-2"><span className="text-zinc-500">✓</span> Brief history saved</li>
              <li className="flex gap-2"><span className="text-zinc-500">✓</span> Cancel anytime</li>
            </ul>
            <button
              onClick={() => startCheckout("pro")}
              className="w-full py-3 bg-white text-zinc-900 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              Get Pro
            </button>
          </div>
        </div>
      </section>

      {/* Company Interview Prep Guides */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-zinc-900 mb-3">Company Interview Prep Guides</h2>
        <p className="text-center text-zinc-500 mb-10">Free, detailed breakdowns of how top companies hire.</p>
        <div className="grid sm:grid-cols-5 gap-3 mb-6">
          {[
            { name: "Google", slug: "google" },
            { name: "Amazon", slug: "amazon" },
            { name: "Meta", slug: "meta" },
            { name: "Microsoft", slug: "microsoft" },
            { name: "Apple", slug: "apple" },
          ].map(({ name, slug }) => (
            <a
              key={slug}
              href={`/interview-prep/${slug}`}
              className="flex items-center justify-center py-3 px-4 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:text-zinc-900 transition-colors text-center"
            >
              {name}
            </a>
          ))}
        </div>
        <div className="text-center">
          <a href="/interview-prep" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            See all company guides →
          </a>
        </div>
      </section>

      {/* Prep by Role */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-zinc-900 mb-3">Prep by Role</h2>
        <p className="text-center text-zinc-500 mb-10">Tailored interview advice for your career path.</p>
        <div className="grid sm:grid-cols-5 gap-3">
          {[
            { name: "Product Management", slug: "pm" },
            { name: "Software Engineering", slug: "swe" },
            { name: "Data Science", slug: "data-science" },
            { name: "Consulting", slug: "consulting" },
            { name: "Finance", slug: "finance" },
          ].map(({ name, slug }) => (
            <a
              key={slug}
              href={`/interview-prep/roles/${slug}`}
              className="flex items-center justify-center py-3 px-4 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:text-zinc-900 transition-colors text-center"
            >
              {name}
            </a>
          ))}
        </div>
      </section>

      {/* Segment Pages */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center text-zinc-900 mb-3">Built For You</h2>
        <p className="text-center text-zinc-500 mb-10">Interview prep tailored to where you are in your career.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { name: "New Graduates", slug: "new-grads", desc: "Landing your first role after school" },
            { name: "Career Changers", slug: "career-changers", desc: "Pivoting into a new industry or function" },
            { name: "Experienced Pros", slug: "experienced", desc: "Leveling up to senior and leadership roles" },
          ].map(({ name, slug, desc }) => (
            <a
              key={slug}
              href={`/for/${slug}`}
              className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-400 transition-colors"
            >
              <h3 className="font-semibold text-zinc-900 mb-1">{name}</h3>
              <p className="text-sm text-zinc-500">{desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-zinc-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Your next interview is coming. Start prepping now.</h2>
          <p className="text-zinc-400 mb-8">Get a prep brief for your next interview in under a minute.</p>
          <button
            onClick={onGetStarted}
            className="px-8 py-3.5 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-colors"
          >
            Get Your Prep Brief
          </button>
        </div>
      </section>

      {/* Footer Nav */}
      <footer className="border-t border-zinc-800 bg-zinc-900 text-zinc-400 py-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-sm">&copy; {new Date().getFullYear()} PrepFile</span>
          <nav className="flex gap-6 text-sm">
            <a href="/interview-prep" className="hover:text-white transition-colors">Interview Guides</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
