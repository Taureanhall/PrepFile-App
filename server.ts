import "dotenv/config";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { generateBrief, generateQuickBrief, generateBridgingAnalysis } from "./src/lib/generateBrief.js";
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
  getProSubscriberCount,
  applyFoundingMemberBonus,
  getBriefCountForUser,
  hasReceivedOnboardingEmail,
  markOnboardingEmailSent,
  upsertGoogleUser,
  getPublicBriefMeta,
  getPublicBrief,
  setBriefPublic,
  getAdminMetrics,
  getOrCreateUserByEmail,
  createOtpCode,
  verifyOtpCode,
  getTotalBriefCount,
  createTeam,
  getTeamById,
  getTeamByAdminUser,
  activateTeam,
  addTeamMember,
  getTeamUsage,
  getTeamByCheckoutSession,
  getTeamByMember,
  updateTeamBranding,
  queueEmail,
} from "./src/lib/db.js";
import { getPostHogClient } from "./src/lib/posthog.js";
import { getStripe, PRICES, PACK_BRIEF_COUNT, TEAM_SEAT_PRICE_CENTS, TEAM_MIN_SEATS } from "./src/lib/stripe.js";
import { createLSCheckoutUrl, verifyLSWebhookSignature, mapLSStatusToPlan } from "./src/lib/lemonsqueezy.js";
import { runNurtureEmailBatch } from "./src/lib/nurture.js";
import { runWelcomeDripBatch } from "./src/lib/welcome-drip.js";
import { processDripQueue } from "./src/lib/email-drip.js";
import {
  sendWelcomeEmailImmediate,
  runWelcomeSequenceBatch,
  runReengagementBatch,
  parseUnsubscribeToken,
  makeUnsubscribeToken,
  sendUpgradeWelcomeEmail,
  sendDunningEmail,
} from "./src/lib/email-sequences.js";
import { subjectA as postBriefSubject, buildPostBriefUpgradeHtml } from "./src/lib/emails/post-brief-upgrade.js";
import { sendPhWelcomeImmediate, sendPhFreeLimitImmediate, runPhEmailBatch } from "./src/lib/ph-emails.js";
import { setEmailUnsubscribed, getUserIdByEmail, getUserEmailById, getReferralCount, saveB2bLead, getB2bLeads, isProductHuntUser } from "./src/lib/db.js";
import { OAuth2Client } from "google-auth-library";

