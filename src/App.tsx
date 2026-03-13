"use client";

import { useState, useEffect } from "react";
import { PrepBrief } from "./components/PrepBrief";
import { AuthPanel } from "./components/AuthPanel";
import { SignInGate } from "./components/SignInGate";
import { MyBriefs } from "./components/MyBriefs";
import { UpgradePrompt } from "./components/UpgradePrompt";
import { LandingPage } from "./components/LandingPage";
import { PublicBrief } from "./components/PublicBrief";
import { InterviewPrepPage } from "./components/InterviewPrepPage";
import { InterviewPrepIndex } from "./components/InterviewPrepIndex";
import { BlogPage } from "./components/BlogPage";
import { FaqPage } from "./components/FaqPage";
import { SegmentPage } from "./components/SegmentPage";
import { UpgradeCTA } from "./components/UpgradeCTA";
import { PricingPage } from "./components/PricingPage";
import { Nav } from "./components/Nav";
import { SuggestionInput } from "./components/SuggestionInput";
import { POPULAR_COMPANIES, getTitleSuggestions } from "./lib/suggestions";
import { GeneratingState } from "./components/GeneratingState";
import { ToastContainer } from "./components/Toast";
import type { Toast } from "./components/Toast";
import type { PrepBriefData } from "./types";
import { trackPageView, identifyUser, resetUser, trackBriefGenerated, trackLogin, trackUpgradeClicked, trackSignupCompleted, trackExampleBriefClicked } from "./lib/analytics";

// Canonical slug mapping for /interview-prep/roles/:shortSlug
const ROLE_SLUG_MAP: Record<string, string> = {
  pm: "product-manager",
  swe: "software-engineer",
  "data-science": "data-scientist",
  consulting: "management-consultant",
  finance: "investment-banking-analyst",
};

const EXAMPLES = [
  { company: "Stripe", title: "Product Manager" },
  { company: "JPMorgan Chase", title: "Quantitative Analyst" },
  { company: "Ford Motor Company", title: "Manufacturing Engineer" },
  { company: "Johnson & Johnson", title: "Clinical Trial Manager" },
  { company: "Walmart", title: "Supply Chain Director" },
  { company: "Goldman Sachs", title: "Investment Banking Associate" },
  { company: "Boeing", title: "Aerospace Engineer" },
  { company: "Procter & Gamble", title: "Brand Manager" },
  { company: "General Electric", title: "Operations Manager" },
  { company: "OpenAI", title: "Machine Learning Researcher" },
  { company: "Target", title: "Retail Operations Lead" },
  { company: "Pfizer", title: "Regulatory Affairs Specialist" },
  { company: "Caterpillar", title: "Mechanical Engineer" },
  { company: "Bank of America", title: "Financial Advisor" },
  { company: "Airbnb", title: "Senior Software Engineer" }
];

interface User {
  id: string;
  email: string;
}

interface Subscription {
  plan: "free" | "pro" | "pack";
  pack_briefs_remaining: number;
  has_stripe_customer: boolean;
}

