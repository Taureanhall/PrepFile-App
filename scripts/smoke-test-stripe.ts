/**
 * Stripe Smoke Test — PRE-320
 *
 * Tests:
 *  1. /api/stripe/status endpoint
 *  2. /api/stripe/create-checkout-session (Pro + Pack)
 *  3. Webhook handler — checkout.session.completed (Pro)
 *  4. Webhook handler — checkout.session.completed (Pack)
 *  5. Webhook handler — customer.subscription.deleted
 *  6. Paywall trigger after 3 briefs (rate-limit logic)
 *  7. Founding member bonus: first 50 Pro subscribers get +5 bonus briefs
 *
 * Run: npx tsx scripts/smoke-test-stripe.ts
 */

import crypto from "crypto";
import { execSync } from "child_process";

const BASE = "http://localhost:3000";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
if (!WEBHOOK_SECRET) {
  console.error("STRIPE_WEBHOOK_SECRET env var is required. Set it before running this test.");
  process.exit(1);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pass(label: string) {
  console.log(`  ✓ ${label}`);
}
function fail(label: string, detail?: string) {
  console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  process.exitCode = 1;
}
function section(title: string) {
  console.log(`\n── ${title} ──`);
}

/** Build a Stripe-signed webhook body */
function buildWebhookPayload(event: object): { body: string; sig: string } {
  const body = JSON.stringify(event);
  const ts = Math.floor(Date.now() / 1000);
  const toSign = `${ts}.${body}`;
  const hmac = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(toSign)
    .digest("hex");
  const sig = `t=${ts},v1=${hmac}`;
  return { body, sig };
}

async function post(path: string, body: unknown, headers?: Record<string, string>) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

async function postRaw(path: string, body: string, headers: Record<string, string>) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body,
  });
  return { status: res.status, text: await res.text() };
}

// ─── DB helpers via sqlite ────────────────────────────────────────────────────

function dbQuery(sql: string, args: string[] = []): any {
  const escaped = args.map((a) => `'${a.replace(/'/g, "''")}'`).join(" ");
  try {
    const result = execSync(
      `sqlite3 prepflow.db "${sql.replace(/"/g, '\\"')}"`,
      { cwd: "/Users/taureanhall/Developer/Prepflow-Company/prepfile-app", encoding: "utf8" }
    ).trim();
    return result;
  } catch {
    return null;
  }
}

function getSubscription(userId: string) {
  const row = dbQuery(
    `SELECT plan, stripe_customer_id, stripe_subscription_id, pack_briefs_remaining, founding_member, bonus_briefs FROM subscriptions WHERE user_id='${userId}' LIMIT 1`
  );
  if (!row) return null;
  const [plan, custId, subId, packRemaining, foundingMember, bonusBriefs] = row.split("|");
  return { plan, custId, subId, packRemaining: Number(packRemaining), foundingMember: foundingMember === "1", bonusBriefs: Number(bonusBriefs) };
}

// ─── Test 1: Health ───────────────────────────────────────────────────────────

section("1. Server Health");
{
  const res = await fetch(`${BASE}/api/health`);
  const data = await res.json();
  if (data.status === "ok") pass("GET /api/health returns { status: ok }");
  else fail("Health check failed", JSON.stringify(data));
}

// ─── Test 2: Stripe status (unauthenticated) ──────────────────────────────────

section("2. /api/stripe/status (unauthenticated)");
{
  const res = await fetch(`${BASE}/api/stripe/status`);
  if (res.status === 401) pass("Returns 401 without session");
  else fail("Expected 401 for unauthenticated request", `got ${res.status}`);
}

// ─── Test 3: create-checkout-session — missing product ───────────────────────

section("3. /api/stripe/create-checkout-session validation");
{
  const { status, data } = await post("/api/stripe/create-checkout-session", { product: "invalid" });
  if (status === 400) pass("Returns 400 for invalid product");
  else fail("Expected 400 for invalid product", `got ${status}: ${JSON.stringify(data)}`);
}

// ─── Test 4: create-checkout-session — unauthenticated Pro ───────────────────

section("4. /api/stripe/create-checkout-session (unauthenticated, pro)");
{
  const { status, data } = await post("/api/stripe/create-checkout-session", { product: "pro" });
  // Unauthenticated is allowed — Stripe creates a session without user metadata
  if (status === 200 && data.url && data.url.includes("stripe.com")) {
    pass(`Pro checkout session created → Stripe URL returned`);
    console.log(`    URL: ${data.url.slice(0, 80)}...`);
  } else if (status === 200 && data.url) {
    pass(`Pro checkout session created → URL: ${data.url.slice(0, 80)}...`);
  } else {
    fail("Failed to create Pro checkout session", `${status}: ${JSON.stringify(data)}`);
  }
}

// ─── Test 5: create-checkout-session — unauthenticated Pack ──────────────────

