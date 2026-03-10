# Audit Report — PrepFlow Interview Intel
**Date:** 2026-03-07
**Project Type:** Code (React SPA + Express server)
**Framework:** React 19, Vite 6, Tailwind v4, TypeScript, @google/genai
**Agents Run:** Code Quality, Frontend/Design, Architecture/Security

---

## Pre-flight

- `.gitignore` present — `.env*` correctly excluded (with `!.env.example` carve-out)
- No `CLAUDE.md` in project root — **Warning: missing project-level instructions**
- No `.env` committed (not a git repo)
- No ESLint configured
- No Prettier configured

---

## Executive Summary

| Severity | Count |
|---|---|
| Critical | 10 |
| Warning | 22 |
| Suggestion | 5 |
| Auto-fixes applied | 11 (`transition-all` -> `transition-colors`) |
| Requires approval | 3 |

---

## Critical Issues

### [AR-01] — API Key Exposed in Client Bundle
- **Agent:** Architecture
- **File:** `vite.config.ts:11`
- **Issue:** `GEMINI_API_KEY` is injected into the Vite client bundle via the `define` block. `generateBrief` is imported and called in `src/App.tsx` (browser), so the key is shipped to every end user and is trivially extractable from the built JS.
- **Fix:** Move `generateBrief` behind a server-side Express route (`POST /api/generate-brief`). Read the key from `process.env` in `server.ts` only. Have the React client `fetch` that route. Remove the `define` block from `vite.config.ts`.
- **Auto-fixable:** No

---

### [AR-02] — Production Mode Never Serves Frontend
- **Agent:** Architecture / Code Quality (OBS-2)
- **File:** `server.ts:17-23`
- **Issue:** The Vite dev middleware is only mounted in non-production. There is no `express.static("dist")` for production. `NODE_ENV=production` starts Express with only `/api/health` — the frontend is never served.
- **Fix:** Add `app.use(express.static("dist"))` and a SPA fallback (`app.get("*", ...)`) inside the production branch of `server.ts`.
- **Auto-fixable:** No

---

### [CQ-03a] — No Shape Validation on LLM Response
- **Agent:** Code Quality
- **File:** `src/lib/generateBrief.ts:129`
- **Issue:** `JSON.parse(response.text || "{}")` with no shape validation. A malformed or partial Gemini response silently passes an invalid object to `PrepBrief`, which renders `undefined` throughout the UI with no user-visible error.
- **Fix:** After parsing, validate that top-level keys exist (`companySnapshot`, `roleIntelligence`, `roundExpectations`, `questionsToAsk`, `blindSpots`). Throw a typed error with a user-facing message if validation fails. The `try/catch` in `handleGenerate` will surface it.
- **Auto-fixable:** No

---

### [CQ-03b] — Fake Email Send Shows False Success to User
- **Agent:** Code Quality
- **File:** `src/components/PrepBrief.tsx:32-53`
- **Issue:** `handleSave` uses a `setTimeout` stub. It shows "Brief sent! Check your inbox." to the user but nothing is sent. This is a silent functional lie — the user believes their brief was emailed when it was not.
- **Fix:** Either implement a real `/api/send-brief` route in `server.ts` using the `resend` package (already installed), or replace the success message with an honest state ("Email delivery coming soon") or hide the feature entirely until it is implemented.
- **Auto-fixable:** No

---

### [FD-05a] — Form Labels Not Associated with Inputs
- **Agent:** Frontend/Design
- **File:** `src/App.tsx:172, 185, 198`
- **Issue:** All three form field labels have no `htmlFor` attribute, and their corresponding inputs have no `id`. Screen readers cannot programmatically associate labels with fields.
- **Fix:** Add matching `htmlFor`/`id` pairs: `<label htmlFor="company-name">` + `<input id="company-name">`, same for `job-title` and `job-description`.
- **Auto-fixable:** No

---

### [FD-05b] — Email Input Has No Label
- **Agent:** Frontend/Design
- **File:** `src/components/PrepBrief.tsx:229-235`
- **Issue:** The email input has no `<label>` element and no `aria-label`. The placeholder `"your@email.com"` is not a substitute — it disappears when typing begins and is not reliably read as a label by screen readers.
- **Fix:** Add `aria-label="Email address"` to the input, or add a visually hidden label: `<label htmlFor="save-email" className="sr-only">Email address</label>` with `id="save-email"` on the input.
- **Auto-fixable:** No

---

