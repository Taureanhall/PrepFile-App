# Prepflow Prepfile App - Gemini Guide

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS 4, Lucide React, Motion (Framer Motion)
- **Backend:** Node.js, Express, tsx (for running TS directly)
- **Database:** Better-SQLite3 (local `prepflow.db`)
- **AI Integration:** Google Generative AI (`@google/genai`)
- **Analytics:** PostHog
- **Payments/Auth:** Stripe, Resend, Google Auth Library

## Core Commands
- `npm run dev`: Starts the development server using `tsx server.ts`
- `npm run build`: Builds the production assets via Vite
- `npm run start`: Starts the production server
- `npm run lint`: Runs TypeScript compiler for type checking (`tsc --noEmit`)
- `npm run clean`: Removes the `dist` directory

## Project Structure
- `server.ts`: Main Express server handling API routes, authentication, and database interactions.
- `src/App.tsx`: Main React entry point with custom routing logic.
- `src/components/`: UI components (e.g., `PrepBrief`, `LandingPage`, `AuthPanel`).
- `src/lib/`: Utility functions, analytics, and shared logic.
- `src/marketing/`: Likely contains marketing-related content or components.
- `prepflow.db`: SQLite database file.

## Coding Standards & Patterns
- **React Components:** Prefer functional components with hooks.
- **State Management:** Uses React `useState` and `useEffect` for local and shared state.
- **Styling:** Tailwind CSS 4 for all styling.
- **TypeScript:** Strict type usage is encouraged. Check types in `src/types.ts`.
- **Routing:** Handled manually in `App.tsx` by matching `window.location.pathname`.
- **API Communication:** Frontend communicates with the Express backend via `fetch` calls.

## Key Features
- **Brief Generation:** Uses Gemini AI to generate interview prep briefs.
- **Authentication:** Custom email-based auth using Resend and SQLite sessions.
- **Subscriptions:** Managed via Stripe (Free, Pro, Pack plans).
- **SEO/Marketing:** Dedicated routes for `/interview-prep` and `/blog`.

## Agent Orchestration

### Board API
- Local URL: http://localhost:3100
- Auth header: Authorization: Bearer board
- Company ID: b6ca2efa-c023-465d-a0fb-4faa91dfe120

### Agent IDs
- Founding Engineer (FE): 75384e2a-e24f-4850-9912-f2605a8b97fa
- Marketing: (check via GET /api/companies/{companyId}/agents)
- CEO: (check via GET /api/companies/{companyId}/agents)

### Paperclipai
- Heartbeat command: node /Users/taureanhall/.npm/_npx/43414d9b790239bb/node_modules/.bin/paperclipai heartbeat run --agent-id {agentId}
- Agents only run one task at a time
- To unblock a stuck issue: PATCH /api/issues/{id} with {"status":"todo"}

### Current Priority Issues
- PRE-89 (critical): Upgrade buttons not initiating Stripe checkout — revenue blocking, assign to FE
- PRE-90 (high): Redesign sign-in flow

### Railway
- Production URL: https://prepfile-production.up.railway.app
- Auto-deploys from main branch
- Stripe live keys already set in Railway env vars