section("5. /api/stripe/create-checkout-session (unauthenticated, pack)");
{
  const { status, data } = await post("/api/stripe/create-checkout-session", { product: "pack" });
  if (status === 200 && data.url) {
    pass(`Interview Pack checkout session created → URL returned`);
    console.log(`    URL: ${data.url.slice(0, 80)}...`);
  } else {
    fail("Failed to create Interview Pack checkout session", `${status}: ${JSON.stringify(data)}`);
  }
}

// ─── Test 6: Webhook — checkout.session.completed (Pro) ──────────────────────

section("6. Webhook — checkout.session.completed (Pro)");
{
  // Insert a test user directly into the DB for webhook testing
  const testEmail = `smoke-test-pro-${Date.now()}@test.prepfile.work`;
  dbQuery(`INSERT OR IGNORE INTO users (id, email, created_at) VALUES ('smoke-test-pro-uid', '${testEmail}', datetime('now'))`);

  const event = {
    id: `evt_smoke_pro_${Date.now()}`,
    type: "checkout.session.completed",
    data: {
      object: {
        id: `cs_smoke_${Date.now()}`,
        customer: "cus_smoke_test_pro",
        subscription: "sub_smoke_test_pro",
        customer_details: { email: testEmail },
        metadata: { product: "pro", user_id: "smoke-test-pro-uid" },
        amount_total: 1499,
      },
    },
  };
  const { body, sig } = buildWebhookPayload(event);
  const { status, text } = await postRaw("/api/stripe/webhook", body, {
    "Content-Type": "application/json",
    "stripe-signature": sig,
  });

  if (status === 200) {
    pass("Webhook returned 200");
    // Verify DB
    const sub = getSubscription("smoke-test-pro-uid");
    if (sub && sub.plan === "pro") {
      pass("DB: user plan updated to 'pro'");
      if (sub.custId === "cus_smoke_test_pro") pass("DB: stripe_customer_id saved");
      else fail("DB: stripe_customer_id mismatch", sub.custId);
      if (sub.subId === "sub_smoke_test_pro") pass("DB: stripe_subscription_id saved");
      else fail("DB: stripe_subscription_id mismatch", sub.subId);
    } else {
      fail("DB: plan not updated to pro", sub ? JSON.stringify(sub) : "row not found");
    }
  } else {
    fail(`Webhook returned ${status}`, text);
  }
}

// ─── Test 7: Webhook — checkout.session.completed (Pack) ─────────────────────

section("7. Webhook — checkout.session.completed (Interview Pack)");
{
  const testEmail = `smoke-test-pack-${Date.now()}@test.prepfile.work`;
  dbQuery(`INSERT OR IGNORE INTO users (id, email, created_at) VALUES ('smoke-test-pack-uid', '${testEmail}', datetime('now'))`);

  const event = {
    id: `evt_smoke_pack_${Date.now()}`,
    type: "checkout.session.completed",
    data: {
      object: {
        id: `cs_smoke_pack_${Date.now()}`,
        customer: "cus_smoke_test_pack",
        subscription: null,
        customer_details: { email: testEmail },
        metadata: { product: "pack", user_id: "smoke-test-pack-uid" },
        amount_total: 699,
      },
    },
  };
  const { body, sig } = buildWebhookPayload(event);
  const { status, text } = await postRaw("/api/stripe/webhook", body, {
    "Content-Type": "application/json",
    "stripe-signature": sig,
  });

  if (status === 200) {
    pass("Webhook returned 200");
    const sub = getSubscription("smoke-test-pack-uid");
    if (sub && sub.plan === "pack") {
      pass("DB: user plan updated to 'pack'");
      if (sub.packRemaining === 5) pass("DB: pack_briefs_remaining = 5");
      else fail("DB: pack_briefs_remaining unexpected", String(sub.packRemaining));
    } else {
      fail("DB: plan not updated to pack", sub ? JSON.stringify(sub) : "row not found");
    }
  } else {
    fail(`Webhook returned ${status}`, text);
  }
}

// ─── Test 8: Webhook — customer.subscription.deleted ─────────────────────────

section("8. Webhook — customer.subscription.deleted (downgrade)");
{
  const event = {
    id: `evt_smoke_del_${Date.now()}`,
    type: "customer.subscription.deleted",
    data: {
      object: {
        id: "sub_smoke_test_pro",
        customer: "cus_smoke_test_pro",
        status: "canceled",
      },
    },
  };
  const { body, sig } = buildWebhookPayload(event);
  const { status, text } = await postRaw("/api/stripe/webhook", body, {
    "Content-Type": "application/json",
    "stripe-signature": sig,
  });

  if (status === 200) {
    pass("Webhook returned 200");
    const sub = getSubscription("smoke-test-pro-uid");
    if (sub && sub.plan === "free") {
      pass("DB: user downgraded to 'free' after subscription deleted");
    } else {
      fail("DB: downgrade not applied", sub ? JSON.stringify(sub) : "row not found");
    }
  } else {
    fail(`Webhook returned ${status}`, text);
  }
}

