import { useState } from "react";

interface Props {
  reason: "free_limit" | "pack_exhausted";
  onDismiss: () => void;
}

export function UpgradePrompt({ reason, onDismiss }: Props) {
  const [loading, setLoading] = useState<"pro" | "pack" | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

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
    <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-1">
          {reason === "pack_exhausted" ? "Pack used up" : "You've hit your free limit"}
        </h2>
        <p className="text-zinc-500 text-sm">
          {reason === "pack_exhausted"
            ? "Your 5-brief Interview Pack has been used. Upgrade to Pro for unlimited briefs."
            : "Free tier includes 3 briefs per week. Upgrade to keep prepping."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pro */}
        <div className="border-2 border-zinc-900 rounded-xl p-5 flex flex-col gap-3">
          <div>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Most popular</div>
            <div className="text-lg font-bold text-zinc-900">PrepFile Pro</div>
            <div className="text-3xl font-bold text-zinc-900 mt-1">$9.99<span className="text-base font-normal text-zinc-500">/mo</span></div>
          </div>
          <ul className="text-sm text-zinc-600 space-y-1">
            <li>✓ Unlimited full briefs</li>
            <li>✓ Resume match & personalized blind spots</li>
            <li>✓ Brief history saved</li>
            <li>✓ Cancel anytime</li>
          </ul>
          <button
            onClick={() => startCheckout("pro")}
            disabled={loading !== null}
            className="mt-auto w-full py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            {loading === "pro" ? "Redirecting..." : "Get Pro"}
          </button>
        </div>

        {/* Pack */}
        <div className="border border-zinc-200 rounded-xl p-5 flex flex-col gap-3">
          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">One-time</div>
            <div className="text-lg font-bold text-zinc-900">Interview Pack</div>
            <div className="text-3xl font-bold text-zinc-900 mt-1">$4.99<span className="text-base font-normal text-zinc-500"> once</span></div>
          </div>
          <ul className="text-sm text-zinc-600 space-y-1">
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
