import React, { useState } from "react";

interface Props {
  source: "career-services" | "recruiting-agencies";
  heading?: string;
}

export function B2BLeadForm({ source, heading = "Get in touch" }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/b2b-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, organization, role, source }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-brand-50 border border-brand-200 rounded-2xl px-7 py-8 text-center">
        <p className="text-base font-semibold text-brand-700 mb-1">Thanks! We'll reach out within 24 hours.</p>
        <p className="text-sm text-brand-600">Check your inbox — we'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl px-7 py-7">
      <h2 className="text-base font-semibold text-zinc-900 mb-5">{heading}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5" htmlFor="b2b-name">
              Your name
            </label>
            <input
              id="b2b-name"
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Alex Johnson"
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5" htmlFor="b2b-email">
              Work email
            </label>
            <input
              id="b2b-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="alex@yourorg.com"
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-600 mb-1.5" htmlFor="b2b-org">
            Organization name
          </label>
          <input
            id="b2b-org"
            type="text"
            required
            value={organization}
            onChange={e => setOrganization(e.target.value)}
            placeholder="Acme Bootcamp / Talent Partners Inc."
            className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-600 mb-1.5" htmlFor="b2b-role">
            Your role
          </label>
          <select
            id="b2b-role"
            required
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
          >
            <option value="">Select a role…</option>
            <option value="career-services">Career services / bootcamp</option>
            <option value="recruiting">Recruiting agency</option>
            <option value="other">Other</option>
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending…" : "Get in touch"}
        </button>

        <p className="text-xs text-zinc-400 text-center">No spam. We'll reach out within 24 hours.</p>
      </form>
    </div>
  );
}
