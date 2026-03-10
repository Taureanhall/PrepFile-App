import React, { useState } from "react";

interface AuthPanelProps {
  onDismiss: () => void;
}

export function AuthPanel({ onDismiss }: AuthPanelProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/request-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to send link");
      }
      setStatus("sent");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-zinc-900 text-white rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <span className="text-green-400 mt-0.5">✓</span>
          <div>
            <p className="font-medium">Check your inbox</p>
            <p className="text-zinc-400 text-sm mt-1">
              We sent a login link to <strong className="text-white">{email}</strong>. It expires in 15 minutes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 text-white rounded-2xl p-6 mb-8 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-semibold text-sm">Sign in to save your briefs</p>
          <p className="text-zinc-400 text-sm mt-0.5">
            Free plan: 3 briefs per week.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs mt-0.5 shrink-0"
          aria-label="Dismiss"
        >
          Try free →
        </button>
      </div>

      {/* Google OAuth — primary */}
      <a
        href="/api/auth/google"
        className="flex items-center justify-center gap-3 w-full px-4 py-2.5 bg-white text-zinc-900 font-medium text-sm rounded-lg hover:bg-zinc-100 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </a>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-700" />
        <span className="text-zinc-500 text-xs">or</span>
        <div className="flex-1 h-px bg-zinc-700" />
      </div>

      {/* Email fallback */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-base sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full sm:w-auto px-4 py-2.5 bg-zinc-700 text-white font-medium text-sm rounded-lg hover:bg-zinc-600 disabled:opacity-50 transition-colors"
        >
          {status === "loading" ? "Sending…" : "Email link"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-400 text-xs">{errorMsg}</p>
      )}
    </div>
  );
}