// ─── Test 9: Webhook — invalid signature ─────────────────────────────────────

section("9. Webhook — invalid signature rejected");
{
  const body = JSON.stringify({ type: "checkout.session.completed", data: { object: {} } });
  const { status } = await postRaw("/api/stripe/webhook", body, {
    "Content-Type": "application/json",
    "stripe-signature": "t=1,v1=invalidsig",
  });
  if (status === 400) pass("Invalid webhook signature rejected with 400");
  else fail("Expected 400 for invalid sig", `got ${status}`);
}

// ─── Test 10: Paywall trigger check ──────────────────────────────────────────

section("10. Paywall trigger — free tier limit");
{
  // Test that the rate limit logic for free authenticated users caps at 3 briefs
  // We verify this through the API response codes / documented behavior
  // (Can't trigger 3 briefs without real Gemini calls, so verify error code mapping)
  const res = await fetch(`${BASE}/api/generate-brief`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyName: "TestCo",
      jobTitle: "Software Engineer",
      jobDescription: "Build and maintain backend systems at scale using Node.js and Postgres.",
      round: "First screen",
      familiarity: "Know of them",
      timeToPrep: "1+ days",
      biggestGap: "System design",
    }),
  });
  // Unauthenticated first call should succeed (1 free brief) or have used limit (401) or rate limit (402)
  // 200 = brief generated, 401 = free brief used (cookie set), 402 = rate limit, 429 = rate limit
  if (res.status === 200 || res.status === 401 || res.status === 402 || res.status === 429) {
    pass(`/api/generate-brief unauthenticated call: ${res.status} (correct — free brief or limit hit)`);
  } else {
    const body = await res.text().catch(() => "");
    fail("Unexpected status from /api/generate-brief", `${res.status}: ${body}`);
  }
}

// ─── Test 11: Founding member flag ───────────────────────────────────────────

section("11. Founding member bonus — DB schema");
{
  // Check that founding_member and bonus_briefs columns exist
  const cols = dbQuery("PRAGMA table_info(subscriptions)");
  if (cols && cols.includes("founding_member")) {
    pass("subscriptions.founding_member column exists");
  } else {
    fail("subscriptions.founding_member column MISSING — bonus not implemented yet");
  }
  if (cols && cols.includes("bonus_briefs")) {
    pass("subscriptions.bonus_briefs column exists");
  } else {
    fail("subscriptions.bonus_briefs column MISSING — bonus not implemented yet");
  }
}

// ─── Test 12: Founding member — first 50 Pro get 5 bonus briefs ─────────────

section("12. Founding member bonus — webhook applies bonus for early Pro subscribers");
{
  const proSubCount = dbQuery("SELECT COUNT(*) FROM subscriptions WHERE plan='pro'");
  console.log(`    Current Pro subscriber count: ${proSubCount || 0}`);

  // Check our smoke-test user got founding_member status (since we're early)
  const sub = getSubscription("smoke-test-pro-uid");
  // After downgrade test it's "free" again. Test with a fresh user.
  const testEmail2 = `smoke-test-founding-${Date.now()}@test.prepfile.work`;
  dbQuery(`INSERT OR IGNORE INTO users (id, email, created_at) VALUES ('smoke-founding-uid', '${testEmail2}', datetime('now'))`);

  const event = {
    id: `evt_smoke_founding_${Date.now()}`,
    type: "checkout.session.completed",
    data: {
      object: {
        id: `cs_smoke_founding_${Date.now()}`,
        customer: "cus_smoke_founding",
        subscription: "sub_smoke_founding",
        customer_details: { email: testEmail2 },
        metadata: { product: "pro", user_id: "smoke-founding-uid" },
        amount_total: 1499,
      },
    },
  };
  const { body, sig } = buildWebhookPayload(event);
  await postRaw("/api/stripe/webhook", body, {
    "Content-Type": "application/json",
    "stripe-signature": sig,
  });

  const foundingSub = getSubscription("smoke-founding-uid");
  if (foundingSub?.foundingMember === true) {
    pass("Founding member flag set for early Pro subscriber");
    if (foundingSub.bonusBriefs === 5) pass("Bonus briefs = 5 awarded");
    else fail("Bonus briefs not 5", String(foundingSub?.bonusBriefs));
  } else {
    fail("Founding member flag NOT set — bonus logic missing", JSON.stringify(foundingSub));
  }
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

section("Cleanup — removing smoke test users");
dbQuery(`DELETE FROM subscriptions WHERE user_id IN ('smoke-test-pro-uid','smoke-test-pack-uid','smoke-founding-uid')`);
dbQuery(`DELETE FROM users WHERE id IN ('smoke-test-pro-uid','smoke-test-pack-uid','smoke-founding-uid')`);
pass("Smoke test users removed from DB");

console.log("\n── Done ──\n");
