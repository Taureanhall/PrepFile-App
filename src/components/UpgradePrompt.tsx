import { useState, useEffect } from "react";
import { trackUpgradeClicked } from "../lib/analytics";

interface Props {
  reason: "free_limit" | "pack_exhausted" | "pro_required";
  onDismiss: () => void;
  userName?: string;
  briefId?: string | null;
}

export function UpgradePrompt({ reason, onDismiss, userName, briefId }: Props) {
  const [loading, setLoading] = useState<"pro" | "pack" | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  useEffect(() => {
    if (reason === "pro_required" || reason === "free_limit") {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [reason]);

  async function startCheckout(product: "pro" | "pack") {
    trackUpgradeClicked("post_brief", product);
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

  // Gain-framing paywall modal for free_limit
  if (reason === "free_limit") {
    const firstName = userName?.split(" ")[0] ?? null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onDismiss} />
        <div className="relative z-10 w-full max-w-lg animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-xl font-bold text-zinc-900 leading-snug">
                You're on a roll — unlock the full brief
              </h2>
              <p className="text-sm text-zinc-500 mt-2">
                {firstName
                  ? `You've created 3 briefs, ${firstName} — you're clearly serious about this. Here's what you're missing.`
                  : "You've created 3 PrepFile briefs. Here's what you're missing in each one."}
              </p>
            </div>

            {/* Free vs Paid comparison */}
            <div className="mx-6 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-zinc-200 p-4">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">Free brief</p>
                  <ul className="space-y-2 text-zinc-500">
                    <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">✓</span> Company snapshot</li>
                    <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">✓</span> Role intelligence</li>
                    <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">✗</span> <span className="line-through">Visual analytics</span></li>
                    <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">✗</span> <span className="line-through">Resume match</span></li>
                    <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">✗</span> <span className="line-through">Round expectations</span></li>
                    <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">✗</span> <span className="line-through">Blind spot analysis</span></li>
                  </ul>
                </div>
                <div className="rounded-xl border-2 border-brand-600 p-4 bg-brand-50/30">
                  <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide mb-3">Full brief</p>
                  <ul className="space-y-2 text-zinc-700">
                    <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">✓</span> Company snapshot</li>
                    <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">✓</span> Role intelligence</li>
                    <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">✓</span> Visual analytics</li>
                    <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">✓</span> Resume match</li>
                    <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">✓</span> Round expectations</li>
                    <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">✓</span> Blind spot analysis</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA section — Interview Pack primary */}
            <div className="px-6 pb-6 space-y-3">
              <button
                onClick={() => startCheckout("pack")}
                disabled={loading !== null}
                className="w-full py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {loading === "pack" ? "Redirecting..." : "Get Interview Pack — $6.99 one-time"}
              </button>
              <p className="text-xs text-center text-zinc-400">
                5 full briefs. No subscription. Pay once.
              </p>

              <button
                onClick={() => startCheckout("pro")}
                disabled={loading !== null}
                className="w-full py-2.5 bg-white text-zinc-700 text-sm font-medium rounded-xl border border-zinc-200 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
              >
                {loading === "pro" ? "Redirecting..." : "Or go unlimited — $14.99/mo"}
              </button>

              {checkoutError && (
                <p className="text-xs text-red-600 text-center">{checkoutError}</p>
              )}

              <button
                onClick={onDismiss}
                className="w-full text-sm text-zinc-400 hover:text-zinc-600 transition-colors py-1"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pack exhausted — inline card
  if (reason === "pack_exhausted") {
    return (
      <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 mb-1">Pack used up</h2>
          <p className="text-zinc-500 text-sm">
            Your 5-brief Interview Pack has been used. Upgrade to Pro for unlimited briefs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pro */}
          <div className="border-2 border-brand-600 rounded-xl p-5 flex flex-col gap-3">
            <div>
              <div className="text-xs font-semibold text-accent-500 uppercase tracking-wide mb-1">Most popular</div>
              <div className="text-lg font-bold text-zinc-900">PrepFile Pro</div>
              <div className="text-3xl font-bold text-zinc-900 mt-1">$14.99<span className="text-base font-normal text-zinc-500">/mo</span></div>
            </div>
            <ul className="text-sm text-zinc-600 space-y-1">
              <li>✓ Unlimited full briefs</li>
              <li>✓ Visual analytics & gap charts</li>
              <li>✓ Resume match & personalized blind spots</li>
              <li>✓ Brief history saved</li>
              <li>✓ Cancel anytime</li>
            </ul>
            <button
              onClick={() => startCheckout("pro")}
              disabled={loading !== null}
              className="mt-auto w-full py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              {loading === "pro" ? "Redirecting..." : "Get Pro"}
            </button>
          </div>

          {/* Pack */}
          <div className="border border-zinc-200 rounded-xl p-5 flex flex-col gap-3">
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">One-time</div>
              <div className="text-lg font-bold text-zinc-900">Interview Pack</div>
              <div className="text-3xl font-bold text-zinc-900 mt-1">$6.99<span className="text-base font-normal text-zinc-500"> once</span></div>
            </div>
            <ul className="text-sm text-zinc-600 space-y-1">
              <li>✓ Visual analytics & gap charts</li>
              <li>✓ Resume match & personalized blind spots</li>
              <li>✓ 5 full briefs, never expire</li>
              <li>✓ Brief history saved</li>
              <li>✓ No subscription</li>
            </ul>
            <button
              onClick={() => startCheckout("pack")}
              disabled={loading !== null}
              className="mt-auto w-full py-2.5 bg-white text-zinc-900 text-sm font-medium rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
            >
              {loading === "pack" ? "Redirecting..." : "Buy Pack"}
            </button>
          </div>
        </div>

        {checkoutError && (
          <p className="text-sm text-red-600">{checkoutError}</p>
        )}

        <button
          onClick={onDismiss}
          className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          Maybe later
        </button>
      </div>
    );
  }

  // pro_required — centered modal overlay (Interview Pack as primary low-risk entry)
  const proRequiredContent = (
    <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-1">Upgrade to unlock this feature</h2>
        <p className="text-zinc-500 text-sm">
          Resume match, round expectations, and full company signals are available on Pro and Interview Pack.
        </p>
      </div>

      {/* Free vs Full comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-zinc-200 p-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">Your free brief</p>
          <ul className="space-y-2 text-zinc-500">
            <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">✓</span> Company snapshot</li>
            <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">✓</span> Role intelligence</li>
            <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">✗</span> <span className="line-through">Visual analytics</span></li>
            <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">✗</span> <span className="line-through">Resume match</span></li>
            <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">✗</span> <span className="line-through">Round expectations</span></li>
            <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">✗</span> <span className="line-through">Blind spot analysis</span></li>
          </ul>
        </div>
        <div className="rounded-xl border-2 border-brand-600 p-4 bg-brand-50/30">
          <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide mb-3">Full brief</p>
          <ul className="space-y-2 text-zinc-700">
            <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">✓</span> Company snapshot</li>
            <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">✓</span> Role intelligence</li>
            <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">✓</span> Visual analytics</li>
            <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">✓</span> Resume match</li>
            <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">✓</span> Round expectations</li>
            <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">✓</span> Blind spot analysis</li>
          </ul>
        </div>
      </div>

      {/* CTA section — Interview Pack primary */}
      <div className="space-y-3">
        <button
          onClick={() => startCheckout("pack")}
          disabled={loading !== null}
          className="w-full py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          {loading === "pack" ? "Redirecting..." : "Get Interview Pack — $6.99 one-time"}
        </button>
        <p className="text-xs text-center text-zinc-400">
          5 full briefs. No subscription. Pay once.
        </p>

        <button
          onClick={() => startCheckout("pro")}
          disabled={loading !== null}
          className="w-full py-2.5 bg-white text-zinc-700 text-sm font-medium rounded-xl border border-zinc-200 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
        >
          {loading === "pro" ? "Redirecting..." : "Or go unlimited — $14.99/mo"}
        </button>
      </div>

      {checkoutError && (
        <p className="text-sm text-red-600 text-center">{checkoutError}</p>
      )}

      <button
        onClick={onDismiss}
        className="w-full text-sm text-zinc-400 hover:text-zinc-600 transition-colors py-1"
      >
        Maybe later
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-0" onClick={onDismiss} />
      <div className="relative z-50 w-full max-w-lg">{proRequiredContent}</div>
    </div>
  );
}
