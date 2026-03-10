import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  _stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" });
  return _stripe;
}

export const PRICES = {
  pro: {
    unit_amount: 999, // $9.99
    currency: "usd",
    recurring: { interval: "month" as const },
    product_data: { name: "PrepFlow Pro" },
  },
  pack: {
    unit_amount: 499, // $4.99
    currency: "usd",
    product_data: { name: "PrepFlow Interview Pack (5 briefs)" },
  },
} as const;

export const PACK_BRIEF_COUNT = 5;
