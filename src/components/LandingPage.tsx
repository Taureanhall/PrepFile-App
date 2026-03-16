import React, { useEffect, useRef, useState } from "react";
import { landingBaseline, landingVariants, type LandingVariant } from "../marketing/content/landing-variants";
import { trackAbVariant } from "../lib/analytics";
import { Nav } from "./Nav";
import { SuggestionInput } from "./SuggestionInput";
import { POPULAR_COMPANIES, getTitleSuggestions } from "../lib/suggestions";

const DEMO_COMPANY = "Google";
const DEMO_ROLE = "Product Manager";
const DEMO_SECTIONS = [
  {
    label: "Company Snapshot",
    text: "Google is defending its core search monopoly while expanding aggressively into cloud and AI. PM interviews probe how you'd prioritize revenue-protecting vs. growth bets.",
  },
  {
    label: "What This Role Needs",
    bullets: ["Structured thinking under ambiguity (STAR + data)", "Metrics ownership — AARRR fluency expected", "Systems-level product sense, not feature lists"],
  },
  {
    label: "Interview Format",
    text: "4–5 rounds: phone screen → 2× product sense → 1× analytical → 1× leadership. Each product sense round is 50 min with a senior PM.",
  },
  {
    label: "Smart Questions to Ask",
    bullets: ['"How does the team balance search vs. cloud growth priorities?"', '"What does the 90-day ramp look like for a new PM here?"'],
  },
];

type DemoPhase = "idle" | "typing-company" | "typing-role" | "generating" | "result";

function useTypingText(target: string, active: boolean, delayMs = 65): string {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) { setText(""); return; }
    let i = 0;
    setText("");
    const id = setInterval(() => {
      i++;
      setText(target.slice(0, i));
      if (i >= target.length) clearInterval(id);
    }, delayMs);
    return () => clearInterval(id);
  }, [active, target, delayMs]);
  return text;
}

