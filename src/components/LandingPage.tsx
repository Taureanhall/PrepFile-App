import React, { useEffect, useState } from "react";
import { landingBaseline, landingVariants, type LandingVariant } from "../marketing/content/landing-variants";
import { trackAbVariant } from "../lib/analytics";
import { Nav } from "./Nav";
import { SuggestionInput } from "./SuggestionInput";
import { POPULAR_COMPANIES, getTitleSuggestions } from "../lib/suggestions";

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

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  return `${n}+`;
}

interface LandingPageProps {
  onGetStarted: (company?: string, title?: string) => void;
  briefCount?: number | null;
}


export function LandingPage({ onGetStarted, briefCount = null }: LandingPageProps) {
  const [variant, setVariant] = useState<LandingVariant>(landingBaseline);
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const v = pickVariant();
    setVariant(v);
    trackAbVariant(v.id);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGetStarted(company.trim() || undefined, title.trim() || undefined);
  };

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans" data-ab-variant={variant.id}>
      <Nav cta={{ label: "Sign in", onClick: () => onGetStarted() }} />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-10 sm:pt-16 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-50 border border-accent-200 rounded-full text-xs font-medium text-accent-600 mb-7">
          {briefCount !== null ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 inline-block" />
              <span>{formatCount(briefCount)} briefs generated</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 inline-block" />
              <span>{variant.badge}</span>
            </>
          )}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 mb-5 leading-tight">
          {variant.headline}
        </h1>
        <p className="text-lg sm:text-xl text-zinc-500 mb-8 max-w-xl mx-auto leading-relaxed">
          {variant.subheadline}
        </p>

        {/* Inline mini-form */}
        <div className="max-w-md mx-auto">
          <p className="text-sm font-medium text-zinc-600 mb-3 text-left">Enter your interview details to get started</p>
          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            <SuggestionInput
              value={company}
              onChange={setCompany}
              suggestions={POPULAR_COMPANIES}
              placeholder="Company name (e.g. Google)"
              label="Popular companies"
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent text-sm"
            />
            <SuggestionInput
              value={title}
              onChange={setTitle}
              suggestions={getTitleSuggestions(company)}
              placeholder="Job title (e.g. Product Manager)"
              label={company.trim() ? `Roles at ${company}` : "Popular titles"}
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 text-white font-semibold text-base rounded-xl hover:bg-brand-500 transition-colors shadow-md"
            >
              {variant.cta}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </form>
          <p className="mt-3 text-sm text-center">
            <span className="text-accent-500 font-semibold">Free to try</span>
            <span className="text-zinc-400"> — no credit card required · takes 60 seconds</span>
          </p>
          <p className="mt-2 text-xs text-center text-zinc-400">No data sold. No JD stored. Briefs generated and gone.</p>
        </div>
      </section>

      {/* Value props bar */}
      <section className="bg-brand-900 py-8">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              { stat: "< 60 sec", label: "from job link to full prep brief" },
              { stat: "Any company", label: "if they're hiring, we can prep you" },
              { stat: "Free", label: "to try — no credit card required" },
            ].map(({ stat, label }) => (
              <div key={stat} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold text-accent-400">{stat}</span>
                <span className="text-sm text-zinc-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-white border-t border-zinc-100 py-14">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          {/* Snippet 1 — Speed */}
          <blockquote className="border-l-4 border-brand-600 pl-5">
            <p className="text-base sm:text-lg text-zinc-700 leading-relaxed italic">
              "Paste a job link. Get back a brief that knows what the company actually cares about, what this role really is, what the interview will test, and the questions that make interviewers think 'this person did their homework.'"
            </p>
          </blockquote>

          {/* Snippet 3 — Depth */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-2">What's inside a brief</p>
            <p className="text-base text-zinc-700 leading-relaxed">
              What the company is doing right now and why it matters for your interview. What this role actually needs — not what the JD says. How each round works and what trips people up. Questions that show you understand their business. And the blind spots most candidates walk in with. The research you'd spend a weekend on, done before you finish reading this.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t border-zinc-100 py-14">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-brand-400 mb-10">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Enter your role",
                body: "Type the company name and job title you're interviewing for — no job description paste needed to get started.",
              },
              {
                step: "2",
                title: "AI researches the role",
                body: "PrepFile analyzes the company's competitive position, the role's priorities, and what interviewers actually evaluate.",
              },
              {
                step: "3",
                title: "Walk in prepared",
                body: "Get a personalized brief with key talking points and smart questions — ready in under 60 seconds.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <div className="w-9 h-9 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center mb-4 shrink-0">
                  {step}
                </div>
                <h3 className="text-base font-semibold text-zinc-900 mb-1">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Nav */}
      <footer className="border-t border-brand-800 bg-brand-900 text-zinc-400 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm mb-6">
            <a href="/interview-prep" className="hover:text-white transition-colors">Interview Guides</a>
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="/for/career-services" className="hover:text-white transition-colors">For Bootcamps</a>
            <a href="/for/recruiting-agencies" className="hover:text-white transition-colors">For Recruiters</a>
            <a href="mailto:support@prepfile.work" className="hover:text-white transition-colors">Help</a>
          </div>
          <div className="text-sm">&copy; {new Date().getFullYear()} PrepFile</div>
        </div>
      </footer>
    </div>
  );
}