const RATE_LIMIT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000; // 1 week
const RATE_LIMIT_MAX = 3; // 3 briefs per week for free tier (legacy, used for quick briefs)
const QUICK_BRIEF_LIMIT = 3; // 3 quick briefs per week for free tier
const FULL_BRIEF_LIMIT = 1; // 1 full brief per week for free tier

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
      let userId = session.metadata?.user_id;
      const product = session.metadata?.product as "pro" | "pack" | "team";
      if (!product) return res.sendStatus(200);

      // Team plan activation
      if (product === "team") {
        const team = getTeamByCheckoutSession(session.id);
        if (team) {
          activateTeam(team.id, session.customer);
          console.log(`[STRIPE] Team ${team.id} activated (${team.seat_count} seats)`);
        }
        return res.sendStatus(200);
      }

      // If no user_id (unauthenticated checkout), create or find user by Stripe customer email
      if (!userId) {
        const email = session.customer_details?.email || session.customer_email;
        if (!email) {
          console.error("[STRIPE] checkout.session.completed with no user_id and no email");
          return res.sendStatus(200);
        }
        userId = getOrCreateUserByEmail(email);
        console.log(`[STRIPE] Created/found user ${userId} for unauthenticated checkout (${email})`);
      }

      if (product === "pro") {
        upsertSubscription(userId, "pro", session.customer, session.subscription);
        // Founding member bonus: first 50 Pro subscribers get 5 bonus briefs
        const FOUNDING_MEMBER_LIMIT = 50;
        const FOUNDING_BONUS_BRIEFS = 5;
        const proCount = getProSubscriberCount();
        if (proCount <= FOUNDING_MEMBER_LIMIT) {
          applyFoundingMemberBonus(userId, FOUNDING_BONUS_BRIEFS);
          console.log(`[STRIPE] Founding member bonus applied to user ${userId} (Pro subscriber #${proCount})`);
        }
      } else if (product === "pack") {
        upsertSubscription(userId, "pack", session.customer, null, PACK_BRIEF_COUNT);
      }

      getPostHogClient()?.capture({
        distinctId: userId,
        event: "payment_completed",
        properties: {
          plan: product,
          stripe_customer_id: session.customer,
          amount_total: session.amount_total,
        },
      });

      // Send upgrade welcome email (fire-and-forget)
      const userEmail = getUserEmailById(userId);
      if (userEmail) {
        const appUrl = process.env.APP_URL || "https://prepfile.work";
        sendUpgradeWelcomeEmail(userId, userEmail, appUrl, FROM_EMAIL).catch(
          (err) => console.error("[STRIPE] upgrade welcome email error:", err)
        );
        // PH users also get a PH-specific upgrade welcome (+24h)
        if (isProductHuntUser(userId)) {
          queueEmail(userId, "ph_upgrade_welcome", new Date(Date.now() + 24 * 60 * 60 * 1000));
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as any;
      // Find user by stripe_customer_id and downgrade
      const db = (await import("./src/lib/db.js")).default;
      const row = db.prepare("SELECT user_id FROM subscriptions WHERE stripe_customer_id = ?").get(sub.customer) as any;
      if (row) {
        upsertSubscription(row.user_id, "free", sub.customer, null, 0);
        console.log(`[STRIPE] Subscription cancelled — user ${row.user_id} downgraded to free`);
      }
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as any;
      // Look up user by stripe_customer_id and send dunning email
      const db = (await import("./src/lib/db.js")).default;
      const row = db.prepare("SELECT user_id FROM subscriptions WHERE stripe_customer_id = ?").get(invoice.customer) as any;
      if (row) {
        const userEmail = getUserEmailById(row.user_id);
        if (userEmail) {
          const appUrl = process.env.APP_URL || "https://prepfile.work";
          sendDunningEmail(row.user_id, userEmail, appUrl, FROM_EMAIL).catch(
            (err) => console.error("[STRIPE] dunning email error:", err)
          );
        }
        console.log(`[STRIPE] invoice.payment_failed for customer ${invoice.customer} — dunning email queued`);
      }
    }

    res.sendStatus(200);
  });

  // Lemon Squeezy webhook — raw body required, before express.json()
  app.post("/api/lemonsqueezy/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["x-signature"] as string;
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!sig || !webhookSecret) return res.status(400).send("Missing signature or secret");

    if (!verifyLSWebhookSignature(req.body, sig, webhookSecret)) {
      console.error("[LS] Webhook signature verification failed");
      return res.status(400).send("Invalid signature");
    }

    let event: any;
    try {
      event = JSON.parse(req.body.toString());
    } catch {
      return res.status(400).send("Invalid JSON");
    }

    const eventName: string = event.meta?.event_name || "";
    const data = event.data?.attributes || {};
    const customData = event.meta?.custom_data || {};
    const userId: string = customData.user_id || "";
    const product: string = customData.product || "pro";

    console.log(`[LS] Webhook received: ${eventName}`);

    if (eventName === "subscription_created") {
      if (!userId) {
        // Try to find user by email from subscription
        const email = data.user_email;
        if (!email) {
          console.error("[LS] subscription_created with no user_id and no email");
          return res.sendStatus(200);
        }
        const foundUserId = getOrCreateUserByEmail(email);
        upsertSubscription(foundUserId, "pro", String(data.customer_id), String(event.data?.id));
        console.log(`[LS] Created/found user ${foundUserId} for unauthenticated LS subscription`);
      } else {
        upsertSubscription(userId, "pro", String(data.customer_id), String(event.data?.id));
      }

      getPostHogClient()?.capture({
        distinctId: userId || data.user_email,
        event: "payment_completed",
        properties: { plan: "pro", ls_customer_id: data.customer_id, amount_total: data.total },
      });

      const userEmail = userId ? getUserEmailById(userId) : data.user_email;
      if (userEmail) {
        const appUrl = process.env.APP_URL || "https://prepfile.work";
        sendUpgradeWelcomeEmail(userId || userEmail, userEmail, appUrl, FROM_EMAIL).catch(
          (err) => console.error("[LS] upgrade welcome email error:", err)
        );
      }
    }

    if (eventName === "order_created" && product === "pack") {
      // One-time Interview Pack purchase
      const orderUserId = userId || "";
      if (!orderUserId) {
        const email = data.user_email;
        if (!email) {
          console.error("[LS] order_created (pack) with no user_id and no email");
          return res.sendStatus(200);
        }
        const foundUserId = getOrCreateUserByEmail(email);
        upsertSubscription(foundUserId, "pack", String(data.customer_id), null, PACK_BRIEF_COUNT);
        getPostHogClient()?.capture({
          distinctId: foundUserId,
          event: "payment_completed",
          properties: { plan: "pack", ls_customer_id: data.customer_id, amount_total: data.total },
        });
      } else {
        upsertSubscription(orderUserId, "pack", String(data.customer_id), null, PACK_BRIEF_COUNT);
        getPostHogClient()?.capture({
          distinctId: orderUserId,
          event: "payment_completed",
          properties: { plan: "pack", ls_customer_id: data.customer_id, amount_total: data.total },
        });
      }
    }

    if (eventName === "subscription_updated" || eventName === "subscription_cancelled") {
      const status = data.status as string;
      const planStatus = mapLSStatusToPlan(status);
      const db = (await import("./src/lib/db.js")).default;
      const subRow = db.prepare("SELECT user_id FROM subscriptions WHERE stripe_subscription_id = ?").get(String(event.data?.id)) as any;
      if (subRow) {
        if (planStatus === "cancelled") {
          upsertSubscription(subRow.user_id, "free", String(data.customer_id), null, 0);
          console.log(`[LS] Subscription cancelled — user ${subRow.user_id} downgraded to free`);
        } else if (planStatus) {
          console.log(`[LS] Subscription updated — user ${subRow.user_id} status: ${status}`);
        }
      }
    }

    if (eventName === "subscription_payment_failed") {
      const db = (await import("./src/lib/db.js")).default;
      const subRow = db.prepare("SELECT user_id FROM subscriptions WHERE stripe_subscription_id = ?").get(String(event.data?.id)) as any;
      if (subRow) {
        const userEmail = getUserEmailById(subRow.user_id);
        if (userEmail) {
          const appUrl = process.env.APP_URL || "https://prepfile.work";
          sendDunningEmail(subRow.user_id, userEmail, appUrl, FROM_EMAIL).catch(
            (err) => console.error("[LS] dunning email error:", err)
          );
        }
        console.log(`[LS] subscription_payment_failed for user ${subRow.user_id} — dunning email queued`);
      }
    }

    res.sendStatus(200);
  });

  // Resume enhancement — must be registered with route-scoped multer BEFORE express.json()
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
      const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      const allowedExts = [".pdf", ".docx"];
      const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf("."));
      if (allowed.includes(file.mimetype) && allowedExts.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error("Only PDF and DOCX files are supported"));
      }
    },
  });

  app.post("/api/enhance-brief", cookieParser(), (req, res) => {
    upload.single("resume")(req, res, async (err) => {
      if (err) {
        if ((err as any).code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({ error: "File too large. Maximum size is 5MB." });
        }
        return res.status(400).json({ error: err.message || "Invalid file" });
      }

      try {
        const user = getSessionUser(req);
        if (!user) return res.status(401).json({ error: "Authentication required" });

        // Resume match is Pro/Pack only
        const userSub = getUserSubscription(user.id);
        if (userSub.plan === "free") return res.status(403).json({ error: "pro_required" });

        if (!req.body?.briefData) return res.status(400).json({ error: "briefData is required" });
        if (!req.file) return res.status(400).json({ error: "resume file is required" });

        let brief: any;
        try {
          brief = JSON.parse(req.body.briefData);
        } catch {
          return res.status(400).json({ error: "briefData must be valid JSON" });
        }

        // Extract resume text
        let resumeText: string;
        if (req.file.mimetype === "application/pdf") {
          const pdfParseModule = await import("pdf-parse");
          const pdfParse = (pdfParseModule as any).default ?? pdfParseModule;
          const result = await pdfParse(req.file.buffer);
          resumeText = result.text;
        } else {
          const mammoth = await import("mammoth");
          const result = await mammoth.extractRawText({ buffer: req.file.buffer });
          resumeText = result.value;
        }

        if (!resumeText?.trim()) {
          return res.status(400).json({ error: "Could not extract text from resume" });
        }

        const bridgingAnalysis = await generateBridgingAnalysis(brief, resumeText);

        getPostHogClient()?.capture({
          distinctId: user.id,
          event: "brief_enhanced",
          properties: {
            authenticated: true,
            company: brief.companySnapshot?.overview ? "present" : "",
            job_title: brief.roleIntelligence?.coreMandate || "",
          },
        });

        res.json(bridgingAnalysis);
      } catch (innerErr: any) {
        console.error("enhance-brief error:", innerErr);
        res.status(500).json({ error: innerErr.message || "Failed to enhance brief" });
      }
    });
  });

  app.use(express.json());
  app.use(cookieParser());

  // Referral source tracking — set prepfile_ref cookie from ?ref= or ?utm_source=
  app.use((req, res, next) => {
    const ref = (req.query.ref || req.query.utm_source) as string | undefined;
    if (ref && typeof ref === "string" && !req.cookies?.prepfile_ref) {
      res.cookie("prepfile_ref", ref.slice(0, 64), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }
    next();
  });

  // API routes FIRST
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Brand asset extraction — used by SEO pages and briefs
  app.get("/api/brand/:company", async (req, res) => {
    try {
      const { extractCompanyBrand } = await import("./src/lib/extractBrand.js");
      const assets = await extractCompanyBrand(req.params.company);
      res.json(assets);
    } catch {
      res.json({});
    }
  });

  // Public stats — no auth required
  app.get("/api/stats", (_req, res) => {
    const totalBriefs = getTotalBriefCount();
    res.json({ totalBriefs });
  });

  // Founding member spots remaining — public, no auth required
  app.get("/api/founding-members/remaining", (_req, res) => {
    try {
      const TOTAL = 50;
      const taken = getProSubscriberCount();
      const remaining = Math.max(0, TOTAL - taken);
      res.json({ total: TOTAL, taken, remaining });
    } catch (err: any) {
      console.error("[founding-members/remaining] Error:", err);
      res.status(500).json({ error: "Failed to get founding member count" });
    }
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

  // Auth: request email OTP code
  app.post("/api/auth/request-otp", async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limit: 5 OTP requests per hour per email
    if (!checkAndIncrementRateLimit(`otp:${normalizedEmail}`, 5, 60 * 60 * 1000)) {
      return res.status(429).json({ error: "Too many requests. Please wait a few minutes." });
    }

    try {
      const code = createOtpCode(normalizedEmail);

      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error: sendError } = await resend.emails.send({
        from: FROM_EMAIL,
        replyTo: "support@prepfile.work",
        to: normalizedEmail,
        subject: `Your PrepFile code: ${code}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
            <h2 style="font-size:20px;font-weight:700;color:#18181b;margin-bottom:8px">Your verification code</h2>
            <p style="color:#52525b;margin-bottom:24px">Enter this code to sign in to PrepFile. It expires in 10 minutes.</p>
            <div style="background:#f4f4f5;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
              <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#18181b">${code}</span>
            </div>
            <p style="color:#a1a1aa;font-size:12px">If you didn't request this, you can ignore this email.</p>
          </div>
        `,
      });

      if (sendError) {
        console.error("OTP Resend error:", sendError);
        return res.status(500).json({ error: "Failed to send verification code" });
      }

      console.log("OTP email sent:", data?.id, "to:", normalizedEmail);
      res.json({ success: true });
    } catch (err: any) {
      console.error("OTP email error:", err);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  });

  // Auth: verify OTP code → set session cookie → return user
  app.post("/api/auth/verify-otp", (req, res) => {
    const { email, code } = req.body;
    if (!email || !code || typeof email !== "string" || typeof code !== "string") {
      return res.status(400).json({ error: "Email and code required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const referralSource = req.cookies?.prepfile_ref as string | undefined;
    const result = verifyOtpCode(normalizedEmail, code.trim(), referralSource);

    if (!result.sessionToken) {
      return res.status(400).json({ error: result.error });
    }

    const signedInUser = getUserBySession(result.sessionToken);
    if (signedInUser) {
      getPostHogClient()?.capture({ distinctId: signedInUser.id, event: "user_signed_in", properties: { user_id: signedInUser.id, method: "email_otp" } });
      sendWelcomeEmailImmediate(signedInUser.id, signedInUser.email, APP_URL, FROM_EMAIL).catch(() => {});
      // Queue welcome drip email for new users
      if (getBriefCountForUser(signedInUser.id) === 0) queueEmail(signedInUser.id, "welcome", new Date());
    }

    res.cookie("session", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.clearCookie("free_brief_used");
    res.json({ success: true, user: signedInUser });
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
      // Fire welcome-1 for new users (idempotent — skips if already sent)
      sendWelcomeEmailImmediate(signedInUser.id, signedInUser.email, APP_URL, FROM_EMAIL).catch(() => {});
      // Queue welcome drip email for new users
      if (getBriefCountForUser(signedInUser.id) === 0) queueEmail(signedInUser.id, "welcome", new Date());
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

  // Capture email from skip-for-now flow (no session created, just stores the email for nurture)
  app.post("/api/auth/capture-email", (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    try {
      getOrCreateUserByEmail(email);
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to save email" });
    }
  });

  // Email unsubscribe — linked from all marketing emails
  app.get("/api/unsubscribe", (req, res) => {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      return res.status(400).send("Invalid unsubscribe link.");
    }
    const userId = parseUnsubscribeToken(token);
    if (!userId) {
      return res.status(400).send("Invalid or expired unsubscribe link.");
    }
    try {
      setEmailUnsubscribed(userId);
    } catch (err) {
      console.error("[unsubscribe] DB error:", err);
    }
    res.status(200).send(
      `<html><body style="font-family:sans-serif;max-width:480px;margin:80px auto;text-align:center">` +
      `<h2 style="color:#18181b">You've been unsubscribed</h2>` +
      `<p style="color:#52525b">You won't receive any more marketing emails from PrepFile.</p>` +
      `<a href="/" style="color:#18181b">Return to PrepFile →</a>` +
      `</body></html>`
    );
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

      const referralSource = req.cookies?.prepfile_ref as string | undefined;
      const sessionToken = upsertGoogleUser(payload.sub, payload.email, referralSource);
      const signedInUser = getUserBySession(sessionToken);
      if (signedInUser) {
        getPostHogClient()?.capture({ distinctId: signedInUser.id, event: "user_signed_in", properties: { user_id: signedInUser.id, method: "google", referral_source: referralSource || "direct" } });
        // Fire welcome email for new users (idempotent — skips if already sent)
        // PH users get a PH-specific welcome; everyone else gets the generic one
        if (referralSource === "producthunt") {
          sendPhWelcomeImmediate(signedInUser.id, signedInUser.email, APP_URL, FROM_EMAIL).catch(() => {});
        } else {
          sendWelcomeEmailImmediate(signedInUser.id, signedInUser.email, APP_URL, FROM_EMAIL).catch(() => {});
        }
        // Queue welcome drip email for new users
        const isNewSignup = getBriefCountForUser(signedInUser.id) === 0;
        if (isNewSignup) queueEmail(signedInUser.id, "welcome", new Date());
      }

      res.cookie("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.clearCookie("free_brief_used");
      const isNewUser = signedInUser ? getBriefCountForUser(signedInUser.id) === 0 : false;
      res.redirect(isNewUser ? "/?welcome=1&auth_method=google" : "/?auth_method=google");
    } catch (err: any) {
      console.error("Google OAuth error:", err);
      res.status(500).send("Google sign-in failed. Please try again.");
    }
  });

  // Referral count for current user
  app.get("/api/referral-count", (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    const appUrl = process.env.APP_URL || "https://prepfile.work";
    res.json({ count: getReferralCount(user.id), referralLink: `${appUrl}/?ref=${user.id}` });
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
      free_briefs_used: sub.plan === "free" ? getBriefCountForUser(user.id) : undefined,
    });
  });

  // Checkout session — routes to Lemon Squeezy or Stripe based on PAYMENT_PROVIDER env var
  // PAYMENT_PROVIDER=lemonsqueezy (default when set) | stripe
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    const user = getSessionUser(req);

    const { product } = req.body as { product: "pro" | "pack" };
    if (product !== "pro" && product !== "pack") {
      return res.status(400).json({ error: "Invalid product" });
    }

    const provider = process.env.PAYMENT_PROVIDER || "stripe";

    try {
      if (provider === "lemonsqueezy") {
        const url = await createLSCheckoutUrl(product, {
          email: user?.email,
          userId: user?.id,
          successUrl: `${APP_URL}/?payment=success`,
        });
        return res.json({ url });
      }

      // Stripe path (default when PAYMENT_PROVIDER=stripe or not set)
      const stripe = getStripe();
      const priceConfig = PRICES[product];
      const isSubscription = product === "pro";

      const sessionParams: any = {
        mode: isSubscription ? "subscription" : "payment",
        payment_method_types: ["card"],
        line_items: [{ price_data: priceConfig, quantity: 1 }],
        success_url: `${APP_URL}/?payment=success`,
        cancel_url: `${APP_URL}/?payment=cancel`,
        metadata: { product },
      };

      if (user) {
        sessionParams.metadata.user_id = user.id;
        sessionParams.customer_email = user.email;
        const sub = getUserSubscription(user.id);
        if (sub.stripe_customer_id) {
          delete sessionParams.customer_email;
          sessionParams.customer = sub.stripe_customer_id;
        }
      }

      const session = await stripe.checkout.sessions.create(sessionParams);
      res.json({ url: session.url });
    } catch (err: any) {
      console.error("Checkout session error:", err);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Customer portal — routes to Lemon Squeezy or Stripe based on PAYMENT_PROVIDER
  const handlePortalSession = async (req: express.Request, res: express.Response) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    const sub = getUserSubscription(user.id);
    if (!sub.stripe_customer_id) return res.status(400).json({ error: "No active subscription" });

    const provider = process.env.PAYMENT_PROVIDER || "stripe";

    try {
      if (provider === "lemonsqueezy") {
        // Lemon Squeezy customer portal: direct user to LS subscription management
        // stripe_subscription_id stores the LS subscription ID when using LS
        const lsSubId = sub.stripe_subscription_id;
        if (lsSubId) {
          return res.json({ url: `https://app.lemonsqueezy.com/my-orders/${lsSubId}` });
        }
        // Fallback: LS customer portal by customer ID
        return res.json({ url: "https://app.lemonsqueezy.com/my-orders" });
      }

      // Stripe path
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

  // --- Team / Bulk Plan ---

  // POST /api/teams/create — authenticated admin creates a team + starts Stripe checkout
  app.post("/api/teams/create", async (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Authentication required" });

    const { name, seatCount } = req.body as { name: string; seatCount: number };
    if (!name?.trim()) return res.status(400).json({ error: "Team name is required" });
    const seats = Number(seatCount);
    if (!Number.isInteger(seats) || seats < TEAM_MIN_SEATS) {
      return res.status(400).json({ error: `Minimum ${TEAM_MIN_SEATS} seats required` });
    }

    try {
      const stripe = getStripe();
      const totalCents = seats * TEAM_SEAT_PRICE_CENTS;

      // Create a placeholder Stripe session ID for the team record — we get the real ID from Stripe
      const sessionParams: any = {
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            unit_amount: TEAM_SEAT_PRICE_CENTS,
            product_data: {
              name: `PrepFile Team Plan — ${seats} seats`,
              description: `Bulk interview prep access for ${seats} students ($5/seat)`,
            },
          },
          quantity: seats,
        }],
        success_url: `${APP_URL}/team-admin?payment=success`,
        cancel_url: `${APP_URL}/team-admin?payment=cancel`,
        metadata: { product: "team", user_id: user.id, seat_count: String(seats) },
        customer_email: user.email,
      };

      const stripeSession = await stripe.checkout.sessions.create(sessionParams);
      const team = createTeam(user.id, name.trim(), seats, stripeSession.id);

      res.json({ url: stripeSession.url, teamId: team.id, totalCents });
    } catch (err: any) {
      console.error("[TEAMS] create error:", err);
      res.status(500).json({ error: "Failed to create team checkout" });
    }
  });

  // GET /api/teams/mine — returns the admin's team (if any)
  app.get("/api/teams/mine", (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Authentication required" });
    const team = getTeamByAdminUser(user.id);
    res.json({ team });
  });

  // GET /api/teams/:id/usage — returns team members with brief usage (admin only)
  app.get("/api/teams/:id/usage", (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Authentication required" });

    const team = getTeamById(req.params.id);
    if (!team) return res.status(404).json({ error: "Team not found" });
    if (team.admin_user_id !== user.id) return res.status(403).json({ error: "Forbidden" });

    const members = getTeamUsage(team.id);
    res.json({ team, members });
  });

  // POST /api/teams/:id/members — add member emails (admin only)
  app.post("/api/teams/:id/members", (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Authentication required" });

    const team = getTeamById(req.params.id);
    if (!team) return res.status(404).json({ error: "Team not found" });
    if (team.admin_user_id !== user.id) return res.status(403).json({ error: "Forbidden" });
    if (team.status !== "active") return res.status(402).json({ error: "Team is not yet active. Complete payment first." });

    const { emails } = req.body as { emails: string[] };
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: "emails array is required" });
    }

    const members = getTeamUsage(team.id);
    if (members.length + emails.length > team.seat_count) {
      return res.status(400).json({ error: `Would exceed seat count (${team.seat_count} seats)` });
    }

    for (const email of emails) {
      if (typeof email === "string" && email.includes("@")) {
        addTeamMember(team.id, email);
      }
    }

    res.json({ added: emails.length });
  });

  // PATCH /api/teams/:id/branding — admin sets agency branding (name, logo, enabled)
  app.patch("/api/teams/:id/branding", (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Authentication required" });

    const team = getTeamById(req.params.id);
    if (!team) return res.status(404).json({ error: "Team not found" });
    if (team.admin_user_id !== user.id) return res.status(403).json({ error: "Forbidden" });

    const { agencyName, agencyLogoUrl, brandingEnabled } = req.body as {
      agencyName?: string;
      agencyLogoUrl?: string;
      brandingEnabled?: boolean;
    };

    updateTeamBranding(
      team.id,
      typeof agencyName === "string" ? agencyName.trim() || null : team.agency_name,
      typeof agencyLogoUrl === "string" ? agencyLogoUrl.trim() || null : team.agency_logo_url,
      typeof brandingEnabled === "boolean" ? brandingEnabled : !!team.branding_enabled
    );

    res.json({ ok: true });
  });

  // Extract company + title from JD using LLM (fast, cheap)
  app.post("/api/extract-jd", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string" || text.trim().length < 30) {
        return res.json({ company: null, title: null });
      }

      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("[extract-jd] No API key found");
        return res.json({ company: null, title: null });
      }

      const ai = new GoogleGenAI({ apiKey });

      const snippet = text.slice(0, 8000);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Extract the company name and job title from this job description. Return ONLY valid JSON: {"company": "..." , "title": "..."}\nUse null for any field you cannot confidently determine. For company, identify the hiring company (not the recruiting agency). For title, use the exact job title as stated.\n\nJob description:\n${snippet}`,
        config: { responseMimeType: "application/json" },
      });

      const raw = response.text?.trim() || "";
      const parsed = JSON.parse(raw);
      res.json({
        company: typeof parsed.company === "string" ? parsed.company.slice(0, 100) : null,
        title: typeof parsed.title === "string" ? parsed.title.slice(0, 100) : null,
      });
    } catch (err) {
      console.error("[extract-jd] Error:", err);
      res.json({ company: null, title: null });
    }
  });

  // Generate brief — authenticated OR 1 free brief via cookie
  app.post("/api/generate-brief", async (req, res) => {
    try {
      const bypassKey = process.env.BYPASS_KEY;
      const clientKey = req.headers["x-bypass-key"];
      const isBypassed = bypassKey && clientKey === bypassKey;

      const user = getSessionUser(req);

      // Determine brief tier (server-authoritative, never trust client)
      let briefTier: "free" | "pro" = "free";
      if (isBypassed) {
        briefTier = "pro";
      } else if (user) {
        const subForTier = getUserSubscription(user.id);
        if (subForTier.plan === "pro" || subForTier.plan === "pack") briefTier = "pro";
      }

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
            // Free tier — hard limit of 3 briefs lifetime
            if (getBriefCountForUser(user.id) >= 3) {
              return res.status(402).json({ error: "free_brief_limit", message: "You've used all 3 free briefs. Upgrade to Pro for unlimited full briefs." });
            }
          }
        }
      }

      const { companyName, jobTitle, jobDescription, round, familiarity, timeToPrep, biggestGap, referralSource } = req.body;

      const VALID_ROUNDS = ["First screen", "Hiring manager", "Panel", "Final", "Not sure"];
      const VALID_FAMILIARITY = ["Never heard of them", "Know of them", "Know them well", "Used their product"];
      const VALID_TIME_TO_PREP = ["Under 1 hour", "1-3 hours", "Full day", "1+ days"];
      const VALID_BIGGEST_GAP = ["Industry knowledge", "Technical skills", "Seniority jump", "Culture fit", "No obvious gap"];

      if (!companyName || typeof companyName !== "string" || companyName.trim().length === 0) {
        return res.status(400).json({ error: "companyName is required" });
      }
      if (!jobTitle || typeof jobTitle !== "string" || jobTitle.trim().length === 0) {
        return res.status(400).json({ error: "jobTitle is required" });
      }
      if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length < 10) {
        return res.status(400).json({ error: "jobDescription must be at least 10 characters" });
      }
      if (jobDescription.length > 10000) {
        return res.status(400).json({ error: "jobDescription exceeds maximum length" });
      }
      if (round && !VALID_ROUNDS.includes(round)) {
        return res.status(400).json({ error: "Invalid round value" });
      }
      if (familiarity && !VALID_FAMILIARITY.includes(familiarity)) {
        return res.status(400).json({ error: "Invalid familiarity value" });
      }
      if (timeToPrep && !VALID_TIME_TO_PREP.includes(timeToPrep)) {
        return res.status(400).json({ error: "Invalid timeToPrep value" });
      }
      if (biggestGap && !VALID_BIGGEST_GAP.includes(biggestGap)) {
        return res.status(400).json({ error: "Invalid biggestGap value" });
      }

      // Run brief generation and brand extraction in parallel
      const { extractCompanyBrand } = await import("./src/lib/extractBrand.js");
      const [data, brandAssets] = await Promise.all([
        generateBrief(req.body, briefTier),
        extractCompanyBrand(req.body.companyName || ""),
      ]);

      // Attach brand assets to brief data if extraction returned anything
      if (brandAssets.logoUrl || brandAssets.primaryColor) {
        (data as any).brandAssets = brandAssets;
      }

      const refSource = (typeof referralSource === "string" && referralSource.trim()) ? referralSource.trim() : "direct";
      getPostHogClient()?.capture({
        distinctId: user ? user.id : `anon:${req.ip || "unknown"}`,
        event: "brief_generated",
        properties: {
          company: req.body.companyName || "",
          job_title: req.body.jobTitle || "",
          round: req.body.round || "",
          authenticated: !!user,
          referral_source: refSource,
        },
      });

      // Persist brief for authenticated users
      let savedBriefId: string | undefined;
      if (user) {
        try {
          const briefId = saveBrief(user.id, req.body.companyName || "", req.body.jobTitle || "", data);
          savedBriefId = briefId;

          // Queue drip nudges after brief generation (free users only)
          const briefCount = getBriefCountForUser(user.id);
          const sub = getUserSubscription(user.id);
          if (sub.plan === "free") {
            const now = new Date();
            queueEmail(user.id, "nudge_24h", new Date(now.getTime() + 24 * 60 * 60 * 1000));
            queueEmail(user.id, "nudge_72h", new Date(now.getTime() + 72 * 60 * 60 * 1000));
            if (briefCount >= 3) {
              queueEmail(user.id, "upgrade_prompt", now);
              // PH users get a PH-specific free-limit email
              if (isProductHuntUser(user.id)) {
                sendPhFreeLimitImmediate(user.id, user.email, APP_URL, FROM_EMAIL).catch(() => {});
              }
            }
          }

          // Send post-brief upgrade email after first brief (free users only)
          if (briefCount === 1 && !hasReceivedOnboardingEmail(user.id)) {
            try {
              const sub = getUserSubscription(user.id);
              if (sub.plan === "free") {
                const { Resend } = await import("resend");
                const resend = new Resend(process.env.RESEND_API_KEY);
                const unsubToken = makeUnsubscribeToken(user.id);
                const unsubscribeUrl = `${APP_URL}/api/unsubscribe?token=${unsubToken}`;

                await resend.emails.send({
                  from: FROM_EMAIL,
                  to: user.email,
                  subject: postBriefSubject,
                  html: buildPostBriefUpgradeHtml(APP_URL, unsubscribeUrl),
                });
              }
              markOnboardingEmailSent(user.id);
            } catch (emailErr) {
              console.error("Failed to send post-brief upgrade email:", emailErr);
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

      // Include agency branding if user belongs to a team with branding enabled
      let agencyBranding: { agencyName: string; agencyLogoUrl?: string } | undefined;
      if (user) {
        const memberTeam = getTeamByMember(user.id);
        if (memberTeam && memberTeam.branding_enabled && memberTeam.agency_name) {
          agencyBranding = {
            agencyName: memberTeam.agency_name,
            ...(memberTeam.agency_logo_url ? { agencyLogoUrl: memberTeam.agency_logo_url } : {}),
          };
        }
      }

      res.json({ ...data, briefId: savedBriefId, agencyBranding });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to generate brief" });
    }
  });

  // Quick brief — concise output from company name + job title only (no JD)
  app.post("/api/generate-quick-brief", async (req, res) => {
    try {
      const bypassKey = process.env.BYPASS_KEY;
      const clientKey = req.headers["x-bypass-key"];
      const isBypassed = bypassKey && clientKey === bypassKey;

      const user = getSessionUser(req);

      if (!isBypassed) {
        if (!user) {
          if (req.cookies?.free_brief_used) {
            return res.status(401).json({ error: "free_brief_used", message: "Sign in to generate more briefs." });
          }
        } else {
          const sub = getUserSubscription(user.id);
          if (sub.plan === "pro") {
            // Unlimited
          } else if (sub.plan === "pack") {
            // Pack users get quick briefs for free (doesn't consume pack briefs)
          } else {
            // Free tier — 3 quick briefs per week
            if (!checkAndIncrementRateLimit(`user:${user.id}:quick`, QUICK_BRIEF_LIMIT, RATE_LIMIT_WINDOW_MS)) {
              return res.status(402).json({ error: "quick_limit_exceeded", message: "You've used your 3 quick briefs this week. Use your full brief with a job description, or upgrade for unlimited." });
            }
          }
        }
      }

      const { companyName, jobTitle } = req.body;
      if (!companyName || typeof companyName !== "string" || companyName.trim().length === 0) {
        return res.status(400).json({ error: "companyName is required" });
      }
      if (!jobTitle || typeof jobTitle !== "string" || jobTitle.trim().length === 0) {
        return res.status(400).json({ error: "jobTitle is required" });
      }

      const data = await generateQuickBrief({ companyName: companyName.trim(), jobTitle: jobTitle.trim() });

      let savedBriefId: string | undefined;
      if (user) {
        try {
          const briefId = saveBrief(user.id, companyName.trim(), jobTitle.trim(), data);
          savedBriefId = briefId;
        } catch (err) {
          console.error("Failed to save quick brief:", err);
        }
      }

      if (!user && !isBypassed) {
        res.cookie("free_brief_used", "1", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      res.json({ ...data, briefId: savedBriefId });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to generate quick brief" });
    }
  });

  app.post("/api/send-brief", async (req, res) => {
    try {
      const sendUser = getSessionUser(req);
      if (!sendUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

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

  // Cron endpoint — trigger email batches externally (e.g. Railway/Vercel cron)
  app.post("/api/cron/emails", async (req, res) => {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) return res.status(503).json({ error: "CRON_SECRET not configured" });
    const provided = req.headers["x-cron-secret"];
    if (provided !== cronSecret) return res.status(401).json({ error: "Unauthorized" });

    try {
      await runWelcomeDripBatch(APP_URL, FROM_EMAIL);
      await runWelcomeSequenceBatch(APP_URL, FROM_EMAIL);
      await runReengagementBatch(APP_URL, FROM_EMAIL);
      await runNurtureEmailBatch(APP_URL, FROM_EMAIL);
      await runPhEmailBatch(APP_URL, FROM_EMAIL);
      res.json({ ok: true });
    } catch (err) {
      console.error("[/api/cron/emails] error:", err);
      res.status(500).json({ error: "Internal error" });
    }
  });

  // Cron endpoint — process email drip queue (welcome, nudge_24h, nudge_72h, upgrade_prompt)
  app.post("/api/cron/send-emails", async (req, res) => {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) return res.status(503).json({ error: "CRON_SECRET not configured" });
    const provided = req.headers["x-cron-secret"];
    if (provided !== cronSecret) return res.status(401).json({ error: "Unauthorized" });

    try {
      const result = await processDripQueue(APP_URL, FROM_EMAIL);
      res.json({ ok: true, ...result });
    } catch (err) {
      console.error("[/api/cron/send-emails] error:", err);
      res.status(500).json({ error: "Internal error" });
    }
  });

  // POST /api/b2b-leads — capture B2B lead from landing pages
  app.post("/api/b2b-leads", async (req, res) => {
    const { name, email, organization, role, source } = req.body ?? {};

    // Basic validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Name is required." });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: "A valid work email is required." });
    }
    if (!organization || typeof organization !== "string" || organization.trim().length === 0) {
      return res.status(400).json({ error: "Organization name is required." });
    }
    const validRoles = ["career-services", "recruiting", "other"];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ error: "Please select a role." });
    }
    const validSources = ["career-services", "recruiting-agencies"];
    const leadSource = validSources.includes(source) ? source : "unknown";

    try {
      saveB2bLead(name.trim(), email.trim(), organization.trim(), role, leadSource);

      // Send admin notification email if ADMIN_NOTIFY_EMAIL is configured
      const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
      if (adminEmail && process.env.RESEND_API_KEY) {
        try {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: FROM_EMAIL,
            to: adminEmail,
            subject: `New B2B lead: ${name.trim()} — ${organization.trim()}`,
            html: `<p>New B2B lead from <strong>/for/${leadSource}</strong>:</p>
