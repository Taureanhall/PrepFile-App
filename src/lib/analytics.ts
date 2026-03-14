/// <reference types="vite/client" />
import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;

export function initAnalytics() {
  if (!POSTHOG_KEY) return;
  const init = () =>
    posthog.init(POSTHOG_KEY, {
      api_host: "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false, // fired manually
    });
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(init);
  } else {
    setTimeout(init, 0);
  }
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

export function trackBriefGenerated(companyName: string, jobTitle: string, userTier: string, isAuthenticated: boolean) {
  if (!POSTHOG_KEY) return;
  posthog.capture("brief_generated", { company_name: companyName, job_title: jobTitle, user_tier: userTier, is_authenticated: isAuthenticated });
}

export function trackUpgradeClicked(location: string, plan: string) {
  if (!POSTHOG_KEY) return;
  posthog.capture("upgrade_clicked", { location, plan });
}

export function trackSignupCompleted(method: string) {
  if (!POSTHOG_KEY) return;
  posthog.capture("signup_completed", { method });
}

export function trackSeoPageViewed(companySlug: string, pageType: string) {
  if (!POSTHOG_KEY) return;
  posthog.capture("seo_page_viewed", { company_slug: companySlug, page_type: pageType });
}

export function trackLogin() {
  if (!POSTHOG_KEY) return;
  posthog.capture("login");
}

export function trackAbVariant(variantId: string) {
  if (!POSTHOG_KEY) return;
  posthog.capture("ab_variant_shown", { variant_id: variantId, experiment: "landing_headline_v1" });
}

export function trackUpgradeCTAShown(variantId: string) {
  if (!POSTHOG_KEY) return;
  posthog.capture("upgrade_cta_shown", { variant: variantId });
}

export function trackUpgradeCTAClicked(variantId: string) {
  if (!POSTHOG_KEY) return;
  posthog.capture("upgrade_cta_clicked", { variant: variantId });
}

export function trackExampleBriefClicked() {
  if (!POSTHOG_KEY) return;
  posthog.capture("example_brief_clicked");
}

export function trackPaymentCompleted(plan: string) {
  if (!POSTHOG_KEY) return;
  posthog.capture("payment_completed", { plan });
}