export default function Page() {
  // Route: /b/:id — public brief view
  const publicBriefId = window.location.pathname.match(/^\/b\/([^/]+)$/)?.[1] ?? null;
  if (publicBriefId) {
    return <PublicBrief briefId={publicBriefId} />;
  }

  // Route: /interview-prep — index listing all company guides
  if (window.location.pathname === "/interview-prep") {
    return <InterviewPrepIndex />;
  }

  // Route: /interview-prep/roles/:slug — job-function landing pages (pm, swe, data-science, consulting, finance)
  const roleSlug = window.location.pathname.match(/^\/interview-prep\/roles\/([^/]+)$/)?.[1] ?? null;
  if (roleSlug) {
    const canonicalSlug = ROLE_SLUG_MAP[roleSlug] ?? roleSlug;
    return <InterviewPrepPage slug={canonicalSlug} />;
  }

  // Route: /interview-prep/:slug — SEO marketing pages
  const interviewPrepSlug = window.location.pathname.match(/^\/interview-prep\/([^/]+)$/)?.[1] ?? null;
  if (interviewPrepSlug) {
    return <InterviewPrepPage slug={interviewPrepSlug} />;
  }

  // Route: /blog — blog index
  if (window.location.pathname === "/blog") {
    return <BlogPage />;
  }

  // Route: /blog/:slug — individual blog article
  const blogSlug = window.location.pathname.match(/^\/blog\/([^/]+)$/)?.[1] ?? null;
  if (blogSlug) {
    return <BlogPage slug={blogSlug} />;
  }

  // Route: /faq — FAQ page
  if (window.location.pathname === "/faq") {
    return <FaqPage />;
  }

  // Route: /pricing — pricing page
  if (window.location.pathname === "/pricing") {
    return <PricingPage />;
  }

  // Route: /for/:slug — segment landing pages
  const segmentSlug = window.location.pathname.match(/^\/for\/([^/]+)$/)?.[1] ?? null;
  if (segmentSlug) {
    return <SegmentPage slug={segmentSlug} />;
  }

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<"free_limit" | "pack_exhausted" | "pro_required" | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentCancel, setPaymentCancel] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [briefCount, setBriefCount] = useState<number | null>(null);

  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const showToast = (message: string, type: "error" | "info" = "error") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismissToast(id), 5000);
  };

  // Core Inputs — pre-fill company from ?company= param (SEO page CTA)
  const prefilledCompany = new URLSearchParams(window.location.search).get("company") ?? "";
  const [companyName, setCompanyName] = useState(prefilledCompany);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // MCQ Inputs
  const [round, setRound] = useState("");
  const [familiarity, setFamiliarity] = useState("");
  const [timeToPrep, setTimeToPrep] = useState("");
  const [biggestGap, setBiggestGap] = useState("");

  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<PrepBriefData | null>(null);
  const [briefId, setBriefId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [hasKey, setHasKey] = useState(true);
  const [isEditor, setIsEditor] = useState(false);
  const [placeholders, setPlaceholders] = useState({ company: "Stripe", title: "Product Manager" });

  useEffect(() => {
    const randomExample = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
    setPlaceholders(randomExample);
  }, []);

  useEffect(() => {
    const checkKey = async () => {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        setIsEditor(true);
        if (aistudio.hasSelectedApiKey) {
          const has = await aistudio.hasSelectedApiKey();
          setHasKey(has);
        }
      }
    };
    checkKey();
  }, []);

  const fetchBriefCount = () => {
    fetch("/api/stats")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.totalBriefs >= 10) setBriefCount(d.totalBriefs); })
      .catch(() => {});
  };

  // Track page view on mount; handle Stripe return params and auth completion
  useEffect(() => {
    trackPageView();
    fetchBriefCount();
    const params = new URLSearchParams(window.location.search);

    // Capture referral source from ?ref= param into sessionStorage
    const ref = params.get("ref");
    if (ref) {
      sessionStorage.setItem("prepfile_ref", ref);
    } else if (!sessionStorage.getItem("prepfile_ref")) {
      sessionStorage.setItem("prepfile_ref", "direct");
    }

    const authMethod = params.get("auth_method");
    if (authMethod) {
      trackSignupCompleted(authMethod);
    }
    if (params.get("welcome") === "1") {
      setShowWelcome(true);
    }
    if (authMethod || params.get("welcome") === "1") {
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (params.get("payment") === "success") {
      setPaymentSuccess(true);
      window.history.replaceState({}, "", "/");
      // Refresh subscription after successful payment to get plan name
      fetch("/api/stripe/status")
        .then((r) => r.ok ? r.json() : null)
        .then((d) => {
          if (d) {
            setSubscription(d);
            setPaymentPlan(d.plan === "pro" ? "Pro" : d.plan === "pack" ? "Interview Pack" : null);
          }
        })
        .catch(() => {});
    } else if (params.get("payment") === "cancel") {
      setPaymentCancel(true);
      window.history.replaceState({}, "", "/");
    }
  }, []);

  // Auto-dismiss payment banners after 5 seconds
  useEffect(() => {
    if (!paymentSuccess) return;
    const t = setTimeout(() => setPaymentSuccess(false), 5000);
    return () => clearTimeout(t);
  }, [paymentSuccess]);

  useEffect(() => {
    if (!paymentCancel) return;
    const t = setTimeout(() => setPaymentCancel(false), 5000);
    return () => clearTimeout(t);
  }, [paymentCancel]);

  // Load auth state on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (d) => {
        const loadedUser = d.user || null;
        setUser(loadedUser);
        // Don't auto-open auth panel — landing page handles unauthenticated entry
        if (loadedUser) {
          identifyUser(loadedUser.id);
          trackLogin();
          try {
            const subRes = await fetch("/api/stripe/status");
            if (subRes.ok) {
              const subData = await subRes.json();
              setSubscription(subData);
            }
          } catch {
            // non-fatal — subscription info is display-only
          }
        }
      })
      .catch(() => setShowAuthPanel(true))
      .finally(() => setAuthLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    resetUser();
    setUser(null);
    setSubscription(null);
    setShowAuthPanel(true);
    setNeedsSignIn(false);
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/create-portal-session", { method: "POST" });
      if (!res.ok) throw new Error("Failed to open portal");
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      showToast("Unable to open subscription portal. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && aistudio.openSelectKey) {
      await aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  // Derived State
  const showMCQs = jobDescription.trim().length > 10;
  const isFormValid =
    companyName.trim() !== "" &&
    jobTitle.trim() !== "" &&
    jobDescription.trim() !== "" &&
    round !== "" &&
    familiarity !== "" &&
    timeToPrep !== "" &&
    biggestGap !== "";

  const handleGenerate = async () => {
    if (!isFormValid) return;

    setIsGenerating(true);

    try {
      const bypassKey = localStorage.getItem("bypass_key") || "";
      const referralSource = sessionStorage.getItem("prepfile_ref") || "direct";
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(bypassKey && { 'x-bypass-key': bypassKey }) },
        body: JSON.stringify({ companyName, jobTitle, jobDescription, round, familiarity, timeToPrep, biggestGap, referralSource }),
      });

      if (res.status === 401) {
        setNeedsSignIn(true);
        return;
      }

      if (res.status === 402) {
        const d = await res.json();
        setUpgradeReason(d.error === "pack_exhausted" ? "pack_exhausted" : "free_limit");
        return;
      }

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const { briefId: newBriefId, ...briefData } = data;
      trackBriefGenerated(companyName, jobTitle, subscription?.plan ?? "free", !!user);
      setOutput(briefData as PrepBriefData);
      setBriefId(newBriefId ?? null);
      fetchBriefCount();
    } catch (error: any) {
      console.error("Error generating brief:", error);
      if (error.message?.includes("Rate limit exceeded")) {
        showToast("You've used your free briefs this week. Upgrade to Pro for unlimited briefs, or your limit resets next week.");
      } else {
        showToast(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickBrief = async (company?: string, title?: string) => {
    const qCompany = company || companyName;
    const qTitle = title || jobTitle;
    if (!qCompany.trim() || !qTitle.trim()) return;

    if (company) setCompanyName(company);
    if (title) setJobTitle(title);
    setShowForm(true);
    setIsGenerating(true);

    try {
      const bypassKey = localStorage.getItem("bypass_key") || "";
      const res = await fetch('/api/generate-quick-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(bypassKey && { 'x-bypass-key': bypassKey }) },
        body: JSON.stringify({ companyName: qCompany.trim(), jobTitle: qTitle.trim() }),
      });

      if (res.status === 401) {
        setNeedsSignIn(true);
        return;
      }

      if (res.status === 402) {
        const d = await res.json();
        if (d.error === "quick_limit_exceeded") {
          setUpgradeReason("free_limit");
        } else {
          setUpgradeReason(d.error === "pack_exhausted" ? "pack_exhausted" : "free_limit");
        }
        return;
      }

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const { briefId: newBriefId, ...briefData } = data;
      trackBriefGenerated(qCompany, qTitle, subscription?.plan ?? "free", !!user);
      setOutput(briefData as PrepBriefData);
      setBriefId(newBriefId ?? null);
      fetchBriefCount();
    } catch (error: any) {
      console.error("Error generating quick brief:", error);
      showToast(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const mcqOptions = {
    round: ["First screen", "Hiring manager", "Panel", "Final", "Not sure"],
    familiarity: ["Never heard of them", "Know of them", "Know them well", "Used their product"],
    timeToPrep: ["Under 1 hour", "1-3 hours", "Full day", "1+ days"],
    biggestGap: ["Industry knowledge", "Technical skills", "Seniority jump", "Culture fit", "No obvious gap"],
  };

  const EXAMPLE_DATA = {
    companyName: "Google",
    jobTitle: "Senior Software Engineer",
    jobDescription: `We are looking for a Senior Software Engineer to join Google's Core Infrastructure team in Mountain View, CA.

Responsibilities:
- Design, build, and maintain scalable distributed systems serving billions of users
- Lead technical design reviews and mentor junior engineers
- Collaborate cross-functionally with product, design, and SRE teams
- Drive adoption of best engineering practices including code review, testing, and documentation

Minimum Qualifications:
- BS/MS in Computer Science or equivalent practical experience
- 5+ years of experience in software development using C++, Java, Go, or Python
- Experience with distributed systems, large-scale storage, or network programming
- Strong problem-solving skills and ability to handle ambiguous requirements

Preferred Qualifications:
- Experience with Kubernetes, Borg, or similar container orchestration systems
- Familiarity with Google Cloud Platform products
- Track record of leading technical projects end-to-end`,
    round: "Final",
    familiarity: "Know them well",
    timeToPrep: "1-3 hours",
    biggestGap: "Seniority jump",
  };

  const handleTryExample = () => {
    trackExampleBriefClicked();
    setCompanyName(EXAMPLE_DATA.companyName);
    setJobTitle(EXAMPLE_DATA.jobTitle);
    setJobDescription(EXAMPLE_DATA.jobDescription);
    setRound(EXAMPLE_DATA.round);
    setFamiliarity(EXAMPLE_DATA.familiarity);
    setTimeToPrep(EXAMPLE_DATA.timeToPrep);
    setBiggestGap(EXAMPLE_DATA.biggestGap);
  };

  // Update document title + OG tags when viewing a generated brief
  useEffect(() => {
    const defaultTitle = "PrepFile — AI Interview Prep Briefs";
    const defaultDesc = "Stop guessing. PrepFile builds a company intel brief for your exact role and interview round — in 60 seconds.";

    const setMeta = (property: string, value: string, isName = false) => {
      const sel = isName ? `meta[name="${property}"]` : `meta[property="${property}"]`;
      const el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (el) el.setAttribute("content", value);
    };

    if (output && companyName && jobTitle) {
      const briefTitle = `${companyName} — ${jobTitle} Prep Brief | PrepFile`;
      const briefDesc = `Interview prep brief for ${jobTitle} at ${companyName}. Competitive position, role expectations, and tailored talking points.`;
      document.title = briefTitle;
      setMeta("og:title", briefTitle);
      setMeta("og:description", briefDesc);
      setMeta("twitter:title", briefTitle, true);
      setMeta("twitter:description", briefDesc, true);
    } else {
      document.title = defaultTitle;
      setMeta("og:title", defaultTitle);
      setMeta("og:description", defaultDesc);
      setMeta("twitter:title", defaultTitle, true);
      setMeta("twitter:description", defaultDesc, true);
    }
  }, [output, companyName, jobTitle]);

  // Show landing page for unauthenticated users who haven't started sign-in
  if (!authLoading && !user && !showAuthPanel && !showForm && !isEditor) {
    return (
      <LandingPage
        briefCount={briefCount}
        onGetStarted={(company, title) => {
          if (company && title) {
            // Both fields filled — generate a quick brief immediately
            handleQuickBrief(company, title);
          } else if (company || title) {
            if (company) setCompanyName(company);
            if (title) setJobTitle(title);
            setShowForm(true);
          } else {
            setShowAuthPanel(true);
          }
        }}
      />
    );
  }

  if (!hasKey) {
    return (
      <div className="min-h-[100dvh] bg-zinc-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-zinc-200/60 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">Connect API Key</h2>
          <p className="text-zinc-600 mb-8">
            To use the advanced gemini-3.1-pro-preview model, please select your Google Cloud API key.
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full py-3 px-4 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors"
          >
            Select API Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <Nav cta={
        !authLoading && user
          ? { label: "Sign out", onClick: handleLogout }
          : undefined
      }>
        {!authLoading && user && (
          <>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-zinc-500">{user.email}</span>
              {subscription && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  subscription.plan === "pro"
                    ? "bg-brand-600 text-white"
                    : subscription.plan === "pack"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-zinc-100 text-zinc-500"
                }`}>
                  {subscription.plan === "pro" ? "Pro" : subscription.plan === "pack" ? "Pack" : "Free"}
                </span>
              )}
              {subscription?.plan === "pack" && (
                <span className="text-xs text-zinc-400">
                  {subscription.pack_briefs_remaining} briefs left
                </span>
              )}
            </div>
            {subscription?.plan === "pro" && subscription.has_stripe_customer && (
              <button
                onClick={handleManageSubscription}
                disabled={portalLoading}
                className="text-sm px-3 py-2.5 border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-50"
              >
                {portalLoading ? "Loading..." : "Manage Plan"}
              </button>
            )}
            <button
              onClick={() => { setShowHistory(true); setOutput(null); }}
              className="text-sm px-3 py-2.5 border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              My Briefs
            </button>
          </>
        )}
        {isEditor && (
          <button
            onClick={handleSelectKey}
            className="text-sm px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium shadow-sm"
          >
            Connect / Change API Key
          </button>
        )}
      </Nav>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">

        {showHistory ? (
          <MyBriefs onBack={() => setShowHistory(false)} showToast={showToast} />
        ) : !output ? (
          <div className="space-y-0">
            {/* Auth Panel — shown to unauthenticated users who haven't dismissed */}
            {!authLoading && !user && showAuthPanel && !needsSignIn && (
              <AuthPanel onDismiss={() => setShowAuthPanel(false)} />
            )}

            {/* Payment success banner */}
            {paymentSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm flex justify-between items-center">
                <span>
                  Payment successful!{paymentPlan ? ` You're now on ${paymentPlan}.` : " Your plan has been upgraded."}
                </span>
                <button onClick={() => setPaymentSuccess(false)} className="text-green-600 hover:text-green-800 ml-4">✕</button>
              </div>
            )}

            {/* Payment cancel banner */}
            {paymentCancel && (
              <div className="mb-6 p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 text-sm flex justify-between items-center">
                <span>No charge was made. You can upgrade anytime.</span>
                <button onClick={() => setPaymentCancel(false)} className="text-zinc-500 hover:text-zinc-700 ml-4">✕</button>
              </div>
            )}

            {/* Welcome banner for new users arriving from OAuth */}
            {showWelcome && (
              <div className="mb-6 p-4 bg-brand-50 border border-brand-200 rounded-xl text-brand-900 text-sm flex justify-between items-center">
                <span className="font-medium">Welcome to PrepFile — generate your first interview prep brief below.</span>
                <button onClick={() => setShowWelcome(false)} className="text-brand-600 hover:text-brand-800 ml-4">✕</button>
              </div>
            )}

            {/* Upgrade prompt — shown when plan limit hit (not pro_required, which overlays the brief) */}
            {upgradeReason && upgradeReason !== "pro_required" ? (
              <UpgradePrompt reason={upgradeReason} onDismiss={() => setUpgradeReason(null)} />
            ) : needsSignIn ? (
              <SignInGate />
            ) : isGenerating ? (
              <GeneratingState companyName={companyName || "your company"} />
            ) : (
              <div className="space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200/60">

                {/* Try with example */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-semibold text-zinc-900">Build your prep brief</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Fill in the details below, or try a sample first.</p>
                  </div>
                  <button
                    onClick={handleTryExample}
                    className="shrink-0 ml-4 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 border border-zinc-200 rounded-lg hover:bg-zinc-200 transition-colors"
                  >
                    Try with example
                  </button>
                </div>

                {/* Core Inputs */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Company name
                    </label>
                    <SuggestionInput
                      value={companyName}
                      onChange={setCompanyName}
                      suggestions={POPULAR_COMPANIES}
                      placeholder={`e.g. ${placeholders.company}`}
                      label="Popular companies"
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Job title
                    </label>
                    <SuggestionInput
                      value={jobTitle}
                      onChange={setJobTitle}
                      suggestions={getTitleSuggestions(companyName)}
                      placeholder={`e.g. ${placeholders.title}`}
                      label={companyName.trim() ? `Roles at ${companyName}` : "Popular titles"}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Job description
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the full job description here..."
                      rows={6}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors resize-y"
                    />
                  </div>
                </div>

                {/* MCQ Section (Conditional) */}
                {showMCQs && (
                  <div className="pt-6 border-t border-zinc-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                      <h2 className="text-lg font-semibold text-zinc-900 mb-1">Quick context</h2>
                      <p className="text-sm text-zinc-500 mb-6">Help us tailor the brief to your specific situation.</p>
                    </div>

                    {/* Question 1 */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-zinc-800">
                        Which interview round is this for?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {mcqOptions.round.map((option) => (
                          <button
                            key={option}
                            onClick={() => setRound(option)}
                            className={`px-4 py-2.5 text-sm rounded-full border transition-colors ${
                              round === option
                                ? "bg-brand-600 text-white border-brand-600"
                                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Question 2 */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-zinc-800">
                        How familiar are you with this company?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {mcqOptions.familiarity.map((option) => (
                          <button
                            key={option}
                            onClick={() => setFamiliarity(option)}
                            className={`px-4 py-2.5 text-sm rounded-full border transition-colors ${
                              familiarity === option
                                ? "bg-brand-600 text-white border-brand-600"
                                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Question 3 */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-zinc-800">
                        How much time do you have to prep?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {mcqOptions.timeToPrep.map((option) => (
                          <button
                            key={option}
                            onClick={() => setTimeToPrep(option)}
                            className={`px-4 py-2.5 text-sm rounded-full border transition-colors ${
                              timeToPrep === option
                                ? "bg-brand-600 text-white border-brand-600"
                                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Question 4 */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-zinc-800">
                        What's your biggest gap for this role?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {mcqOptions.biggestGap.map((option) => (
                          <button
                            key={option}
                            onClick={() => setBiggestGap(option)}
                            className={`px-4 py-2.5 text-sm rounded-full border transition-colors ${
                              biggestGap === option
                                ? "bg-brand-600 text-white border-brand-600"
                                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 space-y-3">
                      <button
                        onClick={handleGenerate}
                        disabled={!isFormValid || isGenerating}
                        className="w-full flex items-center justify-center py-3.5 px-4 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isGenerating ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Building your brief...
                          </>
                        ) : (
                          "Generate My Prep Brief"
                        )}
                      </button>
                      <p className="text-xs text-zinc-400 mt-2">This usually takes 30–60 seconds</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Pro upgrade overlay — shown on top of brief when user clicks upgrade CTAs */}
            {upgradeReason === "pro_required" && (
              <UpgradePrompt reason="pro_required" onDismiss={() => setUpgradeReason(null)} />
            )}
            <PrepBrief
              data={output}
              user={user}
              userPlan={subscription?.plan}
              briefId={briefId}
              onRegenerate={handleGenerate}
              isRegenerating={isGenerating}
              onUpgradeClick={() => setUpgradeReason("pro_required")}
            />

            {/* Post-brief upgrade CTA — free users only, A/B tested copy variants */}
            {(!user || subscription?.plan === "free") && (
              <UpgradeCTA onUpgradeClick={() => setUpgradeReason("pro_required")} />
            )}

            <div className="flex justify-center pt-8 print:hidden">
              <button
                onClick={() => { setOutput(null); setBriefId(null); }}
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Start Over
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-6 py-8 mt-8 border-t border-zinc-200 flex justify-between items-center text-sm text-zinc-400 print:hidden">
        <span>&copy; {new Date().getFullYear()} PrepFile</span>
        <nav className="flex gap-5">
          <a href="/pricing" className="hover:text-zinc-600 transition-colors">Pricing</a>
          <a href="/interview-prep" className="hover:text-zinc-600 transition-colors">Interview Guides</a>
          <a href="/blog" className="hover:text-zinc-600 transition-colors">Blog</a>
          <a href="/faq" className="hover:text-zinc-600 transition-colors">FAQ</a>
        </nav>
      </footer>
    </div>
  );
}
