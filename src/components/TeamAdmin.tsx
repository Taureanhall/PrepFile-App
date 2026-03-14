import React, { useState, useEffect } from "react";

interface Team {
  id: string;
  name: string;
  seat_count: number;
  status: "pending" | "active";
  created_at: string;
}

interface TeamMember {
  email: string;
  user_id: string | null;
  joined_at: string;
  brief_count: number;
}

const TEAM_MIN_SEATS = 20;
const TEAM_SEAT_PRICE = 5;

export default function TeamAdmin() {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [seatCount, setSeatCount] = useState(20);
  const [error, setError] = useState("");
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      // Payment completed — reload team after a short delay
      setTimeout(() => loadTeam(), 2000);
    } else {
      loadTeam();
    }
  }, []);

  async function loadTeam() {
    setLoading(true);
    try {
      const res = await fetch("/api/teams/mine");
      if (!res.ok) throw new Error("Failed to load team");
      const data = await res.json();
      setTeam(data.team);
      if (data.team) {
        await loadUsage(data.team.id);
      }
    } catch {
      setError("Failed to load team data");
    } finally {
      setLoading(false);
    }
  }

  async function loadUsage(teamId: string) {
    try {
      const res = await fetch(`/api/teams/${teamId}/usage`);
      if (!res.ok) return;
      const data = await res.json();
      setMembers(data.members ?? []);
    } catch {
      // non-blocking
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!teamName.trim()) return setError("Team name is required");
    if (seatCount < TEAM_MIN_SEATS) return setError(`Minimum ${TEAM_MIN_SEATS} seats`);
    setCreating(true);
    try {
      const res = await fetch("/api/teams/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teamName.trim(), seatCount }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Failed to create team");
      if (data.url) window.location.href = data.url;
    } catch {
      setError("Failed to create team. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteError("");
    setInviteSuccess("");
    if (!team) return;
    const emails = inviteEmails
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter((e) => e.includes("@"));
    if (emails.length === 0) return setInviteError("Enter at least one valid email");
    setInviting(true);
    try {
      const res = await fetch(`/api/teams/${team.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });
      const data = await res.json();
      if (!res.ok) return setInviteError(data.error || "Failed to add members");
      setInviteSuccess(`Added ${data.added} member${data.added !== 1 ? "s" : ""}`);
      setInviteEmails("");
      await loadUsage(team.id);
    } catch {
      setInviteError("Failed to add members. Please try again.");
    } finally {
      setInviting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-48" />
          <div className="h-32 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  const totalCost = seatCount * TEAM_SEAT_PRICE;
  const params = new URLSearchParams(window.location.search);
  const paymentSuccess = params.get("payment") === "success";
  const paymentCancelled = params.get("payment") === "cancel";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Team Admin</h1>
        <p className="mt-2 text-gray-600">
          Bulk interview prep access for bootcamps and career programs.
        </p>
      </div>

      {paymentSuccess && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm">
          Payment received! Your team is being activated — this page will refresh shortly.
        </div>
      )}

      {paymentCancelled && (
        <div className="mb-6 rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-yellow-800 text-sm">
          Checkout cancelled. Your team setup was not completed.
        </div>
      )}

      {!team ? (
        /* Create team form */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Create your team</h2>
          <p className="text-gray-500 text-sm mb-6">
            $5 per student, one-time per cohort. Minimum {TEAM_MIN_SEATS} seats.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program or organization name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. General Assembly Chicago Cohort 12"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of seats
              </label>
              <input
                type="number"
                min={TEAM_MIN_SEATS}
                max={500}
                value={seatCount}
                onChange={(e) => setSeatCount(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum {TEAM_MIN_SEATS} seats
              </p>
            </div>

            <div className="rounded-lg bg-teal-50 border border-teal-100 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-teal-800">
                  {seatCount} seats × ${TEAM_SEAT_PRICE}
                </span>
                <span className="text-lg font-bold text-teal-900">
                  ${totalCost.toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-xs text-teal-600">One-time payment per cohort</p>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {creating ? "Redirecting to checkout…" : `Pay $${totalCost.toLocaleString()} → Continue`}
            </button>
          </form>
        </div>
      ) : (
        /* Team dashboard */
        <div className="space-y-6">
          {/* Team status card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{team.name}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {team.seat_count} seats · Created {new Date(team.created_at).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  team.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {team.status === "active" ? "Active" : "Payment pending"}
              </span>
            </div>

            {team.status === "pending" && (
              <p className="mt-4 text-sm text-yellow-700 bg-yellow-50 rounded-lg px-4 py-3">
                Complete payment to activate your team and add members.
              </p>
            )}
          </div>

          {/* Usage dashboard */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Usage</h3>
              <span className="text-sm text-gray-500">
                {members.length} / {team.seat_count} seats filled
              </span>
            </div>

            {members.length === 0 ? (
              <p className="text-gray-400 text-sm">
                {team.status === "active"
                  ? "No members added yet. Add emails below."
                  : "Activate your team first to add members."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left pb-2 text-gray-500 font-medium">Email</th>
                      <th className="text-left pb-2 text-gray-500 font-medium">Signed up</th>
                      <th className="text-right pb-2 text-gray-500 font-medium">Briefs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {members.map((m) => (
                      <tr key={m.email}>
                        <td className="py-2 text-gray-900">{m.email}</td>
                        <td className="py-2 text-gray-500">
                          {m.user_id ? "Yes" : "Not yet"}
                        </td>
                        <td className="py-2 text-right font-medium text-gray-900">
                          {m.brief_count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Invite members */}
          {team.status === "active" && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-1">Add members</h3>
              <p className="text-sm text-gray-500 mb-4">
                Enter student emails, one per line or comma-separated.
              </p>

              {inviteError && (
                <div className="mb-3 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-red-700 text-sm">
                  {inviteError}
                </div>
              )}
              {inviteSuccess && (
                <div className="mb-3 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-green-700 text-sm">
                  {inviteSuccess}
                </div>
              )}

              <form onSubmit={handleInvite} className="space-y-3">
                <textarea
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  rows={4}
                  placeholder="student1@email.com&#10;student2@email.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={inviting}
                  className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
                >
                  {inviting ? "Adding…" : "Add members"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Pricing info footer */}
      <div className="mt-8 text-center text-sm text-gray-400">
        Questions? Email{" "}
        <a href="mailto:hello@prepfile.work" className="underline hover:text-gray-600">
          hello@prepfile.work
        </a>
      </div>
    </div>
  );
}