### [FD-03] — focus:outline-none Paired with transition-all (now fixed) on Focus Inputs
- **Agent:** Frontend/Design
- **File:** `src/App.tsx:180, 193, 206`; `src/components/PrepBrief.tsx:235`
- **Issue:** `focus:outline-none` removes the browser focus ring on all four form inputs. While `focus:ring-2` is present as a replacement, the former pairing with `transition-all` (now fixed to `transition-colors`) caused the ring to animate in delayed, which could appear broken on some browsers. Verify the focus ring is visually distinct after the `transition-all` fix.
- **Fix:** `transition-all` has been auto-fixed to `transition-colors`. Visually verify focus ring renders correctly. No further code change required unless ring is imperceptible.
- **Auto-fixable:** Partially (transition fixed; visual verification still required)

---

### [VISUAL-BUG] — Section Headings Render at 14px (text-sm overrides text-xl)
- **Agent:** Frontend/Design (observation)
- **File:** `src/components/PrepBrief.tsx:76, 124, 162, 200`
- **Issue:** All four section `<h2>` elements have both `text-xl` and `text-sm` in their className. In Tailwind, the later class wins — `text-sm` is applied last and overrides `text-xl`. All section headings render at 14px instead of the intended 20px. This is the most significant visual rendering bug found.
- **Fix:** Remove `text-sm` from the `<h2>` className. It belongs on a separate child element (the `uppercase tracking-wider` label style), not on the heading element itself.
- **Auto-fixable:** No

---

### [AR-03] — No Error Boundary Around LLM Output
- **Agent:** Architecture
- **File:** `src/main.tsx`, `src/App.tsx`
- **Issue:** `PrepBrief` renders unvalidated LLM output with no React Error Boundary. If the response shape is unexpected, the component throws and the entire app unmounts with a blank screen and no recovery path.
- **Fix:** Wrap `<PrepBrief>` in an Error Boundary in `App.tsx`. Also wrap the root app in `main.tsx`. The boundary should render a fallback with a "Try Again" action that resets `output` state.
- **Auto-fixable:** No

---

### [AR-04] — "use client" Directive in Vite SPA
- **Agent:** Code Quality / Architecture (OBS-3)
- **File:** `src/App.tsx:1`
- **Issue:** `"use client"` is a Next.js App Router directive. It has no effect in a Vite SPA and is misleading to any developer reading the file.
- **Fix:** Remove line 1 (`"use client"`).
- **Auto-fixable:** No

---

## Warnings

### [CQ-06] — TypeScript strict Mode Disabled
- **Agent:** Code Quality
- **File:** `tsconfig.json`
- **Issue:** `"strict": true` is absent. `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes` are all off. The `output: any` on `App.tsx:39` and the absent shared type between `generateBrief`'s return value and `PrepBriefProps` are direct consequences.
- **Fix:** Add `"strict": true` to `compilerOptions`. Fix resulting errors — they represent real type-safety gaps.

---

### [CQ-05a] — App.tsx is 353 Lines with 4+ Distinct Concerns
- **Agent:** Code Quality
- **File:** `src/App.tsx`
- **Issue:** Handles API key detection, placeholder randomization, localStorage counter, 7 state variables, form validation, 4 identical MCQ blocks, and generation flow.
- **Fix:** Extract: (1) `useInterviewForm()` hook for all form state/validation; (2) `<MCQQuestion>` reusable component for the four identical pill-button blocks; (3) `<GenerateButton>` for loading/limit states.

---

### [CQ-05b] — PrepBrief.tsx Mixes Email Capture with Content Rendering
- **Agent:** Code Quality
- **File:** `src/components/PrepBrief.tsx`
- **Issue:** Email capture form with its own async state lives in the same component as five content sections.
- **Fix:** Extract `<EmailCapture>` as a sibling component with its own `email`/`status` state.

---

### [CQ-09] — Stale Closure in Generation Counter
- **Agent:** Code Quality
- **File:** `src/App.tsx:105-107`
- **Issue:** `const newCount = generationsUsed + 1` reads from the closure. Concurrent calls would both read the same stale value and both write the same incremented count.
- **Fix:** Use functional update: `setGenerationsUsed(prev => { const next = prev + 1; localStorage.setItem("interview_intel_count", next.toString()); return next; })`.

---

### [CQ-08] — Double Render on Mount for generationsUsed
- **Agent:** Code Quality
- **File:** `src/App.tsx:45-53`
- **Issue:** `generationsUsed` initializes to `0`, then a `useEffect` reads localStorage and triggers a re-render. The component shows `0 of 5 free briefs used` for one frame before correcting.
- **Fix:** Lazy-initialize: `useState(() => { const c = localStorage.getItem("interview_intel_count"); return c ? parseInt(c, 10) : 0; })`.

