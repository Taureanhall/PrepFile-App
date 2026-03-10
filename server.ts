import "dotenv/config";
import crypto from "crypto";
import express from "express";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import { generateBrief } from "./src/lib/generateBrief.js";
import {
  createMagicLink,
  verifyMagicLink,
  getUserBySession,
  deleteSession,
  saveBrief,
  getBriefsByUser,
  getBriefById,
  checkAndIncrementRateLimit,
  getUserSubscription,
  upsertSubscription,
  usePackBrief,
  getBriefCountForUser,
  hasReceivedOnboardingEmail,
  markOnboardingEmailSent,
  upsertGoogleUser,
  getPublicBriefMeta,
  getPublicBrief,
  setBriefPublic,
} from "./src/lib/db.js";
import { getPostHogClient } from "./src/lib/posthog.js";
import { getStripe, PRICES, PACK_BRIEF_COUNT } from "./src/lib/stripe.js";
import { OAuth2Client } from "google-auth-library";

const RATE_LIMIT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000; // 1 week
const RATE_LIMIT_MAX = 3; // 3 briefs per week for free tier

function getSessionUser(req: express.Request) {
  const token = req.cookies?.session;
  if (!token) return null;
  return getUserBySession(token);
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
  const FROM_EMAIL = process.env.FROM_EMAIL || "PrepFile <onboarding@resend.dev>";

  // Stripe webhook — must be registered with raw body BEFORE express.json()
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!sig || !webhookSecret) return res.status(400).send("Missing signature or secret");

    let event: any;
    try {
      event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const userId = session.metadata?.user_id;
      const product = session.metadata?.product as "pro" | "pack";
      if (!userId || !product) return res.sendStatus(200);

      if (product === "pro") {
        upsertSubscription(userId, "pro", session.customer, session.subscription);
      } else if (product === "pack") {
        upsertSubscription(userId, "pack", session.customer, null, PACK_BRIEF_COUNT);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as any;
      // Find user by stripe_customer_id and downgrade
      const stripe = getStripe();
      const customer = await stripe.customers.retrieve(sub.customer) as any;
      if (customer && !customer.deleted) {
        // We store customer_id in subscriptions; find user by scanning (small dataset)
        // Better: store customer_id in metadata when creating customer
        const email = customer.email;
        if (email) {
          // Downgrade any user with this stripe_customer_id
          const db = (await import("./src/lib/db.js")).default;
          const row = db.prepare("SELECT user_id FROM subscriptions WHERE stripe_customer_id = ?").get(sub.customer) as any;
          if (row) upsertSubscription(row.user_id, "free", sub.customer, null, 0);
        }
      }
    }

    res.sendStatus(200);
  });

  app.use(express.json());
  app.use(cookieParser());

  // API routes FIRST
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Auth: get current user
  app.get("/api/auth/me", (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ user: null });
    res.json({ user });
  });

  // Auth: request magic link
  app.post("/api/auth/request-magic-link", async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email required" });
    }

    try {
      const token = createMagicLink(email.toLowerCase().trim());
      const magicUrl = `${APP_URL}/api/auth/verify?token=${token}`;

      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Your PrepFile login link",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
            <h2 style="font-size:20px;font-weight:700;color:#18181b;margin-bottom:8px">Sign in to PrepFile</h2>
            <p style="color:#52525b;margin-bottom:24px">Click the button below to sign in. This link expires in 15 minutes.</p>
            <a href="${magicUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500">Sign in to PrepFile</a>
            <p style="color:#a1a1aa;font-size:12px;margin-top:24px">If you didn't request this, you can ignore this email.</p>
          </div>
        `,
      });

      res.json({ success: true });
    } catch (err: any) {
      console.error("Magic link error:", err);
      res.status(500).json({ error: "Failed to send login email" });
    }
  });

  // Auth: verify magic link token → set session cookie → redirect home
  app.get("/api/auth/verify", (req, res) => {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      return res.status(400).send("Invalid or missing token");
    }

    const sessionToken = verifyMagicLink(token);
    if (!sessionToken) {
      return res.status(400).send("This link has expired or already been used. Please request a new one.");
    }

    const signedInUser = getUserBySession(sessionToken);
    if (signedInUser) {
      getPostHogClient()?.capture({ distinctId: signedInUser.id, event: "user_signed_in", properties: { user_id: signedInUser.id } });
    }

    res.cookie("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    // Clear free brief cookie now that they're signed in
    res.clearCookie("free_brief_used");
    res.redirect("/");
  });

  // Auth: logout
  app.post("/api/auth/logout", (req, res) => {
    const token = req.cookies?.session;
    if (token) deleteSession(token);
    res.clearCookie("session");
    res.json({ success: true });
  });

  // Auth: Google OAuth
  app.get("/api/auth/google", (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) return res.status(503).json({ error: "Google OAuth not configured" });

    const state = crypto.randomBytes(16).toString("hex");
    res.cookie("oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 10 * 60 * 1000 });

    const client = new OAuth2Client(clientId, clientSecret, `${APP_URL}/api/auth/google/callback`);
    const url = client.generateAuthUrl({ access_type: "offline", scope: ["email", "profile"], state });
    res.redirect(url);
  });

  app.get("/api/auth/google/callback", async (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) return res.status(503).send("Google OAuth not configured");

    const { code, state } = req.query as { code?: string; state?: string };
    const storedState = req.cookies?.oauth_state;
    if (!code || !state || state !== storedState) return res.status(400).send("Invalid OAuth state");
    res.clearCookie("oauth_state");

    try {
      const client = new OAuth2Client(clientId, clientSecret, `${APP_URL}/api/auth/google/callback`);
      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);

      const ticket = await client.verifyIdToken({ idToken: tokens.id_token!, audience: clientId });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload?.email) return res.status(400).send("Invalid Google account");

      const sessionToken = upsertGoogleUser(payload.sub, payload.email);
      const signedInUser = getUserBySession(sessionToken);
      if (signedInUser) {
        getPostHogClient()?.capture({ distinctId: signedInUser.id, event: "user_signed_in", properties: { user_id: signedInUser.id, method: "google" } });
      }

      res.cookie("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.clearCookie("free_brief_used");
      res.redirect("/");
    } catch (err: any) {
      console.error("Google OAuth error:", err);
      res.status(500).send("Google sign-in failed. Please try again.");
    }
  });

  // Stripe: get current plan
  app.get("/api/stripe/status", (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    const sub = getUserSubscription(user.id);
    res.json({
      plan: sub.plan,
      pack_briefs_remaining: sub.pack_briefs_remaining,
      has_stripe_customer: !!sub.stripe_customer_id,
    });
  });

  // Stripe: create checkout session
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    const { product } = req.body as { product: "pro" | "pack" };
    if (product !== "pro" && product !== "pack") {
      return res.status(400).json({ error: "Invalid product" });
    }

    try {
      const stripe = getStripe();
      const priceConfig = PRICES[product];
      const isSubscription = product === "pro";

      const sessionParams: any = {
        mode: isSubscription ? "subscription" : "payment",
        payment_method_types: ["card"],
        line_items: [{ price_data: priceConfig, quantity: 1 }],
        success_url: `${APP_URL}/?payment=success`,
        cancel_url: `${APP_URL}/?payment=cancel`,
        customer_email: user.email,
        metadata: { user_id: user.id, product },
      };

      // Reuse existing Stripe customer if we have one
      const sub = getUserSubscription(user.id);
      if (sub.stripe_customer_id) {
        delete sessionParams.customer_email;
        sessionParams.customer = sub.stripe_customer_id;
      }

      const session = await stripe.checkout.sessions.create(sessionParams);
      res.json({ url: session.url });
    } catch (err: any) {
      console.error("Checkout session error:", err);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Stripe: customer portal (manage subscription)
  const handlePortalSession = async (req: express.Request, res: express.Response) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    const sub = getUserSubscription(user.id);
    if (!sub.stripe_customer_id) return res.status(400).json({ error: "No active subscription" });

    try {
      const session = await getStripe().billingPortal.sessions.create({
        customer: sub.stripe_customer_id,
        return_url: APP_URL,
      });
      res.json({ url: session.url });
    } catch (err: any) {
      console.error("Portal session error:", err);
      res.status(500).json({ error: "Failed to create portal session" });
    }
  };
  app.post("/api/stripe/portal", handlePortalSession);
  app.post("/api/stripe/create-portal-session", handlePortalSession);

  // Generate brief — authenticated OR 1 free brief via cookie
  app.post("/api/generate-brief", async (req, res) => {
    try {
      const bypassKey = process.env.BYPASS_KEY;
      const clientKey = req.headers["x-bypass-key"];
      const isBypassed = bypassKey && clientKey === bypassKey;

      const user = getSessionUser(req);

      if (!isBypassed) {
        if (!user) {
          // Unauthenticated: allow 1 free brief via cookie
          if (req.cookies?.free_brief_used) {
            return res.status(401).json({ error: "free_brief_used", message: "Sign in to generate more briefs." });
          }
        } else {
          // Authenticated: check plan
          const sub = getUserSubscription(user.id);
          if (sub.plan === "pro") {
            // Unlimited — no rate limit check
          } else if (sub.plan === "pack") {
            if (!usePackBrief(user.id)) {
              return res.status(402).json({ error: "pack_exhausted", message: "Your Interview Pack is used up. Upgrade to Pro for unlimited briefs." });
            }
          } else {
            // Free tier
            if (!checkAndIncrementRateLimit(`user:${user.id}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
              return res.status(402).json({ error: "rate_limit_exceeded", message: "Free tier allows 3 briefs per week. Upgrade for more." });
            }
          }
        }
      }

      const data = await generateBrief(req.body);

      getPostHogClient()?.capture({
        distinctId: user ? user.id : `anon:${req.ip || "unknown"}`,
        event: "brief_generated",
        properties: {
          company: req.body.companyName || "",
          job_title: req.body.jobTitle || "",
          round: req.body.round || "",
          authenticated: !!user,
        },
      });

      // Persist brief for authenticated users
      if (user) {
        try {
          const briefId = saveBrief(user.id, req.body.companyName || "", req.body.jobTitle || "", data);

          // Send onboarding email after first brief
          const briefCount = getBriefCountForUser(user.id);
          if (briefCount === 1 && !hasReceivedOnboardingEmail(user.id)) {
            try {
              const { Resend } = await import("resend");
              const resend = new Resend(process.env.RESEND_API_KEY);
              const sub = getUserSubscription(user.id);
              const isFreeTier = sub.plan === "free";
              const appUrl = APP_URL;

              await resend.emails.send({
                from: FROM_EMAIL,
                to: user.email,
                subject: "Your first PrepFile brief is ready",
                html: `
                  <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px">
                    <h2 style="font-size:20px;font-weight:700;color:#18181b;margin-bottom:8px">Welcome to PrepFile</h2>
                    <p style="color:#52525b;margin-bottom:16px">
                      You just generated your first prep brief for <strong>${req.body.companyName || "your target company"}</strong>.
                      PrepFile uses Porter's Five Forces and Deming analysis to give you the company context, role intelligence,
                      and round-specific expectations that most candidates miss.
                    </p>
                    <a href="${appUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;margin-bottom:24px">View your brief →</a>
                    ${isFreeTier ? `
                    <div style="background:#f4f4f5;border-radius:8px;padding:16px;margin-top:8px">
                      <p style="color:#3f3f46;font-size:14px;margin:0 0 8px">
                        <strong>On the free plan?</strong> You get 3 briefs per week. Upgrade to Pro for unlimited briefs at $9.99/month,
                        or grab an Interview Pack (5 briefs) for $4.99.
                      </p>
                      <a href="${appUrl}" style="color:#18181b;font-size:14px;font-weight:500">See upgrade options →</a>
                    </div>
                    ` : ""}
                    <p style="color:#a1a1aa;font-size:12px;margin-top:24px">PrepFile — AI-powered interview prep</p>
                  </div>
                `,
              });
              markOnboardingEmailSent(user.id);
            } catch (emailErr) {
              console.error("Failed to send onboarding email:", emailErr);
              // Non-fatal — do not crash the generate endpoint
            }
          }
        } catch (err) {
          console.error("Failed to save brief:", err);
        }
      }

      // Mark free brief used for unauthenticated users
      if (!user && !isBypassed) {
        res.cookie("free_brief_used", "1", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }

      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to generate brief" });
    }
  });

  app.post("/api/send-brief", async (req, res) => {
    try {
      const { email, data } = req.body;
      if (!email || !data) {
        return res.status(400).json({ error: "email and data are required" });
      }

      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const ul = (items: string[]) => `<ul style="padding-left:20px">${items.map(i => `<li style="margin-bottom:6px">${i}</li>`).join("")}</ul>`;
      const h3 = (text: string) => `<h3 style="margin:16px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:#71717a">${text}</h3>`;
      const h2 = (text: string) => `<h2 style="margin:28px 0 10px;font-size:16px;font-weight:700;border-bottom:1px solid #e4e4e7;padding-bottom:6px">${text}</h2>`;

      const sections = [
        data.blindSpots?.length ? `<div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:14px 18px;margin-bottom:24px"><strong style="color:#92400e">Blind Spots</strong>${ul(data.blindSpots)}</div>` : "",
        h2("1. Company Snapshot"),
        `<p>${data.companySnapshot?.overview || ""}</p>`,
        data.companySnapshot?.keyMetrics?.length ? h3("Key Metrics") + ul(data.companySnapshot.keyMetrics) : "",
        data.companySnapshot?.recentSignals?.length ? h3("Recent Signals") + ul(data.companySnapshot.recentSignals) : "",
        data.companySnapshot?.risksAndUnknowns?.length ? h3("Risks & Unknowns") + ul(data.companySnapshot.risksAndUnknowns) : "",
        h2("2. Role Intelligence"),
        `<p><strong>Core Mandate:</strong> ${data.roleIntelligence?.coreMandate || ""}</p>`,
        data.roleIntelligence?.success90Days?.length ? h3("90-Day Success Metrics") + ul(data.roleIntelligence.success90Days) : "",
        data.roleIntelligence?.commonFailureModes?.length ? h3("Common Failure Modes") + ul(data.roleIntelligence.commonFailureModes) : "",
        h2("3. Round Expectations"),
        `<p>${data.roundExpectations?.overview || ""}</p>`,
        data.roundExpectations?.whatTripsPeopleUp?.length ? h3("What Trips People Up") + ul(data.roundExpectations.whatTripsPeopleUp) : "",
        data.roundExpectations?.howToShowUpStrong?.length ? h3("How to Show Up Strong") + ul(data.roundExpectations.howToShowUpStrong) : "",
        h2("4. Questions to Ask"),
        data.questionsToAsk?.length ? ul(data.questionsToAsk) : "",
      ].join("");

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Your Interview Prep Brief",
        html: `<div style="font-family:sans-serif;max-width:600px;margin:auto">${sections}</div>`,
      });

      const emailUser = getSessionUser(req);
      if (emailUser) {
        getPostHogClient()?.capture({ distinctId: emailUser.id, event: "email_sent", properties: { user_id: emailUser.id } });
      }

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to send email" });
    }
  });

  // Public brief API — no auth required
  app.get("/api/public/briefs/:id", (req, res) => {
    const brief = getPublicBrief(req.params.id);
    if (!brief) return res.status(404).json({ error: "Not found" });
    res.json({ ...brief, brief_data: JSON.parse(brief.brief_data) });
  });

  // Toggle brief public/private
  app.post("/api/briefs/:id/share", (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    const { isPublic } = req.body as { isPublic: boolean };
    const changed = setBriefPublic(req.params.id, user.id, isPublic);
    if (!changed) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, isPublic });
  });

  // Briefs history — authenticated users only
  app.get("/api/briefs", (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    const briefs = getBriefsByUser(user.id);
    res.json({ briefs });
  });

  app.get("/api/briefs/:id", (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    const brief = getBriefById(req.params.id, user.id);
    if (!brief) return res.status(404).json({ error: "Not found" });
    res.json({ ...brief, brief_data: JSON.parse(brief.brief_data) });
  });

  // Helper: inject dynamic OG meta tags into an HTML template for /b/:id brief share pages
  function injectBriefOgTags(html: string, briefId: string, appUrl: string): string {
    const meta = getPublicBriefMeta(briefId);
    if (!meta) return html;

    const title = `${meta.company_name} — ${meta.job_title} Interview Prep | PrepFile`;
    const description = `AI-generated interview prep brief for ${meta.job_title} at ${meta.company_name}. Company intel, role expectations, and round-specific strategy.`;
    const url = `${appUrl}/b/${briefId}`;

    return html
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/g, `$1${title}$2`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/g, `$1${description}$2`)
      .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/g, `$1${url}$2`)
      .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/g, `$1${title}$2`)
      .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/g, `$1${description}$2`)
      .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/g, `$1${url}$2`);
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    // Intercept /b/:id to inject dynamic OG tags before Vite serves the SPA
    app.get("/b/:id", async (req, res, next) => {
      try {
        const template = await vite.transformIndexHtml(req.url, (await import("fs")).readFileSync("index.html", "utf-8"));
        const html = injectBriefOgTags(template, req.params.id, APP_URL);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch {
        next();
      }
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));

    // Intercept /b/:id to inject dynamic OG tags before catch-all
    app.get("/b/:id", (req, res) => {
      const fs = require("fs") as typeof import("fs");
      const indexPath = (require("path") as typeof import("path")).join(process.cwd(), "dist", "index.html");
      const template = fs.readFileSync(indexPath, "utf-8");
      const html = injectBriefOgTags(template, req.params.id, APP_URL);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    });

    app.get("*", (_req, res) => {
      res.sendFile("dist/index.html", { root: process.cwd() });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
