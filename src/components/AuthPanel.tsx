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
    <div className="bg-zinc-900 text-white rounded-2xl p-6 mb-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-semibold text-sm">Sign in for unlimited briefs</p>
          <p className="text-zinc-400 text-sm mt-0.5">
            You have 1 free brief. Sign in to unlock more.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs mt-0.5 shrink-0"
          aria-label="Dismiss"
        >
          Try 1 free →
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 bg-white text-zinc-900 font-medium text-sm rounded-lg hover:bg-zinc-100 disabled:opacity-50 transition-colors shrink-0"
        >
          {status === "loading" ? "Sending…" : "Get link"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
      )}
    </div>
  );
}
