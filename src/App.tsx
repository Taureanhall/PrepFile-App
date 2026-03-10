"use client";

import React, { useState, useEffect } from "react";
import { PrepBrief } from "./components/PrepBrief";
import { AuthPanel } from "./components/AuthPanel";
import { SignInGate } from "./components/SignInGate";
import { MyBriefs } from "./components/MyBriefs";
import { UpgradePrompt } from "./components/UpgradePrompt";
import { LandingPage } from "./components/LandingPage";
import type { PrepBriefData } from "./types";
import { trackPageView, identifyUser, resetUser, trackBriefGenerated, trackLogin } from "./lib/analytics";

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
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<"free_limit" | "pack_exhausted" | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentCancel, setPaymentCancel] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  // Core Inputs
  const [companyName, setCompanyName] = useState("");
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

  // Track page view on mount; handle Stripe return params
  useEffect(() => {
    trackPageView();
    const params = new URLSearchParams(window.location.search);
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
      alert("Unable to open subscription portal. Please try again.");
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
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(bypassKey && { 'x-bypass-key': bypassKey }) },
        body: JSON.stringify({ companyName, jobTitle, jobDescription, round, familiarity, timeToPrep, biggestGap }),
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
      trackBriefGenerated(companyName, jobTitle);
      setOutput(data);
    } catch (error: any) {
      console.error("Error generating brief:", error);
      if (error.message?.includes("Rate limit exceeded")) {
        alert("You've reached your 5-brief daily limit. Try again tomorrow.");
      } else {
        alert(error.message || "Something went wrong. Please try again.");
      }
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

  // Show landing page for unauthenticated users who haven't started sign-in
  if (!authLoading && !user && !showAuthPanel && !isEditor) {
    return <LandingPage onGetStarted={() => setShowAuthPanel(true)} />;
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-zinc-200/60 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">Connect API Key</h2>
          <p className="text-zinc-600 mb-8">
            To use the advanced gemini-3.1-pro-preview model, please select your Google Cloud API key.
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full py-3 px-4 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition-colors"
          >
            Select API Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">

        {/* Header */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">
              Interview Intel
            </h1>
            <p className="text-zinc-600 text-lg">
              Prep briefs that show what the company actually needs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!authLoading && user && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-zinc-500">{user.email}</span>
                  {subscription && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      subscription.plan === "pro"
                        ? "bg-zinc-900 text-white"
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
                    className="text-sm px-3 py-1.5 border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-50"
                  >
                    {portalLoading ? "Loading..." : "Manage Plan"}
                  </button>
                )}
                <button
                  onClick={() => { setShowHistory(true); setOutput(null); }}
                  className="text-sm px-3 py-1.5 border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  My Briefs
                </button>
                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-1.5 border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
            {isEditor && (
              <button
                onClick={handleSelectKey}
                className="text-sm px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors font-medium shadow-sm"
              >
                Connect / Change API Key
              </button>
            )}
          </div>
        </header>

        {showHistory ? (
          <MyBriefs onBack={() => setShowHistory(false)} />
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

            {/* Upgrade prompt — shown when plan limit hit */}
            {upgradeReason ? (
              <UpgradePrompt reason={upgradeReason} onDismiss={() => setUpgradeReason(null)} />
            ) : needsSignIn ? (
              <SignInGate />
            ) : (
              <div className="space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200/60">

                {/* Core Inputs */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Company name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={`e.g. ${placeholders.company}`}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Job title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder={`e.g. ${placeholders.title}`}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors"
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
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors resize-y"
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
                            className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                              round === option
                                ? "bg-zinc-900 text-white border-zinc-900"
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
                            className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                              familiarity === option
                                ? "bg-zinc-900 text-white border-zinc-900"
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
                            className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                              timeToPrep === option
                                ? "bg-zinc-900 text-white border-zinc-900"
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
                            className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                              biggestGap === option
                                ? "bg-zinc-900 text-white border-zinc-900"
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
                        className="w-full flex items-center justify-center py-3.5 px-4 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isGenerating ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Researching company + building your brief (30–60 sec)...
                          </>
                        ) : (
                          "Generate My Prep Brief"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PrepBrief data={output} />

            <div className="flex justify-center pt-8 print:hidden">
              <button
                onClick={() => setOutput(null)}
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Start Over
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
