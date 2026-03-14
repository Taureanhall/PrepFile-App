<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# PrepFile — AI Interview Prep

This contains everything you need to run, develop, and deploy the PrepFile app.

View your app in AI Studio: https://ai.studio/apps/b5ca1214-494e-482c-be13-ca62d74b0933

## Run Locally

**Prerequisites:** Node.js (v18+)

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and fill in your keys (at minimum `GEMINI_API_KEY`)
3. Run the app:
   `npm run dev`

## Server Mode — Remote Control & Spawn Options

The Express server (`server.ts`) supports several environment variables that control how it spawns and binds, making it easy to run from a remote laptop, tunnel, or cloud VM.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port the server listens on. Railway and other PaaS providers set this automatically. |
| `APP_URL` | `http://localhost:$PORT` | Public-facing base URL. Used for OAuth callbacks, magic-link emails, and Stripe redirects. Set this to your tunnel or production URL when running remotely. |
| `NODE_ENV` | `development` | Set to `production` to serve the pre-built `dist/` folder instead of spawning Vite HMR. |
| `DB_PATH` | `./prepflow.db` | Path to the SQLite database file. Useful for pointing to a shared or persistent volume. |
| `DISABLE_HMR` | — | Set to `true` to disable Vite hot-module-reload (used in AI Studio / headless environments). |

### Spawn Commands

```bash
# Development (Vite HMR + Express, binds 0.0.0.0:3000)
npm run dev

# Production (pre-built assets, no Vite)
npm run build && npm start

# Custom port
PORT=8080 npm run dev

# Remote laptop over tunnel (e.g. ngrok, Cloudflare Tunnel)
APP_URL="https://my-tunnel.ngrok-free.app" PORT=3000 npm run dev

# Headless / CI environment (no HMR flicker)
DISABLE_HMR=true PORT=3000 npm run dev
```

### Binding & Network

The server binds to `0.0.0.0` (all interfaces) by default, so it is accessible from other machines on the same network without extra configuration. When running on a remote laptop:

1. **Same network** — Access via `http://<laptop-ip>:3000` and set `APP_URL` to match.
2. **Behind NAT / firewall** — Use a tunnel service (ngrok, Cloudflare Tunnel, Tailscale Funnel) and set `APP_URL` to the tunnel's public URL.
3. **Railway / PaaS** — `PORT` is set automatically; configure `APP_URL` in the platform dashboard.

### Background Workers

On startup the server spawns several background interval workers for email sequences. These run in-process (no separate worker spawn):

| Worker | Initial Delay | Interval | Purpose |
|--------|--------------|----------|---------|
| Nurture emails | 30 s | 4 hours | Re-engagement drip for inactive users |
| Welcome sequence | 60 s | 4 hours | Day 2 & day 5 onboarding emails |
| Re-engagement | 90 s | 4 hours | Day 7 & day 14 win-back emails |
| Welcome drip | 120 s | 4 hours | Day 0, 1, 3 pre-brief activation |

These workers use `APP_URL` and `FROM_EMAIL` for link generation, so both must be set correctly when running remotely.

### Quick Start — Remote Laptop

```bash
git clone <repo-url> && cd PrepFile-App
npm install
cp .env.example .env.local
# Edit .env.local with your keys, then:
APP_URL="https://<your-tunnel-url>" npm run dev
```
