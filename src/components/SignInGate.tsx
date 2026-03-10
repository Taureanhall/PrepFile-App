import React, { useState } from "react";

export function SignInGate() {
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
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200/60 text-center space-y-4">
        <div className="text-4xl">✉️</div>
        <h2 className="text-xl font-bold text-zinc-900">Check your inbox</h2>
        <p className="text-zinc-500">
          We sent a login link to <strong className="text-zinc-900">{email}</strong>.
          Click it to sign in and keep generating briefs.
        </p>
        <p className="text-zinc-400 text-sm">Link expires in 15 minutes.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200/60 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Sign in to continue</h2>
        <p className="text-zinc-500 mt-1.5">
          You've used your free brief. Sign in with your email to generate more — no password needed.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3 px-4 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors"
        >
          {status === "loading" ? "Sending…" : "Send magic link"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-500 text-sm">{errorMsg}</p>
      )}
    </div>
  );
}
