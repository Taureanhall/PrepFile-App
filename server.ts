import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { generateBrief } from "./src/lib/generateBrief.js";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/generate-brief", async (req, res) => {
    try {
      const bypassKey = process.env.BYPASS_KEY;
      const clientKey = req.headers["x-bypass-key"];
      const isBypassed = bypassKey && clientKey === bypassKey;

      if (!isBypassed) {
        const ip = req.ip || "unknown";
        if (!checkRateLimit(ip)) {
          return res.status(429).json({ error: "Rate limit exceeded. You can generate 5 briefs per day." });
        }
      }

      const data = await generateBrief(req.body);
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
        from: "PrepFlow <onboarding@resend.dev>",
        to: email,
        subject: "Your Interview Prep Brief",
        html: `<div style="font-family:sans-serif;max-width:600px;margin:auto">${sections}</div>`,
      });

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (_req, res) => {
      res.sendFile("dist/index.html", { root: process.cwd() });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