<ul>
  <li><strong>Name:</strong> ${name.trim()}</li>
  <li><strong>Email:</strong> ${email.trim()}</li>
  <li><strong>Organization:</strong> ${organization.trim()}</li>
  <li><strong>Role:</strong> ${role}</li>
</ul>`,
          });
        } catch (emailErr) {
          console.error("[b2b-leads] admin notification email failed:", emailErr);
          // Don't fail the request if the email fails
        }
      }

      res.json({ ok: true });
    } catch (err) {
      console.error("[b2b-leads] error:", err);
      res.status(500).json({ error: "Failed to save lead. Please try again." });
    }
  });

  // Admin dashboard — password-gated via ADMIN_PASSWORD env var (HTTP Basic Auth)
  app.get("/admin", (req, res) => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return res.status(503).send("Admin dashboard not configured (ADMIN_PASSWORD not set).");

    const authHeader = req.headers.authorization || "";
    const base64 = authHeader.startsWith("Basic ") ? authHeader.slice(6) : "";
    const [, password] = Buffer.from(base64, "base64").toString().split(":");

    if (password !== adminPassword) {
      res.setHeader("WWW-Authenticate", 'Basic realm="PrepFile Admin"');
      return res.status(401).send("Unauthorized");
    }

    const m = getAdminMetrics();
    const b2bLeads = getB2bLeads(50);
    const now = new Date().toUTCString();

    const distRows = m.briefsPerUserDistribution.map(r =>
      `<tr><td>${r.brief_count}</td><td>${r.user_count}</td></tr>`
    ).join("") || "<tr><td colspan='2'>No data</td></tr>";

    const esc = (s: string) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    const b2bLeadRows = b2bLeads.map(r => {
      const sourceBadge = r.source === "career-services"
        ? `<span style="background:#fef9c3;color:#854d0e;padding:2px 8px;border-radius:9999px;font-size:11px">career services</span>`
        : r.source === "recruiting-agencies"
        ? `<span style="background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:9999px;font-size:11px">recruiting</span>`
        : `<span style="color:#a1a1aa;font-size:11px">${esc(r.source)}</span>`;
      return `<tr><td>${esc(r.name)}</td><td>${esc(r.email)}</td><td>${esc(r.organization)}</td><td>${esc(r.role)}</td><td>${sourceBadge}</td><td>${esc(r.created_at)}</td></tr>`;
    }).join("") || "<tr><td colspan='6'>No leads yet</td></tr>";

    const signupRows = m.recentSignups.map(r => {
      const planBadge = r.plan === "pro"
        ? `<span style="background:#16a34a;color:#fff;padding:2px 8px;border-radius:9999px;font-size:11px">pro</span>`
        : r.plan === "pack"
        ? `<span style="background:#2563eb;color:#fff;padding:2px 8px;border-radius:9999px;font-size:11px">pack</span>`
        : `<span style="background:#e4e4e7;color:#52525b;padding:2px 8px;border-radius:9999px;font-size:11px">free</span>`;
      const refBadge = r.referral_source
        ? `<span style="background:#fef9c3;color:#854d0e;padding:2px 8px;border-radius:9999px;font-size:11px">${esc(r.referral_source)}</span>`
        : `<span style="color:#a1a1aa;font-size:11px">—</span>`;
      return `<tr><td>${esc(r.email)}</td><td>${planBadge}</td><td>${esc(r.created_at)}</td><td>${esc(String(r.brief_count))}</td><td>${refBadge}</td></tr>`;
    }).join("") || "<tr><td colspan='5'>No signups yet</td></tr>";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>PrepFile Admin</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;color:#18181b;padding:32px}
  h1{font-size:22px;font-weight:700;margin-bottom:4px}
  .sub{color:#71717a;font-size:13px;margin-bottom:32px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px;margin-bottom:32px}
  .card{background:#fff;border-radius:10px;padding:20px;border:1px solid #e4e4e7}
  .card .label{font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px}
  .card .value{font-size:28px;font-weight:700}
  .card .sub2{font-size:12px;color:#a1a1aa;margin-top:2px}
  section{background:#fff;border-radius:10px;border:1px solid #e4e4e7;padding:20px;margin-bottom:24px}
  section h2{font-size:15px;font-weight:600;margin-bottom:14px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{text-align:left;color:#71717a;font-weight:500;padding:6px 10px;border-bottom:1px solid #e4e4e7}
  td{padding:8px 10px;border-bottom:1px solid #f4f4f5;vertical-align:middle}
  tr:last-child td{border-bottom:none}
</style>
</head>
<body>
<h1>PrepFile Admin</h1>
<p class="sub">Last loaded: ${now}</p>

<div class="grid">
  <div class="card"><div class="label">Total Users</div><div class="value">${m.totalUsers}</div><div class="sub2">+${m.usersToday} today</div></div>
  <div class="card"><div class="label">Paying Users</div><div class="value">${m.payingUsers}</div><div class="sub2">${m.freeUsers} free</div></div>
  <div class="card"><div class="label">Briefs (All Time)</div><div class="value">${m.totalBriefs}</div></div>
  <div class="card"><div class="label">Briefs (7 Days)</div><div class="value">${m.briefs7d}</div><div class="sub2">+${m.briefsToday} today</div></div>
  <div class="card"><div class="label">Free / Paid</div><div class="value">${m.freeUsers} / ${m.payingUsers}</div></div>
</div>

<section>
  <h2>Briefs per User Distribution</h2>
  <table>
    <thead><tr><th>Briefs Generated</th><th>Users</th></tr></thead>
    <tbody>${distRows}</tbody>
  </table>
</section>

<section>
  <h2>B2B Leads (last 50)</h2>
  <table>
    <thead><tr><th>Name</th><th>Email</th><th>Organization</th><th>Role</th><th>Source</th><th>Submitted</th></tr></thead>
    <tbody>${b2bLeadRows}</tbody>
  </table>
</section>

<section>
  <h2>Recent Signups (last 25)</h2>
  <table>
    <thead><tr><th>Email</th><th>Plan</th><th>Signed Up</th><th>Briefs</th><th>Source</th></tr></thead>
    <tbody>${signupRows}</tbody>
  </table>
</section>
</body></html>`;

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  });

  // SEO page data for /interview-prep/:slug
  const INTERVIEW_PREP_PAGES: Record<string, { title: string; description: string; name: string }> = {
    google: {
      name: "Google",
      title: "How to Prepare for a Google Interview | PrepFile",
      description: "Everything you need to know about Google's interview process: culture, hiring rounds, coding expectations, and system design. Generate a personalized Google prep brief in 10 minutes.",
    },
    amazon: {
      name: "Amazon",
      title: "How to Prepare for an Amazon Interview | PrepFile",
      description: "Master Amazon's Leadership Principles, Bar Raiser process, and behavioral interview format. Generate a personalized Amazon prep brief with specific LP examples in 10 minutes.",
    },
    meta: {
      name: "Meta",
      title: "How to Prepare for a Meta Interview | PrepFile",
      description: "Meta's interview process decoded: coding expectations, system design at scale, and behavioral format. Generate a personalized Meta prep brief with round-by-round strategy in 10 minutes.",
    },
    mckinsey: {
      name: "McKinsey",
      title: "How to Prepare for a McKinsey Interview | PrepFile",
      description: "McKinsey case interview preparation: structured thinking, MECE frameworks, and PEI storytelling. Generate a personalized McKinsey prep brief tailored to your background in 10 minutes.",
    },
    "goldman-sachs": {
      name: "Goldman Sachs",
      title: "How to Prepare for a Goldman Sachs Interview | PrepFile",
      description: "Goldman Sachs interview prep: technical finance, markets knowledge, and Super Day strategy. Generate a personalized Goldman Sachs prep brief for your division in 10 minutes.",
    },
    microsoft: {
      name: "Microsoft",
      title: "How to Prepare for a Microsoft Interview | PrepFile",
      description: "Microsoft's loop ends with an As-Appropriate interview most candidates don't understand. Here's how the full process works, what growth mindset actually means in practice, and how the AA round can change your offer.",
    },
    apple: {
      name: "Apple",
      title: "How to Prepare for an Apple Interview | PrepFile",
      description: "Apple's interview process has no standard format — each team runs its own loop. Here's what actually matters: the culture signals, the loop structure, and the one question that kills most candidates.",
    },
    netflix: {
      name: "Netflix",
      title: "How to Prepare for a Netflix Interview | PrepFile",
      description: "Netflix's hiring bar is uniquely high — and uniquely different. Culture alignment, autonomous decision-making, and system design depth matter more than LeetCode grinding. Here's what actually gets you hired.",
    },
    jpmorgan: {
      name: "JPMorgan",
      title: "How to Prepare for a JPMorgan Interview | PrepFile",
      description: "JPMorgan's interview process starts with Pymetrics before any human sees your resume. Division matters — IB, S&T, AWM, and Tech each have distinct formats. Here's how to prep for each.",
    },
    deloitte: {
      name: "Deloitte",
      title: "How to Prepare for a Deloitte Interview | PrepFile",
      description: "Deloitte's case interviews are candidate-led, not interviewer-led — the opposite of McKinsey. The group exercise is real and evaluated. Here's what the process actually looks like across Consulting, Advisory, and Audit.",
    },
    bcg: {
      name: "BCG",
      title: "How to Prepare for a BCG Interview | PrepFile",
      description: "BCG case interviews are candidate-led, not interviewer-led. Understand the full process: online assessment, PEI, written case, and what evaluators score. Generate a personalized BCG prep brief in 10 minutes.",
    },
    uber: {
      name: "Uber",
      title: "How to Prepare for an Uber Interview | PrepFile",
      description: "Uber's system design rounds are domain-specific: ride matching, surge pricing, real-time geo at scale. Here's the full loop, what interviewers score, and how to prep for each round.",
    },
    tesla: {
      name: "Tesla",
      title: "How to Prepare for a Tesla Interview | PrepFile",
      description: "Tesla's hiring bar is speed and ownership: they want builders who operate without hand-holding. Here's the full process, what interviewers score, and how to stand out in a Tesla loop.",
    },
    salesforce: {
      name: "Salesforce",
      title: "How to Prepare for a Salesforce Interview | PrepFile",
      description: "Salesforce interviews blend technical depth with Ohana culture fit. Here's the hiring process, what evaluators score in each round, and how to prep for a Salesforce loop.",
    },
    ibm: {
      name: "IBM",
      title: "How to Prepare for an IBM Interview | PrepFile",
      description: "IBM's interviews span consulting, cloud, and AI roles — each with distinct formats. Here's the hiring process, what evaluators score, and how to prep for an IBM loop.",
    },
    "johnson-and-johnson": {
      name: "Johnson & Johnson",
      title: "How to Prepare for a Johnson & Johnson Interview | PrepFile",
      description: "Johnson & Johnson interview prep: behavioral rounds, virtual video interviews, and Credo-aligned storytelling. Build your personalized J&J prep brief in 10 minutes.",
    },
    pfizer: {
      name: "Pfizer",
      title: "How to Prepare for a Pfizer Interview | PrepFile",
      description: "Pfizer interview prep: STAR-based behavioral rounds, HireVue assessments, and scientific competency questions. Build your personalized Pfizer prep brief in 10 minutes.",
    },
    unitedhealth: {
      name: "UnitedHealth Group",
      title: "How to Prepare for a UnitedHealth Group Interview | PrepFile",
      description: "UnitedHealth Group interview prep: behavioral rounds, digital assessments, and healthcare industry knowledge. Build your personalized UHG prep brief in 10 minutes.",
    },
    walmart: {
      name: "Walmart",
      title: "How to Prepare for a Walmart Interview | PrepFile",
      description: "Ace Walmart's 65-question assessment, STAR behavioral rounds, and Bar Raiser-style panel interviews. Build your personalized Walmart prep brief in minutes.",
    },
    target: {
      name: "Target",
      title: "How to Prepare for a Target Interview | PrepFile",
      description: "Prepare for Target's recorded video interview, Workday application, and guest-obsessed behavioral rounds. Build your personalized Target prep brief fast.",
    },
    nike: {
      name: "Nike",
      title: "How to Prepare for a Nike Interview | PrepFile",
      description: "Prepare for Nike's HireVue video interview, group retail exercises, and culture-driven behavioral rounds. Generate your personalized Nike prep brief today.",
    },
    "procter-and-gamble": {
      name: "Procter & Gamble",
      title: "How to Prepare for a Procter & Gamble Interview | PrepFile",
      description: "Ace P&G's PEAK assessment, cognitive challenges, and behavioral interviews using the STAR method. Build your personalized P&G prep brief in minutes.",
    },
    "coca-cola": {
      name: "Coca-Cola",
      title: "How to Prepare for a Coca-Cola Interview | PrepFile",
      description: "Prepare for Coca-Cola's panel interviews, competency-based questions, and situational assessments. Build your personalized Coca-Cola prep brief in minutes.",
    },
    boeing: {
      name: "Boeing",
      title: "How to Prepare for a Boeing Interview | PrepFile",
      description: "Prepare for Boeing's STAR-format panel interviews, government compliance questions, and engineering assessments. Build your personalized Boeing prep brief.",
    },
    "general-electric": {
      name: "General Electric",
      title: "How to Prepare for a General Electric Interview | PrepFile",
      description: "Prepare for GE's multi-stage process: situational judgment tests, video interviews, and assessment centre exercises. Build your personalized GE prep brief.",
    },
    visa: {
      name: "Visa",
      title: "How to Prepare for a Visa Interview | PrepFile",
      description: "Prepare for Visa's multi-round interviews, technical coding assessments, and system design questions. Build your personalized Visa prep brief in minutes.",
    },
    "capital-one": {
      name: "Capital One",
      title: "How to Prepare for a Capital One Interview | PrepFile",
      description: "Prepare for Capital One's Power Day case interviews, quantitative assessments, and behavioral rounds. Build your personalized Capital One prep brief fast.",
    },
    disney: {
      name: "Disney",
      title: "How to Prepare for a Disney Interview | PrepFile",
      description: "Prepare for Disney's STAR behavioral interviews, assessment centre exercises, and culture-fit evaluations. Build your personalized Disney prep brief today.",
    },
    caterpillar: {
      name: "Caterpillar",
      title: "How to Prepare for a Caterpillar Interview | PrepFile",
      description: "Prepare for Caterpillar's behavioral interviews, aptitude assessments, and on-site panel rounds. Build your personalized Caterpillar prep brief in minutes.",
    },
    "warner-bros": {
      name: "Warner Bros. Discovery",
      title: "How to Prepare for a Warner Bros. Discovery Interview | PrepFile",
      description: "Prepare for Warner Bros. Discovery's HireVue video interview, panel rounds, and portfolio reviews. Build your personalized WBD prep brief in minutes.",
    },
    "software-engineer": {
      name: "Software Engineer",
      title: "Software Engineer Interview Prep Guide | PrepFile",
      description: "Crack your software engineer interview: understand coding round formats, what interviewers actually evaluate, and how to prep for behavioral rounds. Get a personalized prep brief in minutes.",
    },
    "product-manager": {
      name: "Product Manager",
      title: "Product Manager Interview Prep Guide | PrepFile",
      description: "Prepare for your PM interview: product sense rounds, analytical cases, behavioral questions, and what top companies look for in product managers. Get a personalized prep brief in minutes.",
    },
    "data-scientist": {
      name: "Data Scientist",
      title: "Data Scientist Interview Prep Guide | PrepFile",
      description: "Ace your data science interview: SQL rounds, statistics questions, ML system design, and what hiring managers look for in DS candidates. Get a personalized prep brief in minutes.",
    },
    "ux-designer": {
      name: "UX Designer",
      title: "UX Designer Interview Prep Guide | PrepFile",
      description: "Prepare for your UX design interview: portfolio presentation tips, design challenge strategy, whiteboard exercises, and what hiring managers look for in UX candidates. Get a personalized prep brief in minutes.",
    },
    "marketing-manager": {
      name: "Marketing Manager",
      title: "Marketing Manager Interview Prep Guide | PrepFile",
      description: "Ace your marketing manager interview: campaign strategy questions, metrics rounds, behavioral assessments, and what hiring managers look for in marketing candidates. Get a personalized prep brief in minutes.",
    },
    "data-engineer": {
      name: "Data Engineer",
      title: "Data Engineer Interview Prep Guide | PrepFile",
      description: "Ace your data engineer interview: SQL deep dives, pipeline design, system design for data infrastructure, and what hiring managers look for in DE candidates. Get a personalized prep brief in minutes.",
    },
    "business-analyst": {
      name: "Business Analyst",
      title: "Business Analyst Interview Prep Guide | PrepFile",
      description: "Prepare for your business analyst interview: case studies, SQL rounds, stakeholder communication questions, and what hiring managers look for in BA candidates. Get a personalized prep brief in minutes.",
    },
    "management-consultant": {
      name: "Management Consultant",
      title: "Management Consulting Interview Prep Guide | PrepFile",
      description: "Crack your consulting interview: case interview frameworks, market sizing, exhibit interpretation, and what McKinsey, BCG, and Bain actually evaluate. Get a personalized prep brief in minutes.",
    },
    "investment-banking-analyst": {
      name: "Investment Banking Analyst",
      title: "Investment Banking Analyst Interview Prep Guide | PrepFile",
      description: "Prepare for your IB analyst interview: technical questions on valuation and accounting, fit interviews, deal experience, and what bulge bracket banks actually evaluate. Get a personalized prep brief in minutes.",
    },
    "devops-sre-engineer": {
      name: "DevOps/SRE Engineer",
      title: "DevOps/SRE Engineer Interview Prep Guide | PrepFile",
      description: "Ace your DevOps or SRE interview: system design for reliability, incident response scenarios, infrastructure coding, and what top companies look for in platform engineers. Get a personalized prep brief in minutes.",
    },
    airbnb: {
      name: "Airbnb",
      title: "How to Prepare for an Airbnb Interview | PrepFile",
      description: "Airbnb's Core Values are an active evaluation rubric, not marketing copy. Understand the Experience round, what marketplace system design looks like at Airbnb, and how to prepare for their product-specific coding problems.",
    },
    spotify: {
      name: "Spotify",
      title: "How to Prepare for a Spotify Interview | PrepFile",
      description: "Spotify's Squad model shapes how they hire: autonomous operation, mission alignment, and ambiguity tolerance are scored signals. Here's the full loop, what evaluators score, and how to prep for Spotify's domain-specific technical rounds.",
    },
    linkedin: {
      name: "LinkedIn",
      title: "How to Prepare for a LinkedIn Interview | PrepFile",
      description: "LinkedIn's InDay Loop spans coding, system design, and structured behavioral rounds. Graph algorithms are domain-relevant, and mission alignment is a scored signal. Here's what evaluators actually look for.",
    },
    adobe: {
      name: "Adobe",
      title: "How to Prepare for an Adobe Interview | PrepFile",
      description: "Adobe interviews span Creative Cloud engineering, enterprise SaaS, and design roles — each with distinct formats. Customer empathy is a scored behavioral signal. Here's the full process and what evaluators score.",
    },
    stripe: {
      name: "Stripe",
      title: "How to Prepare for a Stripe Interview | PrepFile",
      description: "Stripe evaluates written communication explicitly, and their API design round is unlike anything at FAANG. Understand the full loop, what exactly-once processing means for system design prep, and how to approach the API design round.",
    },
    "prepfile-vs-chatgpt": {
      name: "PrepFile vs ChatGPT",
      title: "PrepFile vs ChatGPT for Interview Prep | PrepFile",
      description: "ChatGPT gives generic interview advice. PrepFile generates a structured brief specific to your company, role, and round. Here's the difference — and when to use each.",
    },
    "prepfile-vs-interviewing-io": {
      name: "PrepFile vs Interviewing.io",
      title: "PrepFile vs Interviewing.io | PrepFile",
      description: "Interviewing.io is mock interview practice. PrepFile is company research and prep intelligence. Here's how they work together — and which to use first.",
    },
    "prepfile-vs-pramp": {
      name: "PrepFile vs Pramp",
      title: "PrepFile vs Pramp | PrepFile",
      description: "Pramp gives peer mock interview reps. PrepFile gives company-specific research briefs. Use them in sequence — PrepFile first, then Pramp — for the best result.",
    },
  };

  // Blog article SEO data — mirrors blog-articles.ts content
  const BLOG_ARTICLES: Record<string, { title: string; description: string; keywords: string }> = {
    "how-to-prepare-tech-interview-24-hours": {
      title: "How to Prepare for a Tech Interview in 24 Hours | PrepFile",
      description: "Got an interview tomorrow? Here's exactly how to use the next 24 hours — hour by hour — to prepare without burning yourself out.",
      keywords: "last minute interview prep, interview tomorrow what to do, 24 hour interview prep",
    },
    "interview-prep-checklist": {
      title: "The Interview Prep Checklist Most Candidates Skip | PrepFile",
      description: "Most candidates do the visible prep and skip the items that actually matter. Here's the checklist that separates prepared candidates from everyone else.",
      keywords: "interview preparation checklist, interview prep checklist, what to do before an interview",
    },
    "why-interview-prep-advice-is-wrong": {
      title: "Why Most Interview Prep Advice Is Wrong | PrepFile",
      description: "The standard interview prep advice — practice questions, use STAR format, do mock interviews — isn't wrong. It just optimizes for the wrong constraint.",
      keywords: "how to actually prepare for interviews, interview prep advice, effective interview preparation",
    },
    "complete-interview-prep-checklist-2026": {
      title: "The Complete Interview Prep Checklist (2026) | PrepFile",
      description: "A step-by-step interview prep checklist covering company research, role alignment, behavioral prep, logistics, and the day-of routine — so nothing falls through the cracks.",
      keywords: "interview prep checklist, how to prepare for an interview, job interview checklist, interview preparation steps",
    },
    "behavioral-interview-questions": {
      title: "Top 30 Behavioral Interview Questions | PrepFile",
      description: "The 30 behavioral interview questions that come up most often — what interviewers are actually asking, and how to structure your answer using the STAR method.",
      keywords: "behavioral interview questions, common behavioral interview questions, how to answer behavioral interview questions",
    },
    "star-method-interview": {
      title: "The STAR Method for Interview Answers | PrepFile",
      description: "The STAR method — Situation, Task, Action, Result — is the standard framework for behavioral interviews. Here's how to use it correctly, and why most candidates get it wrong.",
      keywords: "STAR method interview, STAR interview technique, how to use STAR method, STAR format behavioral interview",
    },
  };

  // Segment landing page SEO data
  const SEGMENT_PAGES: Record<string, { title: string; description: string }> = {
    "new-grads": {
      title: "Interview Prep for New Graduates | PrepFile",
      description: "Walk into your first interview knowing exactly what they're looking for. PrepFile generates a personalized brief covering company culture, interview format, and what skills they'll probe — in 10 minutes.",
    },
    "career-changers": {
      title: "Interview Prep for Career Changers | PrepFile",
      description: "Switching industries? PrepFile maps your background to what your target company actually looks for — and closes the gaps before your interview.",
    },
    "experienced": {
      title: "Interview Prep for Experienced Professionals | PrepFile",
      description: "10 minutes of prep that makes you the best-informed person in the room. PrepFile generates a complete briefing on the company, role, and interview format.",
    },
    "career-services": {
      title: "Interview Prep for Bootcamp Students — PrepFile for Career Services",
      description: "Give every student a personalized interview prep brief before each interview. PrepFile generates company-specific briefs in 60 seconds. Bulk seats from $5/student.",
    },
    "recruiting-agencies": {
      title: "Interview Prep for Recruiting Agencies — PrepFile",
      description: "Help your candidates walk into interviews prepared. PrepFile generates personalized, company-specific prep briefs in 60 seconds. Higher placement rates. $500/month unlimited.",
    },
  };

  // Helper: inject SEO meta tags for /faq page
  function injectFaqMeta(html: string, appUrl: string): string {
    const title = "Frequently Asked Questions | PrepFile";
    const description = "Common questions about PrepFile — how it works, pricing tiers, what's included in free vs. Pro, and how to get started.";
    const url = `${appUrl}/faq`;

    return html
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/g, `$1${description}$2`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/g, `$1${title}$2`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/g, `$1${description}$2`)
      .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/g, `$1${url}$2`)
      .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/g, `$1${title}$2`)
      .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/g, `$1${description}$2`)
      .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/g, `$1${url}$2`);
  }

  // Helper: inject SEO meta tags for /for/:slug segment pages
  function injectSegmentMeta(html: string, slug: string, appUrl: string): string {
    const segment = SEGMENT_PAGES[slug];
    if (!segment) return html;

    const url = `${appUrl}/for/${slug}`;
    return html
      .replace(/<title>[^<]*<\/title>/, `<title>${segment.title}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/g, `$1${segment.description}$2`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/g, `$1${segment.title}$2`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/g, `$1${segment.description}$2`)
      .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/g, `$1${url}$2`)
      .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/g, `$1${segment.title}$2`)
      .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/g, `$1${segment.description}$2`)
      .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/g, `$1${url}$2`);
  }

  // Helper: inject SEO meta tags for /blog index page
  function injectBlogIndexMeta(html: string, appUrl: string): string {
    const title = "Interview Prep Blog | PrepFile";
    const description = "Interview prep guides, strategy, and tactics from PrepFile. Learn how to prepare smarter, not longer.";
    const url = `${appUrl}/blog`;

    return html
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/g, `$1${description}$2`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/g, `$1${title}$2`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/g, `$1${description}$2`)
      .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/g, `$1${url}$2`)
      .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/g, `$1${title}$2`)
      .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/g, `$1${description}$2`)
      .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/g, `$1${url}$2`);
  }

  // Helper: inject SEO meta tags for /blog/:slug pages
  function injectBlogMeta(html: string, slug: string, appUrl: string): string {
    const article = BLOG_ARTICLES[slug];
    if (!article) return html;

    const url = `${appUrl}/blog/${slug}`;
    const schemaJson = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title.replace(" | PrepFile", ""),
      description: article.description,
      keywords: article.keywords,
      url,
      publisher: {
        "@type": "Organization",
        name: "PrepFile",
        url: appUrl,
      },
    });

    return html
      .replace(/<title>[^<]*<\/title>/, `<title>${article.title}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/g, `$1${article.description}$2`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/g, `$1${article.title}$2`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/g, `$1${article.description}$2`)
      .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/g, `$1${url}$2`)
      .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/g, `$1${article.title}$2`)
      .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/g, `$1${article.description}$2`)
      .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/g, `$1${url}$2`)
      .replace("</head>", `<script type="application/ld+json">${schemaJson}</script>\n</head>`);
  }

  // Helper: inject SEO meta tags for /interview-prep index page
  function injectInterviewPrepIndexMeta(html: string, appUrl: string): string {
    const title = "Company Interview Prep Guides | PrepFile";
    const description =
      "Detailed interview prep guides for Google, Amazon, Meta, McKinsey, Goldman Sachs, and more. Learn the culture, hiring process, and what interviewers actually evaluate.";
    const url = `${appUrl}/interview-prep`;

    return html
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/g, `$1${description}$2`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/g, `$1${title}$2`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/g, `$1${description}$2`)
      .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/g, `$1${url}$2`)
      .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/g, `$1${title}$2`)
      .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/g, `$1${description}$2`)
      .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/g, `$1${url}$2`);
  }

  // Helper: inject SEO meta tags for /interview-prep/:slug pages
  function injectInterviewPrepMeta(html: string, slug: string, appUrl: string): string {
    const page = INTERVIEW_PREP_PAGES[slug];
    if (!page) return html;

    const url = `${appUrl}/interview-prep/${slug}`;
    const schemaJson = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `How to Prepare for a ${page.name} Interview`,
      description: page.description,
      url,
      publisher: {
        "@type": "Organization",
        name: "PrepFile",
        url: appUrl,
      },
    });

    return html
      .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/g, `$1${page.description}$2`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/g, `$1${page.title}$2`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/g, `$1${page.description}$2`)
      .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/g, `$1${url}$2`)
      .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/g, `$1${page.title}$2`)
      .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/g, `$1${page.description}$2`)
      .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/g, `$1${url}$2`)
      .replace("</head>", `<script type="application/ld+json">${schemaJson}</script>\n</head>`);
  }

  // Helper: inject dynamic OG meta tags into an HTML template for /b/:id brief share pages
  function injectBriefOgTags(html: string, briefId: string, appUrl: string): string {
    const brief = getPublicBrief(briefId);
    if (!brief) return html;

    const title = `PrepFile Brief: ${brief.company_name} — ${brief.job_title}`;
    const ogImageUrl = `${appUrl}/og-image.png`;
    const url = `${appUrl}/b/${briefId}`;

    let description = "Interview prep brief powered by PrepFile";
    try {
      const data = JSON.parse(brief.brief_data);
      const overview = data?.companySnapshot?.overview;
      if (overview && typeof overview === "string") {
        description = overview.length > 150 ? overview.slice(0, 147) + "..." : overview;
      }
    } catch {
      // fall through to default description
    }

    return html
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/g, `$1${title}$2`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/g, `$1${description}$2`)
      .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/g, `$1${url}$2`)
      .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/g, `$1${ogImageUrl}$2`)
      .replace(/(<meta\s+name="twitter:card"\s+content=")[^"]*(")/g, `$1summary_large_image$2`)
      .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/g, `$1${title}$2`)
      .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/g, `$1${description}$2`)
      .replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/g, `$1${ogImageUrl}$2`)
      .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/g, `$1${url}$2`);
  }

  // Sitemap
  app.get("/sitemap.xml", (_req, res) => {
    const slugs = Object.keys(INTERVIEW_PREP_PAGES);
    const blogSlugs = Object.keys(BLOG_ARTICLES);
    const segmentSlugs = Object.keys(SEGMENT_PAGES);
    const urls = [
      `<url><loc>${APP_URL}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
      `<url><loc>${APP_URL}/interview-prep</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>`,
      ...slugs.map(
        (slug) =>
          `<url><loc>${APP_URL}/interview-prep/${slug}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`
      ),
      `<url><loc>${APP_URL}/blog</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
      ...blogSlugs.map(
        (slug) =>
          `<url><loc>${APP_URL}/blog/${slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
      ),
      `<url><loc>${APP_URL}/faq</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
      ...segmentSlugs.map(
        (slug) =>
          `<url><loc>${APP_URL}/for/${slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
      ),
    ].join("\n  ");

    res.setHeader("Content-Type", "application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`);
  });

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

    // Intercept /interview-prep (index) to inject SEO meta tags
    app.get("/interview-prep", async (req, res, next) => {
      try {
        const template = await vite.transformIndexHtml(req.url, (await import("fs")).readFileSync("index.html", "utf-8"));
        const html = injectInterviewPrepIndexMeta(template, APP_URL);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch {
        next();
      }
    });

    // Intercept /interview-prep/:slug to inject SEO meta tags
    app.get("/interview-prep/:slug", async (req, res, next) => {
      try {
        const template = await vite.transformIndexHtml(req.url, (await import("fs")).readFileSync("index.html", "utf-8"));
        const html = injectInterviewPrepMeta(template, req.params.slug, APP_URL);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch {
        next();
      }
    });

    // Intercept /blog (index) to inject SEO meta tags
    app.get("/blog", async (req, res, next) => {
      try {
        const template = await vite.transformIndexHtml(req.url, (await import("fs")).readFileSync("index.html", "utf-8"));
        const html = injectBlogIndexMeta(template, APP_URL);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch {
        next();
      }
    });

    // Intercept /blog/:slug to inject SEO meta tags
    app.get("/blog/:slug", async (req, res, next) => {
      try {
        const template = await vite.transformIndexHtml(req.url, (await import("fs")).readFileSync("index.html", "utf-8"));
        const html = injectBlogMeta(template, req.params.slug, APP_URL);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch {
        next();
      }
    });

    // Intercept /faq to inject SEO meta tags
    app.get("/faq", async (req, res, next) => {
      try {
        const template = await vite.transformIndexHtml(req.url, (await import("fs")).readFileSync("index.html", "utf-8"));
        const html = injectFaqMeta(template, APP_URL);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch {
        next();
      }
    });

    // Intercept /for/:slug to inject SEO meta tags
    app.get("/for/:slug", async (req, res, next) => {
      try {
        const template = await vite.transformIndexHtml(req.url, (await import("fs")).readFileSync("index.html", "utf-8"));
        const html = injectSegmentMeta(template, req.params.slug, APP_URL);
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
      try {
        const indexPath = path.join(process.cwd(), "dist", "index.html");
        const template = fs.readFileSync(indexPath, "utf-8");
        const html = injectBriefOgTags(template, req.params.id, APP_URL);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (err) {
        console.error("[/b/:id] Failed to render:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    // Intercept /interview-prep (index) to inject SEO meta tags
    app.get("/interview-prep", (req, res) => {
      try {
        const indexPath = path.join(process.cwd(), "dist", "index.html");
        const template = fs.readFileSync(indexPath, "utf-8");
        const html = injectInterviewPrepIndexMeta(template, APP_URL);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (err) {
        console.error("[/interview-prep] Failed to render:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    // Intercept /interview-prep/:slug to inject SEO meta tags
    app.get("/interview-prep/:slug", (req, res) => {
      try {
        const indexPath = path.join(process.cwd(), "dist", "index.html");
        const template = fs.readFileSync(indexPath, "utf-8");
        const html = injectInterviewPrepMeta(template, req.params.slug, APP_URL);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (err) {
        console.error("[/interview-prep/:slug] Failed to render:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    // Intercept /faq to inject SEO meta tags
    app.get("/faq", (req, res) => {
      try {
        const indexPath = path.join(process.cwd(), "dist", "index.html");
        const template = fs.readFileSync(indexPath, "utf-8");
        const html = injectFaqMeta(template, APP_URL);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (err) {
        console.error("[/faq] Failed to render:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    // Intercept /for/:slug to inject SEO meta tags
    app.get("/for/:slug", (req, res) => {
      try {
        const indexPath = path.join(process.cwd(), "dist", "index.html");
        const template = fs.readFileSync(indexPath, "utf-8");
        const html = injectSegmentMeta(template, req.params.slug, APP_URL);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (err) {
        console.error("[/for/:slug] Failed to render:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("*", (_req, res) => {
      res.sendFile("dist/index.html", { root: process.cwd() });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Stripe configuration diagnostic
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      console.error("[STRIPE] STRIPE_SECRET_KEY is NOT set — upgrade buttons will fail");
    } else if (stripeKey.startsWith("sk_live_")) {
      console.log("[STRIPE] STRIPE_SECRET_KEY: live key configured");
    } else if (stripeKey.startsWith("sk_test_")) {
      console.log("[STRIPE] STRIPE_SECRET_KEY: test key configured (switch to sk_live_ for production)");
    } else {
      console.warn("[STRIPE] STRIPE_SECRET_KEY: key present but unrecognized format");
    }
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    console.log(`[STRIPE] STRIPE_WEBHOOK_SECRET: ${webhookSecret ? "set" : "NOT set — webhooks will fail"}`);
    console.log(`[STRIPE] APP_URL: ${APP_URL}`);

    // Lemon Squeezy / payment provider diagnostics
    const provider = process.env.PAYMENT_PROVIDER || "stripe";
    console.log(`[PAYMENT] PAYMENT_PROVIDER: ${provider}`);
    if (provider === "lemonsqueezy") {
      const lsKey = process.env.LEMONSQUEEZY_API_KEY;
      const lsStore = process.env.LEMONSQUEEZY_STORE_ID;
      const lsWebhook = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
      const lsProVariant = process.env.LEMONSQUEEZY_VARIANT_ID_PRO;
      const lsPackVariant = process.env.LEMONSQUEEZY_VARIANT_ID_PACK;
      console.log(`[LS] LEMONSQUEEZY_API_KEY: ${lsKey ? "set" : "NOT set — checkout will fail"}`);
      console.log(`[LS] LEMONSQUEEZY_STORE_ID: ${lsStore ? lsStore : "NOT set — checkout will fail"}`);
      console.log(`[LS] LEMONSQUEEZY_WEBHOOK_SECRET: ${lsWebhook ? "set" : "NOT set — webhooks will fail"}`);
      console.log(`[LS] LEMONSQUEEZY_VARIANT_ID_PRO: ${lsProVariant ? lsProVariant : "NOT set — Pro checkout will fail"}`);
      console.log(`[LS] LEMONSQUEEZY_VARIANT_ID_PACK: ${lsPackVariant ? lsPackVariant : "NOT set — Pack checkout will fail"}`);
    }
  });

  // Nurture email batch — run once on startup (after 30s) then every 4 hours
  const runNurture = () => runNurtureEmailBatch(APP_URL, FROM_EMAIL);
  setTimeout(runNurture, 30_000);
  setInterval(runNurture, 4 * 60 * 60 * 1000);

  // Welcome sequence batch (welcome-2 day 2, welcome-3 day 5) — every 4 hours
  const runWelcome = () => runWelcomeSequenceBatch(APP_URL, FROM_EMAIL);
  setTimeout(runWelcome, 60_000);
  setInterval(runWelcome, 4 * 60 * 60 * 1000);

  // Re-engagement batch (day 7, day 14 inactive) — every 4 hours
  const runReengagement = () => runReengagementBatch(APP_URL, FROM_EMAIL);
  setTimeout(runReengagement, 90_000);
  setInterval(runReengagement, 4 * 60 * 60 * 1000);

  // Welcome drip (day 0, 1, 3 — pre-brief activation) — every 4 hours
  const runWelcomeDrip = () => runWelcomeDripBatch(APP_URL, FROM_EMAIL);
  setTimeout(runWelcomeDrip, 120_000);
  setInterval(runWelcomeDrip, 4 * 60 * 60 * 1000);
}

startServer();