function DemoAnimation() {
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [genStep, setGenStep] = useState(0);
  const [visibleSections, setVisibleSections] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const companyText = useTypingText(DEMO_COMPANY, phase === "typing-company");
  const roleText    = useTypingText(DEMO_ROLE,    phase === "typing-role");

  function schedule(fn: () => void, ms: number) {
    timerRef.current = setTimeout(fn, ms);
  }

  useEffect(() => {
    // Kick off the sequence
    schedule(() => setPhase("typing-company"), 600);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (phase === "typing-company" && companyText === DEMO_COMPANY) {
      schedule(() => setPhase("typing-role"), 500);
    }
  }, [phase, companyText]);

  useEffect(() => {
    if (phase === "typing-role" && roleText === DEMO_ROLE) {
      schedule(() => setPhase("generating"), 600);
    }
  }, [phase, roleText]);

  useEffect(() => {
    if (phase !== "generating") return;
    setGenStep(0);
    const steps = [900, 1700, 2500, 3300];
    const ids = steps.map((t, i) => setTimeout(() => setGenStep(i + 1), t));
    const done = setTimeout(() => {
      setVisibleSections(0);
      setPhase("result");
    }, 4400);
    return () => { ids.forEach(clearTimeout); clearTimeout(done); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "result") return;
    const ids = DEMO_SECTIONS.map((_, i) =>
      setTimeout(() => setVisibleSections(i + 1), 400 + i * 380)
    );
    const reset = setTimeout(() => {
      setPhase("idle");
      setVisibleSections(0);
      setGenStep(0);
      schedule(() => setPhase("typing-company"), 800);
    }, 400 + DEMO_SECTIONS.length * 380 + 5800);
    return () => { ids.forEach(clearTimeout); clearTimeout(reset); };
  }, [phase]);

  const genLabels = ["Company snapshot & strategy", "Role priorities & skills", "Interview format & traps", "Smart questions to ask"];

  return (
    <div className="max-w-xl mx-auto rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-md">
      {/* Form area */}
      {(phase === "idle" || phase === "typing-company" || phase === "typing-role") && (
        <div className="p-6">
          <p className="text-xs font-medium text-zinc-500 mb-4">Enter your interview details</p>
          <div className="space-y-3">
            <div className={`flex items-center px-4 py-3 rounded-xl border text-sm ${phase === "typing-company" ? "border-brand-600 ring-2 ring-brand-600/10" : "border-zinc-200"}`}>
              <span className="text-zinc-900 flex-1 min-h-[20px]">{companyText || <span className="text-zinc-400">Company name (e.g. Google)</span>}</span>
              {phase === "typing-company" && <span className="inline-block w-0.5 h-4 bg-brand-600 animate-[blink_0.8s_step-end_infinite]" />}
            </div>
            <div className={`flex items-center px-4 py-3 rounded-xl border text-sm ${phase === "typing-role" ? "border-brand-600 ring-2 ring-brand-600/10" : "border-zinc-200"}`}>
              <span className="text-zinc-900 flex-1 min-h-[20px]">{roleText || <span className="text-zinc-400">Job title (e.g. Product Manager)</span>}</span>
              {phase === "typing-role" && <span className="inline-block w-0.5 h-4 bg-brand-600 animate-[blink_0.8s_step-end_infinite]" />}
            </div>
            <div className={`w-full py-3.5 rounded-xl text-sm font-semibold text-center transition-colors ${phase === "typing-role" && roleText === DEMO_ROLE ? "bg-brand-600 text-white" : "bg-zinc-100 text-zinc-400"}`}>
              Generate My Brief →
            </div>
          </div>
        </div>
      )}

      {/* Generating state */}
      {phase === "generating" && (
        <div className="p-8 flex flex-col items-center gap-5">
          <div className="w-9 h-9 rounded-full border-2 border-zinc-200 border-t-brand-600 animate-spin" />
          <div>
            <p className="text-sm font-semibold text-zinc-800 text-center">Researching {DEMO_COMPANY}…</p>
            <p className="text-xs text-zinc-400 text-center mt-1">Analyzing competitive position, role priorities, and interview format</p>
          </div>
          <div className="w-full max-w-xs space-y-2">
            {genLabels.map((label, i) => (
              <div key={label} className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${genStep > i ? "text-zinc-700 opacity-100 translate-y-0" : "text-zinc-300 opacity-0 translate-y-1"}`}>
                <span className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold transition-colors ${genStep > i ? "bg-green-50 border border-green-300 text-green-600" : "bg-zinc-100 border border-zinc-200"}`}>
                  {genStep > i ? "✓" : ""}
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brief result */}
      {phase === "result" && (
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-zinc-900">{DEMO_COMPANY} · {DEMO_ROLE}</p>
              <p className="text-xs text-zinc-400">Interview Prep Brief</p>
            </div>
            <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">Ready</span>
          </div>
          <div className="space-y-3">
            {DEMO_SECTIONS.map((s, i) => (
              <div key={s.label} className={`transition-all duration-350 ${visibleSections > i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"}`}>
                {i > 0 && <hr className="border-zinc-100 mb-3" />}
                <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-500 mb-1.5">{s.label}</p>
                {"text" in s ? (
                  <p className="text-xs text-zinc-600 leading-relaxed">{s.text}</p>
                ) : (
                  <ul className="text-xs text-zinc-600 space-y-1">
                    {s.bullets.map((b) => <li key={b} className="before:content-['→_'] before:text-brand-600 before:font-semibold">{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
  const [isProductHunt, setIsProductHunt] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ref") === "producthunt") setIsProductHunt(true);
  }, []);

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
        {isProductHunt && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6154]/10 border border-[#ff6154]/30 rounded-full text-sm font-semibold text-[#ff6154] mb-4">
            <svg width="16" height="16" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#FF6154"/><path d="M22.667 20H17.333v-6.667h5.334a3.333 3.333 0 110 6.667z" fill="#fff"/><path d="M14 10v20h3.333v-6.667h5.334A6.667 6.667 0 0022.667 10H14z" fill="#fff"/></svg>
            Featured on Product Hunt
          </div>
        )}
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

      {/* Social proof + value props bar */}
      <section className="bg-brand-900 py-8">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              ...(briefCount !== null ? [{ stat: formatCount(briefCount), label: "briefs generated by real users" }] : [{ stat: "< 60 sec", label: "from job link to full prep brief" }]),
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

      {/* Sample brief preview */}
      <section className="bg-zinc-50 border-t border-zinc-100 py-14">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-brand-400 mb-2">What you get</h2>
          <p className="text-center text-sm text-zinc-400 mb-8">Here's part of a real brief — yours is personalized to your company and role</p>
          <div className="max-w-xl mx-auto rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-md">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-zinc-900">{DEMO_COMPANY} · {DEMO_ROLE}</p>
                  <p className="text-xs text-zinc-400">Interview Prep Brief</p>
                </div>
                <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">Sample</span>
              </div>
              <div className="space-y-3">
                {DEMO_SECTIONS.map((s, i) => (
                  <div key={s.label}>
                    {i > 0 && <hr className="border-zinc-100 mb-3" />}
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-500 mb-1.5">{s.label}</p>
                    {"text" in s ? (
                      <p className="text-xs text-zinc-600 leading-relaxed">{s.text}</p>
                    ) : (
                      <ul className="text-xs text-zinc-600 space-y-1">
                        {s.bullets.map((b) => <li key={b} className="before:content-['→_'] before:text-brand-600 before:font-semibold">{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-100 text-center">
                <p className="text-xs text-zinc-400 mb-3">Full briefs include visual analytics, resume match, round expectations, and more</p>
                <button
                  onClick={() => onGetStarted()}
                  className="px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-500 transition-colors"
                >
                  Generate yours free
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* See it in action */}
      <section className="bg-white border-t border-zinc-100 py-14">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-brand-400 mb-2">See it in action</h2>
          <p className="text-center text-sm text-zinc-400 mb-8">Type a company and role → get a full brief in under 60 seconds</p>
          <DemoAnimation />
        </div>
      </section>

      {/* Pricing section */}
      <section className="bg-zinc-50 border-t border-zinc-100 py-14" id="pricing">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-brand-400 mb-6">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            {/* Free */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col gap-3">
              <div>
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Get started</div>
                <div className="text-lg font-bold text-zinc-900">Free</div>
                <div className="text-3xl font-bold text-zinc-900 mt-1">$0<span className="text-base font-normal text-zinc-500"> forever</span></div>
              </div>
              <ul className="text-sm text-zinc-600 space-y-1 flex-1">
                <li>✓ 3 full briefs</li>
                <li>✓ No credit card required</li>
              </ul>
              <button
                onClick={() => onGetStarted()}
                className="w-full py-2.5 bg-white text-zinc-900 text-sm font-medium rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
              >
                Get started free
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white border-2 border-brand-600 rounded-2xl p-6 flex flex-col gap-3">
              <div>
                <div className="text-xs font-semibold text-accent-500 uppercase tracking-wide mb-1">Most popular</div>
                <div className="text-lg font-bold text-zinc-900">PrepFile Pro</div>
                <div className="text-3xl font-bold text-zinc-900 mt-1">$14.99<span className="text-base font-normal text-zinc-500">/mo</span></div>
              </div>
              <ul className="text-sm text-zinc-600 space-y-1 flex-1">
                <li>✓ Unlimited full briefs</li>
                <li>✓ Visual analytics & gap charts</li>
                <li>✓ Resume match & blind spots</li>
                <li>✓ Brief history saved</li>
                <li>✓ Cancel anytime</li>
              </ul>
              <button
                onClick={() => onGetStarted()}
                className="w-full py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
              >
                Get Pro
              </button>
            </div>
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
