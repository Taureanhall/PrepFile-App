/// <reference types="vite/client" />
import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;

export function initAnalytics() {
  if (!POSTHOG_KEY) return;
  posthog.init(POSTHOG_KEY, {
    api_host: "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // fired manually
  });
}

export function identifyUser(userId: string) {
  if (!POSTHOG_KEY) return;
  posthog.identify(userId);
}

export function resetUser() {
  if (!POSTHOG_KEY) return;
  posthog.reset();
}

export function trackPageView() {
  if (!POSTHOG_KEY) return;
  posthog.capture("page_view");
}

export function trackBriefGenerated(company: string, jobTitle: string) {
  if (!POSTHOG_KEY) return;
  posthog.capture("brief_generated", { company, job_title: jobTitle });
}

export function trackLogin() {
  if (!POSTHOG_KEY) return;
  posthog.capture("login");
}