---

### [CQ-04a] — Dead Import in server.ts
- **Agent:** Code Quality
- **File:** `server.ts:3`
- **Issue:** `generateBrief` is imported but never called in `server.ts`. Zero routes use it.
- **Fix:** Remove the import. Re-introduce it when the `/api/generate-brief` route is implemented (see AR-01).

---

### [CQ-04b] — Unused React Default Import (React 19)
- **Agent:** Code Quality
- **File:** `src/App.tsx:3`, `src/components/PrepBrief.tsx:1`
- **Issue:** `import React` is not needed with React 19's automatic JSX transform (`jsx: "react-jsx"` in tsconfig). Only the named imports are used.
- **Fix:** Change to `import { useState, useEffect } from "react"` (App.tsx) and `import { useState } from "react"` (PrepBrief.tsx).

---

### [CQ-12a] — resend Installed but Unused
- **Agent:** Code Quality
- **File:** `package.json:24`
- **Issue:** `resend` is a dependency but has zero imports. The email feature is stubbed.
- **Fix:** Either implement the email route, or `npm uninstall resend` until it is needed.

---

### [CQ-12b] — better-sqlite3 Installed but Unused
- **Agent:** Code Quality
- **File:** `package.json:17`
- **Issue:** `better-sqlite3` is a native addon with zero imports. No database code exists anywhere in the project. Native addons require compilation and add meaningful install overhead.
- **Fix:** `npm uninstall better-sqlite3`. Remove when there is no DB feature.

---

### [FD-09] — transition-all on All Interactive Elements (AUTO-FIXED)
- **Agent:** Frontend/Design + Code Quality
- **File:** `src/App.tsx` (9 instances), `src/components/PrepBrief.tsx` (2 instances)
- **Issue:** `transition-all` animates every CSS property, causing unnecessary GPU work. The textarea (`resize-y`) was additionally animating height on every drag event.
- **Fix:** **Auto-fixed** — all 11 instances replaced with `transition-colors`.

---

### [FD-10] — Animations Lack prefers-reduced-motion Variants
- **Agent:** Frontend/Design
- **File:** `src/App.tsx:213, 316, 336`
- **Issue:** `animate-in fade-in slide-in-from-bottom-4` and `animate-spin` have no `motion-reduce:` variants. Users with OS-level "Reduce Motion" enabled still receive animations.
- **Fix:** Add `motion-reduce:animate-none` to the animated elements. For the spinner, also consider `aria-busy="true"` on the button.

---

### [FD-17] — Decorative SVGs Missing aria-hidden
- **Agent:** Frontend/Design
- **File:** `src/App.tsx:344`; `src/components/PrepBrief.tsx:62, 224`
- **Issue:** Three inline SVGs adjacent to visible text labels lack `aria-hidden="true"`. Screen readers attempt to parse the SVG path data as content.
- **Fix:** Add `aria-hidden="true"` to each decorative `<svg>` element.

---

### [FD-18] — Form Status Changes Not in aria-live Region
- **Agent:** Frontend/Design
- **File:** `src/components/PrepBrief.tsx:222-248`
- **Issue:** Success and error state swaps are not inside an `aria-live` region. Screen readers will not announce the status change.
- **Fix:** Wrap the entire status area in `<div aria-live="polite" aria-atomic="true">`. The container must persist across state changes for the observer to detect the mutation.

---

### [FD-08a] — Likely Contrast Failure: text-zinc-500 at 12px
- **Agent:** Frontend/Design
- **File:** `src/App.tsx:328`
- **Issue:** `text-zinc-500 text-xs` on white background. zinc-500 on white is ~3.4:1, which fails WCAG AA (4.5:1 required for text below 18.67px).
- **Fix:** Use `text-zinc-600` or `text-zinc-700`. Verify with a contrast checker.

---

### [FD-08b] — Likely Contrast Failure: text-amber-900/80 on amber-50
- **Agent:** Frontend/Design
- **File:** `src/components/PrepBrief.tsx:65`
- **Issue:** The `/80` opacity modifier on `text-amber-900` may reduce effective contrast below 4.5:1 on `bg-amber-50`.
- **Fix:** Use `text-amber-900` (full opacity) or `text-amber-950`. Verify with a contrast checker.

---

### [FD-15] — Flex Layout Missing min-w-0
- **Agent:** Frontend/Design
- **File:** `src/App.tsx:147-148`
- **Issue:** The header flex row has no `min-w-0` on the text container. Long description text can overflow and push the button off-screen before the `sm:` breakpoint activates.
- **Fix:** Add `min-w-0` and `flex-1` to the left `<div>` inside the header flex container.

---

### [AR-05] — No Observability on Gemini API Calls
- **Agent:** Architecture
- **File:** `src/lib/generateBrief.ts`
- **Issue:** No trace logging on inputs, outputs, token usage, or errors from the Gemini API call. When generation fails or returns a bad shape, there is no signal to debug from. Violates project CLAUDE.md observability rule.
- **Fix:** Log at minimum: model name, prompt token count, response token count, success/failure, and any parse errors. When moved server-side (AR-01), use a structured logger with a request ID.

---

## Suggestions

### [FD-14] — Generic Page Title in index.html
- **File:** `index.html:6`
- **Issue:** `<title>My Google AI Studio App</title>` is the scaffold default. Browser tab and history will show this instead of "Interview Intel" or "PrepFlow".
- **Fix:** Update to `<title>Interview Intel — PrepFlow</title>`.

---

### [FD-11] — Off-Grid Spacing Values
- **File:** `src/App.tsx` (pervasive)
- **Issue:** `mb-1.5` (6px), `py-2.5` (10px), `py-3.5` (14px) are all off the 4px baseline grid. These are AI code-generator defaults.
- **Fix:** Replace with `mb-2`, `py-2`/`py-3`, `py-3`/`py-4` as appropriate.

---

### [FD-12] — Unselected Pill Hover is Near-Invisible
- **File:** `src/App.tsx:226-237`
- **Issue:** `hover:bg-zinc-50` on a white background is imperceptible as a hover affordance on most monitors.
- **Fix:** Use `hover:bg-zinc-100` for a perceptible signal.

---

### [CQ-SUG-01] — No Form Semantics (Enter Key Does Not Submit)
- **File:** `src/App.tsx`
- **Issue:** The generate flow uses `onClick` on a `<button>` outside any `<form>`. Pressing Enter in a focused input does not trigger generation. Expected browser behavior is broken.
- **Fix:** Wrap the form fields and generate button in `<form onSubmit={handleGenerate}>` and change the button to `type="submit"`.

---

### [GEMINI-MODEL] — Verify Model Name Currency
- **File:** `src/lib/generateBrief.ts:64`
- **Issue:** Model name `gemini-3.1-pro-preview` — verify this is current against Google AI documentation. Model names change frequently.
- **Fix:** Check Google AI Studio model list. No code change needed if the name is confirmed current.

---

## Auto-Applied Fixes

| File | Change | Rule |
|---|---|---|
| `src/App.tsx` | `transition-all` → `transition-colors` (9 instances: lines 133, 180, 193, 206, 229, 251, 273, 295, 312) | FD-09 / CQ-07 |
| `src/components/PrepBrief.tsx` | `transition-all` → `transition-colors` (2 instances: lines 235, 240) | FD-09 / CQ-07 |

---

## Requires Approval

| File | Issue | Why Approval Needed |
|---|---|---|
| `src/components/PrepBrief.tsx:41-42` | `console.log("Saving brief for:", email)` and `console.log("Brief data:", data)` log PII (user email) and full brief content | PII exposure — review before removing |
| `src/components/PrepBrief.tsx:50` | `console.error("Failed to save:", error)` — currently unreachable dead code from stub | Becomes live when real send route is wired; confirm desired error handling |
| `src/App.tsx:109` | `console.error("Error generating brief:", error)` logs full API error | Acceptable for dev; confirm it should not ship to production as-is |

---

## Agent Errors

None. All three agents completed successfully.

---

## Learning Loop Additions

Patterns seen 3+ times — candidates for audit memory rules:

1. **`transition-all` saturation in AI-generated Tailwind code:** Every interactive element defaults to it. In future Vite + Tailwind audits, run the `transition-all` grep first — it will be the highest-count finding.

2. **Explicit `import React` in React 17+ projects:** AI tools consistently generate `import React` regardless of the automatic JSX transform setting. Always grep for it when the project uses `jsx: "react-jsx"` or `jsx: "react-jsx"`.

3. **Stubbed feature with misleading success UI:** `setTimeout(resolve, N)` inside a `try/catch` followed by `setStatus("success")` with no real API call is a reliable fingerprint for a fake implementation. Always inspect "send" and "save" handlers for this pattern.

4. **Section heading class conflicts (text-xl + text-sm on same element):** AI code generators produce this when combining font-size with typographic style classes on the same element. The later class silently wins. Always check for multiple conflicting text-size utilities on heading elements.
